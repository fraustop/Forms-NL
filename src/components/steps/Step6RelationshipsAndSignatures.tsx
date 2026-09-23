import React from 'react';
import type { CharacterizationFormData } from '../../types/form';
import { SectionCard, SuggestionChips } from '../common/FormInputs';
import { BeeIllustration } from '../common/BrandAssets';
import { HeartHandshake, HelpCircle, FileCheck, ShieldCheck, Sparkles, Send, Loader2 } from 'lucide-react';

interface Step6Props {
  data: CharacterizationFormData;
  updateData: (fields: Partial<CharacterizationFormData>) => void;
  onSaveToCloud: () => void;
  isSavingToCloud: boolean;
}

export const Step6RelationshipsAndSignatures: React.FC<Step6Props> = ({
  data,
  updateData,
  onSaveToCloud,
  isSavingToCloud,
}) => {
  const fortalezasSugerencias = [
    'Excelente disposición y alegría en el momento de juego compartido',
    'Momentos de alimentación tranquilos y con buena comunicación',
    'Aspecto a fortalecer: establecer rutinas más consistentes al ir a dormir',
    'Vínculo de afecto y confianza mutua muy sólido',
    'Aspecto a fortalecer: mayor paciencia ante berrinches o momentos de frustración',
  ];

  const expectativasSugerencias = [
    'Aprender nuevas estrategias de estimulación temprana y juego pedagógico',
    'Acompañamiento profesional para el desarrollo integral de mi hijo/a',
    'Fortalecer nuestras pautas de crianza positiva en el hogar',
    'Favorecer la socialización y autonomía de la niña/niño',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner (Compactado 25%) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-nl-petrol via-teal-800 to-slate-900 text-white rounded-2xl py-3.5 px-4 sm:py-4 sm:px-6 shadow-card">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-teal-300">
              Página 8: Vínculos, Expectativas y Formalización
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-display">Relaciones, Expectativas y Firmas</h2>
            <p className="text-teal-100 text-[11px] sm:text-xs max-w-lg">
              Cierre de la caracterización, acuerdos mutuos y formalización con firmas de los participantes.
            </p>
          </div>
          <div className="self-start sm:self-auto shrink-0">
            <BeeIllustration className="w-10 h-8 animate-wiggle" />
          </div>
        </div>
      </div>

      {/* Relational Strengths & Areas to improve */}
      <SectionCard
        title="Vínculos y Momentos de Interacción"
        subtitle="Identifique las fortalezas y/o aspectos a mejorar en las relaciones que se establecen con la niña o el niño en los momentos de alimentación, juego, cuidado, trato, entre otras."
        icon={<HeartHandshake className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="space-y-2">
          <textarea
            rows={5}
            placeholder="Describa qué fluye muy bien en el trato diario y qué aspectos les gustaría enriquecer o fortalecer como familia..."
            value={data.fortalezasYMejoras}
            onChange={(e) => updateData({ fortalezasYMejoras: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-nl-petrol text-sm leading-relaxed"
          />

          <SuggestionChips
            suggestions={fortalezasSugerencias}
            currentValue={data.fortalezasYMejoras}
            onSelect={(newVal) => updateData({ fortalezasYMejoras: newVal })}
          />
        </div>
      </SectionCard>

      {/* Motivation & Expectations */}
      <SectionCard
        title="Motivación y Expectativas del Servicio"
        subtitle="¿Por qué decidió ser parte de este servicio? y ¿Qué espera del servicio?"
        icon={<HelpCircle className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="space-y-2">
          <textarea
            rows={4}
            placeholder="Comparta qué motivó a la familia a integrarse a Educación Inicial No Escolarizada y qué beneficios esperan obtener para el niño/a y la familia..."
            value={data.motivoYExpectativas}
            onChange={(e) => updateData({ motivoYExpectativas: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-nl-petrol text-sm leading-relaxed"
          />

          <SuggestionChips
            suggestions={expectativasSugerencias}
            currentValue={data.motivoYExpectativas}
            onSelect={(newVal) => updateData({ motivoYExpectativas: newVal })}
          />
        </div>
      </SectionCard>

      {/* Formalization & Print Signature Boxes */}
      <SectionCard
        title="Formalización y Firmas"
        subtitle="Registro de nombres para el acta. Las firmas se realizarán físicamente con pluma una vez impreso el documento"
        icon={<FileCheck className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agente Educativo */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Nombre del Agente Educativo <span className="text-rose-500 font-bold">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">Personal responsable de Educación Inicial</p>
              <input
                type="text"
                placeholder="Nombre completo del Agente Educativo"
                value={data.agenteEducativo.nombre || 'Guadalupe Jazmín Hernández Amador'}
                onChange={(e) =>
                  updateData({
                    agenteEducativo: { ...data.agenteEducativo, nombre: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 text-sm focus:ring-2 focus:ring-nl-petrol shadow-sm"
              />
            </div>

            {/* Signature Box for Print */}
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                Firma del Agente Educativo:
              </span>
              <div className="h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-4 text-center select-none">
                <FileCheck className="w-6 h-6 text-nl-petrol mb-1 opacity-70" />
                <span className="text-xs font-bold text-slate-700">Espacio para firma autógrafa</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  (Se firmará a mano con pluma una vez impreso)
                </span>
              </div>
            </div>
          </div>

          {/* Padre, Madre o Tutor */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Nombre del Padre, Madre o Tutor que firmará <span className="text-rose-500 font-bold">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">Titular o cuidador que acompaña al infante</p>
              
              {/* Quick suggestions if parent names exist */}
              {(data.mama?.nombre || data.papa?.nombre || data.otroCuidador?.nombre) && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-slate-500 font-semibold w-full">Sugerir nombre:</span>
                  {data.mama?.nombre && (
                    <button
                      type="button"
                      onClick={() =>
                        updateData({
                          tutorResponsable: { ...data.tutorResponsable, nombre: data.mama.nombre },
                        })
                      }
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-nl-petrol-soft hover:text-nl-petrol font-medium transition-colors"
                    >
                      Mamá: {data.mama.nombre}
                    </button>
                  )}
                  {data.papa?.nombre && (
                    <button
                      type="button"
                      onClick={() =>
                        updateData({
                          tutorResponsable: { ...data.tutorResponsable, nombre: data.papa.nombre },
                        })
                      }
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-nl-petrol-soft hover:text-nl-petrol font-medium transition-colors"
                    >
                      Papá: {data.papa.nombre}
                    </button>
                  )}
                  {data.otroCuidador?.nombre && (
                    <button
                      type="button"
                      onClick={() =>
                        updateData({
                          tutorResponsable: { ...data.tutorResponsable, nombre: data.otroCuidador.nombre },
                        })
                      }
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-nl-petrol-soft hover:text-nl-petrol font-medium transition-colors"
                    >
                      Cuidador: {data.otroCuidador.nombre}
                    </button>
                  )}
                </div>
              )}

              <input
                type="text"
                placeholder="Nombre de la persona responsable que firmará"
                value={data.tutorResponsable.nombre || data.mama.nombre || data.papa.nombre || data.otroCuidador.nombre}
                onChange={(e) =>
                  updateData({
                    tutorResponsable: { ...data.tutorResponsable, nombre: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 text-sm focus:ring-2 focus:ring-nl-petrol shadow-sm"
              />
            </div>

            {/* Signature Box for Print */}
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                Firma del Padre, Madre o Cuidador:
              </span>
              <div className="h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-4 text-center select-none">
                <FileCheck className="w-6 h-6 text-nl-petrol mb-1 opacity-70" />
                <span className="text-xs font-bold text-slate-700">Espacio para firma autógrafa</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  (Se firmará a mano con pluma una vez impreso)
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Official Legal & Privacy Notice */}
      <div className="bg-slate-100 border border-slate-300 rounded-2xl p-5 text-xs text-slate-600 leading-relaxed shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
          <ShieldCheck className="w-4 h-4 text-nl-petrol" />
          <span>Aviso Legal y Protección de Datos Personales (Gobierno de Nuevo León)</span>
        </div>
        <p className="italic text-slate-700">
          "Se ejecutará el correcto y preciso tratamiento de los datos personales, los cuales serán salvaguardados con fundamento a lo estipulado en los Artículos 3° fracciones X, XI, XXIV, XXV, XXVI, XXVIII, XXXII y XXXVII, 26 y 28 de la Ley de Protección de Datos Personales en Posesión de Sujetos Obligados del Estado de Nuevo León."
        </p>

        <label className="flex items-start gap-2.5 mt-3 pt-3 border-t border-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={data.consentimientoAvisoPrivacidad}
            onChange={(e) => updateData({ consentimientoAvisoPrivacidad: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded text-nl-petrol focus:ring-nl-petrol border-slate-300"
          />
          <span className="text-xs font-semibold text-slate-800">
            He leído y acepto el tratamiento de datos personales para fines exclusivamente educativos y de seguimiento infantil. <span className="text-rose-500 font-bold">*</span>
          </span>
        </label>
      </div>

      {/* Completion & Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center md:text-left">
          <h4 className="font-bold text-slate-800 text-base flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> ¡Formato Digital Completado!
          </h4>
          <p className="text-xs text-slate-500">
            Haz clic en Enviar para guardar y formalizar este expediente en la plataforma oficial.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          {/* Submit / Enviar Button */}
          <button
            type="button"
            onClick={onSaveToCloud}
            disabled={isSavingToCloud}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-75 cursor-pointer"
          >
            {isSavingToCloud ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando Formulario...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
