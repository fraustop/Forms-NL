import React from 'react';
import { Check, Plus } from 'lucide-react';

interface FormFieldProps {
  label: string;
  sublabel?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  sublabel,
  required,
  children,
  className = '',
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="block text-sm font-semibold text-slate-800">
      {label} {required && <span className="text-rose-500 font-bold">*</span>}
    </label>
    {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
    {children}
  </div>
);

interface YesNoRadioProps {
  label: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
  sublabel?: string;
  yesLabel?: string;
  noLabel?: string;
  conditionalContent?: React.ReactNode;
  showConditionalWhen?: boolean;
}

export const YesNoRadio: React.FC<YesNoRadioProps> = ({
  label,
  value,
  onChange,
  sublabel,
  yesLabel = 'Sí',
  noLabel = 'No',
  conditionalContent,
  showConditionalWhen = true,
}) => {
  return (
    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 transition-all hover:bg-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-sm font-bold text-slate-800 block">{label}</span>
          {sublabel && <span className="text-xs text-slate-500 block mt-0.5">{sublabel}</span>}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm ${
              value === true
                ? 'bg-nl-petrol text-white ring-2 ring-nl-petrol ring-offset-1 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${value === true ? 'border-white bg-white/20' : 'border-slate-400'}`}>
              {value === true && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </div>
            {yesLabel}
          </button>

          <button
            type="button"
            onClick={() => onChange(false)}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm ${
              value === false
                ? 'bg-slate-700 text-white ring-2 ring-slate-700 ring-offset-1 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${value === false ? 'border-white bg-white/20' : 'border-slate-400'}`}>
              {value === false && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </div>
            {noLabel}
          </button>
        </div>
      </div>

      {conditionalContent && value === showConditionalWhen && (
        <div className="mt-3 pt-3 border-t border-slate-200 animate-fadeIn">
          {conditionalContent}
        </div>
      )}
    </div>
  );
};

interface SuggestionChipsProps {
  suggestions: string[];
  currentValue: string;
  onSelect: (newVal: string) => void;
  label?: string;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  currentValue,
  onSelect,
  label = '💡 Sugerencias rápidas (toca para agregar):',
}) => {
  const addSuggestion = (text: string) => {
    if (!currentValue.trim()) {
      onSelect(text);
    } else if (!currentValue.includes(text)) {
      onSelect(`${currentValue.trim()}, ${text}`);
    }
  };

  return (
    <div className="mt-2 space-y-1.5">
      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((item, idx) => {
          const isSelected = currentValue.includes(item);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => addSuggestion(item)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-nl-petrol-soft border-nl-petrol-light text-nl-petrol-dark font-medium'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-nl-petrol hover:text-nl-petrol'
              }`}
            >
              <Plus className="w-3 h-3 opacity-60" />
              <span>{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface SectionCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  className = '',
}) => (
  <div className={`bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-card transition-all ${className}`}>
    <div className="flex items-start justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-2xl bg-nl-petrol-soft text-nl-petrol flex items-center justify-center shrink-0 shadow-sm">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800 font-display">{title}</h3>
            {badge && (
              <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);
