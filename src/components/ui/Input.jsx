import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className,
  containerClassName,
  required,
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
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-full border border-slate-200 px-4 py-2.5 transition-all duration-200',
              'focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10',
              Icon && 'pl-10',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
              className
            )
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
