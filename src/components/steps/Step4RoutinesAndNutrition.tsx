import React from 'react';
import type { CharacterizationFormData } from '../../types/form';
import { FormField, SuggestionChips, SectionCard } from '../common/FormInputs';
import { BeeIllustration } from '../common/BrandAssets';
import { Clock, Sparkles, Utensils, Sunrise, Sun, Moon } from 'lucide-react';

interface Step4Props {
  data: CharacterizationFormData;
  updateData: (fields: Partial<CharacterizationFormData>) => void;
}

export const Step4RoutinesAndNutrition: React.FC<Step4Props> = ({ data, updateData }) => {
  const updateAlimentos = (momento: 'manana' | 'tarde' | 'noche', valor: string) => {
    updateData({
      alimentos: {
        ...data.alimentos,
        [momento]: valor,
      },
    });
  };

  const rutinasDiariasSugerencias = [
    'Se despierta a las 7:30 am',
    'Desayuna en familia',
    'Siesta después de comer (1-2 hrs)',
    'Hora de juego y lectura',
    'Cena a las 7:30 pm',
    'Rutina de sueño a las 8:30 pm con cuento o canción',
  ];

  const autocuidadoSugerencias = [
    'Lavado de manos antes de comer',
    'Cepillado de dientes con apoyo',
    'Control de esfínteres consolidado',
    'Uso de orinal / bacinica en proceso',
    'Se quita los zapatos y abrigo solo/a',
    'Pide agua cuando tiene sed',
  ];

  const alimentosFavSugerencias = [
    'Plátano y manzana',
    'Sopa de fideos con verduras',
    'Huevo revuelto',
    'Pollo con verduras',
    'Avena con leche',
    'Frijolitos cocidos',
    'Yogurt natural',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-3xl p-6 sm:p-7 shadow-card">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Páginas 4 y 5: Hábitos Diarios y Alimentación
            </span>
            <h2 className="text-2xl font-bold font-display">Rutinas, Auto-Cuidado y Nutrición</h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Conozcamos las rutinas cotidianas, el grado de independencia en higiene y los hábitos alimentarios.
            </p>
          </div>
          <div className="self-start sm:self-auto shrink-0">
            <BeeIllustration className="w-16 h-12 animate-float" />
          </div>
        </div>
      </div>

      {/* Daily Routines Card */}
      <SectionCard
        title="Rutinas y Hábitos Diarios"
        subtitle="¿Qué rutinas tiene la niña o el niño diariamente? (Al irse a dormir, al comer, al levantarse, etc.)"
        icon={<Clock className="w-5 h-5" />}
      >
        <div className="space-y-2">
          <textarea
            rows={4}
            placeholder="Describa cómo transcurren los momentos clave del día: a qué hora se levanta, cómo es el momento de las comidas, juegos y la preparación para dormir..."
            value={data.rutinasDiarias}
            onChange={(e) => updateData({ rutinasDiarias: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
          />

          <SuggestionChips
            suggestions={rutinasDiariasSugerencias}
            currentValue={data.rutinasDiarias}
            onSelect={(newVal) => updateData({ rutinasDiarias: newVal })}
          />
        </div>
      </SectionCard>

      {/* Self-care & Hygiene Card */}
      <SectionCard
        title="Rutinas de Auto-Cuidado e Higiene"
        subtitle="¿Cuáles rutinas de auto-cuidado e higiene practica la niña o el niño independientemente?"
        icon={<Sparkles className="w-5 h-5" />}
      >
        <div className="space-y-2">
          <textarea
            rows={4}
            placeholder="Mencione si realiza lavado de manos, cepillado de dientes, control de esfínteres, vestirse o peinarse de forma autónoma o con guía..."
            value={data.rutinasAutocuidadoHigiene}
            onChange={(e) => updateData({ rutinasAutocuidadoHigiene: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
          />

          <SuggestionChips
            suggestions={autocuidadoSugerencias}
            currentValue={data.rutinasAutocuidadoHigiene}
            onSelect={(newVal) => updateData({ rutinasAutocuidadoHigiene: newVal })}
          />
        </div>
      </SectionCard>

      {/* Food Consumption Matrix Card (Mañana, Tarde, Noche) */}
      <SectionCard
        title="Consumo de Alimentos en el Día"
        subtitle="¿Qué tipo de alimentos consume la niña o el niño durante la mañana, tarde y noche?"
        icon={<Utensils className="w-5 h-5" />}
        badge="Nutrición"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mañana */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-amber-200 flex items-center justify-center">
                <Sunrise className="w-4 h-4 text-amber-700" />
              </div>
              <span>Mañana</span>
            </div>
            <p className="text-[11px] text-amber-800">Desayuno y colación matutina</p>
            <textarea
              rows={4}
              placeholder="Ej. Leche materna/fórmula, huevo con frijoles, fruta picada, avena..."
              value={data.alimentos.manana}
              onChange={(e) => updateAlimentos('manana', e.target.value)}
              className="w-full p-3 rounded-xl border border-amber-300 bg-white text-xs focus:ring-2 focus:ring-amber-500 flex-1"
            />
          </div>

          {/* Tarde */}
          <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-orange-900 font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-orange-200 flex items-center justify-center">
                <Sun className="w-4 h-4 text-orange-700" />
              </div>
              <span>Tarde</span>
            </div>
            <p className="text-[11px] text-orange-800">Comida y colación vespertina</p>
            <textarea
              rows={4}
              placeholder="Ej. Sopa de verduras, pollo deshebrado, arroz, agua natural, fruta..."
              value={data.alimentos.tarde}
              onChange={(e) => updateAlimentos('tarde', e.target.value)}
              className="w-full p-3 rounded-xl border border-orange-300 bg-white text-xs focus:ring-2 focus:ring-orange-500 flex-1"
            />
          </div>

          {/* Noche */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-indigo-200 flex items-center justify-center">
                <Moon className="w-4 h-4 text-indigo-700" />
              </div>
              <span>Noche</span>
            </div>
            <p className="text-[11px] text-indigo-800">Cena ligera antes de dormir</p>
            <textarea
              rows={4}
              placeholder="Ej. Quesadilla en tortilla de maíz, vaso de leche, chayote cocido..."
              value={data.alimentos.noche}
              onChange={(e) => updateAlimentos('noche', e.target.value)}
              className="w-full p-3 rounded-xl border border-indigo-300 bg-white text-xs focus:ring-2 focus:ring-indigo-500 flex-1"
            />
          </div>
        </div>

        {/* Favorite Foods */}
        <div className="pt-2 border-t border-slate-100">
          <FormField
            label="¿Cuáles son los alimentos que más le gustan?"
            sublabel="Alimentos favoritos o que consume con mayor agrado"
          >
            <input
              type="text"
              placeholder="Ej. Frutas dulces (plátano, manzana), caldito de pollo, quesito, gelatina"
              value={data.alimentosFavoritos}
              onChange={(e) => updateData({ alimentosFavoritos: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </FormField>

          <SuggestionChips
            suggestions={alimentosFavSugerencias}
            currentValue={data.alimentosFavoritos}
            onSelect={(newVal) => updateData({ alimentosFavoritos: newVal })}
          />
        </div>
      </SectionCard>
    </div>
  );
};
