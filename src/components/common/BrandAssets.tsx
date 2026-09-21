import React from 'react';

// Official Nuevo León Header / Escudo style
export const NuevoLeonHeader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-between border-b pb-4 pt-2 border-slate-200 ${className}`}>
    <div className="flex items-center space-x-3">
      {/* Escudo / Emblem badge */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md font-bold text-xs p-1 text-center leading-tight">
        <div className="border border-white/40 rounded-lg w-full h-full flex flex-col items-center justify-center">
          <span className="font-extrabold text-[10px] tracking-wider">NL</span>
          <span className="text-[7px] uppercase tracking-tighter">Gobierno</span>
        </div>
      </div>
      <div>
        <div className="text-xs font-bold text-amber-600 tracking-wider uppercase">EDUCACIÓN</div>
        <div className="text-[10px] text-slate-500 font-medium">GABINETE DE IGUALDAD PARA TODAS LAS PERSONAS</div>
      </div>
    </div>

    <div className="text-center hidden sm:block">
      <div className="text-[11px] font-bold text-nl-petrol tracking-wide uppercase">SUBSECRETARÍA DE EDUCACIÓN BÁSICA</div>
      <div className="text-[10px] font-semibold text-slate-600">DIRECCIÓN DE PRIMERA INFANCIA</div>
      <div className="text-[9px] font-medium text-slate-500">COORDINACIÓN DE EDUCACIÓN INICIAL</div>
    </div>

    <div className="flex items-center">
      <div className="text-right">
        <div className="text-xs font-black tracking-widest text-slate-800 uppercase flex items-center gap-1">
          NUEVO <span className="text-amber-500">★</span> LEÓN
        </div>
      </div>
    </div>
  </div>
);

// Child-friendly Sun SVG (from Page 1 of PDF)
export const SunIllustration: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun rays */}
    <g stroke="#F59E0B" strokeWidth="6" strokeLinecap="round">
      <line x1="50" y1="10" x2="50" y2="2" />
      <line x1="50" y1="90" x2="50" y2="98" />
      <line x1="10" y1="50" x2="2" y2="50" />
      <line x1="90" y1="50" x2="98" y2="50" />
      <line x1="22" y1="22" x2="16" y2="16" />
      <line x1="78" y1="78" x2="84" y2="84" />
      <line x1="22" y1="78" x2="16" y2="84" />
      <line x1="78" y1="22" x2="84" y2="16" />
    </g>
    {/* Sun body */}
    <circle cx="50" cy="50" r="28" fill="#FCD34D" stroke="#F59E0B" strokeWidth="4" />
    {/* Smile face */}
    <circle cx="41" cy="45" r="3.5" fill="#78350F" />
    <circle cx="59" cy="45" r="3.5" fill="#78350F" />
    <path d="M40 55 C45 62, 55 62, 60 55" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    <circle cx="35" cy="52" r="3" fill="#FCA5A5" />
    <circle cx="65" cy="52" r="3" fill="#FCA5A5" />
  </svg>
);

// Child-friendly Flower Illustration (from Page 1 & 6)
export const FlowerIllustration: React.FC<{ className?: string }> = ({ className = 'w-12 h-14' }) => (
  <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stem */}
    <path d="M40 50 Q38 75 42 95" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
    {/* Leaves */}
    <path d="M40 70 Q25 65 20 75 Q32 80 40 73" fill="#34D399" stroke="#10B981" strokeWidth="2" />
    <path d="M41 78 Q55 72 60 82 Q48 88 41 81" fill="#34D399" stroke="#10B981" strokeWidth="2" />
    {/* Petals */}
    <g fill="#60A5FA" stroke="#3B82F6" strokeWidth="2">
      <circle cx="40" cy="22" r="10" />
      <circle cx="55" cy="30" r="10" />
      <circle cx="58" cy="48" r="10" />
      <circle cx="46" cy="58" r="10" />
      <circle cx="30" cy="56" r="10" />
      <circle cx="22" cy="42" r="10" />
      <circle cx="25" cy="26" r="10" />
    </g>
    {/* Center */}
    <circle cx="40" cy="40" r="14" fill="#FBBF24" stroke="#F59E0B" strokeWidth="3" />
    {/* Smile */}
    <circle cx="35" cy="37" r="2" fill="#78350F" />
    <circle cx="45" cy="37" r="2" fill="#78350F" />
    <path d="M36 43 Q40 47 44 43" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Child-friendly Friendly Bee (from Page 4 & 8)
export const BeeIllustration: React.FC<{ className?: string }> = ({ className = 'w-14 h-12' }) => (
  <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wings */}
    <ellipse cx="40" cy="25" rx="16" ry="12" transform="rotate(-30 40 25)" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" opacity="0.9" />
    <ellipse cx="60" cy="22" rx="14" ry="10" transform="rotate(20 60 22)" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" opacity="0.8" />
    {/* Body */}
    <ellipse cx="50" cy="45" rx="26" ry="18" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
    {/* Stripes */}
    <path d="M42 28 C42 38, 42 52, 42 62" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M53 27 C53 38, 53 52, 53 63" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M64 29 C64 38, 64 52, 64 61" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
    {/* Stinger */}
    <polygon points="76,45 84,45 76,48" fill="#1E293B" />
    {/* Antennae */}
    <path d="M28 35 Q22 24 16 26" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <circle cx="15" cy="26" r="2.5" fill="#1E293B" />
    <path d="M32 32 Q28 20 23 21" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <circle cx="22" cy="21" r="2.5" fill="#1E293B" />
    {/* Face */}
    <circle cx="30" cy="42" r="2.5" fill="#1E293B" />
    <path d="M27 48 Q32 52 36 48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="26" cy="46" rx="2" ry="1.5" fill="#FDA4AF" />
  </svg>
);

// Happy Child Mascot (from Page 7)
export const ChildIllustration: React.FC<{ className?: string }> = ({ className = 'w-12 h-16' }) => (
  <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="40" cy="30" r="18" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
    {/* Hair strands */}
    <path d="M30 14 Q38 8 46 13" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
    <path d="M24 20 Q32 10 40 12" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
    {/* Eyes & Smile */}
    <circle cx="33" cy="28" r="2.5" fill="#431407" />
    <circle cx="47" cy="28" r="2.5" fill="#431407" />
    <path d="M34 36 Q40 42 46 36" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="28" cy="33" r="2.5" fill="#FDA4AF" />
    <circle cx="52" cy="33" r="2.5" fill="#FDA4AF" />
    {/* Body / Shirt */}
    <path d="M26 48 C26 48, 20 65, 20 75 L60 75 C60 65, 54 48, 54 48 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
    {/* Rainbow stripes on shirt */}
    <line x1="33" y1="52" x2="33" y2="72" stroke="#F43F5E" strokeWidth="3" />
    <line x1="40" y1="52" x2="40" y2="72" stroke="#FBBF24" strokeWidth="3" />
    <line x1="47" y1="52" x2="47" y2="72" stroke="#10B981" strokeWidth="3" />
    {/* Arms */}
    <path d="M24 50 Q10 40 8 30" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
    <path d="M56 50 Q70 40 72 30" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
    {/* Legs */}
    <line x1="32" y1="75" x2="32" y2="92" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
    <line x1="48" y1="75" x2="48" y2="92" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
