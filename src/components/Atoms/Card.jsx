/**
 * Card Component - Atomic component
 * Base card wrapper with consistent styling
 */

import React from 'react';
import clsx from 'clsx';

export const Card = React.forwardRef(
  ({
    className,
    bordered = false,
    hoverable = false,
    shadow = 'md',
    children,
    ...props
  }, ref) => {
    const baseStyles = 'rounded-lg bg-white overflow-hidden';

    const shadowStyles = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow',
      lg: 'shadow-lg',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          baseStyles,
          shadowStyles[shadow],
          bordered && 'border border-slate-200',
          hoverable && 'transition-all duration-200 hover:shadow-lg hover:scale-105',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
