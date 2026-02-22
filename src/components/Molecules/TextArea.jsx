/**
 * TextArea Component - Molecule component
 * Textarea with character count and validation
 */

import React, { useState } from 'react';
import clsx from 'clsx';

export const TextArea = React.forwardRef(
  ({
    className,
    label,
    error,
    helperText,
    maxLength,
    showCharCount = true,
    value,
    onChange,
    disabled,
    ...props
  }, ref) => {
    const [charCount, setCharCount] = useState(
      typeof value === 'string' ? value.length : 0
    );

    const handleChange = (e) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const charPercentage = maxLength ? (charCount / maxLength) * 100 : 0;
    const isWarning = charPercentage > 80;
    const isError = charPercentage > 100;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-base',
            'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
            'disabled:bg-slate-50 resize-vertical',
            error && 'border-red-500 focus:ring-red-500',
            isError && !error && 'border-red-500',
            isWarning && !error && !isError && 'border-amber-500',
            className
          )}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          {...props}
        />
        <div className="flex justify-between items-center mt-2 text-sm">
          <div>
            {error && <p className="text-red-600">{error}</p>}
            {helperText && !error && <p className="text-slate-500">{helperText}</p>}
          </div>
          {showCharCount && maxLength && (
            <p className={clsx(
              'text-right',
              isError ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-500'
            )}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
