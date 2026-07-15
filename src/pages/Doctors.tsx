import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserRound, Hospital, Stethoscope, ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchDoctors } from '../redux/slices/doctorSlice';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Doctors: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading } = useAppSelector((s) => s.doctors);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  return (
    <Layout title="Doctors" subtitle="Manage your Healthcare Professional contacts">
      <div className="flex justify-end mb-6">
        <button onClick={() => navigate('/log-interaction')} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Interaction
        </button>
      </div>

      {loading ? <LoadingSkeleton /> : (
        list.length === 0 ? (
          <div className="card p-16 text-center">
            <UserRound className="w-14 h-14 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No doctors logged yet.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Log an interaction to add doctors automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((doc) => (
              <div key={doc.id} className="card p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    {doc.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white truncate">{doc.name}</p>
                    <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 mt-0.5">
                      <Stethoscope className="w-3 h-3" />
                      {doc.specialization || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <Hospital className="w-3 h-3" />
                      {doc.hospital}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </Layout>
  );
};

export default Doctors;
