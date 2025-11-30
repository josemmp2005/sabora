import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Heart, Check, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-10 animate-in fade-in duration-700">
      <section className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl overflow-hidden text-white shadow-2xl shadow-orange-200/50 dark:shadow-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative px-8 py-20 md:py-32 text-center max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span>Potenciado por Gemini 2.5 Flash</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Sabora: Tu Chef Personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-100">
              Impulsado por IA
            </span>
          </h1>
          <p className="text-lg md:text-xl text-orange-50 leading-relaxed max-w-2xl mx-auto">
            Convierte lo que tienes en tu nevera en recetas gourmet. Sin desperdicios, 
            personalizado a tus gustos y con instrucciones paso a paso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/app" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 font-bold rounded-xl shadow-xl hover:bg-gray-50 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Logo className="w-6 h-6" showText={false} />
              Empezar a Cocinar
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-8 py-4 bg-orange-700/30 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-orange-700/50 transition-all text-center"
            >
              Ver Funcionalidades
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cocina más inteligente, no más difícil</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3">Tecnología de vanguardia aplicada a tu alimentación diaria.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Modo Despensa</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              ¿No sabes qué hacer con un tomate y dos huevos? Sabora crea recetas increíbles con lo que ya tienes. Adiós al desperdicio.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Salud y Macros</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Cada receta incluye un desglose nutricional detallado (Calorías, Proteínas, Carbs) adaptado a tu perfil dietético.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Visualización IA</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              No imagines el resultado. Utilizamos modelos de generación de imagen avanzados para mostrarte cómo debe quedar tu plato.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative">
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800/50 transform -skew-y-3 scale-110 z-0 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Planes Flexibles</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Empieza gratis y mejora cuando quieras.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chef Amateur</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">€0</span>
                <span className="text-gray-500 dark:text-gray-400">/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  5 Recetas diarias
                </li>
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Modo Despensa básico
                </li>
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Cálculo de calorías simple
                </li>
                <li className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                  <span className="w-5 h-5 block text-center text-xs font-bold">✕</span>
                  Sin generación de imágenes
                </li>
              </ul>
              <Link to="/app" className="block w-full py-3 px-6 text-center rounded-xl border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Empezar Gratis
              </Link>
            </div>

            <div className="bg-gray-900 dark:bg-black p-8 rounded-3xl shadow-xl text-white relative overflow-hidden transform md:-translate-y-4 border border-gray-800 dark:border-gray-700">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                RECOMENDADO
              </div>
              <h3 className="text-2xl font-bold mb-2">Master Chef</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">€9.99</span>
                <span className="text-gray-400">/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="font-semibold text-white">Recetas Ilimitadas</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="font-semibold text-white">Imágenes 4K (Nano Banana)</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  Historial ilimitado en la nube
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  Soporte prioritario
                </li>
              </ul>
              <Link to="/app" className="block w-full py-3 px-6 text-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                Obtener Pro
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <div className="text-center pt-10 border-t border-gray-200 dark:border-gray-700 mt-10">
         <Link to="/app" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            Saltar introducción e ir a la cocina <ArrowRight className="w-4 h-4" />
         </Link>
      </div>
    </div>
  );
};

export default LandingPage;