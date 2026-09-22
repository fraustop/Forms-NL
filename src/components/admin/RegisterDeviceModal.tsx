import React, { useState } from 'react';
import { Shield, KeyRound, Bell, Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import { registerDeviceWithPassword, isDeviceLocallyRegistered } from '../../services/notificationService';
import type { User } from 'firebase/auth';

interface RegisterDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onRegistrationSuccess: () => void;
}

export const RegisterDeviceModal: React.FC<RegisterDeviceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRegistrationSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAlreadyRegistered = isDeviceLocallyRegistered();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Por favor ingresa la contraseña de autorización.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const res = await registerDeviceWithPassword(password, currentUser);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      onRegistrationSuccess();
      setTimeout(() => {
        onClose();
        setPassword('');
        setSuccessMsg(null);
      }, 2000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-200 text-center relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 shadow-sm ring-8 ring-amber-50">
          <Bell className="w-8 h-8 text-amber-600" />
        </div>

        <h3 className="text-xl font-bold font-display text-slate-900 mb-1">
          Registro de Dispositivo para Alertas
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Ingresa la contraseña de seguridad para vincular este navegador y recibir notificaciones sonoras e instantáneas en cuanto se llene un nuevo formulario.
        </p>

        {isAlreadyRegistered && !successMsg && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 mb-4 text-xs text-teal-800 font-semibold flex items-center gap-2 text-left">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Este dispositivo ya cuenta con un registro activo. Puedes revalidarlo si lo deseas.</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 text-xs text-rose-700 font-semibold flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-4 text-xs text-emerald-800 font-bold flex items-center gap-2 text-left animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Contraseña de Seguridad de Notificaciones:</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña maestra..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-nl-petrol bg-slate-50 focus:bg-white"
              autoFocus
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Clave predeterminada: <strong className="text-slate-600 font-mono">EduInicialNL2026</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-nl-petrol to-teal-700 hover:from-nl-petrol-dark hover:to-teal-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validando y Registrando...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-amber-300" />
                <span>Autorizar y Registrar Dispositivo</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
