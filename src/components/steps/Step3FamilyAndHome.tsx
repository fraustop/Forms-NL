import React from 'react';
import type { CharacterizationFormData, CaregiverInfo, Sibling } from '../../types/form';
import { FormField, YesNoRadio, SectionCard } from '../common/FormInputs';
import { Users, UserCheck, Home, Plus, Trash2, Copy, HeartHandshake, School, Dog } from 'lucide-react';

interface Step3Props {
  data: CharacterizationFormData;
  updateData: (fields: Partial<CharacterizationFormData>) => void;
}

export const Step3FamilyAndHome: React.FC<Step3Props> = ({ data, updateData }) => {
  const updateMama = (fields: Partial<CaregiverInfo>) => {
    updateData({
      mama: { ...data.mama, ...fields },
    });
  };

  const updatePapa = (fields: Partial<CaregiverInfo>) => {
    updateData({
      papa: { ...data.papa, ...fields },
    });
  };

  const updateOtroCuidador = (fields: Partial<CaregiverInfo>) => {
    updateData({
      otroCuidador: { ...data.otroCuidador, ...fields },
    });
  };

  const copyAddressFromMamaToPapa = () => {
    if (data.mama.direccion) {
      updatePapa({ direccion: data.mama.direccion });
    }
  };

  const copyAddressFromMamaToCuidador = () => {
    if (data.mama.direccion) {
      updateOtroCuidador({ direccion: data.mama.direccion });
    }
  };

  // Sibling dynamic helpers
  const addSibling = () => {
    const newSibling: Sibling = {
      id: Date.now().toString(),
      nombre: '',
      edad: '',
    };
    const updatedList = [...(data.hermanos || []), newSibling];
    updateData({
      hermanos: updatedList,
      numeroHermanos: updatedList.length,
    });
  };

  const updateSibling = (id: string, field: 'nombre' | 'edad', val: string) => {
    const updatedList = (data.hermanos || []).map((s) =>
      s.id === id ? { ...s, [field]: val } : s
    );
    updateData({ hermanos: updatedList });
  };

  const removeSibling = (id: string) => {
    const updatedList = (data.hermanos || []).filter((s) => s.id !== id);
    updateData({
      hermanos: updatedList,
      numeroHermanos: updatedList.length,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white rounded-3xl p-6 sm:p-7 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Páginas 3 y 4: Entorno Familiar y Red de Cuidado
            </span>
            <h2 className="text-2xl font-bold font-display">Datos Familiares y del Hogar</h2>
            <p className="text-amber-100 text-xs sm:text-sm">
              Información de contacto de madres, padres, cuidadores primarios y dinámica del hogar.
            </p>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 self-start sm:self-auto">
            <Users className="w-8 h-8 text-amber-200" />
          </div>
        </div>
      </div>

      {/* Mamá Card */}
      <SectionCard
        title="Datos de Mamá"
        subtitle="Información de contacto y residencia"
        icon={<UserCheck className="w-5 h-5" />}
        badge="Madre"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre(s) y apellidos de Mamá">
            <input
              type="text"
              placeholder="Ej. Laura Elena Rodríguez Cantú"
              value={data.mama.nombre}
              onChange={(e) => updateMama({ nombre: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <FormField label="Ocupación">
            <input
              type="text"
              placeholder="Ej. Comerciante, Docente, Hogar, Empleada"
              value={data.mama.ocupacion}
              onChange={(e) => updateMama({ ocupacion: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Dirección de la casa (Calle, Número, Colonia, Municipio)">
              <input
                type="text"
                placeholder="Ej. Av. Constitución 400, Col. Centro, Monterrey, N.L."
                value={data.mama.direccion}
                onChange={(e) => updateMama({ direccion: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </FormField>
          </div>

          <FormField label="Teléfono Celular">
            <input
              type="tel"
              placeholder="Ej. 81 1234 5678"
              value={data.mama.celular}
              onChange={(e) => updateMama({ celular: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <FormField label="Correo electrónico">
            <input
              type="email"
              placeholder="Ej. laura.rodriguez@email.com"
              value={data.mama.email || ''}
              onChange={(e) => updateMama({ email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Papá Card */}
      <SectionCard
        title="Datos de Papá"
        subtitle="Información de contacto y residencia"
        icon={<UserCheck className="w-5 h-5" />}
        badge="Padre"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre(s) y apellidos de Papá">
            <input
              type="text"
              placeholder="Ej. Carlos Alberto Garza Salinas"
              value={data.papa.nombre}
              onChange={(e) => updatePapa({ nombre: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <FormField label="Ocupación">
            <input
              type="text"
              placeholder="Ej. Técnico industrial, Chofer, Empleado"
              value={data.papa.ocupacion}
              onChange={(e) => updatePapa({ ocupacion: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-slate-800">Dirección de la casa</label>
              {data.mama.direccion && (
                <button
                  type="button"
                  onClick={copyAddressFromMamaToPapa}
                  className="text-xs text-nl-petrol font-bold flex items-center gap-1 hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar misma dirección de Mamá
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Ej. Av. Constitución 400, Col. Centro, Monterrey, N.L."
              value={data.papa.direccion}
              onChange={(e) => updatePapa({ direccion: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <FormField label="Teléfono Celular">
            <input
              type="tel"
              placeholder="Ej. 81 8765 4321"
              value={data.papa.celular}
              onChange={(e) => updatePapa({ celular: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <FormField label="Correo electrónico">
            <input
              type="email"
              placeholder="Ej. carlos.garza@email.com"
              value={data.papa.email || ''}
              onChange={(e) => updatePapa({ email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Otro Cuidador (Opcional / Si asiste al servicio) */}
      <SectionCard
        title="Otro Cuidador Responsable (Si aplica)"
        subtitle="En caso de que otro cuidador asista con la niña o el niño al servicio"
        icon={<HeartHandshake className="w-5 h-5" />}
        badge="Opcional"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre(s) y apellidos del cuidador">
            <input
              type="text"
              placeholder="Ej. María Luisa Salinas (Abuela materna)"
              value={data.otroCuidador.nombre}
              onChange={(e) => updateOtroCuidador({ nombre: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <FormField label="Parentesco con el infante">
            <input
              type="text"
              placeholder="Ej. Abuela, Tía, Hermano mayor, Niñera"
              value={data.otroCuidador.parentesco || ''}
              onChange={(e) => updateOtroCuidador({ parentesco: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <FormField label="Ocupación">
            <input
              type="text"
              placeholder="Ej. Jubilada, Hogar, Empleada"
              value={data.otroCuidador.ocupacion}
              onChange={(e) => updateOtroCuidador({ ocupacion: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <FormField label="Teléfono Celular">
            <input
              type="tel"
              placeholder="Ej. 81 2233 4455"
              value={data.otroCuidador.celular}
              onChange={(e) => updateOtroCuidador({ celular: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-slate-800">Dirección de la casa</label>
              {data.mama.direccion && (
                <button
                  type="button"
                  onClick={copyAddressFromMamaToCuidador}
                  className="text-xs text-nl-petrol font-bold flex items-center gap-1 hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar misma dirección de Mamá
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Dirección completa del cuidador"
              value={data.otroCuidador.direccion}
              onChange={(e) => updateOtroCuidador({ direccion: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
        </div>
      </SectionCard>

      {/* Living Arrangement, Siblings & Pets */}
      <SectionCard
        title="Dinámica del Hogar, Hermanos y Mascotas"
        subtitle="Convivencia cotidiana y miembros de la familia"
        icon={<Home className="w-5 h-5" />}
      >
        <div className="space-y-4">
          <YesNoRadio
            label="¿La niña o el niño vive con ambos padres?"
            value={data.viveAmbosPadres}
            onChange={(val) => updateData({ viveAmbosPadres: val })}
          />

          <FormField
            label="¿Con qué otros familiares vive en la misma casa?"
            sublabel="Ej. Abuelos, tíos, primos u otros familiares"
          >
            <input
              type="text"
              placeholder="Ej. Abuelita materna y un tío"
              value={data.otrosFamiliaresConviven}
              onChange={(e) => updateData({ otrosFamiliaresConviven: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </FormField>

          {/* Sibling Dynamic Builder */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 block">Hermanos y Hermanas</span>
                <span className="text-xs text-slate-500">
                  Total registrados: {data.hermanos?.length || 0}
                </span>
              </div>
              <button
                type="button"
                onClick={addSibling}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Agregar Hermano/a
              </button>
            </div>

            {(!data.hermanos || data.hermanos.length === 0) ? (
              <p className="text-xs text-slate-400 italic py-2">
                No se han agregado hermanos (hijo/a único/a o presione "Agregar Hermano/a").
              </p>
            ) : (
              <div className="space-y-2">
                {data.hermanos.map((hermano, idx) => (
                  <div
                    key={hermano.id}
                    className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <span className="text-xs font-bold text-slate-400 w-5 text-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Nombre del hermano/a"
                      value={hermano.nombre}
                      onChange={(e) => updateSibling(hermano.id, 'nombre', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Edad (ej. 5 años)"
                      value={hermano.edad}
                      onChange={(e) => updateSibling(hermano.id, 'edad', e.target.value)}
                      className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSibling(hermano.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pet question */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Dog className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-slate-800">
                ¿Tiene mascota? y ¿Cómo se llama?
              </span>
            </div>
            <input
              type="text"
              placeholder="Ej. Sí, un perrito llamado Firulais / No tiene mascota"
              value={data.nombreMascota}
              onChange={(e) => updateData({ nombreMascota: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
        </div>
      </SectionCard>

      {/* Otros Servicios de Educación Inicial */}
      <SectionCard
        title="Antecedentes en Servicios de Educación Inicial"
        subtitle="Asistencia previa a programas educativos de primera infancia"
        icon={<School className="w-5 h-5" />}
      >
        <YesNoRadio
          label="¿Algún integrante de la familia ha asistido a otros servicios de Educación Inicial?"
          value={data.asistioOtrosServicios}
          onChange={(val) => updateData({ asistioOtrosServicios: val })}
          showConditionalWhen={true}
          conditionalContent={
            <div className="space-y-3">
              <FormField label="¿Quién o quiénes asistieron?">
                <input
                  type="text"
                  placeholder="Ej. La niña el año pasado / Su hermano mayor / Mamá"
                  value={data.quienAsistioServicios}
                  onChange={(e) => updateData({ quienAsistioServicios: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-teal-300 bg-white text-sm focus:ring-2 focus:ring-nl-petrol"
                />
              </FormField>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Modalidad del servicio al que asistió:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateData({ modalidadOtrosServicios: 'No Escolarizada' })}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                      data.modalidadOtrosServicios === 'No Escolarizada'
                        ? 'bg-nl-petrol text-white border-nl-petrol shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    No Escolarizada
                  </button>
                  <button
                    type="button"
                    onClick={() => updateData({ modalidadOtrosServicios: 'Escolarizada' })}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                      data.modalidadOtrosServicios === 'Escolarizada'
                        ? 'bg-nl-petrol text-white border-nl-petrol shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Escolarizada (CENDI / Guardería / CAIC)
                  </button>
                </div>
              </div>
            </div>
          }
        />
      </SectionCard>
    </div>
  );
};
