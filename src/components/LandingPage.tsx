import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ChefHat, PlayCircle, Check, Utensils, Star, Flower2 } from 'lucide-react';
import tomatoSoup from '../assets/tomato-soup.webp';

const LandingPage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 md:pt-24 md:pb-32">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-orange-200 to-red-200 dark:from-orange-900/20 dark:to-red-900/20 rounded-full blur-[100px] -z-10 opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-yellow-200 dark:bg-yellow-900/10 rounded-full blur-[120px] -z-10 opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text Content */}
            <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-white/5 border border-orange-100 dark:border-white/10 backdrop-blur-sm shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide">La tradición se encuentra con la IA</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
                    La sabiduría de <br /> la <span className=''>Nonna</span>, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-500">
                        la potencia de la IA
                    </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Nonnapp cocina como lo haría ella: con amor, sin desperdiciar nada y creando magia con lo que tienes en la despensa.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                    <Link to="/app" className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95">
                        <Utensils className="w-6 h-6" />
                        Entrar a la Cocina
                    </Link>
                    <Link to="/auth" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                        <PlayCircle className="w-6 h-6 text-gray-400" />
                        Ver Demo
                    </Link>
                </div>
            </div>

            {/* Visual Mockup - Bento Style */}
            <div className="relative animate-in slide-in-from-right-10 fade-in duration-1000 delay-200 mt-10 lg:mt-0">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-[2rem] shadow-xl space-y-3 col-span-2 row-span-2 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <ChefHat className="w-6 h-6 text-primary" />
                         </div>
                         <div>
                            <div className="font-bold text-gray-900 dark:text-white">Modo Nonna</div>
                            <div className="text-xs text-gray-500">"Tengo huevos, tomate y pan duro"</div>
                         </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-3 text-sm text-gray-600 dark:text-gray-300 italic border-l-4 border-primary">
                         "¡Bambino! No tires ese pan. Vamos a hacer una Pappa al Pomodoro toscana. ¡Espectacular!"
                      </div>
                        <img src={tomatoSoup} className="rounded-xl w-full h-50 object-cover" alt="Tomato Soup" />
                    </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-[2rem] shadow-lg flex flex-col justify-center items-center text-white text-center">
                      <Sparkles className="w-8 h-8 mb-2" />
                      <div className="font-bold text-2xl">4K</div>
                      <div className="text-xs opacity-90">Fotos Reales</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-[2rem] shadow-lg flex flex-col justify-center items-center border border-gray-100 dark:border-gray-700">
                      <div className="text-3xl">🍝</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-1">100%</div>
                      <div className="text-xs text-gray-500">Italian Vibe</div>
                  </div>
               </div>
            </div>
        </div>
      </div>

      {/* Origin Story Section */}
      <section className="py-20 relative">
         <div className="absolute inset-0 bg-orange-50 dark:bg-orange-900/10 -z-10 skew-y-3 transform origin-top-left scale-110"></div>
         <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-block p-3 rounded-full bg-white dark:bg-gray-800 shadow-md mb-6">
                <Flower2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8">El Secreto de Nonnapp</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">
               ¿Alguna vez te has preguntado cómo tu abuela podía cocinar un banquete con solo tres ingredientes en la nevera? 
               Esa es la magia que hemos enseñado a nuestra Inteligencia Artificial.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
               <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                     <span className="text-2xl">🚫</span> Cero Desperdicio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                     La Nonna nunca tiraba comida. Nuestra IA prioriza el uso de lo que ya tienes, ahorrándote dinero y cuidando el planeta.
                  </p>
               </div>
               <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                     <span className="text-2xl">❤️</span> Cocina con Alma
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                     No son solo instrucciones robóticas. Recibes consejos, trucos y ese toque de cariño en cada paso de la preparación.
                  </p>
               </div>
               <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                     <span className="text-2xl">⚡️</span> Velocidad Moderna
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                     La sabiduría de antaño, a la velocidad de hoy. Genera recetas completas y listas de la compra en segundos.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">Planes</span>
               <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Elige tu lugar en la mesa</h2>
               <p className="text-gray-500 dark:text-gray-400">Desde el nieto que empieza hasta el Chef de la familia.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
               
               {/* Tier 1: Il Nipote */}
               <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all relative group">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Il Nipote</h3>
                  <p className="text-sm text-gray-500 mb-6">El Nieto (Básico)</p>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Gratis</div>
                  
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> 5 Recetas al día
                     </li>
                     <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> Modo Despensa Básico
                     </li>
                     <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> Sin imágenes generadas
                     </li>
                  </ul>
                  
                  <Link to="/app" className="block w-full py-3 px-6 text-center rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                     Empezar Gratis
                  </Link>
               </div>

               {/* Tier 2: La Nonna (Pro) */}
               <div className="bg-gray-900 dark:bg-black p-8 rounded-3xl shadow-2xl border-2 border-primary transform scale-105 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     La Nonna <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">La Abuela (Pro)</p>
                  <div className="flex items-baseline gap-1 mb-6">
                     <span className="text-4xl font-extrabold text-white">9€</span>
                     <span className="text-gray-400">/mes</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" /> Recetas Ilimitadas
                     </li>
                     <li className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" /> Fotos 4K de tus platos
                     </li>
                     <li className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" /> Historial infinito
                     </li>
                     <li className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" /> Chat con el Chef
                     </li>
                  </ul>
                  
                  <Link to="/auth" className="block w-full py-3 px-6 text-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:shadow-lg hover:shadow-orange-500/40 transition-all">
                     Convertirse en Chef
                  </Link>
               </div>

               {/* Tier 3: La Famiglia */}
               <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all opacity-75 hover:opacity-100">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">La Famiglia</h3>
                  <p className="text-sm text-gray-500 mb-6">Plan Familiar</p>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">19€</div>
                  
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> Todo lo de La Nonna
                     </li>
                     <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> Hasta 5 perfiles
                     </li>
                     <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> Planificador semanal
                     </li>
                  </ul>
                  
                  <button disabled className="block w-full py-3 px-6 text-center rounded-xl border border-gray-300 dark:border-gray-600 text-gray-400 font-bold cursor-not-allowed">
                     Próximamente
                  </button>
               </div>

            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50 dark:to-orange-900/10 -z-10"></div>
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">
                La mesa está servida. <br/> <span className="text-primary">Solo faltas tú.</span>
            </h2>
            <Link to="/app" className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl">
                Empezar a cocinar <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Prueba gratis. Sin tarjeta de crédito.
            </p>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;