import React from 'react';
import { NuevoLeonHeader, SunIllustration } from '../common/BrandAssets';
import { CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  lastSavedText: string;
  completionPercentage: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastSavedText,
  completionPercentage,
}) => {
  return (
    <header className="bg-white border-b border-slate-200">
      {/* Top Institutional Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <NuevoLeonHeader className="py-2.5" />
      </div>

      {/* Main Title Ribbon (sin botones de acción) */}
      <div className="bg-gradient-to-r from-slate-50 via-teal-50/40 to-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Title & Saved State */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <SunIllustration className="w-8 h-8 hidden sm:block animate-float shrink-0" />
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  Formato de Caracterización
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                    Educación Inicial
                  </span>
                </h1>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {lastSavedText}
                  </span>
                  <span>•</span>
                  <span>Progreso: <strong className="text-slate-800">{completionPercentage}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full sm:w-52 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
              <span>Avance total</span>
              <span className="text-nl-petrol font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-nl-petrol h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
