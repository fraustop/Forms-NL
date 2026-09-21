import React, { useState } from 'react';
import { Copy, Check, CloudCheck, Printer, ArrowRight, Sparkles, X } from 'lucide-react';

interface SaveFirestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  folio: string;
  childName: string;
  onOpenPrint: () => void;
  onNewForm: () => void;
}

export const SaveFirestoreModal: React.FC<SaveFirestoreModalProps> = ({
  isOpen,
  onClose,
  documentId,
  folio,
  childName,
  onOpenPrint,
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

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Guardado en Firebase Firestore
        </span>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-1">
          ¡Expediente Registrado con Éxito!
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
          Los datos de caracterización de <strong className="text-slate-900">{childName || 'la niña o niño'}</strong> se han almacenado de forma segura en la base de datos de <strong>Nuevo León Educación</strong>.
        </p>

        {/* Folio & Doc ID Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Folio Oficial del Formato
              </span>
              <span className="text-base font-extrabold text-nl-petrol font-mono">
                {folio}
              </span>
            </div>

            <button
              type="button"
              onClick={copyFolio}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-nl-petrol text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
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
            <span>ID Documento:</span>
            <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]">
              {documentId}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPrint();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-nl-petrol hover:bg-nl-petrol-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Ver e Imprimir Formato Oficial (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNewForm();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Llenar Nuevo Formato</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
