import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { removeToast } from '../../redux/slices/uiSlice';
import type { Toast } from '../../redux/slices/uiSlice';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error:   <XCircle     className="w-5 h-5 text-rose-500"    />,
  info:    <Info        className="w-5 h-5 text-brand-500"   />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <div className="toast-enter flex items-start gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 min-w-[280px] max-w-sm">
      {icons[toast.type]}
      <p className="flex-1 text-sm text-slate-700 dark:text-slate-200 font-medium">{toast.message}</p>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((s) => s.ui.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
};

export default ToastContainer;
