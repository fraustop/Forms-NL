export interface Sibling {
  id: string;
  nombre: string;
  edad: string;
}

export interface CaregiverInfo {
  nombre: string;
  ocupacion: string;
  direccion: string;
  celular: string;
  email?: string;
  parentesco?: string;
}

export interface VaccineDefinition {
  id: string;
  name: string;
  description?: string;
  recommendedSlots: string[];
}

export interface AgeSlot {
  id: string;
  label: string;
}

export interface CharacterizationFormData {
  // Page 1
  fecha: string;
  servicioTipo: string;
  nombreCompleto: string;
  lugarNacimiento: string;
  fechaNacimiento: string;
  edadAnos: string;
  edadMeses: string;
  sexo: 'F' | 'M' | '';
  estaRegistrado: boolean | null;
  razonNoRegistrado: string;
  grupoEtnico: boolean | null;
  grupoEtnicoCual: string;
  situacionMigracion: boolean | null;
  altura: string;
  peso: string;
  alergias: boolean | null;
  alergiasCual: string;

  // Page 2
  afiliadoSalud: boolean | null;
  afiliadoSaludCual: string;
  enfermedadMedica: boolean | null;
  enfermedadMedicaCual: string;
  discapacidad: boolean | null;
  discapacidadCual: string;
  vacunas: Record<string, Record<string, boolean>>;

  // Page 3
  mama: CaregiverInfo;
  papa: CaregiverInfo;
  otroCuidador: CaregiverInfo;

  // Page 4
  viveAmbosPadres: boolean | null;
  otrosFamiliaresConviven: string;
  numeroHermanos: number | string;
  hermanos: Sibling[];
  tieneMascota: boolean | null;
  nombreMascota: string;
  asistioOtrosServicios: boolean | null;
  quienAsistioServicios: string;
  modalidadOtrosServicios: 'No Escolarizada' | 'Escolarizada' | '';
  rutinasDiarias: string;

  // Page 5
  rutinasAutocuidadoHigiene: string;
  alimentos: {
    manana: string;
    tarde: string;
    noche: string;
  };
  alimentosFavoritos: string;

  // Page 6
  juegoPreferencias: string;
  reglasAcuerdosCrianza: string;

  // Page 7
  estrategiasEmociones: string;
  descripcionDia: string;

  // Page 8
  fortalezasYMejoras: string;
  motivoYExpectativas: string;
  agenteEducativo: {
    nombre: string;
    firma: string;
  };
  tutorResponsable: {
    nombre: string;
    firma: string;
  };
  consentimientoAvisoPrivacidad: boolean;
}

export const VACCINE_AGE_SLOTS: AgeSlot[] = [
  { id: 'al_nacer', label: 'Al nacer' },
  { id: '2_meses', label: '2 meses' },
  { id: '4_meses', label: '4 meses' },
  { id: '6_meses', label: '6 meses' },
  { id: '7_meses', label: '7 meses' },
  { id: '12_meses', label: '12 meses' },
  { id: '18_meses', label: '18 meses' },
  { id: '2_anos', label: '2 años' },
  { id: '3_anos', label: '3 años' },
];

export const VACCINES_LIST: VaccineDefinition[] = [
  {
    id: 'bcg',
    name: 'BCG (Tuberculosis)',
    description: 'Dosis única al nacer',
    recommendedSlots: ['al_nacer'],
  },
  {
    id: 'hepatitis_b',
    name: 'Hepatitis B',
    description: 'Al nacer, 2 meses y 6 meses',
    recommendedSlots: ['al_nacer', '2_meses', '6_meses'],
  },
  {
    id: 'hexavalente',
    name: 'Hexavalente BCG',
    description: 'Difteria, Tos ferina, Tétanos, Poliomielitis, Hepatitis B e Influenza tipo b',
    recommendedSlots: ['2_meses', '4_meses', '6_meses', '18_meses'],
  },
  {
    id: 'rotavirus',
    name: 'Rotavirus',
    description: '2, 4 y 6 meses',
    recommendedSlots: ['2_meses', '4_meses', '6_meses'],
  },
  {
    id: 'neumococo',
    name: 'Neumocócica conjugada (Neumococo)',
    description: '2, 4 y 12 meses',
    recommendedSlots: ['2_meses', '4_meses', '12_meses'],
  },
  {
    id: 'srp',
    name: 'SRP (Sarampión, Rubéola y Parotiditis)',
    description: '12 meses y 18 meses / refuerzo',
    recommendedSlots: ['12_meses', '18_meses'],
  },
  {
    id: 'dpt',
    name: 'DPT (Difteria, Tos ferina y Tétanos)',
    description: 'Refuerzo a los 2-4 años',
    recommendedSlots: ['2_anos', '3_anos'],
  },
  {
    id: 'influenza',
    name: 'Influenza estacional',
    description: '6 y 7 meses, refuerzo anual',
    recommendedSlots: ['6_meses', '7_meses', '18_meses', '2_anos', '3_anos'],
  },
];

export const INITIAL_FORM_DATA: CharacterizationFormData = {
  fecha: new Date().toISOString().split('T')[0],
  servicioTipo: 'AFEI / Visita a los Hogares / CCAPI',
  nombreCompleto: '',
  lugarNacimiento: '',
  fechaNacimiento: '',
  edadAnos: '',
  edadMeses: '',
  sexo: '',
  estaRegistrado: null,
  razonNoRegistrado: '',
  grupoEtnico: null,
  grupoEtnicoCual: '',
  situacionMigracion: null,
  altura: '',
  peso: '',
  alergias: null,
  alergiasCual: '',

  afiliadoSalud: null,
  afiliadoSaludCual: '',
  enfermedadMedica: null,
  enfermedadMedicaCual: '',
  discapacidad: null,
  discapacidadCual: '',
  vacunas: {},

  mama: {
    nombre: '',
    ocupacion: '',
    direccion: '',
    celular: '',
    email: '',
  },
  papa: {
    nombre: '',
    ocupacion: '',
    direccion: '',
    celular: '',
    email: '',
  },
  otroCuidador: {
    nombre: '',
    parentesco: '',
    ocupacion: '',
    direccion: '',
    celular: '',
  },

  viveAmbosPadres: null,
  otrosFamiliaresConviven: '',
  numeroHermanos: '',
  hermanos: [],
  tieneMascota: null,
  nombreMascota: '',
  asistioOtrosServicios: null,
  quienAsistioServicios: '',
  modalidadOtrosServicios: '',
  rutinasDiarias: '',

  rutinasAutocuidadoHigiene: '',
  alimentos: {
    manana: '',
    tarde: '',
    noche: '',
  },
  alimentosFavoritos: '',

  juegoPreferencias: '',
  reglasAcuerdosCrianza: '',

  estrategiasEmociones: '',
  descripcionDia: '',

  fortalezasYMejoras: '',
  motivoYExpectativas: '',
  agenteEducativo: {
    nombre: 'Guadalupe Jazmín Hernández Amador',
    firma: '',
  },
  tutorResponsable: {
    nombre: '',
    firma: '',
  },
  consentimientoAvisoPrivacidad: false,
};
