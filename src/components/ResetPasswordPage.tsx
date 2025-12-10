import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../services/supabase';
import { Lock, Loader2, Check, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { useToast } from '../context/ToastContext';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validation States
  const [isPasswordLengthValid, setIsPasswordLengthValid] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  useEffect(() => {
    setIsPasswordLengthValid(password.length >= 6);
    setDoPasswordsMatch(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  // Verificar si hay una sesión válida al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          console.error('Error al verificar sesión:', error);
          setIsValidSession(false);
          return;
        }

        // Verificar si es una sesión de recuperación de contraseña
        if (session) {
          setIsValidSession(true);
        } else {
          setIsValidSession(false);
          showToast('El enlace de recuperación no es válido o ha expirado', 'error');
          setTimeout(() => navigate('/auth'), 2000);
        }
      } catch (err) {
        console.error('Error inesperado:', err);
        setIsValidSession(false);
      }
    };

    checkSession();
  }, [navigate, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordLengthValid || !doPasswordsMatch) {
      showToast('Por favor, verifica que las contraseñas cumplan los requisitos', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: password
      });

      if (error) throw error;

      showToast('✅ Contraseña actualizada correctamente', 'success');
      
      // Esperar 1.5 segundos y redirigir al login
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
    } catch (err: any) {
      console.error('Error al actualizar contraseña:', err);
      showToast(err.message || 'Error al actualizar la contraseña', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras se verifica la sesión
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión válida, no mostrar el formulario
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Enlace no válido o expirado</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 mb-2" textClassName="text-3xl" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
            Restablecer contraseña
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm text-center">
            Ingresa tu nueva contraseña para tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1 px-1">
              {isPasswordLengthValid ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"></div>
              )}
              <span className={`text-xs ${isPasswordLengthValid ? 'text-green-600' : 'text-gray-400'}`}>
                Mínimo 6 caracteres
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 mt-1 px-1">
              {doPasswordsMatch ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"></div>
              )}
              <span className={`text-xs ${doPasswordsMatch ? 'text-green-600' : 'text-gray-400'}`}>
                Las contraseñas coinciden
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isPasswordLengthValid || !doPasswordsMatch}
            className="w-full py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Actualizar contraseña
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
