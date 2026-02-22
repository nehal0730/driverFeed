import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/formatting.js';

export const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  color = 'primary',
  loading = false,
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-accent-50 text-accent-600',
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="h-4 w-4" />;
    return trend > 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400';
    return trend > 0 ? 'text-success-600' : 'text-accent-600';
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
            ) : (
              <>
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
              </>
            )}
          </div>
        </div>
        {icon && (
          <div className={cn('rounded-lg p-3', colorClasses[color])}>
            {icon}
          </div>
        )}
      </div>

      {trend !== undefined && trendLabel && (
        <div className={cn('mt-4 flex items-center gap-1', getTrendColor())}>
          {getTrendIcon()}
          <span className="text-xs font-semibold">
            {Math.abs(trend).toFixed(1)}% {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export const MetricCard = ({ label, value, change, icon, className }) => {
  return (
    <div className={cn('card p-4 md:p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {change !== undefined && (
            <p className={`mt-1 text-xs font-medium ${change >= 0 ? 'text-success-600' : 'text-accent-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        {icon && <div className="text-3xl opacity-50">{icon}</div>}
      </div>
    </div>
  );
};

export const FeatureCard = ({ title, description, icon, onClick, href, badge }) => {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      className="card card-hover group relative overflow-hidden p-6 transition-all duration-300 hover:border-primary-300 hover:shadow-lg"
    >
      {badge && (
        <span className="badge badge-primary absolute right-3 top-3 text-xs">
          {badge}
        </span>
      )}
      <div className="flex gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </Component>
  );
};

export const ProgressCard = ({
  label,
  value,
  max = 100,
  color = 'primary',
  showValue = true,
  animated = true,
}) => {
  const percentage = (value / max) * 100;
  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-yellow-600',
    danger: 'bg-accent-600',
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-900">{label}</h4>
        {showValue && <span className="text-sm font-semibold text-slate-600">{value}/{max}</span>}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn(
            'h-full transition-all duration-500',
            colorClasses[color],
            animated && 'ease-out'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
