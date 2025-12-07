# ArteStudio Website

Professional portfolio website for ArteStudio - Scenography and event structures company. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 📱 Responsive design with mobile-first approach
- 🎨 Elegant blueprint-inspired design system
- 🔐 Secure admin panel for content management
- 🖼️ Image gallery with lightbox and keyboard navigation
- ⚡ Optimized performance with Next.js
- ♿ WCAG 2.1 Level AA accessibility compliance

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: JWT with email verification
- **Deployment**: Vercel-ready

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

Create `.env.local`:

```env
JWT_SECRET=your-secure-secret-key
ADMIN_EMAILS=admin@example.com
NODE_ENV=development

# Contact form email (SMTP)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
CONTACT_FROM=Studio Website <no-reply@yourdomain.com>
CONTACT_TO=owner@yourdomain.com

# GitHub content storage (optional, enables writing via dashboard)
GITHUB_CONTENT_OWNER=your-github-username-or-org
GITHUB_CONTENT_REPO=your-repo-name
GITHUB_CONTENT_BRANCH=main
GITHUB_CONTENT_TOKEN=ghp_xxx # token with repo:contents scope
```

Generate secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Admin Panel

Access the admin panel at `/admin` to manage:
- Projects (create, edit, delete)
- Categories
- Image uploads

**First time setup:**
1. Set `ADMIN_EMAILS` in `.env.local`
2. Navigate to `/admin`
3. Enter your email
4. Check console for verification code (development mode)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   └── (public pages)     # Public website pages
├── components/            # React components
├── lib/                   # Utilities and helpers
├── data/                  # Project data
└── public/                # Static assets
```

## Deployment

⚠️ **Important**: Read `DEPLOYMENT.md` before deploying to production.

The current implementation uses file-based storage which has limitations in production environments. See deployment guide for solutions.

### Quick Deploy to Vercel

```bash
vercel --prod
```

**Required environment variables in Vercel:**
- `JWT_SECRET`
- `ADMIN_EMAILS`
- `NODE_ENV=production`

## Documentation

- `QUICKSTART.md` - Detailed setup guide
- `DEPLOYMENT.md` - Production deployment strategies
- `SECURITY.md` - Security best practices
- `AUTHENTICATION.md` - Auth system details
- `DESIGN.md` - Design system documentation

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Content Management

### Option 1: Admin Panel (Development)
Use the admin panel in local development, commit changes to git.

### Option 2: Direct Editing
Edit `data/projects.ts` directly for project content.

### Option 3: Production Admin (Requires Setup)
See `DEPLOYMENT.md` for database or git-based CMS options.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security

- JWT-based authentication
- Email verification system
- Rate limiting on auth endpoints
- Secure file upload validation
- Path traversal protection

See `SECURITY.md` for comprehensive security documentation.

## License

© 2024 ArteStudio s.r.l. - All rights reserved  
P.IVA e C.F. 02513970182

## Contact

- **Email**: info@progettoartestudio.it
- **Phone**: +39 02 89031657
- **Address**: Vicolo San Giorgio 5, 20090 Buccinasco (MI), Italy

---

Built with Next.js, TypeScript, and ❤️


