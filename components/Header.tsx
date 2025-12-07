'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '@/data/projects';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group relative z-50">
            <div className="relative w-40 h-12 lg:w-48 lg:h-14 transition-all duration-300">
              <div className="relative w-full h-full">
                <Image
                  src="/logo.png"
                  alt="ArteStudio"
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-105"
                  style={{
                    filter: isScrolled
                      ? `
                        drop-shadow(0 2px 6px rgba(0,0,0,0.18))
                        drop-shadow(0 1px 3px rgba(0,0,0,0.12))
                      `
                      : `
                        brightness(0) invert(1)
                        drop-shadow(0 2px 8px rgba(0,0,0,0.35))
                        drop-shadow(0 1px 4px rgba(0,0,0,0.25))
                      `,
                  }}
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`transition-colors font-display text-lg ${
                isScrolled 
                  ? 'text-charcoal hover:text-bronze-600' 
                  : 'text-white hover:text-bronze-300'
              }`}
            >
              Home
            </Link>
            
            <div className="relative group">
              <button className={`transition-colors font-display text-lg flex items-center gap-2 ${
                isScrolled 
                  ? 'text-charcoal hover:text-bronze-600' 
                  : 'text-white hover:text-bronze-300'
              }`}>
                Projects
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t-2 border-bronze-500">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/projects/${cat.id}`}
                    className="block px-6 py-3 hover:bg-bronze-50 transition-colors border-b border-bronze-100 last:border-b-0"
                  >
                    <div className="font-display text-charcoal">{cat.name}</div>
                    <div className="text-xs text-charcoal/60 mt-1">{cat.description}</div>
                  </Link>
                ))}
              </div>
            </div>
            
            <Link 
              href="/contact" 
              className={`px-6 py-2 transition-all font-display ${
                isScrolled
                  ? 'bg-bronze-600 text-white hover:bg-bronze-700'
                  : 'bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-charcoal'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? 'text-charcoal' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
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
                  className="block px-4 py-3 hover:bg-bronze-50 transition-colors font-display"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                
                <div className="px-4 py-2 font-display text-bronze-600 text-sm uppercase tracking-wide">
                  Projects
                </div>
                
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/projects/${cat.id}`}
                    className="block px-8 py-2 hover:bg-bronze-50 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                
                <Link
                  href="/contact"
                  className="block mx-4 mt-4 px-4 py-3 bg-bronze-600 text-white text-center hover:bg-bronze-700 transition-colors font-display"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

