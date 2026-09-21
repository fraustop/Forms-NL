import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { CharacterizationFormData } from '../types/form';

export interface SaveResponseResult {
  success: boolean;
  id?: string;
  folio?: string;
  error?: string;
}

export interface StoredFormDetail {
  id: string;
  folio: string;
  data: CharacterizationFormData;
  createdAtText: string;
  timestampMillis: number;
}

const COLLECTION_NAME = 'respuestas_caracterizacion';

/**
 * Guarda una nueva caracterización infantil en Cloud Firestore
 */
export async function saveFormToFirestore(
  formData: CharacterizationFormData
): Promise<SaveResponseResult> {
  try {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const folio = `NL-EI-${new Date().getFullYear()}-${randomSuffix}`;

    // Sanitizar objeto para Firestore (evitar undefined)
    const sanitizedData = JSON.parse(JSON.stringify(formData));

    const docPayload = {
      ...sanitizedData,
      folio,
      nombreNino: formData.nombreCompleto || 'Sin nombre registrado',
      fechaRegistro: formData.fecha || new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      clientTimestamp: timestamp,
      origen: 'web_digital_v1',
      estado: 'completado',
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docPayload);

    return {
      success: true,
      id: docRef.id,
      folio: folio,
    };
  } catch (error: any) {
    console.error('Error al guardar documento en Firestore:', error);
    return {
      success: false,
      error: error?.message || 'Error desconocido al conectar con Firebase Firestore',
    };
  }
}

/**
 * Obtiene todos los formularios completos para el Panel de Respuestas (Admin)
 */
export async function fetchAllFormDetails(): Promise<StoredFormDetail[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(200)
    );

    const snapshot = await getDocs(q);
    const results: StoredFormDetail[] = [];

    snapshot.forEach((docSnap) => {
      const rawData = docSnap.data() as any;
      let dateString = 'Fecha no disponible';
      let timestampMillis = 0;

      if (rawData.createdAt?.toDate) {
        const d = rawData.createdAt.toDate();
        dateString = d.toLocaleString('es-MX', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        timestampMillis = d.getTime();
      } else if (rawData.clientTimestamp) {
        const d = new Date(rawData.clientTimestamp);
        dateString = d.toLocaleString('es-MX', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        timestampMillis = rawData.clientTimestamp;
      }

      results.push({
        id: docSnap.id,
        folio: rawData.folio || `NL-EI-${docSnap.id.substring(0, 6)}`,
        data: rawData as CharacterizationFormData,
        createdAtText: dateString,
        timestampMillis,
      });
    });

    return results;
  } catch (error: any) {
    console.error('Error al consultar Firestore en el panel de administración:', error);
    throw error;
  }
}

/**
 * Elimina un documento de respuesta por ID
 */
export async function deleteFormDocument(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error eliminando documento de Firestore:', error);
    return false;
  }
}

/**
 * Genera y descarga un archivo CSV con todas las respuestas recopiladas
 */
export function exportFormsToCSV(forms: StoredFormDetail[]): void {
  if (!forms || forms.length === 0) {
    alert('No hay respuestas para exportar.');
    return;
  }

  const headers = [
    'Folio',
    'Fecha de Registro',
    'Nombre del Infante',
    'Fecha de Nacimiento',
    'Edad (Años)',
    'Edad (Meses)',
    'Sexo',
    'Lugar de Nacimiento',
    'Registrado ante Registro Civil',
    'Grupo Étnico',
    'Migración',
    'Altura',
    'Peso',
    'Alergias',
    'Afiliación a Salud',
    'Enfermedad Médica',
    'Discapacidad',
    'Nombre Mamá',
    'Teléfono Mamá',
    'Email Mamá',
    'Nombre Papá',
    'Teléfono Papá',
    'Nombre Cuidador Adicional',
    'Vive con Ambos Padres',
    'Número de Hermanos',
    'Tiene Mascota',
    'Rutinas Diarias',
    'Rutinas Higiene',
    'Alimentos Mañana',
    'Alimentos Tarde',
    'Alimentos Noche',
    'Alimentos Favoritos',
    'Juego y Preferencias',
    'Reglas de Crianza',
    'Estrategias Emocionales',
    'Agente Educativo',
    'Tutor Responsable',
  ];

  const escapeCSV = (str: any) => {
    if (str === null || str === undefined) return '""';
    const cleanStr = String(str).replace(/"/g, '""');
    return `"${cleanStr}"`;
  };

  const rows = forms.map(({ folio, data, createdAtText }) => [
    escapeCSV(folio),
    escapeCSV(createdAtText || data.fecha),
    escapeCSV(data.nombreCompleto),
    escapeCSV(data.fechaNacimiento),
    escapeCSV(data.edadAnos),
    escapeCSV(data.edadMeses),
    escapeCSV(data.sexo),
    escapeCSV(data.lugarNacimiento),
    escapeCSV(data.estaRegistrado ? 'Sí' : data.estaRegistrado === false ? `No (${data.razonNoRegistrado})` : ''),
    escapeCSV(data.grupoEtnico ? `Sí (${data.grupoEtnicoCual})` : 'No'),
    escapeCSV(data.situacionMigracion ? 'Sí' : 'No'),
    escapeCSV(data.altura),
    escapeCSV(data.peso),
    escapeCSV(data.alergias ? `Sí (${data.alergiasCual})` : 'No'),
    escapeCSV(data.afiliadoSalud ? `Sí (${data.afiliadoSaludCual})` : 'No'),
    escapeCSV(data.enfermedadMedica ? `Sí (${data.enfermedadMedicaCual})` : 'No'),
    escapeCSV(data.discapacidad ? `Sí (${data.discapacidadCual})` : 'No'),
    escapeCSV(data.mama?.nombre),
    escapeCSV(data.mama?.celular),
    escapeCSV(data.mama?.email),
    escapeCSV(data.papa?.nombre),
    escapeCSV(data.papa?.celular),
    escapeCSV(data.otroCuidador?.nombre ? `${data.otroCuidador.nombre} (${data.otroCuidador.parentesco})` : ''),
    escapeCSV(data.viveAmbosPadres ? 'Sí' : 'No'),
    escapeCSV(data.hermanos?.length || data.numeroHermanos || 0),
    escapeCSV(data.nombreMascota || (data.tieneMascota ? 'Sí' : 'No')),
    escapeCSV(data.rutinasDiarias),
    escapeCSV(data.rutinasAutocuidadoHigiene),
    escapeCSV(data.alimentos?.manana),
    escapeCSV(data.alimentos?.tarde),
    escapeCSV(data.alimentos?.noche),
    escapeCSV(data.alimentosFavoritos),
    escapeCSV(data.juegoPreferencias),
    escapeCSV(data.reglasAcuerdosCrianza),
    escapeCSV(data.estrategiasEmociones),
    escapeCSV(data.agenteEducativo?.nombre),
    escapeCSV(data.tutorResponsable?.nombre || data.mama?.nombre),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Respuestas_Caracterizacion_NL_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
