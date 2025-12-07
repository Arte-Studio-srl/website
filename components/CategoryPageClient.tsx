'use client';

import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import { Project, Category } from '@/types';

interface CategoryPageClientProps {
  categoryData: Category;
  projects: Project[];
}

export default function CategoryPageClient({ categoryData, projects }: CategoryPageClientProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-charcoal text-cream">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-bronze-500 mb-6"
            />
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">
              {categoryData.name}
            </h1>
            <p className="text-xl md:text-2xl text-cream/80 leading-relaxed">
              {categoryData.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          {projects.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 flex items-center justify-between"
              >
                <p className="text-charcoal/70">
                  {projects.length} project{projects.length !== 1 ? 's' : ''} found
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <p className="text-charcoal/60 text-xl">
                No projects available in this category yet.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

