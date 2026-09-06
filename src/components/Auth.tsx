import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, signUpWithEmail, requestPasswordReset } from '../services/auth';
import type { AuthSession } from '../services/auth';
import { Mail, Lock, Loader2, ArrowRight, User, Eye, EyeOff, Check } from 'lucide-react';
import { Logo } from './Logo';
import { useToast } from '../context/ToastContext';

interface Props {
  onAuthChange: (session: AuthSession | null) => void;
}

const Auth: React.FC<Props> = ({ onAuthChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validation States
  const [isPasswordLengthValid, setIsPasswordLengthValid] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  useEffect(() => {
    setIsPasswordLengthValid(password.length >= 6);
    setDoPasswordsMatch(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await requestPasswordReset(email);
        if (error) throw new Error(error.message || 'No se pudo enviar el email de recuperación');
        showToast('📧 Revisa tu email para restablecer tu contraseña', 'success');
        setIsForgotPassword(false);
        setEmail('');
      } else if (isLogin) {
        const { user, error } = await signInWithEmail(email, password);
        if (error || !user) throw new Error(error?.message || 'No se pudo iniciar sesión');
        onAuthChange({ user });
        showToast('¡Bienvenido de nuevo!', 'success');
        navigate('/app');
      } else {
        // Strict Frontend Validation
        if (!username.trim()) throw new Error("El nombre de usuario es obligatorio");
        if (password.length < 6) throw new Error("La contraseña es muy corta");
        if (password !== confirmPassword) throw new Error("Las contraseñas no coinciden");

        const { user, error: signUpError } = await signUpWithEmail(email, password, { username });
        if (signUpError || !user) throw new Error(signUpError?.message || 'No se pudo crear la cuenta');

        onAuthChange({ user });
        showToast('¡Registro exitoso! Revisa tu email para verificar tu cuenta.', 'success');
        navigate('/app');
      }
    } catch (err: any) {
      showToast(err.message || 'Ocurrió un error inesperado.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white dark:bg-[#18130D] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#241B10]/10 dark:border-[#F5E6CD]/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 mb-2" textClassName="text-3xl" />
          <h2 className="text-xl font-bold text-[#241B10] dark:text-[#F8F2E6] mt-4">
            {isForgotPassword
              ? 'Recuperar contraseña'
              : isLogin
                ? 'Bienvenido de nuevo'
                : 'Únete a nonnapp'}
          </h2>
          <p className="text-[#8C7C63] dark:text-[#7C715E] mt-2 text-sm text-center">
            {isForgotPassword
              ? 'Te enviaremos un email para restablecer tu contraseña.'
              : isLogin
                ? 'Accede para guardar tus recetas y preferencias.'
                : 'Crea tu perfil culinario y empieza a cocinar.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && !isForgotPassword && (
            <div className="animate-in slide-in-from-top-2 fade-in space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#3A2E1D] dark:text-[#D4D4D8]">Nombre de Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-[#8C7C63]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ChefMaster2025"
                    required={!isLogin && !isForgotPassword}
                    className="w-full pl-10 pr-4 py-3 bg-[#FCF6EC] dark:bg-[#221B12] border border-[#241B10]/15 dark:border-[#F5E6CD]/15 rounded-xl focus:bg-white dark:focus:bg-[#2A2114] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-[#241B10] dark:text-[#F8F2E6]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#3A2E1D] dark:text-[#D4D4D8]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[#8C7C63]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#FCF6EC] dark:bg-[#221B12] border border-[#241B10]/15 dark:border-[#F5E6CD]/15 rounded-xl focus:bg-white dark:focus:bg-[#2A2114] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-[#241B10] dark:text-[#F8F2E6]"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#3A2E1D] dark:text-[#D4D4D8]">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#8C7C63]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-[#FCF6EC] dark:bg-[#221B12] border border-[#241B10]/15 dark:border-[#F5E6CD]/15 rounded-xl focus:bg-white dark:focus:bg-[#2A2114] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-[#241B10] dark:text-[#F8F2E6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#8C7C63] hover:text-[#5C4E3A] dark:hover:text-[#D4D4D8] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {!isLogin && (
                  <div className="flex items-center gap-2 mt-1 px-1">
                    {isPasswordLengthValid ? <Check className="w-3 h-3 text-green-500" /> : <div className="w-3 h-3 rounded-full border border-[#241B10]/20 dark:border-[#F5E6CD]/15"></div>}
                    <span className={`text-xs ${isPasswordLengthValid ? 'text-green-600' : 'text-[#8C7C63]'}`}>Mínimo 6 caracteres</span>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-1 animate-in fade-in">
                  <label className="text-sm font-medium text-[#3A2E1D] dark:text-[#D4D4D8]">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#8C7C63]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 bg-[#FCF6EC] dark:bg-[#221B12] border border-[#241B10]/15 dark:border-[#F5E6CD]/15 rounded-xl focus:bg-white dark:focus:bg-[#2A2114] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-[#241B10] dark:text-[#F8F2E6]"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    {doPasswordsMatch ? <Check className="w-3 h-3 text-green-500" /> : <div className="w-3 h-3 rounded-full border border-[#241B10]/20 dark:border-[#F5E6CD]/15"></div>}
                    <span className={`text-xs ${doPasswordsMatch ? 'text-green-600' : 'text-[#8C7C63]'}`}>Las contraseñas coinciden</span>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setPassword('');
                    }}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading || (!isForgotPassword && !isLogin && (!isPasswordLengthValid || !doPasswordsMatch))}
            className="w-full py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isForgotPassword ? 'Enviar email' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isForgotPassword ? (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setEmail('');
              }}
              className="text-sm text-[#8C7C63] dark:text-[#7C715E] hover:text-primary font-medium"
            >
              ← Volver al inicio de sesión
            </button>
          ) : (
            <p className="text-sm text-[#8C7C63] dark:text-[#7C715E]">
              {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;