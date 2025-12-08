'use client';

import { useState, useEffect, useCallback, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Project, StageIcon } from '@/types';

const FALLBACK_ICON_ORDER: StageIcon[] = ['compass', 'blueprint', 'layers', 'camera', 'sparkles', 'flag'];

const ICON_SHAPES: Record<StageIcon, ReactElement> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 10l5-2-2 5-5 2 2-5z" />
    </>
  ),
  blueprint: (
    <>
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </>
  ),
  layers: (
    <>
      <path d="M3 7l9 5 9-5-9-5-9 5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </>
  ),
  camera: (
    <>
      <path d="M4 7h4l2-2h4l2 2h4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 4l1.4 3.5L17 9l-3.6 1.5L12 14l-1.4-3.5L7 9l3.6-1.5L12 4z" />
      <path d="M5 16l0.8 2 2 .8-2 .8L5 22l-0.8-2-2-.8 2-.8L5 16z" />
      <path d="M19 12l0.7 1.6L21 14l-1.3.5L19 16l-0.7-1.5L17 14l1.3-.5L19 12z" />
    </>
  ),
  flag: (
    <>
      <path d="M6 4v16" />
      <path d="M8 4h9l-2 4 2 4H8" />
    </>
  ),
};

const renderIcon = (icon: StageIcon) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICON_SHAPES[icon]}
  </svg>
);

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [selectedStage, setSelectedStage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentStage = project.stages[selectedStage];
  const currentImages = currentStage.images;

  // Navigate images with keyboard
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    
    if (e.key === 'Escape') {
      setLightboxOpen(false);
    } else if (e.key === 'ArrowLeft') {
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
    } else if (e.key === 'ArrowRight') {
      setSelectedImage((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
    }
  }, [lightboxOpen, currentImages.length]);

  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, handleKeyDown]);

  const formatCategoryName = (category: string) => category.replace('-', ' ');
  const resolveStageIcon = (stage: Project['stages'][number], index: number): StageIcon => {
    if (stage.icon) return stage.icon;
    if (stage.type === 'drawing') return 'blueprint';
    if (stage.type === 'final') return 'sparkles';
    return FALLBACK_ICON_ORDER[index % FALLBACK_ICON_ORDER.length];
  };

  return (
    <>
      {/* Project Header */}
      <section className="relative pt-32 pb-12 bg-charcoal text-cream">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center gap-2 text-sm text-cream/60">
              <Link href="/" className="hover:text-bronze-300 transition-colors">
                Home
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
                  <h3 className="text-bronze-300 font-display text-lg mb-2">Year</h3>
                  <p className="text-xl">{project.year}</p>
                </div>
                {project.client && (
                  <div>
                    <h3 className="text-bronze-300 font-display text-lg mb-2">Client</h3>
                    <p className="text-xl">{project.client}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-bronze-300 font-display text-lg mb-2">Category</h3>
                  <p className="text-xl capitalize">{formatCategoryName(project.category)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Immersive Timeline */}
      <section className="relative bg-charcoal text-cream py-16">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[360px,1fr] gap-12">
            {/* Timeline rail */}
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cream/60 mb-4">Project Timeline</p>
              <div className="space-y-3 border-l border-cream/15 pl-6">
                {project.stages.map((stage, index) => {
                  const active = index === selectedStage;
                  const iconKey = resolveStageIcon(stage, index);
                  return (
                    <button
                      key={stage.id ?? index}
                      onClick={() => {
                        setSelectedStage(index);
                        setSelectedImage(0);
                      }}
                      className={`group relative w-full text-left rounded-lg transition-all ${
                        active ? 'bg-white text-charcoal shadow-xl' : 'bg-white/5 hover:bg-white/10'
                      }`}
                      aria-label={`Open stage ${stage.title}`}
                    >
                      {index !== project.stages.length - 1 && (
                        <span className="absolute -left-[25px] top-5 h-full w-px bg-cream/15" aria-hidden="true" />
                      )}
                      <div className="flex items-start gap-3 p-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            active ? 'bg-bronze-600 text-white' : 'bg-cream/10 text-cream'
                          }`}
                        >
                          {renderIcon(iconKey)}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-xs uppercase tracking-[0.2em] ${
                              active ? 'text-bronze-600' : 'text-cream/50'
                            }`}
                          >
                            Phase {index + 1}
                          </p>
                          <h3 className={`font-display text-xl ${active ? 'text-charcoal' : 'text-cream'}`}>
                            {stage.title}
                          </h3>
                          {stage.description && (
                            <p
                              className={`text-sm leading-relaxed ${
                                active ? 'text-charcoal/70' : 'text-cream/70'
                              } line-clamp-2`}
                            >
                              {stage.description}
                            </p>
                          )}
                          <div className={`text-[11px] mt-2 ${active ? 'text-charcoal/60' : 'text-cream/50'}`}>
                            {stage.images.length} asset{stage.images.length === 1 ? '' : 's'}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected stage visuals */}
            <div className="bg-white text-charcoal rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-charcoal/50">Step {selectedStage + 1}</p>
                  <h3 className="font-display text-2xl">{currentStage.title}</h3>
                  <p className="text-sm text-charcoal/60">
                    {project.title} • {formatCategoryName(project.category)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-bronze-50 text-bronze-700 flex items-center justify-center shadow-inner">
                  {renderIcon(resolveStageIcon(currentStage, selectedStage))}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {currentStage.description && (
                  <p className="text-base text-charcoal/75 leading-relaxed">
                    {currentStage.description}
                  </p>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedStage}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-4"
                  >
                    <motion.div
                      layoutId={`image-${selectedStage}-${selectedImage}`}
                      className="relative aspect-[16/9] bg-charcoal/5 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setLightboxOpen(true)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true); }}
                      aria-label="Open image in lightbox"
                    >
                      <Image
                        src={currentImages[selectedImage]}
                        alt={`${project.title} - ${currentStage.title}`}
                        fill
                        className="object-contain"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-charcoal font-display">Click to enlarge</span>
                        </div>
                      </div>
                    </motion.div>

                    {currentImages.length > 1 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {currentImages.map((img, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.04 }}
                            onClick={() => setSelectedImage(idx)}
                            className={`relative h-24 rounded-md overflow-hidden transition-all ${
                              selectedImage === idx
                                ? 'ring-4 ring-bronze-600 shadow-lg'
                                : 'ring-1 ring-gray-200 hover:ring-bronze-400'
                            }`}
                            aria-label={`View image ${idx + 1}`}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
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
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-bronze-300 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Keyboard hint */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              Use arrow keys or buttons to navigate • Press ESC to close
            </div>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImages[selectedImage]}
                alt={`${project.title} - ${currentStage.title}`}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Navigation */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded transition-colors"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded text-white text-sm">
                  {selectedImage + 1} / {currentImages.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

