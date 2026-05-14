import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/classnames';

type ButtonVariant =
  | 'primary'
  | 'outlineBronze'
  | 'outlineLight'
  | 'nav'
  | 'iconLink'
  | 'filterChip';

const baseButtonClass = 'inline-flex items-center justify-center gap-2 transition-all font-display';

const variants: Record<ButtonVariant, string> = {
  primary: `${baseButtonClass} px-8 py-4 bg-bronze-600 text-white hover:bg-bronze-700 text-lg`,
  outlineBronze: `${baseButtonClass} px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white text-lg`,
  outlineLight: `${baseButtonClass} px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-charcoal text-lg backdrop-blur-sm`,
  nav: 'transition-colors font-display text-lg flex items-center gap-1.5',
  iconLink: 'inline-flex items-center gap-1.5 transition-colors',
  filterChip: 'px-6 py-2 whitespace-nowrap font-display transition-all',
};

export function buttonVariants({
  variant = 'primary',
  active,
  className,
}: {
  variant?: ButtonVariant;
  active?: boolean;
  className?: string;
} = {}) {
  if (variant === 'filterChip') {
    return cn(
      variants.filterChip,
      active ? 'bg-bronze-600 text-white' : 'bg-cream text-charcoal hover:bg-bronze-100',
      className,
    );
  }

  return cn(variants[variant], className);
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

export default function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonVariants({ variant, className })} {...props} />;
}
