import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { checkRateLimit } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string;
};

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO', 'CONTACT_FROM'] as const;

function missingEnv(): string[] {
  return requiredEnv.filter((key) => !process.env[key]);
}

function buildTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

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
    const rateLimit = checkRateLimit(`contact:${email}`, {
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

    const missing = missingEnv();
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing server env: ${missing.join(', ')}` },
        { status: 500 }
      );
    }

    const transport = buildTransport();

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
    console.error('[Contact] send error', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      response: (error as any)?.response,
      responseCode: (error as any)?.responseCode,
      command: (error as any)?.command,
    });
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}



