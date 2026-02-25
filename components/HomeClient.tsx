'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { useSiteData } from '@/components/SiteDataProvider';
import { useTranslations } from 'next-intl';

export default function HomeClient() {
  const t = useTranslations('home');
  const { siteConfig: site, projects, categories } = useSiteData();

  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProjects = projects.slice(0, 6);
  const heroImages =
    site.heroCarousel.length > 0
      ? site.heroCarousel
      : projects.length > 0 
        ? projects.slice(0, 5).map((p) => ({
            projectId: p.id,
            image: p.thumbnail,
            title: p.title,
            category: p.category,
          }))
        : [{
            projectId: 'placeholder',
            image: '/placeholder.jpg',
            title: 'ArteStudio',
            category: 'Architecture',
          }];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Immersive Hero Section with Image Slider */}
      <section className="relative h-screen overflow-hidden">
        {/* Image Slides */}
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
              src={heroImages[currentSlide].image}
              alt={heroImages[currentSlide].title}
              fill
              priority={currentSlide === 0}
              className="object-cover"
              quality={95}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center max-w-5xl"
          >
            {/* Small category tag */}
            <motion.div
              key={`category-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-bronze-600/90 backdrop-blur-sm text-white text-sm font-display tracking-wider">
                {heroImages[currentSlide].category}
              </span>
            </motion.div>

            {/* Main headline */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 tracking-tight drop-shadow-2xl">
              {heroImages[currentSlide].title}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-lg"
            >
              {site.tagline}
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

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-12 h-2 bg-bronze-500'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
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

      {/* Image Showcase Section - Full width gallery */}
      <section className="py-0 bg-charcoal">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {projects.slice(0, 6).map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                <div>
                  <p className="text-bronze-300 text-xs font-display mb-1">{project.year}</p>
                  <h3 className="text-white font-display text-sm">{project.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="expertise" className="py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
              {t('ourExpertise')}
            </h2>
            <div className="w-24 h-1 bg-bronze-600 mx-auto mb-6" />
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              {t('expertiseSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/projects/${category.id}`}>
                  <div className="group relative bg-white p-8 hover-lift border-l-4 border-bronze-600 h-full shadow-lg">
                    {/* Blueprint corner */}
                    <div className="absolute top-0 right-0 w-12 h-12 opacity-20">
                      <svg viewBox="0 0 48 48" className="text-bronze-600">
                        <line x1="48" y1="0" x2="48" y2="48" stroke="currentColor" strokeWidth="1" />
                        <line x1="48" y1="0" x2="0" y2="0" stroke="currentColor" strokeWidth="1" />
                        <line x1="48" y1="12" x2="36" y2="0" stroke="currentColor" strokeWidth="0.5" />
                      </svg>
                    </div>

                    <h3 className="font-display text-2xl text-charcoal mb-3 group-hover:text-bronze-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-charcoal/70 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-bronze-600 text-sm font-display">
                      <span>{t('viewProjects')}</span>
                      <Icon icon="ph:arrow-right" className="w-4 h-4 group-hover:translate-x-2 transition-transform" aria-hidden />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
              {t('featuredProjects')}
            </h2>
            <div className="w-24 h-1 bg-bronze-600 mx-auto mb-6" />
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              {t('featuredSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/projects/all"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white transition-all font-display text-lg group"
            >
              {t('viewAllProjects')}
              <Icon icon="ph:arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-charcoal text-cream relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-8">
              &ldquo;{t('quote')}&rdquo;
            </blockquote>
            <p className="text-bronze-300 text-lg">
              {t('quoteAuthor')}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
