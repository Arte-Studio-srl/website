import { getTranslations } from 'next-intl/server';
import { Icon } from '@iconify/react';

const STEPS = [
  { key: 'project', icon: 'ph:compass-tool' },
  { key: 'build', icon: 'ph:hammer' },
  { key: 'display', icon: 'ph:lightbulb-filament' },
] as const;

interface Props {
  locale: string;
}

export default async function ProcessSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="relative py-28 bg-cream overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-50" aria-hidden />
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-bronze-200/40"
        aria-hidden
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
            {t('processTitle')}
          </h2>
          <div className="w-24 h-1 bg-bronze-600 mx-auto mb-6" />
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            {t('processSubtitle')}
          </p>
        </div>

        <div className="relative">
          <ConnectorLine />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 z-10">
            {STEPS.map((step, idx) => (
              <ProcessCard
                key={step.key}
                index={idx}
                isLast={idx === STEPS.length - 1}
                icon={step.icon}
                label={t(`processSteps.${step.key}.label`)}
                title={t(`processSteps.${step.key}.title`)}
                description={t(`processSteps.${step.key}.description`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConnectorLine() {
  return (
    <svg
      className="hidden md:block absolute left-[16.6%] right-[16.6%] top-[68px] w-2/3 h-6 z-0"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1="0"
        y1="3"
        x2="100"
        y2="3"
        stroke="rgb(139, 99, 71)"
        strokeOpacity="0.5"
        strokeWidth="0.35"
        strokeDasharray="1.2 1.4"
      />
      <line x1="0" y1="0.6" x2="0" y2="5.4" stroke="rgb(139, 99, 71)" strokeOpacity="0.55" strokeWidth="0.3" />
      <line x1="50" y1="0.6" x2="50" y2="5.4" stroke="rgb(139, 99, 71)" strokeOpacity="0.55" strokeWidth="0.3" />
      <line x1="100" y1="0.6" x2="100" y2="5.4" stroke="rgb(139, 99, 71)" strokeOpacity="0.55" strokeWidth="0.3" />
      <circle r="0.9" fill="rgb(139, 99, 71)" cy="3">
        <animate attributeName="cx" values="0;100" dur="6s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.05;0.95;1"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function ProcessCard({
  index,
  isLast,
  icon,
  label,
  title,
  description,
}: {
  index: number;
  isLast: boolean;
  icon: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="md:hidden absolute left-1/2 -translate-x-1/2 -top-12 h-12 w-px bg-bronze-300/60" aria-hidden />

      <div className="relative mb-10">
        <span
          className="absolute -inset-3 border border-bronze-300/60 rotate-45"
          aria-hidden
        />
        <span
          className="absolute -inset-7 border border-bronze-200/50 rotate-45"
          aria-hidden
        />

        <div className="relative w-[136px] h-[136px] bg-white border-2 border-bronze-600 rounded-full flex items-center justify-center shadow-[0_18px_45px_-15px_rgba(139,99,71,0.55)] transition-transform duration-500 group-hover:-translate-y-1">
          <Icon
            icon={icon}
            className="w-14 h-14 text-bronze-700 transition-transform duration-500 group-hover:scale-110"
            aria-hidden
          />
          <span className="absolute -top-3 -right-1 px-2.5 py-1 bg-bronze-600 text-white text-[11px] font-display tracking-[0.2em] shadow-md">
            0{index + 1}
          </span>

          <span className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full text-bronze-500 text-[10px] tracking-[0.4em]" aria-hidden>
            ◦
          </span>
        </div>

        {!isLast && (
          <span
            className="md:hidden absolute left-1/2 -translate-x-1/2 top-full mt-3 h-12 w-px bg-bronze-300/60"
            aria-hidden
          />
        )}
      </div>

      <p className="text-xs uppercase tracking-[0.3em] text-bronze-700 font-display mb-3">
        {label}
      </p>
      <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-4">
        {title}
      </h3>
      <p className="text-charcoal/70 max-w-xs leading-relaxed">
        {description}
      </p>

      <span className="mt-6 inline-block h-px w-10 bg-bronze-400/70" aria-hidden />
    </div>
  );
}
