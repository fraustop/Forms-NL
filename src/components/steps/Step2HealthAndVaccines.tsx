import React, { useState } from 'react';
import type { CharacterizationFormData } from '../../types/form';
import { VACCINES_LIST, VACCINE_AGE_SLOTS } from '../../types/form';
import { YesNoRadio, SectionCard } from '../common/FormInputs';
import { Activity, ShieldCheck, CheckSquare, Square, Info, Sparkles } from 'lucide-react';

interface Step2Props {
  data: CharacterizationFormData;
  updateData: (fields: Partial<CharacterizationFormData>) => void;
}

export const Step2HealthAndVaccines: React.FC<Step2Props> = ({ data, updateData }) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const toggleVaccineSlot = (vaccineId: string, slotId: string) => {
    const currentVaccines = { ...(data.vacunas || {}) };
    const currentSlots = { ...(currentVaccines[vaccineId] || {}) };
    currentSlots[slotId] = !currentSlots[slotId];
    currentVaccines[vaccineId] = currentSlots;
    updateData({ vacunas: currentVaccines });
  };

  const markRecommendedVaccines = () => {
    const newVaccines: Record<string, Record<string, boolean>> = {};
    VACCINES_LIST.forEach((v) => {
      newVaccines[v.id] = {};
      v.recommendedSlots.forEach((slot) => {
        newVaccines[v.id][slot] = true;
      });
    });
    updateData({ vacunas: newVaccines });
  };

  const clearAllVaccines = () => {
    updateData({ vacunas: {} });
  };

  // Count marked vaccines
  const totalApplied = Object.values(data.vacunas || {}).reduce((acc, curr) => {
    return acc + Object.values(curr || {}).filter(Boolean).length;
  }, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-3xl p-6 sm:p-7 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Página 2: Salud Integral y Esquema de Vacunación
            </span>
            <h2 className="text-2xl font-bold font-display">Sistema de Salud y Cartilla</h2>
            <p className="text-teal-100 text-xs sm:text-sm">
              Registre las condiciones de salud y el esquema nacional de vacunación del infante.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 rounded-2xl text-center self-start sm:self-auto">
            <div className="text-xl font-black text-amber-300">{totalApplied}</div>
            <div className="text-[10px] text-teal-100 uppercase tracking-wider font-semibold">
              Dosis Marcadas
            </div>
          </div>
        </div>
      </div>

      {/* Health System, Disease & Disability Card */}
      <SectionCard
        title="Historial de Salud y Afiliación"
        subtitle="Instituciones de atención, padecimientos o diagnósticos específicos"
        icon={<Activity className="w-5 h-5" />}
      >
        <div className="space-y-3">
          <YesNoRadio
            label="¿Afiliado a algún sistema de salud público o privado?"
            sublabel="IMSS, ISSSTE, IMSS-Bienestar, Seguro del Estado, Servicios Médicos Estatales, Seguro Privado, etc."
            value={data.afiliadoSalud}
            onChange={(val) => updateData({ afiliadoSalud: val })}
            showConditionalWhen={true}
            conditionalContent={
              <div>
                <label className="block text-xs font-semibold text-nl-petrol-dark mb-1">
                  ¿A cuál sistema o institución se encuentra afiliado?
                </label>
                <input
                  type="text"
                  placeholder="Ej. IMSS (Clínica 25), ISSSTE, IMSS-Bienestar, Privado"
                  value={data.afiliadoSaludCual}
                  onChange={(e) => updateData({ afiliadoSaludCual: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-teal-300 bg-white text-sm focus:ring-2 focus:ring-nl-petrol"
                />
              </div>
            }
          />

          <YesNoRadio
            label="¿La niña o el niño tiene alguna enfermedad médica diagnosticada o en tratamiento?"
            sublabel="Asma, cardiopatías, epilepsia, reflujo severo, diabetes infantil, etc."
            value={data.enfermedadMedica}
            onChange={(val) => updateData({ enfermedadMedica: val })}
            showConditionalWhen={true}
            conditionalContent={
              <div>
                <label className="block text-xs font-semibold text-nl-petrol-dark mb-1">
                  ¿Cuál enfermedad y qué cuidados requiere?
                </label>
                <input
                  type="text"
                  placeholder="Describa la enfermedad, tratamiento y medicamentos habituales"
                  value={data.enfermedadMedicaCual}
                  onChange={(e) => updateData({ enfermedadMedicaCual: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-teal-300 bg-white text-sm focus:ring-2 focus:ring-nl-petrol"
                />
              </div>
            }
          />

          <YesNoRadio
            label="¿La niña o el niño tiene algún tipo de discapacidad diagnosticada?"
            sublabel="Visual, auditiva, motriz, psicosocial, intelectual o del neurodesarrollo"
            value={data.discapacidad}
            onChange={(val) => updateData({ discapacidad: val })}
            showConditionalWhen={true}
            conditionalContent={
              <div>
                <label className="block text-xs font-semibold text-nl-petrol-dark mb-1">
                  ¿Cuál tipo de discapacidad y grado de apoyo requerido?
                </label>
                <input
                  type="text"
                  placeholder="Especifique el diagnóstico y apoyos técnicos o pedagógicos necesarios"
                  value={data.discapacidadCual}
                  onChange={(e) => updateData({ discapacidadCual: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-teal-300 bg-white text-sm focus:ring-2 focus:ring-nl-petrol"
                />
              </div>
            }
          />
        </div>
      </SectionCard>

      {/* Vaccination Grid Card */}
      <SectionCard
        title="Esquema Nacional de Vacunación"
        subtitle="Selecciona las vacunas que la niña o el niño ha recibido"
        icon={<ShieldCheck className="w-5 h-5" />}
        badge="Cartilla de Salud"
      >
        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markRecommendedVaccines}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-nl-petrol border border-teal-200 hover:bg-teal-100 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Marcar Esquema Oficial Completo
            </button>
            <button
              type="button"
              onClick={clearAllVaccines}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold transition-colors"
            >
              Limpiar
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'table' ? 'bg-nl-petrol text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabla Completa
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'cards' ? 'bg-nl-petrol text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista Tarjetas
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 px-1">
          <span className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-teal-600 text-white flex items-center justify-center text-[9px] font-bold">✓</div>
            <span>Dosis Aplicada</span>
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-amber-100 border border-amber-300"></div>
            <span>Edad recomendada por cartilla</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Haz clic o toca cualquier casilla para marcar/desmarcar</span>
          </span>
        </div>

        {/* View Mode: Table */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-2xl shadow-sm bg-white">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <th className="py-3 px-4 font-bold sticky left-0 bg-slate-100 z-10 w-64 shadow-r">
                    Vacuna
                  </th>
                  {VACCINE_AGE_SLOTS.map((slot) => (
                    <th key={slot.id} className="py-3 px-2 font-bold text-center border-l border-slate-200 whitespace-nowrap">
                      {slot.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {VACCINES_LIST.map((vaccine, idx) => {
                  return (
                    <tr
                      key={vaccine.id}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-800 sticky left-0 bg-inherit z-10">
                        <div className="font-bold text-slate-900">{vaccine.name}</div>
                        {vaccine.description && (
                          <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                            {vaccine.description}
                          </div>
                        )}
                      </td>
                      {VACCINE_AGE_SLOTS.map((slot) => {
                        const isChecked = !!data.vacunas?.[vaccine.id]?.[slot.id];
                        const isRecommended = vaccine.recommendedSlots.includes(slot.id);

                        return (
                          <td
                            key={slot.id}
                            onClick={() => toggleVaccineSlot(vaccine.id, slot.id)}
                            className={`py-3 px-2 text-center border-l border-slate-200 cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-teal-50 hover:bg-teal-100'
                                : isRecommended
                                ? 'bg-amber-50/60 hover:bg-amber-100/60'
                                : 'hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                  isChecked
                                    ? 'bg-nl-petrol text-white shadow-sm scale-110'
                                    : isRecommended
                                    ? 'border-2 border-dashed border-amber-400 bg-white text-transparent'
                                    : 'border border-slate-300 bg-white'
                                }`}
                              >
                                {isChecked && <span className="font-bold text-xs">✓</span>}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* View Mode: Cards (Ultra friendly on Mobile) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VACCINES_LIST.map((vaccine) => (
              <div
                key={vaccine.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{vaccine.name}</h4>
                  {vaccine.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{vaccine.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {VACCINE_AGE_SLOTS.map((slot) => {
                    const isChecked = !!data.vacunas?.[vaccine.id]?.[slot.id];
                    const isRecommended = vaccine.recommendedSlots.includes(slot.id);

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => toggleVaccineSlot(vaccine.id, slot.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                          isChecked
                            ? 'bg-nl-petrol text-white shadow-sm'
                            : isRecommended
                            ? 'bg-amber-100/80 border border-amber-300 text-amber-900 hover:bg-amber-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Square className="w-3.5 h-3.5 opacity-50" />
                        )}
                        <span>{slot.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
