import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Heart, ArrowRight, ChefHat, PlayCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 md:pt-24 md:pb-32">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-orange-200 to-red-200 dark:from-orange-900/20 dark:to-red-900/20 rounded-full blur-[100px] -z-10 opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-blue-200 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text Content */}
            <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-white/5 border border-orange-100 dark:border-white/10 backdrop-blur-sm shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide">Potenciado por Gemini 2.5</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
                    Cocina como un <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-500">
                        Chef IA
                    </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Transforma los ingredientes de tu nevera en obras maestras culinarias. 
                    Recetas personalizadas y visuales fotorrealistas al instante.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                    <Link to="/app" className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95">
                        <ChefHat className="w-6 h-6" />
                        Empezar Gratis
                    </Link>
                    <Link to="/auth" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                        <PlayCircle className="w-6 h-6 text-gray-400" />
                        Ver Demo
                    </Link>
                </div>
            </div>

            {/* Visual Mockup */}
            <div className="relative animate-in slide-in-from-right-10 fade-in duration-1000 delay-200 mt-10 lg:mt-0">
                <div className="relative z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-4 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md mx-auto">
                    {/* Mockup Header */}
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">nonnapp.app</div>
                    </div>
                    
                    {/* Mockup Content */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden h-[450px] relative flex flex-col">
                        <div className="h-56 relative overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
                                alt="Healthy Bowl" 
                                className="w-full h-full object-cover"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white border border-white/10 flex items-center gap-1 shadow-lg">
                                <Sparkles className="w-3 h-3 text-yellow-400" /> IA Generated
                            </div>
                        </div>
                        <div className="p-6 space-y-4 flex-grow flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-md">Desayuno • 15 min</span>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">Bowl de Quinoa y Aguacate</h3>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center min-w-[60px]">
                                    <span className="text-gray-900 dark:text-white font-bold block">450</span>
                                    <span className="text-[10px] text-gray-400 uppercase">kcal</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
                            </div>

                            <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm mt-auto hover:opacity-90 transition-opacity">
                                Ver Receta Completa
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements behind Mockup */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500 rounded-full blur-[80px] opacity-20 dark:opacity-30"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20 dark:opacity-30"></div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="bg-white dark:bg-gray-900/50 py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">Características</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Tu cocina, nivel experto</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    nonnapp utiliza la última tecnología de Google Gemini para entender tus gustos y lo que tienes en tu despensa.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orange-100 dark:hover:border-gray-700 group">
                    <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-orange-500">
                        <Zap className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Modo Despensa</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Dile a la IA qué ingredientes te sobran y crea platos gourmet al instante. Cero desperdicio, máximo sabor.
                    </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-100 dark:hover:border-gray-700 group">
                    <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-green-500">
                        <Heart className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Salud y Macros</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Personaliza recetas según tus objetivos calóricos y nutricionales. Come rico y sano sin complicaciones.
                    </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-100 dark:hover:border-gray-700 group">
                    <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-purple-500">
                        <Sparkles className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Visualización 4K</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Genera imágenes fotorrealistas de tus platos antes de cocinarlos usando el modelo Nano Banana.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="text-center py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50 dark:to-orange-900/10 -z-10"></div>
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">
                ¿Listo para cocinar algo <span className="text-primary">increíble</span>?
            </h2>
            <Link to="/app" className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl">
                Ir a la cocina <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                No requiere tarjeta de crédito para empezar.
            </p>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;