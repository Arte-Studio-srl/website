import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Breadcrumb = {
  label: ReactNode;
  href?: string;
};

type PageHeroProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Breadcrumb[];
};

export default function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 bg-charcoal text-cream">
      <div className="absolute inset-0 blueprint-grid opacity-10" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-cream/60">
            {breadcrumbs.map((item, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <span key={idx} className="contents">
                  {idx > 0 && <span aria-hidden>/</span>}
                  {item.href && !isLast ? (
                    <Link href={item.href} className="hover:text-bronze-300 transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-cream capitalize">{item.label}</span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        <div className="max-w-4xl">
          <div className="h-1 w-20 bg-bronze-500 mb-6" />
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">{title}</h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-cream/80 leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
}
