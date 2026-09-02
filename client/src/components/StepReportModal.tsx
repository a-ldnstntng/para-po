import { useState } from 'react';
import { X, Check, AlertCircle, Send } from 'lucide-react';
import type { RouteStep } from '../lib/api';
import { saveStepReport } from '../lib/userProfile';

interface StepReportModalProps {
  step: RouteStep;
  stepIndex: number;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Mali ang pamasahe',
  'Sarado o lumipat na ang sakayan / terminal',
  'Mali ang direksyon o instruksyon',
  'Hindi na tumatakbo ang rutang ito',
  'Iba pang dahilan',
];

export default function StepReportModal({
  step,
  stepIndex,
  onClose,
}: StepReportModalProps) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStepReport({
      stepIndex: stepIndex + 1,
      mode: step.mode,
      instruction: step.instruction,
      landmark: step.landmark,
      fare: step.fare_estimate_php,
      reason: selectedReason,
      notes: notes.trim(),
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                I-ulat ang Hakbang #{stepIndex + 1}
              </h3>
              <p className="font-body text-[11px] text-slate-400">
                Tulungang itama ang transit data para sa lahat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Preview Snippet */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs font-body text-slate-700">
          <span className="font-display font-bold text-[10px] text-orange-600 uppercase tracking-wider block mb-0.5">
            {step.mode.toUpperCase()} {step.fare_estimate_php ? `· ₱${step.fare_estimate_php.toFixed(0)}` : ''}
          </span>
          <p className="line-clamp-2 leading-relaxed">
            {step.instruction}
          </p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <p className="font-display font-bold text-sm text-slate-900">
              Salamat sa iyong ulat!
            </p>
            <p className="font-body text-xs text-slate-400">
              Susuriin namin ang pagwawastong ito para sa susunod na commuter.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Quick Reason Radio Options */}
            <div>
              <label className="block text-[11px] font-display font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ano ang mali sa hakbang na ito?
              </label>
              <div className="space-y-1.5">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`
                      flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-body cursor-pointer transition-all
                      ${
                        selectedReason === reason
                          ? 'border-orange-500 bg-orange-50/50 text-slate-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-orange-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-[11px] font-display font-bold text-slate-700 uppercase tracking-wider mb-1">
                Karagdagang detalye (Opsyonal)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Hal: '₱20 na po ang pamasahe dito hindi ₱13' o 'Lumipat na ang terminal sa likod ng palengke'"
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="btn-transit-secondary !py-2 !px-3 !text-xs"
              >
                Kanselahin
              </button>
              <button
                type="submit"
                className="btn-sakay-primary !py-2 !px-4 !text-xs"
              >
                <Send className="w-3 h-3" />
                <span>I-submit ang Ulat</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
