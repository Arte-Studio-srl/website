import type { ReactNode } from 'react';
import { cn } from '@/lib/classnames';

type SectionHeadingProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
};

export default function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn('text-center mb-16', className)}>
      <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
        {title}
      </h2>
      <div className="w-24 h-1 bg-bronze-600 mx-auto mb-6" />
      {subtitle && (
        <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
