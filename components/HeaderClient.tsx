'use client';

import { Link } from '@/i18n/navigation';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { Category } from '@/types';
import { cn } from '@/lib/classnames';

interface Props {
  categories: Category[];
}

export default function HeaderClient({ categories }: Props) {
  const t = useTranslations('common');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navTextClass = cn(
    'transition-colors font-display text-lg flex items-center gap-1.5',
    isScrolled ? 'text-charcoal hover:text-bronze-600' : 'text-white hover:text-bronze-300',
  );
  const dropdownButtonClass = cn(
    'transition-colors font-display text-lg flex items-center gap-2',
    isScrolled ? 'text-charcoal hover:text-bronze-600' : 'text-white hover:text-bronze-300',
  );
  const contactCtaClass = cn(
    'px-6 py-2 transition-all font-display flex items-center gap-2',
    isScrolled
      ? 'bg-bronze-600 text-white hover:bg-bronze-700'
      : 'bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-charcoal',
  );
  const mobileMenuButtonClass = cn(
    'lg:hidden p-2 transition-colors',
    isScrolled ? 'text-charcoal' : 'text-white',
  );
  const logoFilter = isScrolled
    ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.18)) drop-shadow(0 1px 3px rgba(0,0,0,0.12))'
    : 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.35)) drop-shadow(0 1px 4px rgba(0,0,0,0.25))';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link href="/" className="flex items-center space-x-3 group relative z-50">
            <div className="relative w-40 h-12 lg:w-48 lg:h-14 transition-all duration-300">
              <div className="relative w-full h-full">
                <Image
                  src="/logo.png"
                  alt="ArteStudio"
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-105"
                  style={{ filter: logoFilter }}
                  priority
                />
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={navTextClass}
            >
              <Icon icon="ph:house" className="w-4 h-4" aria-hidden />
              {t('home')}
            </Link>

            <div className="relative group focus-within:[&_[data-dropdown]]:opacity-100 focus-within:[&_[data-dropdown]]:visible">
              <button
                type="button"
                aria-haspopup="menu"
                className={dropdownButtonClass}
              >
                <Icon icon="ph:squares-four" className="w-4 h-4" aria-hidden />
                {t('projects')}
                <Icon icon="ph:caret-down" className="w-4 h-4 transition-transform group-hover:rotate-180" aria-hidden />
              </button>

              <div
                role="menu"
                data-dropdown
                className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t-2 border-bronze-500"
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    role="menuitem"
                    href={`/projects/${cat.id}`}
                    className="block px-6 py-3 hover:bg-bronze-50 focus:bg-bronze-50 focus:outline-none transition-colors border-b border-bronze-100 last:border-b-0 group/item"
                  >
                    <div className="font-display text-charcoal flex items-center gap-2">
                      <Icon icon="ph:arrow-right" className="w-3.5 h-3.5 text-bronze-400 opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all" aria-hidden />
                      {cat.name}
                    </div>
                    <div className="text-xs text-charcoal/60 mt-1">{cat.description}</div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className={contactCtaClass}
            >
              <Icon icon="ph:chat-dots" className="w-4 h-4" aria-hidden />
              {t('contact')}
            </Link>
            <LocaleSwitcher variant={isScrolled ? 'dark' : 'light'} />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={mobileMenuButtonClass}
            aria-label={t('toggleMenu')}
          >
            {mobileMenuOpen
              ? <Icon icon="ph:x" className="w-6 h-6" aria-hidden />
              : <Icon icon="ph:list" className="w-6 h-6" aria-hidden />
            }
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-bronze-200"
            >
              <div className="py-4 space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-bronze-50 transition-colors font-display"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon icon="ph:house" className="w-5 h-5 text-bronze-500" aria-hidden />
                  {t('home')}
                </Link>

                <div className="px-4 py-2 font-display text-bronze-600 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Icon icon="ph:squares-four" className="w-4 h-4" aria-hidden />
                  {t('projects')}
                </div>

                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/projects/${cat.id}`}
                    className="flex items-center gap-2 px-8 py-2 hover:bg-bronze-50 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon icon="ph:arrow-right" className="w-3.5 h-3.5 text-bronze-400" aria-hidden />
                    {cat.name}
                  </Link>
                ))}

                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 mx-4 mt-4 px-4 py-3 bg-bronze-600 text-white text-center hover:bg-bronze-700 transition-colors font-display"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon icon="ph:chat-dots" className="w-5 h-5" aria-hidden />
                  {t('contact')}
                </Link>
                <div className="px-4 pt-4 flex justify-center">
                  <LocaleSwitcher variant="dark" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
