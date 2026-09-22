import React from 'react';
import { AlertCircle, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepTitle: string;
  errors: string[];
  isSubmitting?: boolean;
}

export const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  isOpen,
  onClose,
  stepTitle,
  errors,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 overflow-hidden relative"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                {isSubmitting ? 'Campos Requeridos Incompletos' : 'Faltan Preguntas por Responder'}
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {stepTitle}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            {isSubmitting
              ? 'Para formalizar y enviar el expediente, todas las preguntas obligatorias deben estar completadas (las vacunas son opcionales y solo se requiere al menos un responsable):'
              : 'Por favor complete las siguientes preguntas obligatorias antes de continuar al siguiente paso:'}
          </p>

          {/* Errors list */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar bg-rose-50/60 rounded-2xl p-3.5 border border-rose-200/80 mb-6 space-y-2">
            {errors.map((err, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-rose-950 font-medium leading-snug">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                <span>{err}</span>
              </div>
            ))}
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-nl-petrol to-teal-700 hover:from-nl-petrol-dark hover:to-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Entendido, completar campos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
