
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeForm from './RecipeForm';
import RecipeDisplay from './RecipeDisplay';
import LoadingOverlay from './LoadingOverlay';
import { generateRecipeAI, generateRecipeImage } from '../services/gemini';
import { checkSmartCache, saveRecipeToDB, fetchRecentRecipes } from '../services/supabase';
import type{ AIRecipeResponse, UserProfile, GenerationParams } from '../types';
import { useToast } from '../context/ToastContext';
import { Sparkles } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  session: any;
}

const GeneratorPage: React.FC<Props> = ({ userProfile, session }) => {
  const { showToast } = useToast();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<AIRecipeResponse | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // Auto-trigger if navigated with state
  useEffect(() => {
    if (location.state && location.state.autoTrigger) {
      const { prompt, mode, servings, timeLimit } = location.state;
      handleGenerate({
        prompt,
        mode: mode || 'text',
        servings: servings || 2,
        timeLimit: timeLimit || 'unlimited',
        ingredients: mode === 'pantry' ? prompt : undefined
      });
      // Clear state to prevent loop if user navigates back (optional, but good practice)
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleGenerate = async (params: GenerationParams) => {
    setIsLoading(true);
    setCurrentRecipe(null);
    setCurrentImage(null);

    try {
      // 1. Check Cache (Skip for "Chef Styles" which are usually unique requests)
      if (!params.prompt.includes('Estilo de cocina')) {
        const cachedRecipe = await checkSmartCache(params.prompt);
        if (cachedRecipe) {
          console.log("Smart Cache HIT");
          setCurrentRecipe(cachedRecipe);
          setCurrentImage(cachedRecipe.main_image_url || null);
          showToast('¡Receta encontrada en caché!', 'success');
          setIsLoading(false);
          return;
        }
      }

      // 2. Generate Recipe Text
      const generatedRecipe = await generateRecipeAI(params.prompt, params.mode, userProfile, params.timeLimit);
      generatedRecipe.recipe_metadata.servings = params.servings; 
      
      setCurrentRecipe(generatedRecipe);

      // 3. Generate Image
      const imagePrompt = `
        Professional high-end food photography of the final dish: ${generatedRecipe.recipe_metadata.title}.
        Visual context: ${generatedRecipe.recipe_metadata.description.substring(0, 150)}.
        Style: Michelin star plating, 8k resolution, hyper-realistic, soft studio lighting, shallow depth of field (bokeh).
        CRITICAL: Real food only. No people, no text.
      `.trim();

      const generatedImage = await generateRecipeImage(imagePrompt);
      setCurrentImage(generatedImage);

      // 4. Save to DB
      const userId = session?.user?.id;
      if (userId) {
        await saveRecipeToDB(userId, generatedRecipe, params.prompt, generatedImage);
        showToast('Receta generada y guardada.', 'success');
      }

    } catch (err: any) {
      showToast("Lo siento, hubo un error generando tu receta. Intenta de nuevo.", 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetView = () => {
    setCurrentRecipe(null);
    setCurrentImage(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      
      <LoadingOverlay isVisible={isLoading} />

      {!currentRecipe ? (
        <div className="space-y-8">
          <div className="text-center space-y-4 mb-8 pt-4">
             <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl mb-2 shadow-inner">
                <Sparkles className="w-8 h-8 text-primary" />
             </div>
             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
               El Laboratorio del Chef
             </h1>
             <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
               Describe tu antojo o dime qué ingredientes tienes. La IA creará la receta perfecta.
             </p>
          </div>

          <RecipeForm 
            isLoading={isLoading} 
            onSubmit={handleGenerate} 
          />
        </div>
      ) : (
        <RecipeDisplay 
          recipe={currentRecipe} 
          imageUrl={currentImage} 
          onGenerateAgain={resetView}
          isPro={userProfile.is_pro || false}
        />
      )}
    </div>
  );
};

export default GeneratorPage;
