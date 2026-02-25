import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie } from '@/lib/auth';
import { getVerificationCode, deleteVerificationCode } from '@/lib/verification-storage';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting - 10 attempts per 15 minutes per email
    const rateLimit = await checkRateLimit(`verify-code:${normalizedEmail}`, {
      maxAttempts: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      const resetInMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many verification attempts. Please try again in ${resetInMinutes} minutes.`,
        },
        { status: 429 }
      );
    }

    // Get stored code from DB
    const storedData = await getVerificationCode(normalizedEmail);

    if (!storedData) {
      return NextResponse.json(
        { success: false, error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if expired
    if (storedData.expiresAt < Date.now()) {
      await deleteVerificationCode(normalizedEmail);
      return NextResponse.json(
        { success: false, error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify code
    if (storedData.code !== code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid verification code',
          attemptsRemaining: rateLimit.remaining,
        },
        { status: 400 }
      );
    }

    // Success — clear code and rate limits
    await deleteVerificationCode(normalizedEmail);
    await resetRateLimit(`send-code:${normalizedEmail}`);
    await resetRateLimit(`verify-code:${normalizedEmail}`);

    if (process.env.NODE_ENV !== 'production') {
      console.info('[AuthCode] Authentication success', { email: normalizedEmail });
    }

    const token = await createToken(normalizedEmail);
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
