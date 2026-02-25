import { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export default function FormField({ 
  label, 
  error, 
  helpText,
  required,
  className = '',
  ...props 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        required={required}
        className={`
          w-full px-4 py-3 bg-gray-50 border border-transparent 
          focus:bg-white focus:border-bronze-300 focus:ring-0 
          text-sm font-medium outline-none transition-colors
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



