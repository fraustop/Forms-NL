import React, { useEffect } from 'react';
import type { CharacterizationFormData } from '../../types/form';
import { FormField, YesNoRadio, SectionCard } from '../common/FormInputs';
import { SunIllustration, FlowerIllustration } from '../common/BrandAssets';
import { calculateAge } from '../../utils/dateUtils';
import { Calendar, User, MapPin, Heart, Sparkles, Scale, Ruler } from 'lucide-react';

interface Step1Props {
  data: CharacterizationFormData;
  updateData: (fields: Partial<CharacterizationFormData>) => void;
}

export const Step1GeneralInfo: React.FC<Step1Props> = ({ data, updateData }) => {
  // Auto-calculate age when birth date changes
  useEffect(() => {
    if (data.fechaNacimiento) {
      const ageResult = calculateAge(data.fechaNacimiento);
      if (ageResult.years >= 0 || ageResult.months >= 0) {
        updateData({
          edadAnos: ageResult.years.toString(),
          edadMeses: ageResult.months.toString(),
        });
      }
    }
  }, [data.fechaNacimiento]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Friendly Greeting Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-nl-petrol via-nl-petrol-light to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-amber-200 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> Página 1: Identificación y Salud Inicial
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              ¡Hola!, yo soy...
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Formato de Caracterización para los Servicios de Educación Inicial No Escolarizada (AFEI, Visita a los Hogares y CCAPI).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 self-start md:self-auto">
            <SunIllustration className="w-12 h-12 shrink-0 animate-wiggle" />
            <div>
              <div className="text-[11px] font-semibold text-teal-200 uppercase tracking-wider">Fecha del Formato</div>
              <input
                type="date"
                value={data.fecha}
                onChange={(e) => updateData({ fecha: e.target.value })}
                className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-6 -bottom-8 opacity-20 pointer-events-none">
          <FlowerIllustration className="w-36 h-36" />
        </div>
      </div>

      {/* Child Personal Details Card */}
      <SectionCard
        title="Datos Personales de la Niña o Niño"
        subtitle="Información básica de registro y nacimiento"
        icon={<User className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField label="Nombre(s) y apellidos completos" required>
              <input
                type="text"
                placeholder="Ej. Mateo Emmanuel Garza Gómez"
                value={data.nombreCompleto}
                onChange={(e) => updateData({ nombreCompleto: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-nl-petrol focus:border-transparent text-slate-800 placeholder-slate-400 font-medium text-base shadow-sm"
              />
            </FormField>
          </div>

          <FormField label="Lugar de nacimiento" required>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Ej. Monterrey, Nuevo León"
                value={data.lugarNacimiento}
                onChange={(e) => updateData({ lugarNacimiento: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-nl-petrol focus:border-transparent text-sm"
              />
            </div>
          </FormField>

          <FormField label="Fecha de nacimiento" required>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="date"
                value={data.fechaNacimiento}
                onChange={(e) => updateData({ fechaNacimiento: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-nl-petrol focus:border-transparent text-sm"
              />
            </div>
          </FormField>
        </div>

        {/* Age and Sex Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Age Section */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Edad Calculada</span>
              {data.fechaNacimiento && (
                <span className="text-[11px] font-normal text-amber-700">Auto-calculada con fecha de nacimiento</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Años:</label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  placeholder="0"
                  value={data.edadAnos}
                  onChange={(e) => updateData({ edadAnos: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Meses:</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  placeholder="0"
                  value={data.edadMeses}
                  onChange={(e) => updateData({ edadMeses: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500 text-sm font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Sex Selection */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Sexo del infante <span className="text-rose-500 font-bold">*</span>
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => updateData({ sexo: 'F' })}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  data.sexo === 'F'
                    ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-rose-50'
                }`}
              >
                <span>👧 Femenino (F)</span>
              </button>
              <button
                type="button"
                onClick={() => updateData({ sexo: 'M' })}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  data.sexo === 'M'
                    ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-sky-50'
                }`}
              >
                <span>👦 Masculino (M)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Social, Ethnic & Migration Questions */}
        <div className="space-y-3 pt-3">
          <YesNoRadio
            label="¿La niña o el niño se encuentra registrado ante el Registro Civil?"
            required
            value={data.estaRegistrado}
            onChange={(val) => updateData({ estaRegistrado: val })}
            showConditionalWhen={false}
            conditionalContent={
              <div>
                <label className="block text-xs font-semibold text-rose-800 mb-1">
                  ¿Cuál es la razón por la que no se encuentra registrado? <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Especifique el motivo (ej. falta de actas de los padres, trámite en curso, etc.)"
                  value={data.razonNoRegistrado}
                  onChange={(e) => updateData({ razonNoRegistrado: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white text-sm focus:ring-2 focus:ring-rose-400"
                />
              </div>
            }
          />

          <YesNoRadio
            label="¿Su familia se encuentra dentro de algún grupo poblacional étnico?"
            required
            value={data.grupoEtnico}
            onChange={(val) => updateData({ grupoEtnico: val })}
            showConditionalWhen={true}
            conditionalContent={
              <div>
                <label className="block text-xs font-semibold text-nl-petrol-dark mb-1">
                  ¿Cuál grupo poblacional étnico? <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Náhuatl, Otomí, Mixteco, Zapoteco, etc."
                  value={data.grupoEtnicoCual}
                  onChange={(e) => updateData({ grupoEtnicoCual: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-teal-300 bg-white text-sm focus:ring-2 focus:ring-nl-petrol"
                />
              </div>
            }
          />

          <YesNoRadio
            label="¿Se encuentra en situación de migración actualmente?"
            sublabel="Indique si la familia o el menor se han desplazado recientemente de otro estado o país"
            required
            value={data.situacionMigracion}
            onChange={(val) => updateData({ situacionMigracion: val })}
          />
        </div>
      </SectionCard>

      {/* Health Measurements & Allergies Card */}
      <SectionCard
        title="Medidas Antropométricas y Alergias"
        subtitle="Registro de peso, talla y reacciones alérgicas"
        icon={<Heart className="w-5 h-5" />}
        badge="Requerido"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Altura actual (Talla)" required>
            <div className="relative">
              <Ruler className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Ej. 85 cm o 0.85 m"
                value={data.altura}
                onChange={(e) => updateData({ altura: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-nl-petrol text-sm"
              />
            </div>
          </FormField>

          <FormField label="Peso actual" required>
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Ej. 12.5 kg"
                value={data.peso}
                onChange={(e) => updateData({ peso: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-nl-petrol text-sm"
              />
            </div>
          </FormField>
        </div>

        <YesNoRadio
          label="¿Presenta alguna alergia a alimentos o elementos del ambiente?"
          sublabel="Medicamentos, polvo, polen, picaduras, leche, cacahuate, etc."
          required
          value={data.alergias}
          onChange={(val) => updateData({ alergias: val })}
          showConditionalWhen={true}
          conditionalContent={
            <div>
              <label className="block text-xs font-semibold text-nl-petrol-dark mb-1">
                ¿A qué elementos o alimentos presenta alergia? <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                placeholder="Detalle las alergias conocidas y cuidados requeridos"
                value={data.alergiasCual}
                onChange={(e) => updateData({ alergiasCual: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-teal-300 bg-white text-sm focus:ring-2 focus:ring-nl-petrol"
              />
            </div>
          }
        />
      </SectionCard>
    </div>
  );
};
