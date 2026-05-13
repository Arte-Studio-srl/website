import { Link } from '@/i18n/navigation';
import { Icon } from '@iconify/react';
import { getTranslations } from 'next-intl/server';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  locale: string;
}

export default async function CategoriesSection({ categories, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section id="expertise" className="py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
            {t('ourExpertise')}
          </h2>
          <div className="w-24 h-1 bg-bronze-600 mx-auto mb-6" />
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            {t('expertiseSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/projects/${category.id}`}>
              <div className="group relative bg-white p-8 hover-lift border-l-4 border-bronze-600 h-full shadow-lg">
                <div className="absolute top-0 right-0 w-12 h-12 opacity-20">
                  <svg viewBox="0 0 48 48" className="text-bronze-600">
                    <line x1="48" y1="0" x2="48" y2="48" stroke="currentColor" strokeWidth="1" />
                    <line x1="48" y1="0" x2="0" y2="0" stroke="currentColor" strokeWidth="1" />
                    <line x1="48" y1="12" x2="36" y2="0" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>

                <h3 className="font-display text-2xl text-charcoal mb-3 group-hover:text-bronze-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-charcoal/70 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-bronze-600 text-sm font-display">
                  <span>{t('viewProjects')}</span>
                  <Icon icon="ph:arrow-right" className="w-4 h-4 group-hover:translate-x-2 transition-transform" aria-hidden />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
