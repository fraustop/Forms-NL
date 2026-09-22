import React, { useState } from 'react';
import { Copy, Check, CloudCheck, ArrowRight, ShieldCheck, Sparkles, X, PlusCircle } from 'lucide-react';

interface SaveFirestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  folio: string;
  childName: string;
  onNavigateToResponses: () => void;
  onNewForm: () => void;
}

export const SaveFirestoreModal: React.FC<SaveFirestoreModalProps> = ({
  isOpen,
  onClose,
  documentId,
  folio,
  childName,
  onNavigateToResponses,
  onNewForm,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyFolio = () => {
    navigator.clipboard.writeText(folio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-teal-100 text-center relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Badge */}
        <div className="w-16 h-16 rounded-3xl bg-teal-100 text-nl-petrol flex items-center justify-center mx-auto mb-4 shadow-sm ring-8 ring-teal-50">
          <CloudCheck className="w-9 h-9" />
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Enviado Exitosamente a Firestore
        </span>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-1">
          ¡Formulario Enviado con Éxito!
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
          Los datos de caracterización de <strong className="text-slate-900">{childName || 'la niña o niño'}</strong> han sido guardados y registrados correctamente en la plataforma oficial de <strong>Educación Inicial Nuevo León</strong>.
        </p>

        {/* Folio & Doc ID Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Folio Oficial Registrado
              </span>
              <span className="text-base font-extrabold text-nl-petrol font-mono">
                {folio}
              </span>
            </div>

            <button
              type="button"
              onClick={copyFolio}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-nl-petrol text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>ID de Registro:</span>
            <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]">
              {documentId}
            </span>
          </div>
        </div>

        {/* Action Buttons: ONLY View Responses OR Start New Form */}
        <div className="space-y-3">
          {/* Option 1: Ver las Respuestas */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToResponses();
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-nl-petrol to-teal-700 hover:from-nl-petrol-dark hover:to-teal-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Ver las Respuestas</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Option 2: Comenzar un Nuevo Formulario */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onNewForm();
            }}
            className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-nl-petrol" />
            <span>Comenzar un Nuevo Formulario</span>
          </button>
        </div>
      </div>
    </div>
  );
};
