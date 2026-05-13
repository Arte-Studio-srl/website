import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { createSmtpTransport, getMissingSmtpEnv } from '@/lib/email';

export const dynamic = 'force-dynamic';

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string;
};

function validatePayload(body: Partial<ContactPayload>) {
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push('Name is required');
  if (!body.email?.trim()) errors.push('Email is required');
  if (!body.subject?.trim()) errors.push('Subject is required');
  if (!body.message?.trim()) errors.push('Message is required');
  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<ContactPayload>;

    // Rate limiting: 10 requests per 15 minutes per email
    const email = payload.email?.toLowerCase().trim() || 'anonymous';
    const rateLimit = await checkRateLimit(`contact:${email}`, {
      maxAttempts: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      const resetInMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      return NextResponse.json(
        { success: false, error: `Too many requests. Please try again in ${resetInMinutes} minutes.` },
        { status: 429 }
      );
    }

    const validationErrors = validatePayload(payload);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    // Also require CONTACT_TO for sending
    const missing = [...getMissingSmtpEnv(), ...(!process.env.CONTACT_TO ? ['CONTACT_TO'] : [])];
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing server env: ${missing.join(', ')}` },
        { status: 500 }
      );
    }

    const transport = createSmtpTransport();

    const textLines = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : '',
      payload.source ? `Source: ${payload.source}` : '',
      '',
      'Message:',
      payload.message ?? '',
    ]
      .filter(Boolean)
      .join('\n');

    await transport.verify();

    await transport.sendMail({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
      replyTo: payload.email,
      subject: `New contact: ${payload.subject}`,
      text: textLines,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const details = error instanceof Error
      ? { message: error.message }
      : { message: 'Unknown contact error' };
    console.error('[Contact] send error', {
      ...details,
    });
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
