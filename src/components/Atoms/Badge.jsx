/**
 * Badge Component - Atomic component
 * Small label component for displaying status or tags
 */

import React from 'react';
import clsx from 'clsx';

const variantStyles = {
  default: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-green-200 bg-green-50 text-green-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  positive: 'border-green-200 bg-green-50 text-green-800',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  negative: 'border-red-200 bg-red-50 text-red-800',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const Badge = React.forwardRef(
  ({
    className,
    variant = 'default',
    size = 'md',
    icon,
    children,
    ...props
  }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center gap-2 rounded border text-xs font-medium',
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && icon}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
