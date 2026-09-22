import type { CharacterizationFormData } from '../types/form';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a specific step of the form.
 * 
 * Rules:
 * - All fields are required EXCEPT:
 *   1. Vacunas (Vaccines table) is strictly OPTIONAL.
 *   2. Caregiver/Parents info (Step 3): Mandatory to provide at least ONE parent or caregiver
 *      (Mamá, Papá, or Otro Cuidador).
 */
export const validateStep = (
  step: number,
  data: CharacterizationFormData
): ValidationResult => {
  const errors: string[] = [];

  switch (step) {
    case 1: {
      if (!data.fecha?.trim()) {
        errors.push('Fecha del formato');
      }
      if (!data.nombreCompleto?.trim()) {
        errors.push('Nombre(s) y apellidos completos del infante');
      }
      if (!data.lugarNacimiento?.trim()) {
        errors.push('Lugar de nacimiento');
      }
      if (!data.fechaNacimiento?.trim()) {
        errors.push('Fecha de nacimiento');
      }
      if (!data.sexo) {
        errors.push('Sexo del infante (Femenino o Masculino)');
      }
      if (data.estaRegistrado === null) {
        errors.push('¿Se encuentra registrado ante el Registro Civil?');
      } else if (data.estaRegistrado === false && !data.razonNoRegistrado?.trim()) {
        errors.push('Razón por la que no se encuentra registrado ante el Registro Civil');
      }
      if (data.grupoEtnico === null) {
        errors.push('¿Su familia se encuentra dentro de algún grupo étnico?');
      } else if (data.grupoEtnico === true && !data.grupoEtnicoCual?.trim()) {
        errors.push('Especificar cuál grupo poblacional étnico');
      }
      if (data.situacionMigracion === null) {
        errors.push('¿Se encuentra en situación de migración?');
      }
      if (!data.altura?.trim()) {
        errors.push('Altura actual (Talla)');
      }
      if (!data.peso?.trim()) {
        errors.push('Peso actual');
      }
      if (data.alergias === null) {
        errors.push('¿Presenta alguna alergia a alimentos o ambiente?');
      } else if (data.alergias === true && !data.alergiasCual?.trim()) {
        errors.push('Especificar a qué elementos o alimentos presenta alergia');
      }
      break;
    }

    case 2: {
      if (data.afiliadoSalud === null) {
        errors.push('¿Afiliado a algún sistema de salud?');
      } else if (data.afiliadoSalud === true && !data.afiliadoSaludCual?.trim()) {
        errors.push('Especificar institución o sistema de salud');
      }
      if (data.enfermedadMedica === null) {
        errors.push('¿Tiene alguna enfermedad médica diagnosticada o en tratamiento?');
      } else if (data.enfermedadMedica === true && !data.enfermedadMedicaCual?.trim()) {
        errors.push('Especificar enfermedad médica y cuidados');
      }
      if (data.discapacidad === null) {
        errors.push('¿Tiene algún tipo de discapacidad diagnosticada?');
      } else if (data.discapacidad === true && !data.discapacidadCual?.trim()) {
        errors.push('Especificar tipo de discapacidad y grado de apoyo');
      }
      // NOTA: 'vacunas' es OPCIONAL por regla de negocio
      break;
    }

    case 3: {
      // Regla: Obligatorio al menos un responsable (Mamá, Papá o Cuidador)
      const hasMama = Boolean(data.mama?.nombre?.trim());
      const hasPapa = Boolean(data.papa?.nombre?.trim());
      const hasOtroCuidador = Boolean(data.otroCuidador?.nombre?.trim());

      if (!hasMama && !hasPapa && !hasOtroCuidador) {
        errors.push('Datos de al menos un responsable (debe registrar los datos de Mamá, Papá o Cuidador)');
      }

      if (data.viveAmbosPadres === null) {
        errors.push('¿La niña o el niño vive con ambos padres?');
      }
      if (!data.otrosFamiliaresConviven?.trim()) {
        errors.push('¿Con qué otros familiares vive en la misma casa?');
      }
      if (!data.nombreMascota?.trim()) {
        errors.push('¿Tiene mascota? y ¿Cómo se llama? (Especifique nombre o indique que no tiene)');
      }
      if (data.asistioOtrosServicios === null) {
        errors.push('¿Ha asistido a otros servicios de Educación Inicial?');
      } else if (data.asistioOtrosServicios === true) {
        if (!data.quienAsistioServicios?.trim()) {
          errors.push('¿Quién o quiénes asistieron a otros servicios?');
        }
        if (!data.modalidadOtrosServicios) {
          errors.push('Modalidad del servicio al que asistió (Escolarizada o No Escolarizada)');
        }
      }
      break;
    }

    case 4: {
      if (!data.rutinasDiarias?.trim()) {
        errors.push('Rutinas y hábitos diarios');
      }
      if (!data.rutinasAutocuidadoHigiene?.trim()) {
        errors.push('Rutinas de auto-cuidado e higiene');
      }
      if (!data.alimentos?.manana?.trim()) {
        errors.push('Consumo de alimentos en la Mañana');
      }
      if (!data.alimentos?.tarde?.trim()) {
        errors.push('Consumo de alimentos en la Tarde');
      }
      if (!data.alimentos?.noche?.trim()) {
        errors.push('Consumo de alimentos en la Noche');
      }
      if (!data.alimentosFavoritos?.trim()) {
        errors.push('Alimentos que más le gustan');
      }
      break;
    }

    case 5: {
      if (!data.juegoPreferencias?.trim()) {
        errors.push('Juego y recreación (¿Qué le gusta jugar?, ¿Con quién? y juguete favorito)');
      }
      if (!data.reglasAcuerdosCrianza?.trim()) {
        errors.push('Reglas y acuerdos de crianza en el hogar');
      }
      if (!data.estrategiasEmociones?.trim()) {
        errors.push('Estrategias para el manejo de emociones');
      }
      if (!data.descripcionDia?.trim()) {
        errors.push(`Descripción narrada de un día típico`);
      }
      break;
    }

    case 6: {
      if (!data.fortalezasYMejoras?.trim()) {
        errors.push('Fortalezas y aspectos a mejorar en los vínculos e interacción');
      }
      if (!data.motivoYExpectativas?.trim()) {
        errors.push('Motivación y expectativas del servicio');
      }
      if (!data.agenteEducativo?.nombre?.trim()) {
        errors.push('Nombre del Agente Educativo');
      }

      const tutorNombre =
        data.tutorResponsable?.nombre?.trim() ||
        data.mama?.nombre?.trim() ||
        data.papa?.nombre?.trim() ||
        data.otroCuidador?.nombre?.trim();

      if (!tutorNombre) {
        errors.push('Nombre de la Madre, Padre o Tutor Responsable que firmará');
      }
      if (!data.consentimientoAvisoPrivacidad) {
        errors.push('Aceptación del Aviso Legal y Protección de Datos Personales');
      }
      break;
    }

    default:
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Checks if a given step is completely filled.
 */
export const isStepComplete = (step: number, data: CharacterizationFormData): boolean => {
  return validateStep(step, data).isValid;
};

/**
 * Validates all form steps (1 through 6).
 */
export const validateAllSteps = (
  data: CharacterizationFormData
): { isValid: boolean; firstFailingStep?: number; errors: string[] } => {
  for (let step = 1; step <= 6; step++) {
    const result = validateStep(step, data);
    if (!result.isValid) {
      return {
        isValid: false,
        firstFailingStep: step,
        errors: result.errors,
      };
    }
  }

  return {
    isValid: true,
    errors: [],
  };
};
