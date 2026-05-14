'use client';

import type {
  ChangeEventHandler,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/classnames';

type FieldSize = 'default' | 'compact';

type CommonFieldProps = {
  id: string;
  name: string;
  label: string;
  icon: string;
  error?: string;
  required?: boolean;
  fieldSize?: FieldSize;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

const sizeClasses: Record<FieldSize, { label: string; icon: string; control: string; error: string }> = {
  default: {
    label: 'block text-charcoal font-display mb-2 flex items-center gap-1.5',
    icon: 'w-4 h-4',
    control: 'w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600',
    error: 'text-red-500 text-sm mt-1',
  },
  compact: {
    label: 'text-sm font-display text-charcoal flex items-center gap-1.5',
    icon: 'w-3.5 h-3.5',
    control: 'w-full rounded-md border-2 px-3 py-2 text-sm transition focus:outline-none focus:border-bronze-600',
    error: 'text-xs text-red-500',
  },
};

function FieldLabel({
  id,
  label,
  icon,
  required,
  fieldSize = 'default',
}: Pick<CommonFieldProps, 'id' | 'label' | 'icon' | 'required' | 'fieldSize'>) {
  const styles = sizeClasses[fieldSize];
  return (
    <label htmlFor={id} className={styles.label}>
      <Icon icon={icon} className={cn(styles.icon, 'text-bronze-500')} aria-hidden />
      {label}{required ? ' *' : ''}
    </label>
  );
}

function controlClass(fieldSize: FieldSize, error?: string, className?: string) {
  return cn(
    sizeClasses[fieldSize].control,
    error ? 'border-red-500' : 'border-bronze-200',
    className,
  );
}

export function TextField({
  id,
  name,
  label,
  icon,
  error,
  required,
  fieldSize = 'default',
  onChange,
  className,
  ...inputProps
}: CommonFieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'name' | 'onChange'>) {
  return (
    <div className={fieldSize === 'compact' ? 'space-y-1' : undefined}>
      <FieldLabel id={id} label={label} icon={icon} required={required} fieldSize={fieldSize} />
      <input
        id={id}
        name={name}
        onChange={onChange as ChangeEventHandler<HTMLInputElement>}
        className={controlClass(fieldSize, error, className)}
        {...inputProps}
      />
      {error && <p className={sizeClasses[fieldSize].error}>{error}</p>}
    </div>
  );
}

export function TextareaField({
  id,
  name,
  label,
  icon,
  error,
  required,
  fieldSize = 'default',
  onChange,
  className,
  ...textareaProps
}: CommonFieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'name' | 'onChange'>) {
  return (
    <div className={fieldSize === 'compact' ? 'space-y-1' : undefined}>
      <FieldLabel id={id} label={label} icon={icon} required={required} fieldSize={fieldSize} />
      <textarea
        id={id}
        name={name}
        onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}
        className={controlClass(fieldSize, error, cn('resize-none', className))}
        {...textareaProps}
      />
      {error && <p className={sizeClasses[fieldSize].error}>{error}</p>}
    </div>
  );
}

export function FormAlert({
  tone,
  children,
  compact = false,
}: {
  tone: 'success' | 'error';
  children: ReactNode;
  compact?: boolean;
}) {
  const isSuccess = tone === 'success';
  return (
    <motion.div
      initial={{ opacity: 0, y: compact ? -6 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: compact ? -6 : -10 }}
      className={cn(
        'flex items-center gap-2',
        compact ? 'rounded-md px-3 py-2 text-sm' : 'p-4 gap-3',
        isSuccess
          ? compact
            ? 'border border-green-300 bg-green-50 text-green-800'
            : 'bg-green-100 border border-green-400 text-green-700'
          : compact
            ? 'border border-red-300 bg-red-50 text-red-700'
            : 'bg-red-100 border border-red-400 text-red-700',
      )}
    >
      <Icon
        icon={isSuccess ? 'ph:check-circle' : 'ph:warning-circle'}
        className={cn(compact ? 'w-4 h-4' : 'w-5 h-5', 'shrink-0')}
        aria-hidden
      />
      {children}
    </motion.div>
  );
}
