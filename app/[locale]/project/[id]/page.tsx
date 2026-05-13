import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectDetailClient from '@/components/ProjectDetailClient';
import { getCurrentData, getProjectById } from '@/lib/data-utils';
import { readSiteConfig } from '@/lib/site-config-storage';
import { buildAbsoluteUrl, toAbsoluteImageUrl } from '@/lib/seo';
import { buildProjectMetadata } from '@/lib/seo';
import { ProjectJsonLd } from '@/components/JsonLd';
import { setRequestLocale } from 'next-intl/server';
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
  const site = await readSiteConfig();
  return buildProjectMetadata(project, site, locale);
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

  const project = await getProjectById(id, locale);
  if (!project) notFound();

  const site = await readSiteConfig();
  const projectUrl = buildAbsoluteUrl(`/${locale}/project/${project.id}/`, site.seo?.siteUrl);
  const thumbnailUrl = toAbsoluteImageUrl(project.thumbnail, site.seo?.siteUrl);

  return (
    <main className="min-h-screen">
      <ProjectJsonLd
        name={project.title}
        description={project.description}
        image={thumbnailUrl}
        dateCreated={project.year ? `${project.year}-01-01` : undefined}
        url={projectUrl}
      />
      <Header locale={locale} />
      <ProjectDetailClient project={project} />
      <Footer locale={locale} />
    </main>
  );
}
