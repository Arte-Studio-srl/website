'use client';

import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface LightboxProps {
  open: boolean;
  images: string[];
  index: number;
  altPrefix: string;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}

export default function Lightbox({ open, images, index, altPrefix, onClose, onIndexChange }: LightboxProps) {
  const t = useTranslations('project');

  const goPrev = useCallback(() => {
    onIndexChange(index > 0 ? index - 1 : images.length - 1);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange(index < images.length - 1 ? index + 1 : 0);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('imageViewer')}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-bronze-300 transition-colors z-10"
            aria-label={t('closeLightbox')}
          >
            <Icon icon="ph:x" className="w-8 h-8" aria-hidden />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {t('keyboardHint')}
          </div>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full h-full max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={images[index]} alt={altPrefix} fill className="object-contain" />
          </motion.div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded transition-colors"
                aria-label={t('previousImage')}
              >
                <Icon icon="ph:caret-left" className="w-6 h-6" aria-hidden />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded transition-colors"
                aria-label={t('nextImage')}
              >
                <Icon icon="ph:caret-right" className="w-6 h-6" aria-hidden />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded text-white text-sm">
                {index + 1} / {images.length}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
