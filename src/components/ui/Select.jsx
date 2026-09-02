import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Select = forwardRef(({
  label,
  error,
  options = [],
  className,
  containerClassName,
  required,
  placeholder = 'Select an option...',
  children,
  ...props
}, ref) => {
  return (
    <div className={twMerge('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={twMerge(
          clsx(
            'w-full bg-white text-slate-900 text-sm rounded-lg border border-slate-200 px-3.5 py-2.5 transition-all duration-200 cursor-pointer',
            'focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
            className
          )
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children || options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
