import React, { useState } from 'react';
import { Copy, Check, CloudCheck, Eye, PlusCircle, Lock, Shield } from 'lucide-react';
import { NuevoLeonHeader } from './BrandAssets';

interface SaveFirestoreModalProps {
  isOpen: boolean;
  documentId: string;
  folio: string;
  childName: string;
  onViewSubmittedResponses: () => void;
  onNewForm: () => void;
}

export const SaveFirestoreModal: React.FC<SaveFirestoreModalProps> = ({
  isOpen,
  documentId,
  folio,
  childName,
  onViewSubmittedResponses,
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
    <div className="fixed inset-0 z-50 min-h-screen w-full bg-slate-900/95 backdrop-blur-md overflow-y-auto flex flex-col justify-between items-center p-4 sm:p-6 font-sans animate-fadeIn">
      {/* Top Institutional Header */}
      <div className="max-w-4xl w-full mx-auto pt-2 pb-4">
        <NuevoLeonHeader className="text-white" />
      </div>

      {/* Center Success Card */}
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-teal-100 text-center relative my-auto animate-scaleUp">
        {/* Celebration Badge */}
        <div className="w-16 h-16 rounded-3xl bg-teal-100 text-nl-petrol flex items-center justify-center mx-auto mb-4 shadow-sm ring-8 ring-teal-50">
          <CloudCheck className="w-9 h-9" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" /> Formulario Enviado y Registrado
        </span>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-1">
          ¡Expediente Guardado con Éxito!
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
          Los datos de caracterización de <strong className="text-slate-900">{childName || 'la niña o niño'}</strong> han sido guardados de manera definitiva en el sistema oficial de <strong>Educación Inicial Nuevo León</strong>.
        </p>

        {/* Lock Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-5 text-left flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span className="text-[11px] text-amber-900 font-semibold leading-tight">
            El formulario ha sido cerrado y bloqueado para asegurar la integridad de la información enviada.
          </span>
        </div>

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

        {/* Action Buttons: ONLY 2 Options */}
        <div className="space-y-3">
          {/* Option 1: Ver las Respuestas Enviadas (Modo Solo Lectura) */}
          <button
            type="button"
            onClick={onViewSubmittedResponses}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-nl-petrol to-teal-700 hover:from-nl-petrol-dark hover:to-teal-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-300" />
            <span>Ver las Respuestas Enviadas</span>
          </button>

          {/* Option 2: Iniciar un Nuevo Formulario */}
          <button
            type="button"
            onClick={onNewForm}
            className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
          >
            <PlusCircle className="w-4 h-4 text-nl-petrol" />
            <span>Iniciar un Nuevo Formulario</span>
          </button>
        </div>
      </div>

      {/* Footer text */}
      <div className="text-center text-xs text-slate-400 py-3">
        Educación Inicial • Subsecretaría de Educación Básica de Nuevo León
      </div>
    </div>
  );
};
