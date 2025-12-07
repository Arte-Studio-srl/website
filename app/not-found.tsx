'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="relative min-h-[80vh] flex items-center justify-center bg-cream">
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="font-display text-9xl md:text-[12rem] text-bronze-600 leading-none">
                404
              </h1>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1 bg-bronze-600 mx-auto mb-8"
            />

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="font-display text-4xl md:text-5xl text-charcoal mb-6"
            >
              Page Not Found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl text-charcoal/70 mb-12 leading-relaxed"
            >
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s get you back on track.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/"
                className="px-8 py-4 bg-bronze-600 text-white hover:bg-bronze-700 transition-all font-display text-lg hover:shadow-xl"
              >
                Back to Home
              </Link>
              <Link
                href="/projects/all"
                className="px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white transition-all font-display text-lg"
              >
                View Projects
              </Link>
            </motion.div>

            {/* Blueprint decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-16"
            >
              <svg className="w-32 h-32 mx-auto text-bronze-400 opacity-30" viewBox="0 0 128 128">
                <line x1="0" y1="0" x2="128" y2="0" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="128" stroke="currentColor" strokeWidth="2" />
                <line x1="128" y1="0" x2="128" y2="128" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="128" x2="128" y2="128" stroke="currentColor" strokeWidth="2" />
                <line x1="32" y1="0" x2="0" y2="32" stroke="currentColor" strokeWidth="1" />
                <line x1="128" y1="32" x2="96" y2="0" stroke="currentColor" strokeWidth="1" />
                <line x1="0" y1="96" x2="32" y2="128" stroke="currentColor" strokeWidth="1" />
                <line x1="96" y1="128" x2="128" y2="96" stroke="currentColor" strokeWidth="1" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

