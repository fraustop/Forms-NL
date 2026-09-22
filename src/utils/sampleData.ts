import type { CharacterizationFormData } from '../types/form';

export const SAMPLE_FORM_DATA: CharacterizationFormData = {
  fecha: new Date().toISOString().split('T')[0],
  servicioTipo: 'AFEI / Visita a los Hogares / CCAPI',
  nombreCompleto: 'Santiago Gael Mendoza Flores',
  lugarNacimiento: 'Monterrey, Nuevo León',
  fechaNacimiento: '2023-04-15',
  edadAnos: '2',
  edadMeses: '5',
  sexo: 'M',
  estaRegistrado: true,
  razonNoRegistrado: '',
  grupoEtnico: false,
  grupoEtnicoCual: '',
  situacionMigracion: false,
  altura: '89 cm',
  peso: '13.2 kg',
  alergias: false,
  alergiasCual: '',

  afiliadoSalud: true,
  afiliadoSaludCual: 'IMSS - UMF #32 Guadalupe, N.L.',
  enfermedadMedica: false,
  enfermedadMedicaCual: '',
  discapacidad: false,
  discapacidadCual: '',
  vacunas: {
    bcg: { al_nacer: true },
    hepatitis_b: { al_nacer: true, '2_meses': true, '6_meses': true },
    hexavalente: { '2_meses': true, '4_meses': true, '6_meses': true, '18_meses': true },
    rotavirus: { '2_meses': true, '4_meses': true, '6_meses': true },
    neumococo: { '2_meses': true, '4_meses': true, '12_meses': true },
    srp: { '12_meses': true, '18_meses': true },
    dpt: { '2_anos': true },
    influenza: { '6_meses': true, '7_meses': true, '18_meses': true, '2_anos': true },
  },

  mama: {
    nombre: 'Ana Sofía Flores Villarreal',
    ocupacion: 'Asistente Administrativa',
    direccion: 'Calle Los Encinos #245, Col. Vista Hermosa, Monterrey, N.L.',
    celular: '81 1543 9876',
    email: 'ana.flores@ejemplo.com',
  },
  papa: {
    nombre: 'Gerardo Mendoza Cantú',
    ocupacion: 'Ingeniero en Mantenimiento',
    direccion: 'Calle Los Encinos #245, Col. Vista Hermosa, Monterrey, N.L.',
    celular: '81 8321 6540',
    email: 'gerardo.mendoza@ejemplo.com',
  },
  otroCuidador: {
    nombre: 'Leticia Villarreal Ramos',
    parentesco: 'Abuela Materna',
    ocupacion: 'Jubilada',
    direccion: 'Calle Los Encinos #245, Col. Vista Hermosa, Monterrey, N.L.',
    celular: '81 2345 6789',
  },

  viveAmbosPadres: true,
  otrosFamiliaresConviven: 'Abuelita materna (Doña Lety)',
  numeroHermanos: 1,
  hermanos: [
    {
      id: 'h1',
      nombre: 'Valentina Mendoza Flores',
      edad: '5 años',
    },
  ],
  tieneMascota: true,
  nombreMascota: 'Un perrito mestizo llamado "Toby"',
  asistioOtrosServicios: false,
  quienAsistioServicios: '',
  modalidadOtrosServicios: '',
  rutinasDiarias: 'Se despierta alrededor de las 7:30 am con música alegre. Desayuna en compañía de mamá y abuelita. A las 10:00 am tiene espacio de juego motriz y exploración. Realiza una siesta de 1:30 a 3:00 pm. Por la tarde juega con su hermana y antes de dormir a las 8:30 pm se le lee un cuento ilustrado.',

  rutinasAutocuidadoHigiene: 'Se lava las manos antes de cada comida cantando una canción. Se cepilla los dientes con supervisión de mamá. Avisa oportunamente para usar su orinal/bacinica durante el día (control de esfínteres en etapa final). Ayuda a ponerse sus zapatos de velcro y a recoger sus juguetes.',
  alimentos: {
    manana: 'Huevo revuelto con jitomate, medio plátano rebanado, 1 tortilla de maíz y un vaso de leche.',
    tarde: 'Sopa de fideos con verduras y pollo deshebrado, agua natural de melón sin azúcar y trocitos de papaya.',
    noche: 'Una sincronizada en tortilla de maíz con queso panela, calabacita cocida al vapor y té de manzanilla tibio.',
  },
  alimentosFavoritos: 'Plátano, papaya, caldito de pollo casero, queso fresco y frijoles refritos.',

  juegoPreferencias: 'Le apasiona armar torres con bloques de colores grandes, apilar vasos y jugar con carritos. Juega mucho con su hermana Valentina y con su papá cuando regresa del trabajo. Su juguete preferido es un trenecito de madera.',
  reglasAcuerdosCrianza: 'Se establecieron horarios regulares para las comidas y el sueño. Se fomenta el diálogo amoroso en lugar de castigos, pidiendo "por favor" y "gracias". Cero uso de teléfonos o pantallas durante la mesa. Cuando ocurre una rabieta, nos agachamos a su altura, validamos su emoción y le ofrecemos un abrazo.',

  estrategiasEmociones: 'Nombramos lo que siente ("veo que estás enojado porque se cayó la torre"). Le ofrecemos tomar aire profundo juntos soplando como si fuera una vela. Brindamos abrazos de contención y refuerzos positivos verbales cuando comparte o resuelve un conflicto con calma.',
  descripcionDia: 'Santiago empieza su día sonriendo al ver el sol entrar por la ventana. Le gusta ayudar a poner los manteles en la mesa del desayuno. Al mediodía canta rimas mientras su abuelita le muestra libros de animales. En la tarde corretea en el patio con su hermana y su perrito Toby. Por la noche, tras un baño tibio y su cena, mamá le lee "El león que quería rugir" y se duerme plácidamente abrazando su mantita.',

  fortalezasYMejoras: 'Fortaleza: Gran curiosidad, afecto espontáneo y excelente disposición para comer alimentos variados. Aspecto a fortalecer: Fomentar mayor paciencia cuando tiene que esperar su turno para jugar con su hermana.',
  motivoYExpectativas: 'Decidimos ingresar al servicio para enriquecer su desarrollo socioafectivo y cognitivo en sus primeros años. Esperamos recibir orientación pedagógica práctica para continuar potenciando sus habilidades desde nuestro hogar.',
  agenteEducativo: {
    nombre: 'Guadalupe Jazmín Hernández Amador',
    firma: '',
  },
  tutorResponsable: {
    nombre: 'Ana Sofía Flores Villarreal (Madre)',
    firma: '',
  },
  consentimientoAvisoPrivacidad: true,
};
