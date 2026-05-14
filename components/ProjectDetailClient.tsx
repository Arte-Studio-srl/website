'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Project } from '@/types';
import Lightbox from '@/components/project/Lightbox';
import StageGallery from '@/components/project/StageGallery';
import StageTimeline from '@/components/project/StageTimeline';

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const t = useTranslations('project');
  const tCommon = useTranslations('common');
  const [selectedStage, setSelectedStage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentStage = project.stages[selectedStage];
  const currentImages = currentStage?.images ?? [];

  const categoryLabel = project.categoryName || project.category.replace(/-/g, ' ');

  return (
    <>
      <section className="relative pt-32 pb-12 bg-charcoal text-cream">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-cream/60">
              <Link href="/" className="hover:text-bronze-300 transition-colors">
                {tCommon('home')}
              </Link>
              <span aria-hidden>/</span>
              <Link
                href={`/projects/${project.category}`}
                className="hover:text-bronze-300 transition-colors capitalize"
              >
                {categoryLabel}
              </Link>
              <span aria-hidden>/</span>
              <span className="text-cream">{project.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-1 bg-bronze-500 mb-6"
                />
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
                  {project.title}
                </h1>
                <p className="text-xl text-cream/80 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-6">
                {project.client && (
                  <div>
                    <h3 className="text-bronze-300 font-display text-lg mb-2">{t('client')}</h3>
                    <p className="text-xl">{project.client}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-bronze-300 font-display text-lg mb-2">{t('category')}</h3>
                  <p className="text-xl capitalize">{categoryLabel}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {currentStage && (
        <section className="relative bg-charcoal text-cream py-16">
          <div className="absolute inset-0 blueprint-grid opacity-10" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-[360px,1fr] gap-12">
              <StageTimeline
                stages={project.stages}
                selectedStage={selectedStage}
                onSelectStage={(idx) => { setSelectedStage(idx); setSelectedImage(0); }}
              />
              <StageGallery
                project={project}
                stageIndex={selectedStage}
                stage={currentStage}
                imageIndex={selectedImage}
                onSelectImage={setSelectedImage}
                onOpenLightbox={() => setLightboxOpen(true)}
              />
            </div>
          </div>
        </section>
      )}

      <Lightbox
        open={lightboxOpen}
        images={currentImages}
        index={selectedImage}
        altPrefix={`${project.title} - ${currentStage?.title ?? ''}`}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setSelectedImage}
      />
    </>
  );
}
