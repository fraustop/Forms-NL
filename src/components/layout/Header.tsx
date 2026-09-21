import React, { useRef } from 'react';
import { NuevoLeonHeader, SunIllustration } from '../common/BrandAssets';
import { Printer, Download, Upload, RotateCcw, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import type { CharacterizationFormData } from '../../types/form';

interface HeaderProps {
  onOpenPrintPreview: () => void;
  onExportJSON: () => void;
  onImportJSON: (data: CharacterizationFormData) => void;
  onReset: () => void;
  onFillSampleData: () => void;
  onNavigateToResponses: () => void;
  lastSavedText: string;
  completionPercentage: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrintPreview,
  onExportJSON,
  onImportJSON,
  onReset,
  onFillSampleData,
  onNavigateToResponses,
  lastSavedText,
  completionPercentage,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportJSON(json);
      } catch {
        alert('Error al leer el archivo JSON. Verifique que sea un archivo válido.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Institutional Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <NuevoLeonHeader className="py-2.5" />
      </div>

      {/* Main Title & Action Bar */}
      <div className="bg-gradient-to-r from-slate-50 via-teal-50/40 to-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Title & Saved State */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <SunIllustration className="w-8 h-8 hidden sm:block animate-float" />
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  Formato de Caracterización
                  <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                    Educación Inicial
                  </span>
                </h1>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {lastSavedText}
                  </span>
                  <span>•</span>
                  <span>Progreso: <strong className="text-slate-800">{completionPercentage}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end text-xs">
            {/* Demo Sample Fill Button */}
            <button
              type="button"
              onClick={onFillSampleData}
              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Llenar con datos de ejemplo para demostración rápida"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Ejemplo</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={onExportJSON}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Descargar expediente en formato JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            {/* Import JSON */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Cargar expediente guardado desde JSON"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Importar</span>
            </button>

            {/* Print / PDF Official Preview */}
            <button
              type="button"
              onClick={onOpenPrintPreview}
              className="px-3.5 py-1.5 rounded-xl bg-nl-petrol hover:bg-nl-petrol-dark text-white font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            {/* Link to Responses Panel (?Respuestas) */}
            <button
              type="button"
              onClick={onNavigateToResponses}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Acceder al panel de respuestas (?Respuestas)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Respuestas</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Reiniciar formulario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
