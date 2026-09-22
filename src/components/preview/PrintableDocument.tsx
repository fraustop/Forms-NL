import React from 'react';
import type { CharacterizationFormData } from '../../types/form';
import { VACCINES_LIST, VACCINE_AGE_SLOTS } from '../../types/form';
import { NuevoLeonHeader, SunIllustration, FlowerIllustration, BeeIllustration, ChildIllustration } from '../common/BrandAssets';
import { formatDateToDMY } from '../../utils/dateUtils';
import { Printer, X, PlusCircle, ShieldCheck, Lock } from 'lucide-react';

interface PrintableDocumentProps {
  data: CharacterizationFormData;
  onClose?: () => void;
  isReadOnlySubmitted?: boolean;
  onNewForm?: () => void;
  onNavigateToResponses?: () => void;
}

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  data,
  onClose,
  isReadOnlySubmitted,
  onNewForm,
  onNavigateToResponses,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const renderCheck = (checked: boolean | null | undefined, label: string) => (
    <span className="inline-flex items-center gap-1 font-semibold text-[11px] mr-3">
      <span className={`w-3.5 h-3.5 border border-slate-700 rounded-sm inline-flex items-center justify-center text-[10px] ${checked ? 'bg-slate-900 text-white font-black' : 'bg-white text-transparent'}`}>
        ✓
      </span>
      <span>{label}</span>
    </span>
  );

  return (
    <div className="bg-slate-100 min-h-screen py-6 px-2 sm:px-6 font-sans">
      {/* Floating Action Bar (hidden on print) */}
      <div className="no-print sticky top-4 z-50 max-w-4xl mx-auto mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
            {isReadOnlySubmitted ? (
              <>
                <Lock className="w-4 h-4 text-nl-petrol" />
                <span>Expediente Enviado (Modo Solo Lectura)</span>
              </>
            ) : (
              <span>Vista Previa de Impresión Oficial (PDF)</span>
            )}
          </h3>
          <p className="text-xs text-slate-500">
            {isReadOnlySubmitted
              ? 'El formulario fue registrado exitosamente. La interfaz de edición se encuentra bloqueada.'
              : 'Formato fiel al documento original de 8 páginas del Gobierno de Nuevo León.'}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-nl-petrol hover:bg-nl-petrol-dark text-white font-bold flex items-center gap-2 shadow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Imprimir / Guardar como PDF
          </button>

          {isReadOnlySubmitted && onNewForm && (
            <button
              type="button"
              onClick={onNewForm}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Iniciar Nuevo Formulario
            </button>
          )}

          {isReadOnlySubmitted && onNavigateToResponses && (
            <button
              type="button"
              onClick={onNavigateToResponses}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" /> Ver Panel de Respuestas
            </button>
          )}

          {onClose && !isReadOnlySubmitted && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" /> Cerrar Vista
            </button>
          )}
        </div>
      </div>

      {/* 8-Page Printable Sheets Container */}
      <div className="max-w-[820px] mx-auto space-y-8 print:space-y-0 text-slate-900 font-sans">

        {/* ----------------- PÁGINA 1 ----------------- */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-md print:shadow-none print:rounded-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative page-break">
          <div>
            <NuevoLeonHeader />

            <div className="text-center my-4 space-y-1">
              <h1 className="text-xl font-extrabold text-nl-petrol tracking-tight">
                Formato de Caracterización
              </h1>
              <div className="text-xs font-bold text-slate-700">
                Servicios de Educación Inicial No Escolarizada
              </div>
              <div className="text-xs font-semibold text-slate-600">
                AFEI / Visita a los Hogares / CCAPI
              </div>
              <div className="text-xs font-bold text-amber-600">Niñas y Niños</div>
            </div>

            <div className="flex justify-between items-center my-3 text-xs">
              <div className="flex items-center gap-2">
                <FlowerIllustration className="w-10 h-12" />
                <SunIllustration className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Fecha:</span>
                <span className="border-b border-slate-500 pb-0.5 min-w-[120px] text-center font-medium">
                  {formatDateToDMY(data.fecha) || '____/____/________'}
                </span>
              </div>
            </div>

            {/* ¡Hola!, yo soy */}
            <div className="my-3">
              <div className="inline-block bg-teal-800 text-white font-bold text-xs px-3 py-1 rounded-md mb-1">
                ¡Hola!, yo soy
              </div>
              <div className="border-b border-slate-700 pb-1 font-bold text-sm min-h-[24px]">
                {data.nombreCompleto || '(Nombre(s) y apellidos)'}
              </div>
              <span className="text-[10px] text-slate-500 italic block">(Nombre(s) y apellidos)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs mt-3">
              <div>
                <span className="font-bold">Lugar de nacimiento: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[150px]">
                  {data.lugarNacimiento || '____________________'}
                </span>
              </div>

              <div>
                <span className="font-bold">Fecha de nacimiento (DD/MM/AAAA): </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[100px] text-center">
                  {formatDateToDMY(data.fechaNacimiento) || '__/__/____'}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="font-bold">¿La niña o el niño se encuentra registrado?</span>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {renderCheck(data.estaRegistrado === true, 'Sí')}
                  {renderCheck(data.estaRegistrado === false, 'No')}
                  <span className="font-bold ml-2">¿Cuál es la razón?</span>
                  <span className="border-b border-slate-400 pb-0.5 flex-1 min-w-[150px]">
                    {data.razonNoRegistrado || '__________________________________'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="font-bold">Edad (años y meses): </span>
                  <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[100px] text-center font-medium">
                    {data.edadAnos || data.edadMeses
                      ? `${data.edadAnos || '0'} años, ${data.edadMeses || '0'} meses`
                      : '____________________'}
                  </span>
                </div>

                <div>
                  <span className="font-bold">Sexo: </span>
                  {renderCheck(data.sexo === 'F', 'F')}
                  {renderCheck(data.sexo === 'M', 'M')}
                </div>
              </div>

              <div>
                <span className="font-bold">¿Su familia se encuentra dentro de algún grupo poblacional étnico?</span>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {renderCheck(data.grupoEtnico === true, 'Sí')}
                  {renderCheck(data.grupoEtnico === false, 'No')}
                  <span className="font-bold ml-2">¿Cuál?</span>
                  <span className="border-b border-slate-400 pb-0.5 flex-1 min-w-[150px]">
                    {data.grupoEtnicoCual || '__________________________________'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold">¿Se encuentra en situación de migración actualmente?</span>
                <div className="mt-1 flex items-center gap-4">
                  {renderCheck(data.situacionMigracion === true, 'Sí')}
                  {renderCheck(data.situacionMigracion === false, 'No')}
                </div>
              </div>
            </div>

            {/* Health Section */}
            <div className="mt-6">
              <div className="inline-block bg-teal-800 text-white font-bold text-xs px-3 py-1 rounded-md mb-3">
                Salud
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold">Altura actual: </span>
                  <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[120px]">
                    {data.altura || '________________'}
                  </span>
                </div>

                <div>
                  <span className="font-bold">Peso actual: </span>
                  <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[120px]">
                    {data.peso || '________________'}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs">
                <span className="font-bold">¿Presenta alguna alergia a alimentos o elementos del ambiente?</span>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {renderCheck(data.alergias === true, 'Sí')}
                  {renderCheck(data.alergias === false, 'No')}
                  <span className="font-bold ml-2">¿Cuál?</span>
                  <span className="border-b border-slate-400 pb-0.5 flex-1 min-w-[150px]">
                    {data.alergiasCual || '__________________________________'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Página 1 de 8
          </div>
        </div>

        {/* ----------------- PÁGINA 2 ----------------- */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-md print:shadow-none print:rounded-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative page-break">
          <div>
            <NuevoLeonHeader />

            <div className="my-4 space-y-4 text-xs">
              <div>
                <span className="font-bold">¿Afiliado a algún sistema de salud?</span>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {renderCheck(data.afiliadoSalud === true, 'Sí')}
                  {renderCheck(data.afiliadoSalud === false, 'No')}
                  <span className="font-bold ml-2">¿Cuál?</span>
                  <span className="border-b border-slate-400 pb-0.5 flex-1 min-w-[150px]">
                    {data.afiliadoSaludCual || '__________________________________'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold">¿La niña o el niño tiene alguna enfermedad médica?</span>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {renderCheck(data.enfermedadMedica === true, 'Sí')}
                  {renderCheck(data.enfermedadMedica === false, 'No')}
                  <span className="font-bold ml-2">¿Cuál?</span>
                  <span className="border-b border-slate-400 pb-0.5 flex-1 min-w-[150px]">
                    {data.enfermedadMedicaCual || '__________________________________'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold">¿La niña o el niño tiene algún tipo de discapacidad diagnosticada?</span>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {renderCheck(data.discapacidad === true, 'Sí')}
                  {renderCheck(data.discapacidad === false, 'No')}
                  <span className="font-bold ml-2">¿Cuál?</span>
                  <span className="border-b border-slate-400 pb-0.5 flex-1 min-w-[150px]">
                    {data.discapacidadCual || '__________________________________'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vaccine Matrix */}
            <div className="mt-6">
              <h4 className="font-bold text-xs text-slate-800 mb-2">
                Selecciona las vacunas que la niña o el niño ha recibido, de acuerdo con su esquema de vacunación.
              </h4>

              <div className="border border-slate-700 rounded-sm overflow-hidden text-[10px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-700 text-slate-800">
                      <th className="py-2 px-2 font-bold w-48 border-r border-slate-700">Vacuna</th>
                      {VACCINE_AGE_SLOTS.map((slot) => (
                        <th key={slot.id} className="py-1 px-1 font-bold text-center border-r border-slate-700 last:border-r-0">
                          {slot.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {VACCINES_LIST.map((vac) => (
                      <tr key={vac.id}>
                        <td className="py-2 px-2 font-medium border-r border-slate-700 leading-tight">
                          {vac.name}
                        </td>
                        {VACCINE_AGE_SLOTS.map((slot) => {
                          const isChecked = !!data.vacunas?.[vac.id]?.[slot.id];
                          return (
                            <td key={slot.id} className="py-1 px-1 text-center border-r border-slate-700 last:border-r-0">
                              {isChecked ? (
                                <span className="font-bold text-xs">✓</span>
                              ) : (
                                <span className="text-slate-300"></span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Página 2 de 8
          </div>
        </div>

        {/* ----------------- PÁGINA 3 ----------------- */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-md print:shadow-none print:rounded-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative page-break">
          <div>
            <NuevoLeonHeader />

            <div className="inline-block bg-teal-800 text-white font-bold text-xs px-3 py-1 rounded-md my-4">
              Datos familiares
            </div>

            {/* Mamá */}
            <div className="space-y-2 text-xs mb-5">
              <div className="font-bold text-teal-900 text-sm">Mamá</div>
              <div>
                <span className="font-bold">Nombre(s) y apellidos: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.mama.nombre || '________________________________________'}
                </span>
              </div>
              <div>
                <span className="font-bold">Ocupación: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.mama.ocupacion || '________________________________________'}
                </span>
              </div>
              <div>
                <span className="font-bold">Dirección de la casa: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.mama.direccion || '________________________________________'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="font-bold">Celular: </span>
                  <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[140px]">
                    {data.mama.celular || '____________________'}
                  </span>
                </div>
                <div>
                  <span className="font-bold">Correo electrónico: </span>
                  <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[140px]">
                    {data.mama.email || '____________________'}
                  </span>
                </div>
              </div>
            </div>

            {/* Papá */}
            <div className="space-y-2 text-xs mb-5 border-t border-slate-200 pt-4">
              <div className="font-bold text-teal-900 text-sm">Papá</div>
              <div>
                <span className="font-bold">Nombre(s) y apellidos: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.papa.nombre || '________________________________________'}
                </span>
              </div>
              <div>
                <span className="font-bold">Ocupación: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.papa.ocupacion || '________________________________________'}
                </span>
              </div>
              <div>
                <span className="font-bold">Dirección de la casa: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.papa.direccion || '________________________________________'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="font-bold">Celular: </span>
                  <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[140px]">
                    {data.papa.celular || '____________________'}
                  </span>
                </div>
                <div>
                  <span className="font-bold">Correo electrónico: </span>
                  <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[140px]">
                    {data.papa.email || '____________________'}
                  </span>
                </div>
              </div>
            </div>

            {/* Otro Cuidador */}
            <div className="space-y-2 text-xs border-t border-slate-200 pt-4">
              <div className="font-bold text-slate-800 text-xs">
                En caso de que otro cuidador asista con la niña o el niño al servicio conteste la siguiente información
              </div>
              <div>
                <span className="font-bold">Nombre(s) y apellidos: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.otroCuidador.nombre || '________________________________________'}
                </span>
              </div>
              <div>
                <span className="font-bold">Parentesco: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.otroCuidador.parentesco || '________________________________________'}
                </span>
              </div>
              <div>
                <span className="font-bold">Ocupación: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.otroCuidador.ocupacion || '________________________________________'}
                </span>
              </div>
              <div>
                <span className="font-bold">Dirección de la casa: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.otroCuidador.direccion || '________________________________________'}
                </span>
              </div>
              <div>
                <span className="font-bold">Celular: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[160px]">
                  {data.otroCuidador.celular || '____________________'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Página 3 de 8
          </div>
        </div>

        {/* ----------------- PÁGINA 4 ----------------- */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-md print:shadow-none print:rounded-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative page-break">
          <div>
            <NuevoLeonHeader />

            <div className="space-y-4 text-xs my-4">
              <div>
                <span className="font-bold">¿La niña o el niño vive con ambos padres?</span>
                <span className="ml-4">
                  {renderCheck(data.viveAmbosPadres === true, 'Sí')}
                  {renderCheck(data.viveAmbosPadres === false, 'No')}
                </span>
              </div>

              <div>
                <span className="font-bold">¿Con qué otros familiares vive? </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[300px]">
                  {data.otrosFamiliaresConviven || '________________________________________'}
                </span>
              </div>

              <div>
                <span className="font-bold">Número de hermanos/as: </span>
                <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[80px] text-center">
                  {data.hermanos?.length || data.numeroHermanos || '____'}
                </span>
              </div>

              <div>
                <span className="font-bold">Nombre(s) y edad(es) de los hermanos/as:</span>
                <div className="border-b border-slate-400 pb-1 mt-1 min-h-[28px] leading-relaxed">
                  {data.hermanos && data.hermanos.length > 0
                    ? data.hermanos.map((h) => `${h.nombre} (${h.edad || 'edad N/D'})`).join('; ')
                    : '__________________________________________________________________________'}
                </div>
              </div>

              <div>
                <span className="font-bold">¿Tiene mascota? y ¿Cómo se llama?</span>
                <div className="border-b border-slate-400 pb-0.5 mt-1 min-h-[22px]">
                  {data.nombreMascota || '__________________________________________________________________________'}
                </div>
              </div>
            </div>

            {/* Otros servicios */}
            <div className="mt-6">
              <div className="inline-block bg-teal-800 text-white font-bold text-xs px-3 py-1 rounded-md mb-3">
                Otros servicios
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold">¿Algún integrante de la familia ha asistido a otros servicios de Educación Inicial:</span>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    {renderCheck(data.asistioOtrosServicios === true, 'Sí')}
                    {renderCheck(data.asistioOtrosServicios === false, 'No')}
                    <span className="font-bold ml-2">¿Quién?</span>
                    <span className="border-b border-slate-400 pb-0.5 flex-1 min-w-[150px]">
                      {data.quienAsistioServicios || '__________________________________'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  {renderCheck(data.modalidadOtrosServicios === 'No Escolarizada', 'No Escolarizada')}
                  {renderCheck(data.modalidadOtrosServicios === 'Escolarizada', 'Escolarizada')}
                </div>
              </div>
            </div>

            {/* Rutinas y hábitos */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="inline-block bg-teal-800 text-white font-bold text-xs px-3 py-1 rounded-md mb-2">
                  Rutinas y hábitos
                </div>
                <BeeIllustration className="w-12 h-10" />
              </div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                ¿Qué rutinas tiene la niña o el niño diariamente? (Al irse a dormir / al comer / al levantarse, etc.)
              </div>
              <div className="border border-slate-700 rounded-2xl p-4 min-h-[140px] text-xs leading-relaxed">
                {data.rutinasDiarias || ''}
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Página 4 de 8
          </div>
        </div>

        {/* ----------------- PÁGINA 5 ----------------- */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-md print:shadow-none print:rounded-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative page-break">
          <div>
            <NuevoLeonHeader />

            <div className="my-4 space-y-4">
              <div className="text-xs font-bold text-slate-800">
                ¿Cuáles rutinas de auto-cuidado e higiene practica la niña o el niño independientemente? (Lavado de manos, dientes, control de esfínteres, etc.)
              </div>
              <div className="border border-slate-700 rounded-2xl p-4 min-h-[140px] text-xs leading-relaxed">
                {data.rutinasAutocuidadoHigiene || ''}
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-slate-800 mb-2">
                  ¿Qué tipo de alimentos consume la niña o el niño durante la mañana, tarde y noche?
                </div>

                <div className="border border-slate-700 rounded-sm overflow-hidden text-xs">
                  <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-700 font-bold text-center py-2">
                    <div className="border-r border-slate-700">Mañana</div>
                    <div className="border-r border-slate-700">Tarde</div>
                    <div>Noche</div>
                  </div>
                  <div className="grid grid-cols-3 min-h-[160px] text-[11px] divide-x divide-slate-700">
                    <div className="p-3 leading-relaxed whitespace-pre-wrap">{data.alimentos.manana}</div>
                    <div className="p-3 leading-relaxed whitespace-pre-wrap">{data.alimentos.tarde}</div>
                    <div className="p-3 leading-relaxed whitespace-pre-wrap">{data.alimentos.noche}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 text-xs">
                <span className="font-bold">¿Cuáles son los alimentos que más le gustan? </span>
                <div className="border-b border-slate-400 pb-1 mt-1 min-h-[24px]">
                  {data.alimentosFavoritos || '__________________________________________________________________________'}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Página 5 de 8
          </div>
        </div>

        {/* ----------------- PÁGINA 6 ----------------- */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-md print:shadow-none print:rounded-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative page-break">
          <div>
            <NuevoLeonHeader />

            <div className="my-5 space-y-6">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-2">
                  ¿Qué le gusta jugar a la niña o niño?, ¿Con quién juega? y ¿Cuál es su juguete favorito?
                </div>
                <div className="border border-slate-700 rounded-2xl p-4 min-h-[220px] text-xs leading-relaxed">
                  {data.juegoPreferencias || ''}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 mb-2">
                  ¿Cuáles son las reglas o acuerdos en familia relacionados con la crianza de la niña o el niño?
                </div>
                <div className="border border-slate-700 rounded-2xl p-4 min-h-[220px] text-xs leading-relaxed">
                  {data.reglasAcuerdosCrianza || ''}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <FlowerIllustration className="w-10 h-12 opacity-80" />
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Página 6 de 8
          </div>
        </div>

        {/* ----------------- PÁGINA 7 ----------------- */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-md print:shadow-none print:rounded-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative page-break">
          <div>
            <NuevoLeonHeader />

            <div className="my-4 space-y-6">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-1 leading-snug">
                  ¿Qué estrategias utilizan desde el hogar para el manejo de sus emociones? <span className="font-normal text-slate-600">Ejemplo: promover comportamientos saludables, la identificación y expresión de emociones, enseñar habilidades de autocontrol, fomentar la empatía, comunicación abierta, refuerzos positivos, manejo de situaciones difíciles, entre otras.</span>
                </div>
                <div className="border border-slate-700 rounded-2xl p-4 min-h-[200px] text-xs leading-relaxed mt-2">
                  {data.estrategiasEmociones || ''}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 mb-1">
                    Describa un día de la niña o el niño
                  </div>
                  <ChildIllustration className="w-10 h-14" />
                </div>
                <div className="text-xs mb-2">
                  <span className="font-bold">Nombre de la niña o el niño: </span>
                  <span className="border-b border-slate-400 pb-0.5 inline-block min-w-[250px]">
                    {data.nombreCompleto || '________________________________________'}
                  </span>
                </div>
                <div className="border border-slate-700 rounded-2xl p-4 min-h-[240px] text-xs leading-relaxed">
                  {data.descripcionDia || ''}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Página 7 de 8
          </div>
        </div>

        {/* ----------------- PÁGINA 8 ----------------- */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-md print:shadow-none print:rounded-none border border-slate-200 print:border-none min-h-[1050px] flex flex-col justify-between relative page-break">
          <div>
            <NuevoLeonHeader />

            <div className="my-4 space-y-5">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-2 leading-snug">
                  Identifique las fortalezas y/o aspectos a mejorar en las relaciones que se establecen con la niña o el niño en los momentos de alimentación, juego, cuidado, trato, entre otras.
                </div>
                <div className="border border-slate-700 rounded-2xl p-4 min-h-[160px] text-xs leading-relaxed">
                  {data.fortalezasYMejoras || ''}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    ¿Por qué decidió ser parte de este servicio? y ¿Qué espera del servicio?
                  </div>
                  <BeeIllustration className="w-12 h-10" />
                </div>
                <div className="border border-slate-700 rounded-2xl p-4 min-h-[160px] text-xs leading-relaxed">
                  {data.motivoYExpectativas || ''}
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="text-center">
                  <div className="h-20 flex items-end justify-center pb-2">
                    {data.agenteEducativo?.firma ? (
                      <img
                        src={data.agenteEducativo.firma}
                        alt="Firma Agente"
                        className="max-h-16 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        {data.agenteEducativo?.nombre || ''}
                      </span>
                    )}
                  </div>
                  <div className="border-t border-slate-800 pt-1 font-bold text-[11px] uppercase tracking-wider text-slate-800">
                    AGENTE EDUCATIVO
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    {data.agenteEducativo?.nombre || 'Nombre y Firma'}
                  </div>
                </div>

                <div className="text-center">
                  <div className="h-20 flex items-end justify-center pb-2">
                    {data.tutorResponsable?.firma ? (
                      <img
                        src={data.tutorResponsable.firma}
                        alt="Firma Tutor"
                        className="max-h-16 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        {data.tutorResponsable?.nombre || data.mama?.nombre || data.papa?.nombre || ''}
                      </span>
                    )}
                  </div>
                  <div className="border-t border-slate-800 pt-1 font-bold text-[11px] uppercase tracking-wider text-slate-800">
                    MADRE, PADRE O CUIDADOR RESPONSABLE
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    {data.tutorResponsable?.nombre || data.mama?.nombre || data.papa?.nombre || 'Nombre y Firma'}
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="pt-6 text-[9.5px] text-slate-600 leading-normal text-justify border-t border-slate-200">
                Se ejecutará el correcto y preciso tratamiento de los datos personales, los cuales serán salvaguardados con fundamento a lo estipulado en los Artículos 3° fracciones X, XI, XXIV, XXV, XXVI, XXVIII, XXXII y XXXVII, 26 y 28 de la Ley de Protección de Datos Personales en Posesión de Sujetos Obligados del Estado de Nuevo León.
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Página 8 de 8
          </div>
        </div>

      </div>
    </div>
  );
};
