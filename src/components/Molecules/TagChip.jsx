/**
 * Tag Chip Component - Molecule component
 * Clickable chip for tag selection
 */

import React from 'react';
import clsx from 'clsx';
import { X, Check } from 'lucide-react';

export const TagChip = ({
  id,
  label,
  selected,
  onToggle,
  sentiment,
}) => {
  const sentimentColors = {
    positive: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-700',
      selectedBg: 'bg-green-100',
    },
    neutral: {
      bg: 'bg-slate-50',
      border: 'border-slate-300',
      text: 'text-slate-700',
      selectedBg: 'bg-slate-100',
    },
    negative: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      selectedBg: 'bg-red-100',
    },
  };

  const colors = sentiment ? sentimentColors[sentiment] : sentimentColors.neutral;

  return (
    <button
      type="button"
      onClick={() => onToggle(id ?? label)}
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'hover:scale-105',
        selected
          ? `${colors.selectedBg} ${colors.border} ${colors.text}`
          : `${colors.bg} ${colors.border} ${colors.text}`,
      )}
      aria-pressed={selected}
      aria-label={`${label}${selected ? ' (selected)' : ''}`}
    >
      {selected && <Check className="h-4 w-4" aria-hidden="true" />}
      <span className="text-sm font-medium">{label}</span>
      {selected && <X className="h-4 w-4 ml-1" aria-hidden="true" />}
    </button>
  );
};

export default TagChip;
