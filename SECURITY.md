# Security Overview

## Authentication & Authorization

### Current Implementation
- **Email-based verification** with 6-digit codes
- **JWT tokens** with 7-day expiration
- **HTTP-only cookies** for token storage
- **Admin email whitelist** via environment variable

### Security Features
1. **Rate Limiting**
   - Send code: 5 attempts per 15 minutes
   - Verify code: 10 attempts per 15 minutes
   - Automatic cleanup of expired rate limit entries

2. **Input Validation**
   - Email normalization (lowercase, trimmed)
   - Code expiration (10 minutes)
   - Secure path handling with sanitization

3. **Token Security**
   - HS256 algorithm for JWT
   - Secure cookie settings in production
   - SameSite: Lax protection

### Configuration Required

#### Environment Variables
```env
# Required for production
JWT_SECRET=your-very-secure-random-string-change-this
ADMIN_EMAILS=admin@example.com,another@example.com
NODE_ENV=production
```

#### Generate Secure JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Endpoints Security

### Public Endpoints
- `GET /api/projects` - List all projects
- `GET /api/projects/[id]` - Get single project
- `GET /api/categories` - List categories

### Protected Endpoints (Require Authentication)
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `PUT /api/categories` - Update categories
- `POST /api/upload` - Upload images
- `GET /api/upload?projectId=...` - List project images
- `DELETE /api/upload?path=...` - Delete image

### File Upload Security
1. **File Size Limit**: 10MB maximum
2. **Allowed Types**: JPG, PNG, WEBP only
3. **Path Traversal Protection**: Sanitized project IDs
4. **MIME Type Validation**: Server-side validation
5. **Filename Sanitization**: Auto-generated safe filenames

## Security Best Practices

### For Production Deployment

1. **Email Service**
   - Implement actual email sending (currently console-logged)
   - Use services like SendGrid, AWS SES, or Resend
   - Remove development code exposure in send-code endpoint

2. **Rate Limiting**
   - Current: In-memory (lost on restart)
   - Recommended: Redis or external service for distributed systems
   - Consider IP-based rate limiting in addition to email-based

3. **HTTPS Only**
   - Ensure secure: true for cookies in production
   - Use proper SSL/TLS certificates
   - Configure Next.js for HTTPS

4. **Environment Variables**
   - Never commit .env files
   - Use strong, unique JWT secrets
   - Rotate secrets periodically

5. **Monitoring**
   - Log failed authentication attempts
   - Monitor rate limit violations
   - Set up alerts for suspicious activity

### Security Headers
Consider adding to `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ];
}
```

## Vulnerability Mitigations

### ✅ Implemented
- Path traversal protection in file uploads
- XSS prevention (React escaping)
- SQL injection (N/A - file-based storage)
- CSRF protection (SameSite cookies)
- Rate limiting on authentication endpoints
- Input validation and sanitization
- Secure cookie configuration
- No stack trace exposure in production errors

### ⚠️ Recommendations
- Implement proper email service
- Add IP-based rate limiting
- Consider moving to database storage for scalability
- Add CAPTCHA for repeated failed attempts
- Implement audit logging
- Add CSP (Content Security Policy) headers
- Consider 2FA for additional security

## Incident Response

### If Credentials Are Compromised
1. Rotate JWT_SECRET immediately
2. Update ADMIN_EMAILS list
3. Check server logs for suspicious activity
4. Clear all active sessions

### Regular Maintenance
- Review admin access list quarterly
- Update dependencies monthly
- Review logs for failed authentication attempts
- Test authentication flow after updates



