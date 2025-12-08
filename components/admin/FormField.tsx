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
      <label className="block text-sm font-medium text-charcoal">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        {...props}
        required={required}
        className={`
          w-full px-4 py-2 border rounded
          focus:ring-2 focus:ring-bronze-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-xs text-charcoal/60">{helpText}</p>
      )}
    </div>
  );
}



