import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  rightElement,
  className,
  containerClassName,
  required,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

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
          <div className="absolute left-3.5 text-slate-400 pointer-events-none z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={effectiveType}
          className={twMerge(
            clsx(
              'w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-full border border-slate-200 px-4 py-2.5 transition-all duration-200',
              'focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10',
              Icon && 'pl-10',
              (isPasswordType || rightElement) && 'pr-10',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
              className
            )
          )}
          {...props}
        />
        {isPasswordType ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1 rounded-full hover:bg-slate-100/80 z-10"
            title={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-400" />}
          </button>
        ) : (
          rightElement && (
            <div className="absolute right-3.5 text-slate-400 z-10">
              {rightElement}
            </div>
          )
        )}
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
