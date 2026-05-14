'use client';

import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import ProjectCard from '@/components/ProjectCard';
import { buttonVariants } from '@/components/ui/ButtonLink';
import type { Project, Category } from '@/types';

interface Props {
  projects: Project[];
  categories: Category[];
}

export default function AllProjectsFilter({ projects, categories }: Props) {
  const t = useTranslations('projects');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get('cat') ?? 'all';

  const setSelectedCategory = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete('cat');
    else params.set('cat', value);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <>
      <section className="bg-white border-b-2 border-bronze-500 sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-3 overflow-x-auto py-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={buttonVariants({ variant: 'filterChip', active: selectedCategory === 'all' })}
            >
              {t('allTitle')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={buttonVariants({ variant: 'filterChip', active: selectedCategory === cat.id })}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <p className="text-charcoal/70">
              {t('projectsFound', { count: filteredProjects.length })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewProjectText={t('viewProject')}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
