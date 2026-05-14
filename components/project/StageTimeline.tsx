'use client';

import { useTranslations } from 'next-intl';
import type { Project } from '@/types';
import { StageIcon, resolveStageIcon } from '@/components/project/stage-icon';

type StageTimelineProps = {
  stages: Project['stages'];
  selectedStage: number;
  onSelectStage: (index: number) => void;
};

export default function StageTimeline({
  stages,
  selectedStage,
  onSelectStage,
}: StageTimelineProps) {
  const t = useTranslations('project');

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-cream/60 mb-4">{t('timeline')}</p>
      <div className="space-y-3 border-l border-cream/15 pl-6">
        {stages.map((stage, index) => {
          const active = index === selectedStage;
          const iconKey = resolveStageIcon(stage, index);
          return (
            <button
              key={stage.id ?? index}
              onClick={() => onSelectStage(index)}
              className={`group relative w-full text-left rounded-lg transition-all ${
                active ? 'bg-white text-charcoal shadow-xl' : 'bg-white/5 hover:bg-white/10'
              }`}
              aria-label={t('openStage', { title: stage.title })}
            >
              {index !== stages.length - 1 && (
                <span className="absolute -left-[25px] top-5 h-full w-px bg-cream/15" aria-hidden="true" />
              )}
              <div className="flex items-start gap-3 p-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    active ? 'bg-bronze-600 text-white' : 'bg-cream/10 text-cream'
                  }`}
                >
                  <StageIcon icon={iconKey} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs uppercase tracking-[0.2em] ${active ? 'text-bronze-600' : 'text-cream/50'}`}>
                    {t('phase', { n: index + 1 })}
                  </p>
                  <h3 className={`font-display text-xl ${active ? 'text-charcoal' : 'text-cream'}`}>
                    {stage.title}
                  </h3>
                  {stage.description && (
                    <p className={`text-sm leading-relaxed ${active ? 'text-charcoal/70' : 'text-cream/70'} line-clamp-2`}>
                      {stage.description}
                    </p>
                  )}
                  <div className={`text-[11px] mt-2 ${active ? 'text-charcoal/60' : 'text-cream/50'}`}>
                    {t('assets', { count: stage.images.length })}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
