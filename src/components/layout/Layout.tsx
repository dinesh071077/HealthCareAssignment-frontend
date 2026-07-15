import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/ToastContainer';
import { useAppSelector } from '../../hooks/useRedux';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-inter">
      <Sidebar />

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '240px' : '64px' }}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Layout;
