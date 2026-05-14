import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectDetailClient from '@/components/ProjectDetailClient';
import { getCurrentData, getProjectById } from '@/lib/data-utils';
import { readSiteConfig } from '@/lib/site-config-storage';
import { buildAbsoluteUrl, toAbsoluteImageUrl } from '@/lib/seo';
import { buildProjectMetadata } from '@/lib/seo';
import { ProjectJsonLd, BreadcrumbListJsonLd, ProjectImagesJsonLd } from '@/components/JsonLd';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const dynamicParams = false;
export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const project = await getProjectById(id, locale);
  if (!project) return {};
  const site = await readSiteConfig(locale);
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const descriptionFallback = t('projectDescriptionFallback', { title: project.title });
  return buildProjectMetadata(project, site, locale, descriptionFallback);
}

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of routing.locales) {
    try {
      const { projects } = await getCurrentData(locale);
      for (const project of projects) {
        params.push({ locale, id: project.id });
      }
    } catch {}
  }
  // Static export requires at least one param. Emit a placeholder when Sanity has no
  // projects yet so the build is resilient to empty content during development. The
  // placeholder route renders a 404 via notFound() in the page below.
  if (params.length === 0) {
    return routing.locales.map((locale) => ({ locale, id: '__placeholder__' }));
  }
  return params;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [{ projects, categories }, site, t] = await Promise.all([
    getCurrentData(locale),
    readSiteConfig(locale),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const project = projects.find((item) => item.id === id);
  if (!project) notFound();

  const projectUrl = buildAbsoluteUrl(`/${locale}/project/${project.id}/`, site.seo?.siteUrl);
  const thumbnailUrl = toAbsoluteImageUrl(project.thumbnail, site.seo?.siteUrl);
  const categoryUrl = buildAbsoluteUrl(`/${locale}/projects/${project.category}/`, site.seo?.siteUrl);
  const homeUrl = buildAbsoluteUrl(`/${locale}/`, site.seo?.siteUrl);
  const categoryLabel = project.categoryName || project.category.replace(/-/g, ' ');

  const breadcrumbs = [
    { name: t('home'), url: homeUrl },
    { name: categoryLabel, url: categoryUrl },
    { name: project.title },
  ];

  const galleryImages = [
    {
      url: thumbnailUrl,
      caption: project.thumbnailAlt || project.title,
    },
    ...project.stages.flatMap((stage) =>
      stage.images.map((img) => ({
        url: toAbsoluteImageUrl(img.url, site.seo?.siteUrl),
        caption: img.alt || `${project.title} — ${stage.title}`,
      }))
    ),
  ].filter((img) => img.url);

  return (
    <main className="min-h-screen">
      <ProjectJsonLd
        name={project.title}
        description={project.description}
        image={thumbnailUrl}
        dateCreated={project.year ? `${project.year}-01-01` : undefined}
        url={projectUrl}
        siteUrl={site.seo?.siteUrl}
      />
      <BreadcrumbListJsonLd items={breadcrumbs} />
      <ProjectImagesJsonLd images={galleryImages} siteUrl={site.seo?.siteUrl} />
      <Header categories={categories} />
      <ProjectDetailClient project={project} />
      <Footer locale={locale} site={site} categories={categories} />
    </main>
  );
}
