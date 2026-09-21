import React from 'react';
import type { CharacterizationFormData } from '../../types/form';
import { SectionCard, SuggestionChips } from '../common/FormInputs';
import { SignaturePad } from '../common/SignaturePad';
import { BeeIllustration } from '../common/BrandAssets';
import { HeartHandshake, HelpCircle, FileCheck, ShieldCheck, Sparkles, Printer, CloudUpload, Loader2 } from 'lucide-react';

interface Step6Props {
  data: CharacterizationFormData;
  updateData: (fields: Partial<CharacterizationFormData>) => void;
  onOpenPrintPreview: () => void;
  onSaveToCloud: () => void;
  isSavingToCloud: boolean;
}

export const Step6RelationshipsAndSignatures: React.FC<Step6Props> = ({
  data,
  updateData,
  onOpenPrintPreview,
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
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-nl-petrol via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-card">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Página 8: Vínculos, Expectativas y Formalización
            </span>
            <h2 className="text-2xl font-bold font-display">Relaciones, Expectativas y Firmas</h2>
            <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
              Cierre de la caracterización, acuerdos mutuos y formalización con firmas de los participantes.
            </p>
          </div>
          <div className="self-start sm:self-auto shrink-0">
            <BeeIllustration className="w-16 h-12 animate-wiggle" />
          </div>
        </div>
      </div>

      {/* Relational Strengths & Areas to improve */}
      <SectionCard
        title="Vínculos y Momentos de Interacción"
        subtitle="Identifique las fortalezas y/o aspectos a mejorar en las relaciones que se establecen con la niña o el niño en los momentos de alimentación, juego, cuidado, trato, entre otras."
        icon={<HeartHandshake className="w-5 h-5" />}
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

      {/* Digital Signatures Module */}
      <SectionCard
        title="Formalización y Firmas Digitales"
        subtitle="Capture o dibuje las firmas correspondientes con el dedo, lápiz táctil o ratón"
        icon={<FileCheck className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignaturePad
            label="Agente Educativo"
            sublabel="Personal responsable de Educación Inicial"
            placeholderName="Nombre completo del Agente Educativo"
            nameValue={data.agenteEducativo.nombre}
            onNameChange={(val) =>
              updateData({
                agenteEducativo: { ...data.agenteEducativo, nombre: val },
              })
            }
            signatureValue={data.agenteEducativo.firma}
            onSignatureChange={(val) =>
              updateData({
                agenteEducativo: { ...data.agenteEducativo, firma: val },
              })
            }
          />

          <SignaturePad
            label="Madre, Padre o Cuidador Responsable"
            sublabel="Titular que acompaña al infante en el servicio"
            placeholderName="Nombre del padre, madre o cuidador"
            nameValue={data.tutorResponsable.nombre || data.mama.nombre || data.papa.nombre}
            onNameChange={(val) =>
              updateData({
                tutorResponsable: { ...data.tutorResponsable, nombre: val },
              })
            }
            signatureValue={data.tutorResponsable.firma}
            onSignatureChange={(val) =>
              updateData({
                tutorResponsable: { ...data.tutorResponsable, firma: val },
              })
            }
          />
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
            He leído y acepto el tratamiento de datos personales para fines exclusivamente educativos y de seguimiento infantil.
          </span>
        </label>
      </div>

      {/* Completion & Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center md:text-left">
          <h4 className="font-bold text-slate-800 text-base flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> ¡Formato Digital Listo para Guardar!
          </h4>
          <p className="text-xs text-slate-500">
            Guarda el expediente directamente en Firestore y descarga la versión PDF oficial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
          {/* Save to Firestore Button */}
          <button
            type="button"
            onClick={onSaveToCloud}
            disabled={isSavingToCloud}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-75 cursor-pointer"
          >
            {isSavingToCloud ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando en Firestore...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4 text-emerald-200" />
                <span>Guardar en la Nube (Firestore)</span>
              </>
            )}
          </button>

          {/* View / Print Official PDF Button */}
          <button
            type="button"
            onClick={onOpenPrintPreview}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm shadow-2xs flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-nl-petrol" />
            <span>Ver Formato PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
