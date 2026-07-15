import React from 'react';
import Layout from '../components/layout/Layout';
import { Settings as SettingsIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleDarkMode } from '../redux/slices/uiSlice';

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.ui.darkMode);

  return (
    <Layout title="Settings" subtitle="App preferences and configuration">
      <div className="max-w-lg space-y-4">
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-brand-500" />
            Appearance
          </h3>
          <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Toggle dark/light theme</p>
            </div>
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${darkMode ? 'bg-brand-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">Backend Configuration</h3>
          <div>
            <label className="form-label">API Base URL</label>
            <input className="form-input" defaultValue="http://localhost:8000/api" readOnly />
          </div>
          <div>
            <label className="form-label">AI Model</label>
            <input className="form-input" defaultValue="gemma2-9b-it (Groq)" readOnly />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
