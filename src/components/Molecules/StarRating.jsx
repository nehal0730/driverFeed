/**
 * Star Rating Component - Molecule component
 * Combines multiple atoms into a rating input component
 */

import React, { useRef, useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  value,
  onChangeRating,
  size = 'md',
  readonly = false,
  ariaLabel = 'Rating',
  onBlur,
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const containerRef = useRef(null);

  const displayValue = hoverValue || value;

  const sizeClass = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
  };

  const handleMouseLeave = () => setHoverValue(0);

  const handleKeyDown = (event) => {
    if (readonly) return;
    const { key } = event;
    if (key === 'ArrowRight' || key === 'ArrowUp') {
      event.preventDefault();
      onChangeRating(Math.min(5, (value || 0) + 1));
    }
    if (key === 'ArrowLeft' || key === 'ArrowDown') {
      event.preventDefault();
      onChangeRating(Math.max(1, (value || 1) - 1));
    }
    if (/^[1-5]$/.test(key)) {
      event.preventDefault();
      onChangeRating(Number(key));
    }
  };

  const handleBlur = (event) => {
    if (!onBlur) return;
    const nextTarget = event.relatedTarget;
    if (!containerRef.current?.contains(nextTarget)) {
      onBlur();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-1"
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={displayValue === star}
          aria-label={`${star} stars`}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => !readonly && onChangeRating(star)}
          disabled={readonly}
          className="transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:cursor-not-allowed"
        >
          <Star
            className={`${sizeClass[size]} ${
              displayValue >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300'
            }`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
