import React from 'react';
import Layout from '../components/layout/Layout';
import { BarChart3 } from 'lucide-react';
import { useAppSelector } from '../hooks/useRedux';

const Analytics: React.FC = () => {
  const interactions = useAppSelector((s) => s.interactions.list);

  const sentimentCounts = ['Positive', 'Neutral', 'Negative'].map((s) => ({
    label: s,
    count: interactions.filter((i) => i.sentiment === s).length,
  }));

  const visitTypeCounts = ['In-person', 'Phone', 'Video', 'Email'].map((t) => ({
    label: t,
    count: interactions.filter((i) => i.visit_type === t).length,
  }));

  const total = interactions.length || 1;

  const colors: Record<string, string> = {
    Positive: 'bg-emerald-500', Neutral: 'bg-amber-500', Negative: 'bg-rose-500',
    'In-person': 'bg-brand-500', Phone: 'bg-teal-500', Video: 'bg-purple-500', Email: 'bg-orange-500',
  };

  return (
    <Layout title="Analytics" subtitle="Interaction trends and insights">
      {interactions.length === 0 ? (
        <div className="card p-16 text-center">
          <BarChart3 className="w-14 h-14 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No data yet. Log interactions to see analytics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentiment breakdown */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Doctor Sentiment</h3>
            <div className="space-y-4">
              {sentimentCounts.map(({ label, count }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
                    <span className="text-slate-400 dark:text-slate-500">{count} ({Math.round((count / total) * 100)}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-2.5 rounded-full ${colors[label]} transition-all duration-700`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visit type breakdown */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Visit Types</h3>
            <div className="space-y-4">
              {visitTypeCounts.map(({ label, count }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
                    <span className="text-slate-400 dark:text-slate-500">{count} ({Math.round((count / total) * 100)}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-2.5 rounded-full ${colors[label]} transition-all duration-700`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary card */}
          <div className="card p-6 md:col-span-2">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Product Performance</h3>
            {(() => {
              const productMap: Record<string, number> = {};
              interactions.forEach((i) => {
                (i.products ?? []).forEach((p) => { productMap[p] = (productMap[p] ?? 0) + 1; });
              });
              const products = Object.entries(productMap).sort(([, a], [, b]) => b - a);
              const maxCount = products[0]?.[1] ?? 1;
              return products.length === 0
                ? <p className="text-slate-400 text-sm">No product data.</p>
                : (
                  <div className="space-y-3">
                    {products.map(([name, count]) => (
                      <div key={name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-slate-600 dark:text-slate-300">{name}</span>
                          <span className="text-slate-400 dark:text-slate-500">{count} interactions</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-2.5 rounded-full bg-gradient-brand transition-all duration-700"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
            })()}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;
