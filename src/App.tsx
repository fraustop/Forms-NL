import React, { useState, useEffect } from 'react';
import type { CharacterizationFormData } from './types/form';
import { INITIAL_FORM_DATA } from './types/form';
import { Header } from './components/layout/Header';
import { StepperNav, STEPS } from './components/layout/StepperNav';
import { Step1GeneralInfo } from './components/steps/Step1GeneralInfo';
import { Step2HealthAndVaccines } from './components/steps/Step2HealthAndVaccines';
import { Step3FamilyAndHome } from './components/steps/Step3FamilyAndHome';
import { Step4RoutinesAndNutrition } from './components/steps/Step4RoutinesAndNutrition';
import { Step5PlayAndEmotions } from './components/steps/Step5PlayAndEmotions';
import { Step6RelationshipsAndSignatures } from './components/steps/Step6RelationshipsAndSignatures';
import { PrintableDocument } from './components/preview/PrintableDocument';
import { SaveFirestoreModal } from './components/common/SaveFirestoreModal';
import { ValidationErrorModal } from './components/common/ValidationErrorModal';
import { ResponsesDashboard } from './components/admin/ResponsesDashboard';
import { SAMPLE_FORM_DATA } from './utils/sampleData';
import { saveFormToFirestore } from './services/formService';
import { subscribeToAuthChanges } from './services/authService';
import { validateStep, validateAllSteps, isStepComplete } from './utils/formValidation';
import type { User } from 'firebase/auth';
import { ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'nl_caracterizacion_infantil_form_draft_v1';

export const App: React.FC = () => {
  // Current view: 'form' (?Form1) or 'respuestas' (?Respuestas)
  const [view, setView] = useState<'form' | 'respuestas'>(() => {
    const search = window.location.search.toLowerCase();
    if (search.includes('respuestas') || search.includes('panel') || search.includes('admin')) {
      return 'respuestas';
    }
    return 'form';
  });

  // Current authenticated user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize form state from LocalStorage if exists
  const [formData, setFormData] = useState<CharacterizationFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved draft from localStorage', e);
    }
    return INITIAL_FORM_DATA;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);
  const [previewDocumentData, setPreviewDocumentData] = useState<CharacterizationFormData | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Guardado automático activo');

  // Locked Submission State
  const [isSubmittedLocked, setIsSubmittedLocked] = useState<boolean>(false);
  const [submittedFormData, setSubmittedFormData] = useState<CharacterizationFormData | null>(null);

  // Validation Error Modal state
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean;
    stepTitle: string;
    errors: string[];
    isSubmitting?: boolean;
  }>({
    isOpen: false,
    stepTitle: '',
    errors: [],
    isSubmitting: false,
  });

  // Firestore Save state
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);
  const [saveModal, setSaveModal] = useState<{
    isOpen: boolean;
    documentId: string;
    folio: string;
  }>({
    isOpen: false,
    documentId: '',
    folio: '',
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to URL changes (back/forward buttons) & block return if form is submitted
  useEffect(() => {
    const handlePopState = () => {
      if (isSubmittedLocked) {
        // Bloquear el retroceso al formulario editable
        window.history.pushState({ locked: true }, '', window.location.href);
        return;
      }

      const search = window.location.search.toLowerCase();
      if (search.includes('respuestas') || search.includes('panel') || search.includes('admin')) {
        setView('respuestas');
      } else {
        setView('form');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSubmittedLocked]);

  // Reset & Start a New Form cleanly
  const handleStartNewForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setSubmittedFormData(null);
    setIsSubmittedLocked(false);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStep(1);
    setShowPrintPreview(false);
    setPreviewDocumentData(null);
    setSaveModal({ isOpen: false, documentId: '', folio: '' });
    setValidationModal({ isOpen: false, stepTitle: '', errors: [], isSubmitting: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch view helper and update browser URL parameter
  const navigateTo = (targetView: 'form' | 'respuestas') => {
    setView(targetView);
    setShowPrintPreview(false);
    setPreviewDocumentData(null);
    const newUrl = targetView === 'respuestas' ? '?Respuestas' : '?Form1';
    window.history.pushState({}, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-save to localStorage whenever formData changes (only if not locked)
  useEffect(() => {
    if (isSubmittedLocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      const now = new Date();
      setLastSavedTime(`Guardado ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (e) {
      console.error('Failed to auto-save to localStorage', e);
    }
  }, [formData, isSubmittedLocked]);

  const updateFormData = (fields: Partial<CharacterizationFormData>) => {
    if (isSubmittedLocked) return;
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  // Save to Firebase Firestore
  const handleSaveToFirestore = async () => {
    // Validar todas las preguntas obligatorias del formulario completo
    const allValidation = validateAllSteps(formData);
    if (!allValidation.isValid) {
      const stepNum = allValidation.firstFailingStep || 1;
      setCurrentStep(stepNum);
      setValidationModal({
        isOpen: true,
        stepTitle: STEPS.find((s) => s.id === stepNum)?.title || `Paso ${stepNum}`,
        errors: allValidation.errors,
        isSubmitting: true,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSavingToCloud(true);
    try {
      const res = await saveFormToFirestore(formData);
      if (res.success && res.id && res.folio) {
        // Guardar copia del formulario enviado y bloquear el estado
        setSubmittedFormData({ ...formData });
        setIsSubmittedLocked(true);
        localStorage.removeItem(STORAGE_KEY);
        window.history.pushState({ locked: true }, '', window.location.href);

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#006674', '#EBA83A', '#3B9E78', '#E86A58', '#38BDF8'],
        });

        setSaveModal({
          isOpen: true,
          documentId: res.id,
          folio: res.folio,
        });
      } else {
        alert(`No se pudo guardar en Firestore: ${res.error || 'Error desconocido'}`);
      }
    } catch (err: any) {
      console.error('Error guardando en Firestore:', err);
      alert(`Error al guardar en Firestore: ${err?.message || err}`);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Calculate completion percentage
  const calculateProgress = (): number => {
    const completedCount = STEPS.filter((s) => isStepComplete(s.id, formData)).length;
    return Math.round((completedCount / STEPS.length) * 100);
  };

  // Check completed steps (accurately using validation logic)
  const completedSteps: number[] = STEPS.map((s) => s.id).filter((stepId) =>
    isStepComplete(stepId, formData)
  );

  // Export JSON
  const handleExportJSON = () => {
    const cleanName = (formData.nombreCompleto || 'Formato_Caracterizacion')
      .trim()
      .replace(/\s+/g, '_');
    const filename = `Caracterizacion_${cleanName}_${formData.fecha || 'NL'}.json`;

    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (importedData: CharacterizationFormData) => {
    setFormData(importedData);
    alert('¡Expediente cargado exitosamente!');
  };

  // Reset Form
  const handleReset = () => {
    if (window.confirm('¿Está seguro de reiniciar el formulario? Se borrarán los datos ingresados actualmente.')) {
      setFormData(INITIAL_FORM_DATA);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(1);
    }
  };

  // Fill Sample Data
  const handleFillSample = () => {
    setFormData(SAMPLE_FORM_DATA);
    setLastSavedTime('Datos de ejemplo cargados');
  };

  // Navigation handlers
  const nextStep = () => {
    // Validar preguntas obligatorias del paso actual antes de avanzar
    const stepValidation = validateStep(currentStep, formData);
    if (!stepValidation.isValid) {
      setValidationModal({
        isOpen: true,
        stepTitle: STEPS.find((s) => s.id === currentStep)?.title || `Paso ${currentStep}`,
        errors: stepValidation.errors,
        isSubmitting: false,
      });
      return;
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPreviewDocumentData(formData);
      setShowPrintPreview(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render Step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralInfo data={formData} updateData={updateFormData} />;
      case 2:
        return <Step2HealthAndVaccines data={formData} updateData={updateFormData} />;
      case 3:
        return <Step3FamilyAndHome data={formData} updateData={updateFormData} />;
      case 4:
        return <Step4RoutinesAndNutrition data={formData} updateData={updateFormData} />;
      case 5:
        return <Step5PlayAndEmotions data={formData} updateData={updateFormData} />;
      case 6:
        return (
          <Step6RelationshipsAndSignatures
            data={formData}
            updateData={updateFormData}
            onSaveToCloud={handleSaveToFirestore}
            isSavingToCloud={isSavingToCloud}
          />
        );
      default:
        return <Step1GeneralInfo data={formData} updateData={updateFormData} />;
    }
  };

  // If Print Preview is active (either from current form, submitted document, or from Admin panel item)
  if (showPrintPreview && (previewDocumentData || submittedFormData || formData)) {
    return (
      <PrintableDocument
        data={previewDocumentData || submittedFormData || formData}
        onClose={() => {
          if (isSubmittedLocked) {
            setShowPrintPreview(false);
            setSaveModal((prev) => ({ ...prev, isOpen: true }));
          } else {
            setShowPrintPreview(false);
            setPreviewDocumentData(null);
          }
        }}
        isReadOnlySubmitted={isSubmittedLocked}
        onNewForm={handleStartNewForm}
        onNavigateToResponses={() => navigateTo('respuestas')}
      />
    );
  }

  // If viewing Responses Dashboard (?Respuestas)
  if (view === 'respuestas') {
    return (
      <ResponsesDashboard
        currentUser={currentUser}
        onNavigateToForm={() => navigateTo('form')}
        onPreviewFormPDF={(docData) => {
          setPreviewDocumentData(docData);
          setShowPrintPreview(true);
        }}
      />
    );
  }

  // Default: Viewing Characterization Form (?Form1)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Save to Firestore Success Full Screen Modal */}
      <SaveFirestoreModal
        isOpen={saveModal.isOpen}
        documentId={saveModal.documentId}
        folio={saveModal.folio}
        childName={submittedFormData?.nombreCompleto || formData.nombreCompleto}
        onViewSubmittedResponses={() => {
          setSaveModal((prev) => ({ ...prev, isOpen: false }));
          setPreviewDocumentData(submittedFormData || formData);
          setShowPrintPreview(true);
        }}
        onNewForm={handleStartNewForm}
      />

      {/* Required Validation Error Modal */}
      <ValidationErrorModal
        isOpen={validationModal.isOpen}
        stepTitle={validationModal.stepTitle}
        errors={validationModal.errors}
        isSubmitting={validationModal.isSubmitting}
        onClose={() => setValidationModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Main App Header */}
      <Header
        onOpenPrintPreview={() => {
          setPreviewDocumentData(formData);
          setShowPrintPreview(true);
        }}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onReset={handleReset}
        onFillSampleData={handleFillSample}
        onNavigateToResponses={() => navigateTo('respuestas')}
        lastSavedText={lastSavedTime}
        completionPercentage={calculateProgress()}
      />

      {/* Stepper & Form Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 pb-28">
        {/* Step Navigation Bar */}
        <StepperNav
          currentStep={currentStep}
          onSelectStep={(stepId) => {
            setCurrentStep(stepId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          completedSteps={completedSteps}
        />

        {/* Active Step with Framer Motion Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="text-xs font-semibold text-slate-500 hidden sm:block">
            Paso <strong className="text-slate-800">{currentStep}</strong> de{' '}
            <strong className="text-slate-800">{STEPS.length}</strong>
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all text-white bg-gradient-to-r from-nl-petrol to-teal-700 hover:from-nl-petrol-dark hover:to-teal-800 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveToFirestore}
                disabled={isSavingToCloud}
                className="px-8 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-75"
              >
                {isSavingToCloud ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
