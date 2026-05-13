import { Link } from '@/i18n/navigation';
import { Icon } from '@iconify/react';
import { getTranslations } from 'next-intl/server';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/types';

interface Props {
  projects: Project[];
  locale: string;
}

export default async function FeaturedProjects({ projects, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tProjects = await getTranslations({ locale, namespace: 'projects' });
  const featuredProjects = projects.slice(0, 6);

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
            {t('featuredProjects')}
          </h2>
          <div className="w-24 h-1 bg-bronze-600 mx-auto mb-6" />
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            {t('featuredSubtitle')}
          </p>
        </div>

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
          <Link
            href="/projects/all"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white transition-all font-display text-lg group"
          >
            {t('viewAllProjects')}
            <Icon icon="ph:arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
