import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, ClipboardList, TrendingUp, Calendar,
  Plus, ChevronRight, Activity, Target
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchInteractions } from '../redux/slices/interactionSlice';
import { fetchDoctors } from '../redux/slices/doctorSlice';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}> = ({ icon: Icon, label, value, change, color }) => (
  <div className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{value}</p>
      {change && <p className="text-xs text-emerald-500 font-medium mt-1">{change}</p>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list: interactions, loading } = useAppSelector((s) => s.interactions);
  const { list: doctors } = useAppSelector((s) => s.doctors);

  useEffect(() => {
    dispatch(fetchInteractions());
    dispatch(fetchDoctors());
  }, [dispatch]);

  const positiveCount  = interactions.filter((i) => i.sentiment === 'Positive').length;
  const followUps      = interactions.filter((i) => i.outcome === 'Follow-up Needed').length;
  const recentInteractions = interactions.slice(0, 5);

  return (
    <Layout title="Dashboard" subtitle="Welcome back! Here's your activity overview.">
      {/* CTA banner */}
      <div className="rounded-2xl bg-gradient-brand p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <h2 className="text-xl font-bold">Log Your Next Interaction</h2>
          <p className="text-white/80 text-sm mt-1">Use the AI assistant or structured form to record your meeting.</p>
        </div>
        <button onClick={() => navigate('/log-interaction')} className="btn-primary bg-white text-brand-700 hover:bg-white/90 flex-shrink-0">
          <Plus className="w-4 h-4" />
          Log Interaction
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ClipboardList} label="Total Interactions" value={interactions.length}  change="↑ 12% this week" color="bg-gradient-brand" />
        <StatCard icon={Users}         label="Doctors Reached"   value={doctors.length}         change="↑ 3 new this month"  color="bg-teal-500" />
        <StatCard icon={Activity}      label="Positive Responses" value={positiveCount}          color="bg-emerald-500" />
        <StatCard icon={Target}        label="Pending Follow-ups" value={followUps}              color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Interactions */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Recent Interactions</h3>
            <button
              onClick={() => navigate('/interactions')}
              className="text-brand-500 dark:text-brand-400 text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? <LoadingSkeleton /> : (
            recentInteractions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No interactions yet. Start by logging one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentInteractions.map((interaction) => (
                  <div key={interaction.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm flex-shrink-0">
                      {(interaction as any).doctor_id ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{interaction.visit_type} Visit</p>
                        <span className={`badge ${
                          interaction.sentiment === 'Positive' ? 'badge-positive'
                          : interaction.sentiment === 'Negative' ? 'badge-negative'
                          : 'badge-neutral'
                        }`}>{interaction.sentiment}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{interaction.summary}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{interaction.visit_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Log New Interaction', icon: Plus, to: '/log-interaction', color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' },
              { label: 'View All Doctors',    icon: Users, to: '/doctors',         color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20'  },
              { label: 'Upcoming Follow-ups', icon: Calendar, to: '/interactions', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
              { label: 'View Analytics',      icon: TrendingUp, to: '/analytics',  color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
            ].map(({ label, icon: Icon, to, color }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
              >
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
