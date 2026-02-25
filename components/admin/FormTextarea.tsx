import { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export default function FormTextarea({ 
  label, 
  error, 
  helpText,
  required,
  className = '',
  rows = 4,
  ...props 
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...props}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-3 bg-gray-50 border border-transparent 
          focus:bg-white focus:border-bronze-300 focus:ring-0 
          text-sm font-light resize-y outline-none transition-colors
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400
          ${error ? '!border-red-500 !bg-red-50' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium tracking-wide mt-1">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-xs text-charcoal/40 font-light mt-1">{helpText}</p>
      )}
    </div>
  );
}



