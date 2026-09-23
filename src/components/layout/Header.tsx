import React from 'react';

interface HeaderProps {
  lastSavedText?: string;
  completionPercentage?: number;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="h-[70px] bg-white border-b border-slate-200 shadow-xs flex items-center">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Educación / Gabinete de Igualdad */}
        <div className="flex items-center space-x-3">
          <div>
            <div className="text-xs sm:text-sm font-black text-amber-600 tracking-wider uppercase leading-none">
              EDUCACIÓN
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-tight mt-1">
              GABINETE DE IGUALDAD PARA TODAS LAS PERSONAS
            </div>
          </div>
        </div>

        {/* Center: Subsecretaría & Primera Infancia (Desktop) */}
        <div className="text-center hidden md:block">
          <div className="text-[11px] font-bold text-nl-petrol tracking-wide uppercase">
            SUBSECRETARÍA DE EDUCACIÓN BÁSICA
          </div>
          <div className="text-[9px] font-semibold text-slate-600">
            DIRECCIÓN DE PRIMERA INFANCIA
          </div>
        </div>

        {/* Right: Título del Formulario y Logo a la derecha */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 font-display leading-tight flex items-center justify-end gap-1.5">
              <span>Formato de Caracterización</span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Educación Inicial
              </span>
            </h1>
            <div className="text-[9px] sm:text-[10px] font-semibold text-teal-700 sm:hidden">
              Educación Inicial
            </div>
          </div>

          {/* Logo a la derecha */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-sm font-bold text-xs p-1 text-center shrink-0">
            <div className="border border-white/40 rounded-lg w-full h-full flex flex-col items-center justify-center">
              <span className="font-black text-[10px] tracking-wider">NL</span>
              <span className="text-[6px] uppercase tracking-tighter">Gobierno</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
