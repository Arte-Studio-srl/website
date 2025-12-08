import Link from 'next/link';
import { categories } from '@/data/projects';
import { getSiteConfig, formatPhoneDisplay, formatTelHref } from '@/lib/site-config';

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
            <div className="flex gap-6">
              <Link href="/contact" className="text-cream/60 hover:text-bronze-300 transition-colors text-sm">
                Contact Us
              </Link>
              {site.social.facebook && (
                <a href={site.social.facebook} target="_blank" rel="noreferrer" className="text-cream/60 hover:text-bronze-300 transition-colors text-sm">
                  Facebook
                </a>
              )}
              {site.social.instagram && (
                <a href={site.social.instagram} target="_blank" rel="noreferrer" className="text-cream/60 hover:text-bronze-300 transition-colors text-sm">
                  Instagram
                </a>
              )}
              {site.social.linkedin && (
                <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="text-cream/60 hover:text-bronze-300 transition-colors text-sm">
                  LinkedIn
                </a>
              )}
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

