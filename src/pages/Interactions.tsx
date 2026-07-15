import React, { useEffect } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchInteractions } from '../redux/slices/interactionSlice';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Interactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading } = useAppSelector((s) => s.interactions);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  return (
    <Layout title="Interactions" subtitle="All logged HCP interactions">
      <div className="flex justify-end mb-6">
        <button onClick={() => navigate('/log-interaction')} className="btn-primary">
          <Plus className="w-4 h-4" /> Log New
        </button>
      </div>

      {loading ? <LoadingSkeleton /> : (
        list.length === 0 ? (
          <div className="card p-16 text-center">
            <ClipboardList className="w-14 h-14 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No interactions logged yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((item) => (
              <div key={item.id} className="card p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-card-hover transition-shadow">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {item.visit_type} Visit
                    </p>
                    <span className={`badge ${
                      item.sentiment === 'Positive' ? 'badge-positive'
                      : item.sentiment === 'Negative' ? 'badge-negative'
                      : 'badge-neutral'
                    }`}>{item.sentiment}</span>
                    {item.outcome && (
                      <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                        {item.outcome}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{item.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                    <span>📅 {item.visit_date}</span>
                    {item.follow_up_date && <span>🔔 Follow-up: {item.follow_up_date}</span>}
                  </div>
                  {item.products && item.products.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.products.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded-full text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </Layout>
  );
};

export default Interactions;
