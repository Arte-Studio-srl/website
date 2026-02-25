import { NextRequest, NextResponse } from 'next/server';
import { isEmailAllowed } from '@/lib/auth';
import { setVerificationCode } from '@/lib/verification-storage';
import { checkRateLimit } from '@/lib/rate-limiter';
import { createSmtpTransport, getMissingSmtpEnv } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting - 5 attempts per 15 minutes per email
    const rateLimit = await checkRateLimit(`send-code:${normalizedEmail}`, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      const resetInMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      return NextResponse.json(
        { success: false, error: `Too many attempts. Please try again in ${resetInMinutes} minutes.` },
        { status: 429 }
      );
    }

    // Check if email is allowed (don't reveal if it's not, for security)
    if (!isEmailAllowed(normalizedEmail)) {
      return NextResponse.json({
        success: true,
        message: 'If your email is authorized, you will receive a verification code',
      });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInMs = 10 * 60 * 1000; // 10 minutes

    // Store code in DB
    await setVerificationCode(normalizedEmail, code, expiresInMs);

    if (process.env.NODE_ENV !== 'production') {
      console.info('[AuthCode] Verification code issued', {
        email: normalizedEmail,
        code,
        expiresInMinutes: 10,
        remainingAttempts: rateLimit.remaining,
      });
    }

    const missingEnv = getMissingSmtpEnv();
    if (missingEnv.length > 0) {
      console.error(`SMTP not configured; missing: ${missingEnv.join(', ')}`);
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const transport = createSmtpTransport();
    await transport.sendMail({
      from: process.env.CONTACT_FROM,
      to: normalizedEmail,
      subject: 'Your Admin Verification Code',
      text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.`,
      html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code expires in 10 minutes.</p>`,
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      // Only return code in development for local testing
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
