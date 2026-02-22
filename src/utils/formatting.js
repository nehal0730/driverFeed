export const formatDate = (date, format = 'long') => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatTimeAgo = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(d, 'short');
};

export const formatNumber = (num, decimals = 1) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-success-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 2.5) return 'text-orange-600';
  return 'text-accent-600';
};

export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return 'text-success-600 bg-success-50';
    case 'neutral':
      return 'text-slate-600 bg-slate-50';
    case 'negative':
      return 'text-accent-600 bg-accent-50';
    default:
      return 'text-slate-600 bg-slate-50';
  }
};

export const getSentimentBadgeColor = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return 'badge-success';
    case 'neutral':
      return 'bg-slate-100 text-slate-800';
    case 'negative':
      return 'badge-danger';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

export const getTrendIcon = (trend) => {
  if (trend > 0) return { icon: 'fa-solid fa-arrow-trend-up', color: 'text-success-600' };
  if (trend < 0) return { icon: 'fa-solid fa-arrow-trend-down', color: 'text-accent-600' };
  return { icon: 'fa-solid fa-arrow-right', color: 'text-slate-400' };
};

export const calculateSentimentPercentage = (sentiment) => {
  const total = sentiment.positive + sentiment.neutral + sentiment.negative;
  if (total === 0) return { positive: 0, neutral: 0, negative: 0 };
  return {
    positive: (sentiment.positive / total) * 100,
    neutral: (sentiment.neutral / total) * 100,
    negative: (sentiment.negative / total) * 100,
  };
};

export const generateChartColors = (count) => {
  const colors = [
    'rgb(34, 197, 94)',
    'rgb(59, 130, 246)',
    'rgb(168, 85, 247)',
    'rgb(244, 63, 94)',
    'rgb(251, 146, 60)',
    'rgb(14, 165, 233)',
  ];
  return Array(count).fill(null).map((_, i) => colors[i % colors.length]);
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const roundToDecimals = (num, decimals = 2) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
