'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import type { HeroSlide } from '@/types';

interface Props {
  slides: HeroSlide[];
  tagline: string;
}

export default function HeroCarousel({ slides, tagline }: Props) {
  const t = useTranslations('home');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] ?? slides[0];

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={currentSlide === 0}
            className="object-cover"
            quality={95}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center max-w-5xl"
        >
          <motion.div
            key={`category-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-bronze-600/90 backdrop-blur-sm text-white text-sm font-display tracking-wider">
              {slide.category}
            </span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 tracking-tight drop-shadow-2xl">
            {slide.title}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-lg"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-bronze-600 text-white hover:bg-bronze-700 transition-all font-display text-lg hover:shadow-2xl transform hover:scale-105"
            >
              {t('exploreProjects')}
              <Icon icon="ph:arrow-right" className="w-5 h-5" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-charcoal transition-all font-display text-lg backdrop-blur-sm"
            >
              <Icon icon="ph:chat-dots" className="w-5 h-5" aria-hidden />
              {t('getInTouch')}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all ${
              index === currentSlide
                ? 'w-12 h-2 bg-bronze-500'
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={t('goToSlide', { n: index + 1 })}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.a
          href="#expertise"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">{t('discover')}</span>
          <Icon icon="ph:arrow-down" className="w-6 h-6" aria-hidden />
        </motion.a>
      </motion.div>
    </section>
  );
}
