# Quick Start Guide

Get the ArteStudio website running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Text editor (VS Code recommended)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd website_as

# Install dependencies
npm install
```

## Environment Setup

Create `.env.local` in the project root:

```env
JWT_SECRET=your-secure-secret-key
ADMIN_EMAILS=your-email@example.com
NODE_ENV=development
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Access Admin Panel

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Enter your email (must match `ADMIN_EMAILS` in `.env.local`)
3. Check the terminal/console for the 6-digit verification code
4. Enter the code to access the admin panel

## Project Structure

```
├── app/
│   ├── admin/         # Admin panel
│   ├── api/           # API endpoints
│   ├── page.tsx       # Homepage
│   └── ...            # Other pages
├── components/        # React components
├── data/
│   └── projects.ts    # Content data
└── public/
    └── images/        # Static images
```

## Adding Content

### Via Admin Panel (Recommended)
1. Go to `/admin`
2. Click "Projects" → "New Project"
3. Fill in details and upload images
4. Save

### Via Direct Edit
Edit `data/projects.ts` manually with your preferred editor.

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Check code quality
```

## Next Steps

- Read `DEPLOYMENT.md` for production deployment
- Review `SECURITY.md` for security best practices
- Check `AUTHENTICATION.md` for auth system details

## Troubleshooting

### Admin login not working
- Verify `ADMIN_EMAILS` matches the email you're using
- Check console for verification code
- Ensure `.env.local` is in project root

### Images not loading
- Verify images are in `public/images/projects/`
- Check file paths in `data/projects.ts`
- Restart dev server after adding new images

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

## Support

Need help? Check the documentation:
- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guide
- `SECURITY.md` - Security information

---

*Ready to deploy? See `DEPLOYMENT.md` for production setup.*
