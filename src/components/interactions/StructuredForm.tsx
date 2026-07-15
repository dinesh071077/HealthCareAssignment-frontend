import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { saveInteraction } from '../../redux/slices/interactionSlice';
import { fetchDoctors, createDoctor } from '../../redux/slices/doctorSlice';
import { addToast } from '../../redux/slices/uiSlice';

const VISIT_TYPES = ['In-person', 'Phone', 'Video', 'Email'];
const SENTIMENTS  = ['Positive', 'Neutral', 'Negative'];
const OUTCOMES    = ['Prescription Interest', 'Sample Requested', 'Follow-up Needed', 'No Action'];
const ALL_PRODUCTS = ['CardioPlus', 'NeuroMax', 'DiabetiCare', 'OncoPrime', 'RespiClear', 'ImmunBoost', 'OrthoRelief', 'GastroPro'];

interface FormData {
  doctorName: string;
  hospital: string;
  specialization: string;
  visitDate: string;
  visitTime: string;
  visitType: string;
  products: string[];
  purpose: string;
  summary: string;
  followUpDate: string;
  sentiment: string;
  outcome: string;
  doctorId: number | null;
}

const initialForm: FormData = {
  doctorName: '', hospital: '', specialization: '',
  visitDate: new Date().toISOString().split('T')[0],
  visitTime: '', visitType: 'In-person', products: [],
  purpose: '', summary: '', followUpDate: '',
  sentiment: 'Neutral', outcome: '', doctorId: null,
};

interface Props {
  prefill?: Partial<FormData>;
}

const StructuredForm: React.FC<Props> = ({ prefill }) => {
  const dispatch = useAppDispatch();
  const doctors = useAppSelector((s) => s.doctors.list);
  const loading  = useAppSelector((s) => s.interactions.loading);

  const [form, setForm] = useState<FormData>({ ...initialForm, ...prefill });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  // Merge prefill if it changes (e.g., from AI extraction)
  useEffect(() => {
    if (prefill) setForm((f) => ({ ...f, ...prefill }));
  }, [prefill]);

  const handleChange = (field: keyof FormData, value: string | string[] | number | null) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const toggleProduct = (p: string) => {
    setForm((f) => ({
      ...f,
      products: f.products.includes(p) ? f.products.filter((x) => x !== p) : [...f.products, p],
    }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.doctorName.trim()) errs.doctorName = 'Doctor name is required';
    if (!form.hospital.trim())   errs.hospital   = 'Hospital is required';
    if (!form.visitDate)         errs.visitDate   = 'Visit date is required';
    if (!form.summary.trim())    errs.summary     = 'Summary is required';
    if (form.products.length === 0) errs.products = 'Select at least one product';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDoctorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10);
    const doc = doctors.find((d) => d.id === id);
    if (doc) {
      setForm((f) => ({
        ...f,
        doctorId: doc.id,
        doctorName: doc.name,
        hospital: doc.hospital,
        specialization: doc.specialization,
      }));
    }
  };

  const handleSave = async () => {
    if (!validate()) {
      dispatch(addToast({ type: 'error', message: 'Please fix the errors before saving.' }));
      return;
    }

    let doctorId = form.doctorId;

    // Create doctor on-the-fly if not found
    if (!doctorId) {
      const result = await dispatch(createDoctor({
        name: form.doctorName,
        hospital: form.hospital,
        specialization: form.specialization,
      }));
      if (createDoctor.fulfilled.match(result)) {
        doctorId = result.payload.id;
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to create doctor record.' }));
        return;
      }
    }

    const result = await dispatch(saveInteraction({
      doctor_id: doctorId!,
      visit_date: form.visitDate,
      visit_time: form.visitTime || undefined,
      visit_type: form.visitType,
      purpose: form.purpose || undefined,
      summary: form.summary,
      sentiment: form.sentiment,
      products: form.products,
      follow_up_date: form.followUpDate || undefined,
      outcome: form.outcome || undefined,
    }));

    if (saveInteraction.fulfilled.match(result)) {
      dispatch(addToast({ type: 'success', message: 'Interaction saved successfully! ✅' }));
      setForm({ ...initialForm });
    } else {
      dispatch(addToast({ type: 'error', message: 'Failed to save interaction. Is the backend running?' }));
    }
  };

  const fieldError = (field: keyof FormData) =>
    errors[field] ? <p className="text-rose-500 text-xs mt-1">{errors[field]}</p> : null;

  return (
    <div className="space-y-6">
      {/* Doctor Section */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-xs flex items-center justify-center font-bold">1</span>
            Doctor Information
          </h3>
          {doctors.length > 0 && (
            <select onChange={handleDoctorSelect} className="form-select w-auto text-xs" defaultValue="">
              <option value="" disabled>Select existing doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} — {d.hospital}</option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Doctor Name *</label>
            <input
              className={`form-input ${errors.doctorName ? 'border-rose-400' : ''}`}
              placeholder="Dr. Sharma"
              value={form.doctorName}
              onChange={(e) => handleChange('doctorName', e.target.value)}
            />
            {fieldError('doctorName')}
          </div>
          <div>
            <label className="form-label">Hospital / Clinic *</label>
            <input
              className={`form-input ${errors.hospital ? 'border-rose-400' : ''}`}
              placeholder="Apollo Hospital"
              value={form.hospital}
              onChange={(e) => handleChange('hospital', e.target.value)}
            />
            {fieldError('hospital')}
          </div>
          <div>
            <label className="form-label">Specialization</label>
            <input
              className="form-input"
              placeholder="Cardiologist"
              value={form.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Visit Details */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-xs flex items-center justify-center font-bold">2</span>
          Visit Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Visit Date *</label>
            <input
              type="date"
              className={`form-input ${errors.visitDate ? 'border-rose-400' : ''}`}
              value={form.visitDate}
              onChange={(e) => handleChange('visitDate', e.target.value)}
            />
            {fieldError('visitDate')}
          </div>
          <div>
            <label className="form-label">Visit Time</label>
            <input
              type="time"
              className="form-input"
              value={form.visitTime}
              onChange={(e) => handleChange('visitTime', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Visit Type</label>
            <select
              className="form-select"
              value={form.visitType}
              onChange={(e) => handleChange('visitType', e.target.value)}
            >
              {VISIT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Purpose of Visit</label>
          <input
            className="form-input"
            placeholder="Product introduction / Follow-up / Sample drop-off..."
            value={form.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
          />
        </div>
      </div>

      {/* Products */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-xs flex items-center justify-center font-bold">3</span>
          Products Discussed *
        </h3>
        {errors.products && <p className="text-rose-500 text-xs">{errors.products}</p>}
        <div className="flex flex-wrap gap-2">
          {ALL_PRODUCTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggleProduct(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                form.products.includes(p)
                  ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Discussion Summary */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-xs flex items-center justify-center font-bold">4</span>
          Discussion Summary & Outcome
        </h3>

        <div>
          <label className="form-label">Discussion Summary *</label>
          <textarea
            rows={4}
            className={`form-textarea ${errors.summary ? 'border-rose-400' : ''}`}
            placeholder="Detailed summary of the conversation..."
            value={form.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
          />
          {fieldError('summary')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Next Follow-up Date</label>
            <input
              type="date"
              className="form-input"
              value={form.followUpDate}
              onChange={(e) => handleChange('followUpDate', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Outcome</label>
            <select
              className="form-select"
              value={form.outcome}
              onChange={(e) => handleChange('outcome', e.target.value)}
            >
              <option value="">Select outcome</option>
              {OUTCOMES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Sentiment */}
        <div>
          <label className="form-label">Doctor Sentiment</label>
          <div className="flex gap-3 mt-1">
            {SENTIMENTS.map((s) => {
              const colors: Record<string, string> = {
                Positive: 'bg-emerald-500 border-emerald-500 text-white',
                Neutral:  'bg-amber-500  border-amber-500  text-white',
                Negative: 'bg-rose-500   border-rose-500   text-white',
              };
              const inactive = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400';
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChange('sentiment', s)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    form.sentiment === s ? colors[s] : inactive
                  }`}
                >
                  {s === 'Positive' ? '😊' : s === 'Neutral' ? '😐' : '😟'} {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save / Reset */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setForm({ ...initialForm })}
          className="btn-ghost"
        >
          <X className="w-4 h-4" /> Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? 'Saving...' : 'Save Interaction'}
        </button>
      </div>
    </div>
  );
};

export default StructuredForm;
