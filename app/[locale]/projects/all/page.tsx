'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { useSiteData } from '@/components/SiteDataProvider';
import { useTranslations } from 'next-intl';

export default function AllProjectsPage() {
  const t = useTranslations('projects');
  const { projects, categories } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <main className="min-h-screen">
      <Header />
      <section className="relative pt-32 pb-20 bg-charcoal text-cream">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
            <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.8, delay: 0.3 }} className="h-1 bg-bronze-500 mb-6" />
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">{t('allTitle')}</h1>
            <p className="text-xl md:text-2xl text-cream/80 leading-relaxed">{t('allSubtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-b-2 border-bronze-500 sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-3 overflow-x-auto py-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 whitespace-nowrap font-display transition-all ${
                selectedCategory === 'all' ? 'bg-bronze-600 text-white' : 'bg-cream text-charcoal hover:bg-bronze-100'
              }`}
            >
              {t('allTitle')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 whitespace-nowrap font-display transition-all ${
                  selectedCategory === cat.id ? 'bg-bronze-600 text-white' : 'bg-cream text-charcoal hover:bg-bronze-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-8">
            <p className="text-charcoal/70">
              {t('projectsFound', { count: filteredProjects.length })}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
