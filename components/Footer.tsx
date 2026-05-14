import { Link } from '@/i18n/navigation';
import { Icon } from '@iconify/react';
import { getTranslations } from 'next-intl/server';
import { formatPhoneDisplay, formatTelHref } from '@/lib/site-config';
import type { Category, SiteConfig } from '@/types';
import type { Locale } from '@/i18n/routing';

type SocialKey = 'facebook' | 'instagram' | 'linkedin';

const socialIconIds: Record<SocialKey, string> = {
  facebook: 'ph:facebook-logo',
  instagram: 'ph:instagram-logo',
  linkedin: 'ph:linkedin-logo',
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
      <Icon icon={socialIconIds[type]} className="w-5 h-5" aria-hidden />
    </a>
  );
}

export default async function Footer({
  locale,
  site,
  categories,
}: {
  locale: Locale;
  site: SiteConfig;
  categories: Category[];
}) {
  const t = await getTranslations({ locale, namespace: 'common' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-charcoal text-cream pt-16 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-display text-2xl mb-4 text-bronze-300">{site.siteName}</h3>
            <p className="text-cream/80 leading-relaxed">
              {site.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-display text-xl mb-4 text-bronze-300">{tFooter('ourWork')}</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/projects/${cat.id}`}
                    className="text-cream/80 hover:text-bronze-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <Icon icon="ph:arrow-right" className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl mb-4 text-bronze-300">{tFooter('contact')}</h4>
            <div className="space-y-3 text-cream/80">
              <div className="flex items-start gap-2">
                <Icon icon="ph:map-pin" className="w-4 h-4 text-bronze-400 mt-0.5 shrink-0" aria-hidden />
                <p>
                  {site.address.split('\n').map((line, idx) => (
                    <span key={idx} className="block">{line}</span>
                  ))}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:phone" className="w-4 h-4 text-bronze-400 shrink-0" aria-hidden />
                <a href={formatTelHref(site.phone)} className="hover:text-bronze-300 transition-colors">
                  {formatPhoneDisplay(site.phone)}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:envelope" className="w-4 h-4 text-bronze-400 shrink-0" aria-hidden />
                <a href={`mailto:${site.contactEmail}`} className="hover:text-bronze-300 transition-colors">
                  {site.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/60 text-sm">
              © {currentYear} {site.legal.companyName} - P.IVA e C.F. {site.legal.piva}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-cream/60 hover:text-bronze-300 transition-colors text-sm inline-flex items-center gap-1.5 group">
                {t('contactUs')}
                <Icon icon="ph:arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden />
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

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-bronze-600 to-transparent opacity-50"
        aria-hidden="true"
      />
    </footer>
  );
}
