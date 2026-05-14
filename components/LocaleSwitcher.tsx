'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

type Props = {
  /** When true, use light colors for dark backgrounds (e.g. hero) */
  variant?: 'light' | 'dark';
};

export default function LocaleSwitcher({ variant = 'dark' }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const activeClass = variant === 'light' ? 'text-bronze-300 font-semibold' : 'text-bronze-600 font-semibold';
  const inactiveClass = variant === 'light' ? 'text-white/70 hover:text-bronze-300' : 'text-charcoal/70 hover:text-bronze-600';

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('language')}>
      <button
        onClick={() => switchLocale('it')}
        className={`px-2 py-1 text-sm font-display transition-colors ${
          locale === 'it' ? activeClass : inactiveClass
        }`}
        aria-pressed={locale === 'it'}
      >
        IT
      </button>
      <span className={variant === 'light' ? 'text-white/40' : 'text-charcoal/40'}>|</span>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 text-sm font-display transition-colors ${
          locale === 'en' ? activeClass : inactiveClass
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
