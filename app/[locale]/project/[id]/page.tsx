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

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const project = await getProjectById(id);
  if (!project) return {};
  const site = await readSiteConfig();
  return buildProjectMetadata(project, site, locale);
}

export async function generateStaticParams() {
  const locs = routing.locales.map((locale) => ({ locale }));
  try {
    const { projects } = await getCurrentData();
    const params: { locale: string; id: string }[] = [];
    for (const { locale } of locs) {
      for (const project of projects) {
        params.push({ locale, id: project.id });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const project = await getProjectById(id);
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
      <Header />
      <ProjectDetailClient project={project} />
      <Footer />
    </main>
  );
}
