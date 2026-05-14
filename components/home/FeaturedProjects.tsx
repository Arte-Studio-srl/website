import { Icon } from '@iconify/react';
import { getTranslations } from 'next-intl/server';
import ProjectCard from '@/components/ProjectCard';
import SectionHeading from '@/components/SectionHeading';
import ButtonLink from '@/components/ui/ButtonLink';
import type { Project } from '@/types';
import type { Locale } from '@/i18n/routing';

interface Props {
  projects: Project[];
  locale: Locale;
}

export default async function FeaturedProjects({ projects, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tProjects = await getTranslations({ locale, namespace: 'projects' });
  const featuredProjects = projects.slice(0, 6);

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title={t('featuredProjects')} subtitle={t('featuredSubtitle')} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewProjectText={tProjects('viewProject')}
            />
          ))}
        </div>

        <div className="text-center">
          <ButtonLink
            href="/projects/all"
            variant="outlineBronze"
            className="group"
          >
            {t('viewAllProjects')}
            <Icon icon="ph:arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
