'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Project } from '@/types';
import { StageIcon, resolveStageIcon } from '@/components/project/stage-icon';

type StageGalleryProps = {
  project: Project;
  stageIndex: number;
  stage: Project['stages'][number];
  imageIndex: number;
  onSelectImage: (idx: number) => void;
  onOpenLightbox: () => void;
};

export default function StageGallery({
  project,
  stageIndex,
  stage,
  imageIndex,
  onSelectImage,
  onOpenLightbox,
}: StageGalleryProps) {
  const t = useTranslations('project');
  const images = stage.images;
  const image = images[imageIndex] ?? images[0];
  const categoryLabel = project.categoryName || project.category.replace(/-/g, ' ');

  return (
    <div className="bg-white text-charcoal rounded-xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-charcoal/50">{t('step', { n: stageIndex + 1 })}</p>
          <h3 className="font-display text-2xl">{stage.title}</h3>
          <p className="text-sm text-charcoal/60">
            {project.title} • {categoryLabel}
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
            {image ? (
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
                  src={image.url}
                  alt={image.alt || `${project.title} - ${stage.title}`}
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
            ) : (
              <div className="aspect-[16/9] rounded-lg bg-charcoal/5 border border-charcoal/10 flex items-center justify-center text-charcoal/55">
                {t('noStageImages')}
              </div>
            )}

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
                    <Image
                      src={img.url}
                      alt={img.alt || `${project.title} - ${stage.title} (${idx + 1})`}
                      fill
                      className="object-cover"
                    />
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
