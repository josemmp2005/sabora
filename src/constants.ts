import type { UserProfile } from './types';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const GEMINI_MODEL_TEXT = import.meta.env.VITE_GEMINI_MODEL_TEXT;
export const GEMINI_MODEL_IMAGE = import.meta.env.VITE_GEMINI_MODEL_IMAGE;

// OAuth Redirect URL - usa la variable de entorno o window.location.origin como fallback
export const OAUTH_REDIRECT_URL = import.meta.env.VITE_OAUTH_REDIRECT_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

export const DEFAULT_USER_PROFILE: UserProfile = {
  allergies: "",
  disliked_ingredients: "",
  cooking_skill: "intermediate",
  use_allergies: false,
  use_utensils: false,
  available_utensils: "",
  is_pro: false
};