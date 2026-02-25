# ArteStudio Website

A professional portfolio website template for companies in the **events and scenography** field. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 📱 Responsive design with mobile-first approach
- 🎨 Elegant blueprint-inspired design system
- 🔐 Secure admin panel for content management
- ⚡ **Instant updates** - Changes appear immediately without restart
- 🖼️ Dynamic image uploads with AWS S3
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
# Clone the repository
git clone <repository-url>
cd artestudio-website

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

See `.env.example` for all available configuration options.

**Required variables:**

- `JWT_SECRET` - Secure secret for JWT tokens
- `ADMIN_EMAILS` - Comma-separated list of admin email addresses
- `SMTP_*` - SMTP settings for contact form and auth emails


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
│   ├── admin/              # Admin panel pages
│   ├── api/                # API routes
│   │   ├── admin/          # Protected admin API endpoints
│   │   ├── contact/        # Contact form endpoint
│   │   └── projects/       # Public projects API
│   ├── project/[id]/       # Project detail pages
│   └── projects/           # Project listing pages
├── components/             # React components
│   └── admin/              # Admin-specific components
├── lib/                    # Utilities and helpers
│   ├── auth.ts             # JWT authentication
│   ├── data-utils.ts       # Data loading with caching
│   └── rate-limiter.ts     # Rate limiting
├── data/                   # Project data (TypeScript)
├── public/                 # Static assets
└── scripts/                # Utility scripts
```

## Deployment

The project supports multiple deployment strategies:

### Vercel (Recommended)

```bash
vercel --prod
```

**Required environment variables in Vercel:**

- `JWT_SECRET`
- `ADMIN_EMAILS`
- `NODE_ENV=production`

### Production Considerations

- **File-based storage**: Works well for portfolios with infrequent updates
- **Database**: PostgreSQL for persistent admin changes
- **Database**: Consider for high-frequency updates (see docs)

## Security

- JWT-based authentication with httpOnly cookies
- Email verification system
- Rate limiting on auth and contact endpoints
- Secure file upload validation (size, type, extension)
- Path traversal protection
- Security headers (X-Frame-Options, X-Content-Type-Options)

See `SECURITY.md` for detailed security documentation.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Content Management

### Option 1: Admin Panel (Recommended)

Use the built-in admin panel. Changes are persisted to the database.

### Option 2: Direct Editing

Edit `data/projects.ts` directly and commit to git.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

Built with Next.js, TypeScript, and Tailwind CSS.
