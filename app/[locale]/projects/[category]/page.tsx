import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { getCurrentData, getProjectsByCategory } from '@/lib/data-utils';
import { readSiteConfig } from '@/lib/site-config-storage';
import { buildCategoryMetadata } from '@/lib/seo';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const dynamicParams = false;
export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, category: categoryId } = await params;
  const { categories } = await getCurrentData(locale);
  const categoryData = categories.find((c) => c.id === categoryId);
  if (!categoryData) return {};
  const projects = await getProjectsByCategory(categoryId, locale);
  const site = await readSiteConfig();
  return buildCategoryMetadata(categoryData, projects.length, site, locale);
}

export async function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];
  for (const locale of routing.locales) {
    try {
      const { categories } = await getCurrentData(locale);
      for (const cat of categories) {
        params.push({ locale, category: cat.id });
      }
    } catch {}
  }
  // Static export requires at least one param. Fall back to a placeholder per
  // locale when Sanity has no categories (or env vars aren't wired), so the
  // build doesn't fail. The placeholder route 404s via notFound() below.
  if (params.length === 0) {
    return routing.locales.map((locale) => ({ locale, category: '__placeholder__' }));
  }
  return params;
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const { categories } = await getCurrentData(locale);
  const categoryData = categories.find((c) => c.id === category);
  if (!categoryData) notFound();

  const projects = await getProjectsByCategory(category, locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  return (
    <main className="min-h-screen">
      <Header locale={locale} />
      <section className="relative pt-32 pb-20 bg-charcoal text-cream">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="h-1 w-20 bg-bronze-500 mb-6" />
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">
              {categoryData.name}
            </h1>
            <p className="text-xl md:text-2xl text-cream/80 leading-relaxed">
              {categoryData.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          {projects.length > 0 ? (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-charcoal/70">
                  {t('projectsFound', { count: projects.length })}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    viewProjectText={t('viewProject')}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-charcoal/60 text-xl">
                {t('noProjects')}
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer locale={locale} />
    </main>
  );
}
