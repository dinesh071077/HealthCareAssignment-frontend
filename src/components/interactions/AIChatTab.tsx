import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, CheckCircle, Edit3, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  addMessage,
  setLoading,
  setComplete,
  setExtractedData,
  resetChat,
} from '../../redux/slices/chatSlice';
import { addToast } from '../../redux/slices/uiSlice';
import { saveInteraction } from '../../redux/slices/interactionSlice';
import { createDoctor } from '../../redux/slices/doctorSlice';
import { api } from '../../services/api';

const EXAMPLE_HINTS = [
  'Met Dr. Sharma today at Apollo Chennai.',
  'Called Dr. Patel — discussed CardioPlus.',
  'Video call with Dr. Rao, Fortis Bangalore.',
];

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-3 self-start">
    <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="chat-bubble-ai flex items-center gap-1 py-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-brand-400 inline-block"
          style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-6px); }
      }
    `}</style>
  </div>
);

const AIChatTab: React.FC<{ onUseInForm?: (data: Record<string, string>) => void }> = ({ onUseInForm }) => {
  const dispatch = useAppDispatch();
  const { messages, isLoading, isComplete, extractedData } = useAppSelector((s) => s.chat);

  const [input, setInput] = useState('');
  const [editedData, setEditedData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (extractedData) {
      const flat: Record<string, string> = {};
      Object.entries(extractedData).forEach(([k, v]) => {
        flat[k] = Array.isArray(v) ? (v as string[]).join(', ') : (v as string) ?? '';
      });
      setEditedData(flat);
    }
  }, [extractedData]);

  // Greet on first load
  useEffect(() => {
    if (messages.length === 0) {
      dispatch(addMessage({
        role: 'assistant',
        content: "👋 Hi! I'm your Pharma CRM Assistant. Tell me about your interaction with a doctor — who did you meet, where, and what was discussed?",
      }));
    }
  }, []);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    dispatch(addMessage({ role: 'user', content: userText }));
    setInput('');
    dispatch(setLoading(true));

    try {
      const historyForApi = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await api.post('/chat', {
        messages: historyForApi,
        user_message: userText,
      });

      const { response, is_complete, extracted_data } = res.data;

      dispatch(addMessage({ role: 'assistant', content: response }));
      dispatch(setComplete(is_complete));
      if (is_complete && extracted_data) {
        dispatch(setExtractedData(extracted_data));
      }
    } catch {
      dispatch(addMessage({
        role: 'assistant',
        content: '⚠️ Connection error. Please ensure the backend is running at http://localhost:8000.',
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSaveFromChat = async () => {
    if (!editedData) return;
    setSaving(true);

    try {
      // Ensure doctor exists
      const docResult = await dispatch(createDoctor({
        name: editedData.doctor_name ?? '',
        hospital: editedData.hospital ?? '',
        specialization: editedData.specialization ?? '',
      }));

      let doctorId: number;
      if (createDoctor.fulfilled.match(docResult)) {
        doctorId = docResult.payload.id;
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to create doctor.' }));
        setSaving(false);
        return;
      }

      const products = editedData.products_discussed
        ? editedData.products_discussed.split(',').map((p) => p.trim()).filter(Boolean)
        : [];

      const result = await dispatch(saveInteraction({
        doctor_id: doctorId,
        visit_date: editedData.visit_date || new Date().toISOString().split('T')[0],
        visit_type: editedData.visit_type || 'In-person',
        purpose: editedData.purpose || undefined,
        summary: editedData.summary || '',
        sentiment: editedData.sentiment || 'Neutral',
        products,
        follow_up_date: editedData.follow_up_date || undefined,
        outcome: editedData.outcome || undefined,
      }));

      if (saveInteraction.fulfilled.match(result)) {
        dispatch(addToast({ type: 'success', message: 'Interaction saved from AI chat! ✅' }));
        dispatch(resetChat());
      } else {
        dispatch(addToast({ type: 'error', message: 'Save failed. Check backend connection.' }));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-240px)] min-h-[500px]">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col card overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white text-sm">Pharma CRM Assistant</p>
              <p className="text-xs text-teal-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                Powered by Groq · gemma2-9b-it
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(resetChat())}
            className="btn-ghost text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Hints */}
          {messages.length <= 1 && (
            <div className="text-center space-y-2 py-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Try saying...</p>
              <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLE_HINTS.map((h) => (
                  <button
                    key={h}
                    onClick={() => sendMessage(h)}
                    className="px-3 py-1.5 rounded-full text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-colors"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-slate-200 dark:bg-slate-700'
                  : 'bg-gradient-brand'
              }`}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  : <Bot  className="w-4 h-4 text-white" />
                }
              </div>
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400 dark:text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-4">
          {isComplete && (
            <div className="flex items-center gap-2 mb-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4" />
              All information collected! Review and save on the right →
            </div>
          )}
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send)"
              disabled={isLoading || isComplete}
              className="form-textarea flex-1 resize-none max-h-28"
              style={{ overflow: 'auto' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading || isComplete}
              className="btn-primary px-4 py-2.5 rounded-xl self-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Extraction Panel */}
      {isComplete && extractedData && (
        <div className="w-full lg:w-96 card overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-brand-50 to-teal-50 dark:from-brand-900/20 dark:to-teal-900/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <p className="font-semibold text-slate-800 dark:text-white text-sm">Extracted CRM Record</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Review and edit before saving</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {Object.entries(editedData).map(([key, value]) => (
              <div key={key}>
                <label className="form-label capitalize">{key.replace(/_/g, ' ')}</label>
                <input
                  className="form-input text-xs"
                  value={value ?? ''}
                  onChange={(e) => setEditedData((d) => ({ ...d, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            {onUseInForm && (
              <button
                onClick={() => onUseInForm(editedData)}
                className="btn-secondary flex-1 text-xs justify-center"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit in Form
              </button>
            )}
            <button
              onClick={handleSaveFromChat}
              disabled={saving}
              className="btn-primary flex-1 text-xs justify-center"
            >
              {saving
                ? <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                : <Save className="w-3.5 h-3.5" />
              }
              {saving ? 'Saving...' : 'Save to CRM'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatTab;
