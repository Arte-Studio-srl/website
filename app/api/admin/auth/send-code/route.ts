import { NextRequest, NextResponse } from 'next/server';
import { isEmailAllowed } from '@/lib/auth';
import { verificationCodes } from '@/lib/verification-storage';
import { checkRateLimit } from '@/lib/rate-limiter';

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
    const rateLimit = checkRateLimit(`send-code:${normalizedEmail}`, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000
    });

    if (!rateLimit.allowed) {
      const resetInMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      return NextResponse.json(
        { 
          success: false, 
          error: `Too many attempts. Please try again in ${resetInMinutes} minutes.` 
        },
        { status: 429 }
      );
    }

    // Check if email is allowed
    if (!isEmailAllowed(normalizedEmail)) {
      // Don't reveal if email is not authorized for security
      return NextResponse.json(
        { success: true, message: 'If your email is authorized, you will receive a verification code' }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code
    verificationCodes.set(normalizedEmail, { code, expiresAt });

    // In production, send email with the code
    console.log(`\n==========================================`);
    console.log(`🔐 Verification Code for ${normalizedEmail}`);
    console.log(`Code: ${code}`);
    console.log(`Expires in 10 minutes`);
    console.log(`Remaining attempts: ${rateLimit.remaining}`);
    console.log(`==========================================\n`);

    // TODO: Implement actual email sending
    // Example: await sendEmail(email, code);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      // In development, return the code (REMOVE IN PRODUCTION!)
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

