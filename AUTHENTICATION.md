# Admin Authentication Setup Guide

## Overview

The ArteStudio admin panel is now protected with email-based authentication. Only authorized emails can access the admin features.

## Setup Instructions

### 1. Create Environment File

Create a `.env.local` file in the root directory of your project:

```bash
# Admin Authentication
ADMIN_EMAILS=your-email@example.com,another-admin@example.com
JWT_SECRET=your-random-secret-key-here-change-this
```

**Important:**
- Replace `your-email@example.com` with your actual admin email(s)
- For multiple admins, separate emails with commas
- Generate a strong random string for `JWT_SECRET` (minimum 32 characters recommended)

### 2. Generate a Secure JWT Secret

You can generate a secure random secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### 3. Configure Your Emails

Add all admin email addresses to the `ADMIN_EMAILS` variable:

```env
ADMIN_EMAILS=admin1@example.com,admin2@example.com,admin3@example.com
```

## How It Works

### Login Flow

1. Navigate to `/admin/login`
2. Enter your authorized email address
3. Click "Send Verification Code"
4. Check your terminal/console for the 6-digit code (in development)
5. Enter the code and click "Verify & Login"
6. You'll be redirected to the admin dashboard

### Development Mode

In development (`NODE_ENV=development`):
- Verification codes are printed to the console
- The code is also returned in the API response
- Codes expire after 10 minutes

### Production Mode

For production deployment:
- You'll need to implement email sending (see implementation notes below)
- Codes are NOT returned in API responses
- Codes still expire after 10 minutes
- Use environment variables from your hosting platform

## Security Features

✅ Email-based authentication
✅ Time-limited verification codes (10 minutes)
✅ JWT tokens with 7-day expiration
✅ HTTP-only cookies
✅ Secure cookies in production
✅ Protected admin routes
✅ Automatic code cleanup
✅ Email whitelist validation

## Protected Routes

All admin routes are now protected:
- `/admin` - Dashboard
- `/admin/projects` - Project management
- `/admin/projects/new` - Create project
- `/admin/projects/edit/[id]` - Edit project
- `/admin/categories` - Category management
- `/admin/images` - Image gallery
- `/admin/config` - Configuration

## Logout

Click the "Logout" button in the admin dashboard header to end your session.

## Implementation Notes

### Email Sending (Production)

To enable email sending in production, update `app/api/admin/auth/send-code/route.ts`:

```typescript
// Remove the console.log and add your email service
// Example with SendGrid:
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: normalizedEmail,
  from: 'noreply@yourdomain.com',
  subject: 'Your Admin Verification Code',
  text: `Your verification code is: ${code}`,
  html: `<p>Your verification code is: <strong>${code}</strong></p>`,
});
```

Popular email services:
- **SendGrid** - Easy to use, free tier available
- **AWS SES** - Cost-effective for high volume
- **Resend** - Modern, developer-friendly
- **Mailgun** - Reliable, good documentation

### Persistent Storage (Production)

For production, replace the in-memory Map with Redis or a database:

```typescript
// Example with Redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Store code
await redis.set(
  `verification:${email}`,
  code,
  { ex: 600 } // 10 minutes
);

// Retrieve code
const storedCode = await redis.get(`verification:${email}`);
```

## Troubleshooting

### "Email not authorized"
- Check that your email is in the `ADMIN_EMAILS` list in `.env.local`
- Make sure there are no extra spaces in the email list
- Emails are case-insensitive

### "Verification code expired"
- Codes expire after 10 minutes
- Request a new code if yours expired

### Can't access admin pages
- Make sure you're logged in
- Check browser cookies are enabled
- Try logging out and back in

### Not receiving codes (development)
- Check your terminal/console output
- The code is printed when you request it
- Look for lines starting with "🔐 Verification Code"

## Files Modified/Created

### New Files
- `lib/auth.ts` - Authentication utilities
- `lib/verification-storage.ts` - Temporary code storage
- `components/AdminAuthGuard.tsx` - Client-side auth guard
- `app/admin/login/page.tsx` - Login page
- `app/api/admin/auth/send-code/route.ts` - Send verification code
- `app/api/admin/auth/verify-code/route.ts` - Verify code and create session
- `app/api/admin/auth/check/route.ts` - Check authentication status
- `app/api/admin/auth/logout/route.ts` - Logout endpoint
- `.env.example` - Environment variables template
- `AUTHENTICATION.md` - This file

### Modified Files
- `app/admin/page.tsx` - Added auth guard and logout button
- `package.json` - Added `jose` dependency

## Next Steps

1. ✅ Create `.env.local` with your email and JWT secret
2. ✅ Restart your development server
3. ✅ Visit `/admin/login` to test authentication
4. 📧 (Optional) Set up email sending for production
5. 🗄️ (Optional) Set up Redis for production code storage

## Support

For issues or questions, check:
- Console logs for development debugging
- `.env.local` file for correct configuration
- Browser developer tools for cookie/network issues


