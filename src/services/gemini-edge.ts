import type { AIRecipeResponse, UserProfile } from '../types';
import { geminiRateLimiter, recipeCache } from '../utils/rateLimiter';
import { getMockRecipe } from './mock-recipe';
import { apiFetch, ApiError } from './api';

// 🚨 DESARROLLO: Activa esto si la API de Gemini está en rate limit (429)
const USE_MOCK_RECIPE = false; // Cambia a true para usar datos de prueba

export class EmailNotVerifiedError extends Error {
  constructor() {
    super('EMAIL_NOT_VERIFIED');
    this.name = 'EmailNotVerifiedError';
  }
}

/**
 * Genera una receta llamando a la API propia (server/src/routes/ai.ts),
 * que es quien tiene la clave de Gemini — nunca el navegador.
 */
export const generateRecipeAI = async (
  prompt: string,
  mode: 'text' | 'pantry',
  userProfile: UserProfile,
  timeLimit?: string,
  ingredients?: string,
  servings?: number,
  utensils?: string
): Promise<AIRecipeResponse> => {
  if (USE_MOCK_RECIPE) {
    console.warn('⚠️ USANDO DATOS MOCK - Gemini API en rate limit');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return getMockRecipe(prompt);
  }

  const cacheKey = JSON.stringify({ prompt, mode, ingredients, servings, timeLimit, utensils });
  const cached = recipeCache.get(cacheKey);
  if (cached) {
    console.log('✅ Receta obtenida del caché');
    return cached as AIRecipeResponse;
  }

  return geminiRateLimiter.execute(async () => {
    try {
      const result = await apiFetch<{ success: boolean; data: AIRecipeResponse }>('/api/ai/generate-recipe', {
        method: 'POST',
        body: { prompt, mode, ingredients, servings, timeLimit, utensils, userProfile },
      });

      recipeCache.set(cacheKey, result.data);
      return result.data;
    } catch (error: any) {
      console.error('Error generando receta:', error);
      if (error instanceof ApiError && error.status === 403 && error.message === 'EMAIL_NOT_VERIFIED') {
        throw new EmailNotVerifiedError();
      }
      throw new Error(error.message || 'No se pudo generar la receta. Intenta de nuevo.');
    }
  });
};

export const generateRecipeImage = async (prompt: string): Promise<string | null> => {
  try {
    const result = await apiFetch<{ success: boolean; imageUrl: string | null }>('/api/ai/generate-image', {
      method: 'POST',
      body: { prompt },
    });
    return result.imageUrl;
  } catch (error) {
    console.error('Error generando imagen:', error);
    return null;
  }
};

export const askChefAboutRecipe = async (
  question: string,
  recipe: AIRecipeResponse,
  chatHistory: Array<{ role: string; text: string }>
): Promise<string> => {
  try {
    const result = await apiFetch<{ reply: string }>('/api/ai/chat', {
      method: 'POST',
      body: { question, recipeContext: recipe, history: chatHistory },
    });
    return result.reply;
  } catch (error) {
    console.error('Error en el chat:', error);
    return 'Hubo un error al procesar tu pregunta.';
  }
};
