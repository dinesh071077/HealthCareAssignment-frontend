import React, { useState } from 'react';
import { MessageSquare, ClipboardEdit } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StructuredForm from '../components/interactions/StructuredForm';
import AIChatTab from '../components/interactions/AIChatTab';

type TabKey = 'form' | 'ai';

const LogInteraction: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('form');
  const [prefillData, setPrefillData] = useState<Record<string, string> | undefined>();

  const handleUseInForm = (data: Record<string, string>) => {
    setPrefillData({
      doctorName:    data.doctor_name   ?? '',
      hospital:      data.hospital      ?? '',
      specialization: data.specialization ?? '',
      visitDate:     data.visit_date    ?? new Date().toISOString().split('T')[0],
      visitType:     data.visit_type    ?? 'In-person',
      purpose:       data.purpose       ?? '',
      summary:       data.summary       ?? '',
      followUpDate:  data.follow_up_date ?? '',
      sentiment:     data.sentiment     ?? 'Neutral',
      outcome:       data.outcome       ?? '',
    } as any);
    setActiveTab('form');
  };

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'form', label: 'Structured Form', icon: ClipboardEdit },
    { key: 'ai',   label: 'AI Assistant',    icon: MessageSquare },
  ];

  return (
    <Layout title="Log Interaction" subtitle="Record your HCP interaction via form or AI chat">
      {/* Tab header */}
      <div className="card p-1 flex gap-1 mb-6 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? 'bg-gradient-brand text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'form'
        ? <StructuredForm prefill={prefillData as any} />
        : <AIChatTab onUseInForm={handleUseInForm} />
      }
    </Layout>
  );
};

export default LogInteraction;
