import Link from 'next/link';
import { categories } from '@/data/projects';
import { getSiteConfig, formatPhoneDisplay, formatTelHref } from '@/lib/site-config';

type SocialKey = 'facebook' | 'instagram' | 'linkedin';

const socialIcons: Record<SocialKey, JSX.Element> = {
  facebook: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.91 3.58 8.98 8.25 9.82v-6.94H7.9v-2.88h2.21V9.8c0-2.2 1.31-3.42 3.32-3.42.96 0 1.97.17 1.97.17v2.17h-1.11c-1.1 0-1.44.69-1.44 1.4v1.69h2.45l-.39 2.88h-2.06v6.94c4.67-.84 8.25-4.91 8.25-9.82Z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7c0-1.1-.9-2-2-2H7Zm11.25 1.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0ZM12 8.5A3.5 3.5 0 1 1 8.5 12A3.5 3.5 0 0 1 12 8.5Zm0 2a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 10.5Z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.32c0-1.27-.02-2.92-1.78-2.92c-1.78 0-2.05 1.39-2.05 2.82v5.42H9.5V9.5h3.42v1.5h.05c.48-.9 1.64-1.85 3.38-1.85c3.61 0 4.28 2.38 4.28 5.47v5.84ZM5.34 8a2.07 2.07 0 1 1 0-4.14a2.07 2.07 0 0 1 0 4.14Zm1.78 12.45H3.55V9.5h3.57v10.95Z" />
    </svg>
  ),
};

function SocialIcon({ href, label, type }: { href: string; label: string; type: SocialKey }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-bronze-300 hover:text-cream transition-colors"
      aria-label={label}
      title={label}
    >
      {socialIcons[type]}
    </a>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const site = getSiteConfig();

  return (
    <footer className="relative bg-charcoal text-cream pt-16 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="font-display text-2xl mb-4 text-bronze-300">ArteStudio</h3>
            <p className="text-cream/80 leading-relaxed">
              {site.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-4 text-bronze-300">Our Work</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/projects/${cat.id}`}
                    className="text-cream/80 hover:text-bronze-300 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-xl mb-4 text-bronze-300">Contact</h4>
            <div className="space-y-3 text-cream/80">
              <p>
                {site.address.split('\n').map((line, idx) => (
                  <span key={idx} className="block">{line}</span>
                ))}
              </p>
              <p>
                <a href={formatTelHref(site.phone)} className="hover:text-bronze-300 transition-colors">
                  {formatPhoneDisplay(site.phone)}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.contactEmail}`} className="hover:text-bronze-300 transition-colors">
                  {site.contactEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/60 text-sm">
              © {currentYear} {site.legal.companyName} - P.IVA e C.F. {site.legal.piva}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-cream/60 hover:text-bronze-300 transition-colors text-sm">
                Contact Us
              </Link>
              <div className="flex items-center gap-3">
                {site.social.facebook && (
                  <SocialIcon href={site.social.facebook} label="Facebook" type="facebook" />
                )}
                {site.social.instagram && (
                  <SocialIcon href={site.social.instagram} label="Instagram" type="instagram" />
                )}
                {site.social.linkedin && (
                  <SocialIcon href={site.social.linkedin} label="LinkedIn" type="linkedin" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint decoration */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-bronze-600 to-transparent opacity-50"
        aria-hidden="true"
      />
    </footer>
  );
}

