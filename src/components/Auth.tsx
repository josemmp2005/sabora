import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, signUpWithEmail, upsertUserProfile } from '../services/supabase';
import { Mail, Lock, Loader2, ArrowRight, User, Eye, EyeOff, Check, X } from 'lucide-react';
import { Logo } from './Logo';
import { useToast } from '../context/ToastContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
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
      if (isLogin) {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        showToast('¡Bienvenido de nuevo!', 'success');
        navigate('/app');
      } else {
        // Strict Frontend Validation
        if (!username.trim()) throw new Error("El nombre de usuario es obligatorio");
        if (password.length < 6) throw new Error("La contraseña es muy corta");
        if (password !== confirmPassword) throw new Error("Las contraseñas no coinciden");

        const { data, error: signUpError } = await signUpWithEmail(email, password, { 
          username 
        });
        
        if (signUpError) throw signUpError;
        
        const userId = data.user?.id;
        if (!userId) throw new Error("No se pudo crear el usuario ID");

        await upsertUserProfile(userId, { 
          email, 
          username
        });

        showToast('¡Registro exitoso! Revisa tu email.', 'success');
        setIsLogin(true);
        resetForm();
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 mb-2" textClassName="text-3xl" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
            {isLogin ? 'Bienvenido de nuevo' : 'Únete a Sabora'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm text-center">
            {isLogin 
              ? 'Accede para guardar tus recetas y preferencias.' 
              : 'Crea tu perfil culinario y empieza a cocinar.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div className="animate-in slide-in-from-top-2 fade-in space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ChefMaster2025"
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
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
            
            {!isLogin && (
               <div className="flex items-center gap-2 mt-1 px-1">
                  {isPasswordLengthValid ? <Check className="w-3 h-3 text-green-500" /> : <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"></div>}
                  <span className={`text-xs ${isPasswordLengthValid ? 'text-green-600' : 'text-gray-400'}`}>Mínimo 6 caracteres</span>
               </div>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-1 animate-in fade-in">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2 mt-1 px-1">
                  {doPasswordsMatch ? <Check className="w-3 h-3 text-green-500" /> : <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"></div>}
                  <span className={`text-xs ${doPasswordsMatch ? 'text-green-600' : 'text-gray-400'}`}>Las contraseñas coinciden</span>
               </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (!isLogin && (!isPasswordLengthValid || !doPasswordsMatch))}
            className="w-full py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? " }
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
        </div>
      </div>
    </div>
  );
};

export default Auth;