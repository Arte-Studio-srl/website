import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import PageHero from '@/components/PageHero';
import { getCurrentData, getProjectsByCategory } from '@/lib/data-utils';
import { readSiteConfig } from '@/lib/site-config-storage';
import { buildAbsoluteUrl, buildCategoryMetadata } from '@/lib/seo';
import { BreadcrumbListJsonLd } from '@/components/JsonLd';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, routing, type Locale } from '@/i18n/routing';

export const dynamicParams = false;
export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale: localeParam, category: categoryId } = await params;
  const locale = isLocale(localeParam) ? localeParam : routing.defaultLocale;
  const { categories } = await getCurrentData(locale);
  const categoryData = categories.find((c) => c.id === categoryId);
  if (!categoryData) return {};
  const projects = await getProjectsByCategory(categoryId, locale);
  const site = await readSiteConfig(locale);
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const descriptionFallback = t('categoryDescriptionFallback', { name: categoryData.name });
  return buildCategoryMetadata(categoryData, projects.length, site, locale, descriptionFallback);
}

export async function generateStaticParams() {
  const params: { locale: Locale; category: string }[] = [];
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
  const { locale: localeParam, category } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  setRequestLocale(locale);

  const { projects: allProjects, categories } = await getCurrentData(locale);
  const categoryData = categories.find((c) => c.id === category);
  if (!categoryData) notFound();

  const projects = allProjects.filter((project) => project.category === category);
  const [t, tCommon, site] = await Promise.all([
    getTranslations({ locale, namespace: 'projects' }),
    getTranslations({ locale, namespace: 'common' }),
    readSiteConfig(locale),
  ]);
  const homeUrl = buildAbsoluteUrl(`/${locale}/`, site.seo?.siteUrl);

  const breadcrumbs = [
    { name: tCommon('home'), url: homeUrl },
    { name: categoryData.name },
  ];

  return (
    <main className="min-h-screen">
      <BreadcrumbListJsonLd items={breadcrumbs} />
      <Header categories={categories} />
      <PageHero
        title={categoryData.name}
        subtitle={categoryData.description}
        breadcrumbs={[
          { label: tCommon('home'), href: '/' },
          { label: categoryData.name },
        ]}
      />

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
      <Footer locale={locale} site={site} categories={categories} />
    </main>
  );
}
