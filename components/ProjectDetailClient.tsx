'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Project } from '@/types';
import Lightbox from '@/components/project/Lightbox';
import { StageIcon, resolveStageIcon } from '@/components/project/stage-icon';

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

  const formatCategoryName = (category: string) => category.replace(/-/g, ' ');

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
            <div className="mb-8 flex items-center gap-2 text-sm text-cream/60">
              <Link href="/" className="hover:text-bronze-300 transition-colors">
                {tCommon('home')}
              </Link>
              <span>/</span>
              <Link
                href={`/projects/${project.category}`}
                className="hover:text-bronze-300 transition-colors capitalize"
              >
                {formatCategoryName(project.category)}
              </Link>
              <span>/</span>
              <span className="text-cream">{project.title}</span>
            </div>

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
                <div>
                  <h3 className="text-bronze-300 font-display text-lg mb-2">{t('year')}</h3>
                  <p className="text-xl">{project.year}</p>
                </div>
                {project.client && (
                  <div>
                    <h3 className="text-bronze-300 font-display text-lg mb-2">{t('client')}</h3>
                    <p className="text-xl">{project.client}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-bronze-300 font-display text-lg mb-2">{t('category')}</h3>
                  <p className="text-xl capitalize">{formatCategoryName(project.category)}</p>
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

function StageTimeline({
  stages,
  selectedStage,
  onSelectStage,
}: {
  stages: Project['stages'];
  selectedStage: number;
  onSelectStage: (index: number) => void;
}) {
  const t = useTranslations('project');

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-cream/60 mb-4">{t('timeline')}</p>
      <div className="space-y-3 border-l border-cream/15 pl-6">
        {stages.map((stage, index) => {
          const active = index === selectedStage;
          const iconKey = resolveStageIcon(stage, index);
          return (
            <button
              key={stage.id ?? index}
              onClick={() => onSelectStage(index)}
              className={`group relative w-full text-left rounded-lg transition-all ${
                active ? 'bg-white text-charcoal shadow-xl' : 'bg-white/5 hover:bg-white/10'
              }`}
              aria-label={t('openStage', { title: stage.title })}
            >
              {index !== stages.length - 1 && (
                <span className="absolute -left-[25px] top-5 h-full w-px bg-cream/15" aria-hidden="true" />
              )}
              <div className="flex items-start gap-3 p-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    active ? 'bg-bronze-600 text-white' : 'bg-cream/10 text-cream'
                  }`}
                >
                  <StageIcon icon={iconKey} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs uppercase tracking-[0.2em] ${active ? 'text-bronze-600' : 'text-cream/50'}`}>
                    {t('phase', { n: index + 1 })}
                  </p>
                  <h3 className={`font-display text-xl ${active ? 'text-charcoal' : 'text-cream'}`}>
                    {stage.title}
                  </h3>
                  {stage.description && (
                    <p className={`text-sm leading-relaxed ${active ? 'text-charcoal/70' : 'text-cream/70'} line-clamp-2`}>
                      {stage.description}
                    </p>
                  )}
                  <div className={`text-[11px] mt-2 ${active ? 'text-charcoal/60' : 'text-cream/50'}`}>
                    {t('assets', { count: stage.images.length })}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StageGallery({
  project,
  stageIndex,
  stage,
  imageIndex,
  onSelectImage,
  onOpenLightbox,
}: {
  project: Project;
  stageIndex: number;
  stage: Project['stages'][number];
  imageIndex: number;
  onSelectImage: (idx: number) => void;
  onOpenLightbox: () => void;
}) {
  const t = useTranslations('project');
  const images = stage.images;
  const formatCategoryName = (c: string) => c.replace(/-/g, ' ');

  return (
    <div className="bg-white text-charcoal rounded-xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-charcoal/50">{t('step', { n: stageIndex + 1 })}</p>
          <h3 className="font-display text-2xl">{stage.title}</h3>
          <p className="text-sm text-charcoal/60">
            {project.title} • {formatCategoryName(project.category)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-bronze-50 text-bronze-700 flex items-center justify-center shadow-inner">
          <StageIcon icon={resolveStageIcon(stage, stageIndex)} />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {stage.description && (
          <p className="text-base text-charcoal/75 leading-relaxed">{stage.description}</p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={stageIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            <motion.div
              layoutId={`image-${stageIndex}-${imageIndex}`}
              className="relative aspect-[16/9] bg-charcoal/5 rounded-lg overflow-hidden cursor-pointer group"
              onClick={onOpenLightbox}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenLightbox(); }}
              aria-label={t('openLightbox')}
            >
              <Image
                src={images[imageIndex]}
                alt={`${project.title} - ${stage.title}`}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="bg-white/90 px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-charcoal font-display">{t('clickToEnlarge')}</span>
                </div>
              </div>
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => onSelectImage(idx)}
                    className={`relative h-24 rounded-md overflow-hidden transition-all ${
                      imageIndex === idx
                        ? 'ring-4 ring-bronze-600 shadow-lg'
                        : 'ring-1 ring-gray-200 hover:ring-bronze-400'
                    }`}
                    aria-label={t('viewImage', { n: idx + 1 })}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
