/**
 * Input Component - Atomic component
 * Base input field with consistent styling
 */

import React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef(
  ({
    className,
    label,
    error,
    helperText,
    icon,
    size = 'md',
    disabled,
    ...props
  }, ref) => {
    const sizeStyles = {
      sm: 'text-sm px-3 py-2',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-4 py-3',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full rounded border border-slate-300 bg-white transition-colors',
              'focus:outline-none focus:ring-1 focus:ring-slate-400',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
              error && 'border-red-500 focus:ring-red-500',
              icon && 'pl-10',
              sizeStyles[size],
              className
            )}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && !error && <p className="text-slate-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
