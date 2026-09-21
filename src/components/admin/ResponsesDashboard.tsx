import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import type { CharacterizationFormData } from '../../types/form';
import type { StoredFormDetail } from '../../services/formService';
import { fetchAllFormDetails, deleteFormDocument, exportFormsToCSV } from '../../services/formService';
import { loginWithGoogle, loginWithEmail, logout, checkIsAdmin } from '../../services/authService';
import { AUTHORIZED_ADMIN_EMAIL } from '../../firebase/config';
import { NuevoLeonHeader, SunIllustration } from '../common/BrandAssets';
import {
  Shield,
  Lock,
  LogOut,
  FileSpreadsheet,
  Printer,
  Trash2,
  Search,
  RefreshCw,
  Users,
  Baby,
  Activity,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  Download,
} from 'lucide-react';

interface ResponsesDashboardProps {
  currentUser: User | null;
  onNavigateToForm: () => void;
  onPreviewFormPDF: (formData: CharacterizationFormData) => void;
}

export const ResponsesDashboard: React.FC<ResponsesDashboardProps> = ({
  currentUser,
  onNavigateToForm,
  onPreviewFormPDF,
}) => {
  const [forms, setForms] = useState<StoredFormDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Email / Password Form State
  const [emailInput, setEmailInput] = useState<string>(AUTHORIZED_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState<string>('');

  const isAdmin = checkIsAdmin(currentUser);

  const loadData = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAllFormDetails();
      setForms(data);
    } catch (err: any) {
      console.error('Error cargando respuestas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentUser, isAdmin]);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    const res = await loginWithGoogle();
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'Error al iniciar sesión con Google.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setAuthError('Por favor ingresa correo y contraseña.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    const res = await loginWithEmail(emailInput, passwordInput);
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'Error al autenticar.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Está seguro de eliminar el registro de "${name}"? Esta acción no se puede deshacer.`)) {
      const ok = await deleteFormDocument(id);
      if (ok) {
        setForms((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert('No se pudo eliminar el documento.');
      }
    }
  };

  const handleDownloadJSON = (item: StoredFormDetail) => {
    const cleanName = (item.data.nombreCompleto || 'Formato').trim().replace(/\s+/g, '_');
    const blob = new Blob([JSON.stringify(item.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Expediente_${cleanName}_${item.folio}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter forms by search query
  const filteredForms = forms.filter((f) => {
    const term = searchTerm.toLowerCase();
    const name = (f.data.nombreCompleto || '').toLowerCase();
    const folio = (f.folio || '').toLowerCase();
    const mom = (f.data.mama?.nombre || '').toLowerCase();
    const dad = (f.data.papa?.nombre || '').toLowerCase();
    return name.includes(term) || folio.includes(term) || mom.includes(term) || dad.includes(term);
  });

  // Calculate stats
  const totalSubmissions = forms.length;
  const totalGirls = forms.filter((f) => f.data.sexo === 'F').length;
  const totalBoys = forms.filter((f) => f.data.sexo === 'M').length;
  const totalInsured = forms.filter((f) => f.data.afiliadoSalud === true).length;

  // ----------------------------------------------------
  // VISTA 1: Usuario NO Autenticado (Formulario de Login)
  // ----------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
        <div className="max-w-4xl mx-auto w-full px-4 pt-6">
          <NuevoLeonHeader />
        </div>

        <div className="max-w-md w-full mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-nl-petrol flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Shield className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold font-display text-slate-800 mb-1">
              Panel de Respuestas
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Acceso restringido para el personal administrativo y educativo de Nuevo León.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-6 text-left flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-tight">
                <strong>Correo Administrador Autorizado:</strong>
                <div className="font-mono font-bold text-nl-petrol mt-0.5">{AUTHORIZED_ADMIN_EMAIL}</div>
              </div>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 text-xs text-rose-700 text-left flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold text-sm shadow-sm flex items-center justify-center gap-3 transition-all hover:border-nl-petrol cursor-pointer mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">o con contraseña</span>
              </div>
            </div>

            {/* Email Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="jazmin2898@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-nl-petrol"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Contraseña:</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-nl-petrol"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-nl-petrol hover:bg-nl-petrol-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Ingresar al Panel</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
              <button
                type="button"
                onClick={onNavigateToForm}
                className="text-xs text-nl-petrol hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ir al Formulario de Llenado (?Form1)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pb-6">
          Educación Inicial • Subsecretaría de Educación Básica de Nuevo León
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VISTA 2: Usuario Autenticado pero NO Autorizado
  // ----------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
        <div className="max-w-4xl mx-auto w-full px-4 pt-6">
          <NuevoLeonHeader />
        </div>

        <div className="max-w-md w-full mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-rose-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold font-display text-slate-800 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              La cuenta conectada (<strong>{currentUser.email}</strong>) no tiene permisos de administrador para consultar las respuestas de caracterización.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-6 text-xs text-amber-900 text-left">
              Solo la cuenta registrada <strong>{AUTHORIZED_ADMIN_EMAIL}</strong> tiene acceso a este módulo.
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={logout}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión / Cambiar Cuenta</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToForm}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Formulario (?Form1)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pb-6">
          Educación Inicial • Gobierno de Nuevo León
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VISTA 3: Panel de Respuestas AUTORIZADO (Admin)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <NuevoLeonHeader className="py-2" />

          {/* Admin Navigation Bar */}
          <div className="py-3 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-nl-petrol flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  Panel de Respuestas Recibidas
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Firestore Cloud
                  </span>
                </h1>
                <div className="text-xs text-slate-500">
                  Sesión activa: <strong className="text-nl-petrol">{currentUser.email}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={onNavigateToForm}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Llenar Formulario (?Form1)</span>
              </button>

              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-nl-petrol hover:bg-teal-50 transition-colors cursor-pointer"
                title="Actualizar lista"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => exportFormsToCSV(forms)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar a Excel / CSV</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-nl-petrol-soft text-nl-petrol flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalSubmissions}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Registros
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalGirls}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Niñas (F)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalBoys}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Niños (M)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalInsured}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Con Sistema de Salud
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre del menor, folio o padre/madre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-nl-petrol bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold self-end sm:self-auto">
            Mostrando <strong className="text-slate-800">{filteredForms.length}</strong> de{' '}
            <strong className="text-slate-800">{forms.length}</strong> registros
          </div>
        </div>

        {/* Responses Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-nl-petrol" />
              <p className="text-sm font-semibold">Cargando respuestas desde Firestore...</p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <SunIllustration className="w-12 h-12 mx-auto opacity-50" />
              <p className="text-sm font-bold text-slate-600">No se encontraron respuestas registradas.</p>
              <p className="text-xs text-slate-400">
                {searchTerm ? 'Intenta con otro término de búsqueda.' : 'Las respuestas guardadas desde el formulario aparecerán aquí.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Folio / Fecha</th>
                    <th className="py-3.5 px-4">Nombre de la Niña / Niño</th>
                    <th className="py-3.5 px-4">Edad y Sexo</th>
                    <th className="py-3.5 px-4">Familia / Contacto</th>
                    <th className="py-3.5 px-4">Salud y Vacunas</th>
                    <th className="py-3.5 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredForms.map((item) => {
                    const vaccineCount = Object.values(item.data.vacunas || {}).reduce((acc, curr) => {
                      return acc + Object.values(curr || {}).filter(Boolean).length;
                    }, 0);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        {/* Folio & Date */}
                        <td className="py-3.5 px-4 align-top">
                          <span className="font-mono font-bold text-nl-petrol block text-xs">
                            {item.folio}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {item.createdAtText}
                          </span>
                        </td>

                        {/* Child Name */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-slate-900 text-sm">
                            {item.data.nombreCompleto || 'Sin nombre registrado'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Nacimiento: {item.data.fechaNacimiento || 'N/D'}
                          </div>
                        </td>

                        {/* Age & Sex */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                item.data.sexo === 'F'
                                  ? 'bg-rose-100 text-rose-800'
                                  : item.data.sexo === 'M'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {item.data.sexo === 'F' ? '👧 Femenino' : item.data.sexo === 'M' ? '👦 Masculino' : 'N/D'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 font-semibold mt-1">
                            {item.data.edadAnos || item.data.edadMeses
                              ? `${item.data.edadAnos || 0}a, ${item.data.edadMeses || 0}m`
                              : 'Edad N/D'}
                          </div>
                        </td>

                        {/* Family Data */}
                        <td className="py-3.5 px-4 align-top text-[11px]">
                          {item.data.mama?.nombre && (
                            <div className="text-slate-700">
                              <strong>Mamá:</strong> {item.data.mama.nombre}
                              {item.data.mama.celular && (
                                <span className="text-slate-500 block text-[10px]">
                                  Tel: {item.data.mama.celular}
                                </span>
                              )}
                            </div>
                          )}
                          {item.data.papa?.nombre && (
                            <div className="text-slate-700 mt-0.5">
                              <strong>Papá:</strong> {item.data.papa.nombre}
                            </div>
                          )}
                        </td>

                        {/* Health & Vaccines */}
                        <td className="py-3.5 px-4 align-top text-[11px]">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Activity className="w-3.5 h-3.5 text-teal-600" />
                            <span>{item.data.afiliadoSaludCual || (item.data.afiliadoSalud ? 'Afiliado' : 'Sin afiliación')}</span>
                          </div>
                          <div className="text-[10px] text-emerald-700 font-bold mt-1">
                            {vaccineCount} dosis marcadas
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 align-top text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* View / Print PDF */}
                            <button
                              type="button"
                              onClick={() => onPreviewFormPDF(item.data)}
                              className="p-1.5 rounded-lg bg-teal-50 text-nl-petrol hover:bg-teal-100 font-bold transition-colors cursor-pointer"
                              title="Ver e Imprimir Formato PDF Oficial (8 Páginas)"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Download JSON */}
                            <button
                              type="button"
                              onClick={() => handleDownloadJSON(item)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="Descargar expediente JSON"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {/* Delete Document */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.data.nombreCompleto)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
