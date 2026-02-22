/**
 * Badge Component - Atomic component
 * Small label component for displaying status or tags
 */

import React from 'react';
import clsx from 'clsx';

const variantStyles = {
  default: 'bg-slate-100 text-slate-900',
  success: 'bg-green-100 text-green-900',
  warning: 'bg-amber-100 text-amber-900',
  danger: 'bg-red-100 text-red-900',
  info: 'bg-blue-100 text-blue-900',
  positive: 'bg-green-100 text-green-900',
  neutral: 'bg-slate-100 text-slate-900',
  negative: 'bg-red-100 text-red-900',
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
          'inline-flex items-center gap-2 rounded-full font-medium',
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
