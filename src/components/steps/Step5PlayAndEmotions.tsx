import React from 'react';
import type { CharacterizationFormData } from '../../types/form';
import { SuggestionChips, SectionCard } from '../common/FormInputs';
import { ChildIllustration } from '../common/BrandAssets';
import { Gamepad2, ShieldAlert, Heart, BookOpen, Sparkles } from 'lucide-react';

interface Step5Props {
  data: CharacterizationFormData;
  updateData: (fields: Partial<CharacterizationFormData>) => void;
}

export const Step5PlayAndEmotions: React.FC<Step5Props> = ({ data, updateData }) => {
  const estrategiasEmocionalesSugerencias = [
    'Promover comportamientos saludables con el ejemplo',
    'Identificación y expresión de emociones (poner en palabras lo que siente)',
    'Espacio de calma y abrazo de contención',
    'Enseñar habilidades de autocontrol y respiración',
    'Fomentar la empatía y escucha activa',
    'Comunicación abierta y afectuosa',
    'Refuerzos positivos cuando colabora',
    'Manejo respetuoso de situaciones difíciles sin gritos',
  ];

  const juegosSugerencias = [
    'Jugar con carritos o bloques de construcción',
    'Jugar a la comidita o muñecos',
    'Correr y jugar a las escondidas en el patio',
    'Pintar con crayones y plastilina',
    'Bailar y cantar canciones infantiles',
    'Juega principalmente con mamá/papá y sus hermanos',
  ];

  const reglasSugerencias = [
    'Horarios fijos para comidas y descanso',
    'Guardar los juguetes después de usarlos',
    'No golpear ni aventar objetos',
    'Pedir las cosas por favor y dar las gracias',
    'Tiempo limitado de pantallas/televisión',
    'Acuerdos hablados con amor y firmeza',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner (Compactado 25%) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-700 text-white rounded-2xl py-3.5 px-4 sm:py-4 sm:px-6 shadow-card">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-200">
              Páginas 6 y 7: Vínculos, Crianza y Bienestar Socioemocional
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-display">Juego, Crianza y Manejo de Emociones</h2>
            <p className="text-purple-100 text-[11px] sm:text-xs max-w-lg">
              Exploración de dinámicas de juego, normas familiares de convivencia y acompañamiento socioafectivo.
            </p>
          </div>
          <div className="self-start sm:self-auto shrink-0 flex items-center gap-2">
            <ChildIllustration className="w-9 h-10" />
          </div>
        </div>
      </div>

      {/* Play & Favorite Toys Card */}
      <SectionCard
        title="Juego y Recreación"
        subtitle="¿Qué le gusta jugar a la niña o niño?, ¿Con quién juega? y ¿Cuál es su juguete favorito?"
        icon={<Gamepad2 className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="space-y-2">
          <textarea
            rows={4}
            placeholder="Describa sus juegos preferidos (al aire libre, simbólicos, construcción), sus compañeros de juego habituales y sus juguetes predilectos..."
            value={data.juegoPreferencias}
            onChange={(e) => updateData({ juegoPreferencias: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm leading-relaxed"
          />

          <SuggestionChips
            suggestions={juegosSugerencias}
            currentValue={data.juegoPreferencias}
            onSelect={(newVal) => updateData({ juegoPreferencias: newVal })}
          />
        </div>
      </SectionCard>

      {/* Family Rearing Rules & Agreements Card */}
      <SectionCard
        title="Reglas y Acuerdos de Crianza en el Hogar"
        subtitle="¿Cuáles son las reglas o acuerdos en familia relacionados con la crianza de la niña o el niño?"
        icon={<ShieldAlert className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="space-y-2">
          <textarea
            rows={4}
            placeholder="Mencione cómo establecen límites, acuerdos sobre horarios, uso de pantallas, orden, convivencia respetuosa y resolución de conflictos..."
            value={data.reglasAcuerdosCrianza}
            onChange={(e) => updateData({ reglasAcuerdosCrianza: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm leading-relaxed"
          />

          <SuggestionChips
            suggestions={reglasSugerencias}
            currentValue={data.reglasAcuerdosCrianza}
            onSelect={(newVal) => updateData({ reglasAcuerdosCrianza: newVal })}
          />
        </div>
      </SectionCard>

      {/* Emotional Strategies Card */}
      <SectionCard
        title="Estrategias para el Manejo de Emociones"
        subtitle="¿Qué estrategias utilizan desde el hogar para el manejo de sus emociones?"
        icon={<Heart className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 text-xs text-purple-900 mb-3 space-y-1">
          <span className="font-bold block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Orientación pedagógica:
          </span>
          <p className="leading-relaxed">
            Ejemplo: promover comportamientos saludables, la identificación y expresión de emociones, enseñar habilidades de autocontrol, fomentar la empatía, comunicación abierta, refuerzos positivos, manejo de situaciones difíciles, entre otras.
          </p>
        </div>

        <div className="space-y-2">
          <textarea
            rows={4}
            placeholder="Detalle cómo acompañan al menor cuando siente frustración, enojo, miedo o tristeza; qué palabras o acciones emplean..."
            value={data.estrategiasEmociones}
            onChange={(e) => updateData({ estrategiasEmociones: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm leading-relaxed"
          />

          <SuggestionChips
            suggestions={estrategiasEmocionalesSugerencias}
            currentValue={data.estrategiasEmociones}
            onSelect={(newVal) => updateData({ estrategiasEmociones: newVal })}
          />
        </div>
      </SectionCard>

      {/* Describe a day of the child Card */}
      <SectionCard
        title={`Describa un día de ${data.nombreCompleto || 'la niña o el niño'}`}
        subtitle="Relato narrativo de un día cotidiano (desde que despierta hasta dormir)"
        icon={<BookOpen className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="space-y-2">
          <textarea
            rows={6}
            placeholder="Escriba un relato fluido y descriptivo sobre un día típico: 'Por la mañana Mateo despierta alegre, desayunamos juntos, le gusta cantar mientras nos arreglamos. Al mediodía ayuda a recoger sus juguetes, por la tarde salimos a caminar o vemos un libro, y en la noche se duerme tras escuchar un cuento...'"
            value={data.descripcionDia}
            onChange={(e) => updateData({ descripcionDia: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm leading-relaxed"
          />
        </div>
      </SectionCard>
    </div>
  );
};
