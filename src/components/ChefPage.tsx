
import React from 'react';
import ChefTableWidget from './ChefTableWidget';

const ChefPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="relative rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 overflow-hidden mb-12 p-8 md:p-12 text-center md:text-left">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 max-w-2xl">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Exclusivo</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">La Mesa del Chef</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
               Accede a nuestra colección curada de estilos culinarios de élite y recetas de autor listas para cocinar. 
               Inspiración pura, sin esperas.
            </p>
         </div>
      </div>

      <ChefTableWidget variant="full" />
    </div>
  );
};

export default ChefPage;
