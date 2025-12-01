import React, { useState, useEffect } from 'react';
import RecipeForm from './RecipeForm';
import RecipeDisplay from './RecipeDisplay';
import HistoryList from './HistoryList';
import LoadingOverlay from './LoadingOverlay';
import { RateLimitWarning } from './RateLimitWarning';
import { generateRecipeAI, generateRecipeImage } from '../services/gemini-edge';
import { checkSmartCache, saveRecipeToDB, fetchRecentRecipes, getFullRecipeById } from '../services/supabase';
import type { AIRecipeResponse, UserProfile as UserProfileType, GenerationParams, RecipeDB } from '../types';
import { useToast } from '../context/ToastContext';

interface Props {
  userProfile: UserProfileType;
  session: any;
}

const Dashboard: React.FC<Props> = ({ userProfile, session }) => {
  const { showToast } = useToast();
  const [recentRecipes, setRecentRecipes] = useState<RecipeDB[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<AIRecipeResponse | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(false);

  // Rate Limit Config
  const RATE_LIMIT_MS = 30000; // 30 seconds

  useEffect(() => {
    loadHistory();
  }, []);

  // Recargar historial cuando volvemos al dashboard
  useEffect(() => {
    if (!currentRecipe && !isLoading) {
      loadHistory();
    }
  }, [currentRecipe]);

  const loadHistory = async () => {
    setIsHistoryLoading(true);
    console.log('🔄 Cargando historial...');
    const history = await fetchRecentRecipes();
    console.log('📋 Historial cargado:', history.length, 'recetas');
    setRecentRecipes(history);
    setIsHistoryLoading(false);
  };

  const checkRateLimit = (): number => {
    const lastGen = localStorage.getItem('sabora_last_gen');
    if (!lastGen) return 0;
    
    const elapsed = Date.now() - parseInt(lastGen);
    if (elapsed < RATE_LIMIT_MS) {
      return Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
    }
    return 0;
  };

  const handleGenerate = async (params: GenerationParams) => {
    // 1. Check Rate Limit
    const waitTime = checkRateLimit();
    if (waitTime > 0) {
      showToast(`Por favor espera ${waitTime}s antes de generar otra receta.`, 'info');
      return;
    }

    setIsLoading(true);
    setCurrentRecipe(null);
    setCurrentImage(null);

    try {
      const cachedRecipe = await checkSmartCache(params.prompt);
      if (cachedRecipe) {
        console.log("Smart Cache HIT");
        setCurrentRecipe(cachedRecipe);
        setCurrentImage(cachedRecipe.main_image_url || null);
        showToast('¡Receta encontrada en caché!', 'success');
        setIsLoading(false);
        return;
      }

      // Set timestamp for Rate Limiting
      localStorage.setItem('sabora_last_gen', Date.now().toString());

      // Mostrar warning de rate limit
      setShowRateLimitWarning(true);
      setTimeout(() => setShowRateLimitWarning(false), 8000); // Ocultar después de 8s

      // Pass all params to Edge Function
      const generatedRecipe = await generateRecipeAI(
        params.prompt, 
        params.mode, 
        userProfile, 
        params.timeLimit,
        params.ingredients,
        params.servings,
        params.utensils
      );
      generatedRecipe.recipe_metadata.servings = params.servings; 
      
      setCurrentRecipe(generatedRecipe);

      const imagePrompt = `
        Professional high-end food photography of the final dish: ${generatedRecipe.recipe_metadata.title}.
        Visual context: ${generatedRecipe.recipe_metadata.description.substring(0, 150)}.
        Style: Michelin star plating, 8k resolution, hyper-realistic, soft studio lighting, shallow depth of field (bokeh), overhead or 45-degree angle shot.
        CRITICAL: Real food only. No people, no hands, no chefs, no faces, no cartoons, no illustrations, no anthropomorphic vegetables.
      `.trim();

      console.log('🖼️ Generando imagen de la receta...');
      const generatedImage = await generateRecipeImage(imagePrompt);
      
      if (generatedImage) {
        console.log('✅ Imagen generada correctamente');
        setCurrentImage(generatedImage);
      } else {
        console.warn('⚠️ No se pudo generar la imagen de la receta');
        setCurrentImage(null);
      }

      const userId = session?.user?.id;
      if (userId) {
        await saveRecipeToDB(userId, generatedRecipe, params.prompt, generatedImage);
        // Esperar un momento antes de recargar el historial para que la DB se actualice
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadHistory();
        showToast('Receta generada y guardada.', 'success');
      } else {
        console.warn("User not logged in, recipe not saved to DB");
        showToast('Receta generada (No guardada - Modo invitado)', 'info');
      }

    } catch (err: any) {
      showToast("Lo siento, hubo un error generando tu receta. Intenta de nuevo.", 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = async (recipe: RecipeDB) => {
    if (!recipe.id) return;
    
    setIsLoading(true);
    
    try {
      const fullRecipe = await getFullRecipeById(recipe.id);
      
      if (fullRecipe) {
        setCurrentRecipe(fullRecipe);
        setCurrentImage(fullRecipe.main_image_url || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast("No se pudo cargar la receta completa.", 'error');
      }
    } catch (err) {
      showToast("Error al cargar la receta.", 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetView = () => {
    setCurrentRecipe(null);
    setCurrentImage(null);
    // Recargar historial cuando volvemos al dashboard
    loadHistory();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      <LoadingOverlay isVisible={isLoading} />

      {!currentRecipe ? (
        <div className="animate-in fade-in duration-500">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">¿Qué cocinamos hoy?</h2>
              <p className="text-gray-500 dark:text-gray-400">Dime qué tienes o qué se te antoja, y la IA hará el resto.</p>
            </div>
            
            <RecipeForm isLoading={false} onSubmit={handleGenerate} />
            
            {/* Historial siempre visible en dashboard */}
            <HistoryList 
              recipes={recentRecipes} 
              isLoading={isHistoryLoading}
              onSelect={handleHistorySelect} 
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
      
      <RateLimitWarning show={showRateLimitWarning} />
    </div>
  );
};

export default Dashboard;