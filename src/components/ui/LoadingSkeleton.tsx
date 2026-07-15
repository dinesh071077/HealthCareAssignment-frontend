import React from 'react';

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="card p-5 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
