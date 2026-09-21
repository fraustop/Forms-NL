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
import { ResponsesDashboard } from './components/admin/ResponsesDashboard';
import { SAMPLE_FORM_DATA } from './utils/sampleData';
import { saveFormToFirestore } from './services/formService';
import { subscribeToAuthChanges } from './services/authService';
import type { User } from 'firebase/auth';
import { ArrowLeft, ArrowRight, Printer, Sparkles, CloudUpload, Loader2 } from 'lucide-react';
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

  // Listen to URL changes (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const search = window.location.search.toLowerCase();
      if (search.includes('respuestas') || search.includes('panel') || search.includes('admin')) {
        setView('respuestas');
      } else {
        setView('form');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Switch view helper and update browser URL parameter
  const navigateTo = (targetView: 'form' | 'respuestas') => {
    setView(targetView);
    setShowPrintPreview(false);
    setPreviewDocumentData(null);
    const newUrl = targetView === 'respuestas' ? '?Respuestas' : '?Form1';
    window.history.pushState({}, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      const now = new Date();
      setLastSavedTime(`Guardado ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (e) {
      console.error('Failed to auto-save to localStorage', e);
    }
  }, [formData]);

  const updateFormData = (fields: Partial<CharacterizationFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  // Save to Firebase Firestore
  const handleSaveToFirestore = async () => {
    if (!formData.nombreCompleto) {
      alert('Por favor ingrese al menos el nombre de la niña o niño antes de guardar en Firestore.');
      setCurrentStep(1);
      return;
    }

    setIsSavingToCloud(true);
    try {
      const res = await saveFormToFirestore(formData);
      if (res.success && res.id && res.folio) {
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
    let score = 0;
    let total = 10;

    if (formData.nombreCompleto) score++;
    if (formData.fechaNacimiento) score++;
    if (formData.sexo) score++;
    if (formData.afiliadoSalud !== null) score++;
    if (Object.keys(formData.vacunas || {}).length > 0) score++;
    if (formData.mama?.nombre || formData.papa?.nombre) score++;
    if (formData.rutinasDiarias) score++;
    if (formData.alimentos?.manana || formData.alimentos?.tarde) score++;
    if (formData.juegoPreferencias || formData.estrategiasEmociones) score++;
    if (formData.agenteEducativo?.nombre || formData.tutorResponsable?.nombre) score++;

    return Math.round((score / total) * 100);
  };

  // Check completed steps
  const completedSteps: number[] = [];
  if (formData.nombreCompleto && formData.fechaNacimiento) completedSteps.push(1);
  if (formData.afiliadoSalud !== null || Object.keys(formData.vacunas || {}).length > 0) completedSteps.push(2);
  if (formData.mama?.nombre || formData.papa?.nombre || formData.otroCuidador?.nombre) completedSteps.push(3);
  if (formData.rutinasDiarias || formData.alimentos?.manana) completedSteps.push(4);
  if (formData.juegoPreferencias || formData.estrategiasEmociones) completedSteps.push(5);
  if (formData.consentimientoAvisoPrivacidad) completedSteps.push(6);

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
            onOpenPrintPreview={() => {
              setPreviewDocumentData(formData);
              setShowPrintPreview(true);
            }}
            onSaveToCloud={handleSaveToFirestore}
            isSavingToCloud={isSavingToCloud}
          />
        );
      default:
        return <Step1GeneralInfo data={formData} updateData={updateFormData} />;
    }
  };

  // If Print Preview is active (either from current form or from Admin panel item)
  if (showPrintPreview && (previewDocumentData || formData)) {
    return (
      <PrintableDocument
        data={previewDocumentData || formData}
        onClose={() => {
          setShowPrintPreview(false);
          setPreviewDocumentData(null);
        }}
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
      {/* Save to Firestore Success Modal */}
      <SaveFirestoreModal
        isOpen={saveModal.isOpen}
        onClose={() => setSaveModal((prev) => ({ ...prev, isOpen: false }))}
        documentId={saveModal.documentId}
        folio={saveModal.folio}
        childName={formData.nombreCompleto}
        onOpenPrint={() => {
          setPreviewDocumentData(formData);
          setShowPrintPreview(true);
        }}
        onNewForm={() => {
          setFormData(INITIAL_FORM_DATA);
          localStorage.removeItem(STORAGE_KEY);
          setCurrentStep(1);
        }}
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
            {currentStep === 6 && (
              <button
                type="button"
                onClick={handleSaveToFirestore}
                disabled={isSavingToCloud}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow transition-colors cursor-pointer"
              >
                {isSavingToCloud ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CloudUpload className="w-3.5 h-3.5" />
                )}
                <span>Guardar en Firestore</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setPreviewDocumentData(formData);
                setShowPrintPreview(true);
              }}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Ver Formato PDF</span>
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all text-white bg-gradient-to-r from-nl-petrol to-teal-700 hover:from-nl-petrol-dark hover:to-teal-800 shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{currentStep === 6 ? 'Finalizar y Ver PDF' : 'Siguiente'}</span>
              {currentStep === 6 ? <Sparkles className="w-4 h-4 text-amber-300" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
