/**
 * Alert/Toast Component - Molecule component
 * Notification display component
 */

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const iconMap = {
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />,
};

const bgColorMap = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
  info: 'bg-blue-50 border-blue-200',
};

const textColorMap = {
  success: 'text-green-800',
  error: 'text-red-800',
  warning: 'text-amber-800',
  info: 'text-blue-800',
};

export const Toast = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={clsx(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        bgColorMap[type],
        'animation-in slide-in-from-top-5 fade-in'
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {iconMap[type]}
      <p className={clsx('text-sm font-medium', textColorMap[type])}>
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className="ml-auto text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
