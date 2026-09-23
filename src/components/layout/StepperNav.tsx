import React from 'react';
import { User, Activity, Users, Utensils, HeartHandshake, FileCheck, Check } from 'lucide-react';

export interface StepDef {
  id: number;
  title: string;
  shortTitle: string;
  pages: string;
  icon: React.ReactNode;
}

export const STEPS: StepDef[] = [
  {
    id: 1,
    title: 'Identificación y Datos Generales',
    shortTitle: '1. Niño/a',
    pages: 'Pág. 1',
    icon: <User className="w-4 h-4" />,
  },
  {
    id: 2,
    title: 'Salud y Esquema de Vacunación',
    shortTitle: '2. Salud',
    pages: 'Pág. 2',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 3,
    title: 'Familia, Hogar y Red de Cuidado',
    shortTitle: '3. Familia',
    pages: 'Pág. 3-4',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 4,
    title: 'Rutinas, Higiene y Alimentación',
    shortTitle: '4. Hábitos',
    pages: 'Pág. 4-5',
    icon: <Utensils className="w-4 h-4" />,
  },
  {
    id: 5,
    title: 'Juego, Crianza y Emociones',
    shortTitle: '5. Crianza',
    pages: 'Pág. 6-7',
    icon: <HeartHandshake className="w-4 h-4" />,
  },
  {
    id: 6,
    title: 'Vínculos, Expectativas y Firmas',
    shortTitle: '6. Firmas',
    pages: 'Pág. 8',
    icon: <FileCheck className="w-4 h-4" />,
  },
];

interface StepperNavProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  completedSteps: number[];
}

export const StepperNav: React.FC<StepperNavProps> = ({
  currentStep,
  onSelectStep,
  completedSteps,
}) => {
  return (
    <nav className="w-full" aria-label="Pasos del formulario">
      {/* Desktop Stepper */}
      <div className="hidden lg:grid grid-cols-6 gap-2">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all relative cursor-pointer ${
                isActive
                  ? 'bg-nl-petrol text-white shadow-md'
                  : isCompleted
                  ? 'bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/60'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isCompleted && !isActive ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  step.icon
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                  {step.pages}
                </div>
                <div className="text-xs font-bold truncate">{step.shortTitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile / Tablet Horizontal Scroll Stepper */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-nl-petrol text-white shadow-sm ring-2 ring-nl-petrol ring-offset-1'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]">
                {isCompleted && !isActive ? '✓' : step.id}
              </span>
              <span>{step.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
