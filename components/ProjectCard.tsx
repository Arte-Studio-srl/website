'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/project/${project.id}`}>
        <div className="relative overflow-hidden bg-white hover-lift">
          {/* Blueprint corner decoration */}
          <div className="absolute top-0 left-0 w-16 h-16 z-10">
            <svg viewBox="0 0 64 64" className="text-bronze-400 opacity-40">
              <line x1="0" y1="0" x2="64" y2="0" stroke="currentColor" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="64" stroke="currentColor" strokeWidth="1" />
              <line x1="16" y1="0" x2="0" y2="16" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Image */}
          <div className="relative h-72 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent z-10" />
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Category badge */}
            <div className="absolute top-4 right-4 z-20 px-4 py-1 bg-bronze-600 text-white text-xs uppercase tracking-wider font-display">
              {project.category.replace(/-/g, ' ')}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 border-t-2 border-bronze-500">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-xl text-charcoal group-hover:text-bronze-600 transition-colors flex-1">
                {project.title}
              </h3>
              <span className="flex items-center gap-1 text-bronze-600 text-sm ml-4">
                <Icon icon="ph:calendar-blank" className="w-3.5 h-3.5" aria-hidden />
                {project.year}
              </span>
            </div>
            
            {project.client && (
              <p className="flex items-center gap-1.5 text-sm text-charcoal/60 mb-3 italic">
                <Icon icon="ph:user" className="w-3.5 h-3.5 shrink-0 not-italic" aria-hidden />
                {project.client}
              </p>
            )}
            
            <p className="text-charcoal/70 text-sm line-clamp-2 mb-4">
              {project.description}
            </p>

            {/* View project indicator */}
            <div className="mt-4 pt-4 border-t border-bronze-200 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-bronze-600">View Project</span>
              <Icon
                icon="ph:arrow-right"
                className="w-5 h-5 text-bronze-600 group-hover:translate-x-2 transition-transform"
                aria-hidden
              />
            </div>
          </div>

          {/* Blueprint grid overlay */}
          <div className="absolute inset-0 blueprint-grid opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}
