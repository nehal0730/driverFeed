/**
 * Button Component - Atomic component
 * Base button with multiple variants and sizes
 */

import React from 'react';
import clsx from 'clsx';

export const Button = React.forwardRef(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded border border-slate-300 bg-white font-medium text-slate-900 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-slate-400';

    const variantStyles = {
      primary: 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800',
      secondary: 'bg-white text-slate-900 hover:bg-slate-50',
      danger: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
      ghost: 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-2',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-5 py-2.5 text-lg gap-2',
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && !isLoading && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
