import { apiFetch, ApiError } from './api';

export interface AuthUser {
  id: string;
  email: string;
  avatar_url: string | null;
  // Se conserva la forma `user_metadata.username` (heredada de Supabase) para
  // no tener que tocar todos los componentes que ya leen `session.user.user_metadata?.username`.
  user_metadata: { username: string };
}

export interface AuthSession {
  user: AuthUser;
}

interface AuthError {
  message: string;
}

type PublicUser = { id: string; email: string; username: string; avatar_url: string | null };

const toAuthUser = (user: PublicUser): AuthUser => ({
  id: user.id,
  email: user.email,
  avatar_url: user.avatar_url,
  user_metadata: { username: user.username },
});

const asAuthError = (err: unknown): AuthError => ({
  message: err instanceof ApiError ? err.message : 'Ocurrió un error inesperado.',
});

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: AuthError | null }> => {
  try {
    const { user } = await apiFetch<{ user: PublicUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    return { user: toAuthUser(user), error: null };
  } catch (err) {
    return { user: null, error: asAuthError(err) };
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata: { username: string }
): Promise<{ user: AuthUser | null; error: AuthError | null }> => {
  try {
    const { user } = await apiFetch<{ user: PublicUser }>('/api/auth/signup', {
      method: 'POST',
      body: { email, password, username: metadata.username },
    });
    return { user: toAuthUser(user), error: null };
  } catch (err) {
    return { user: null, error: asAuthError(err) };
  }
};

export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    return { error: null };
  } catch (err) {
    return { error: asAuthError(err) };
  }
};

export const getCurrentSession = async (): Promise<{ session: AuthSession | null; error: AuthError | null }> => {
  try {
    const { user } = await apiFetch<{ user: PublicUser }>('/api/auth/me');
    return { session: { user: toAuthUser(user) }, error: null };
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { session: null, error: null }; // sin sesión, no es un error
    }
    return { session: null, error: asAuthError(err) };
  }
};

export const updateUsername = async (username: string): Promise<{ error: AuthError | null }> => {
  try {
    await apiFetch('/api/auth/me', { method: 'PATCH', body: { username } });
    return { error: null };
  } catch (err) {
    return { error: asAuthError(err) };
  }
};

export const updateUserPassword = async (newPassword: string): Promise<{ error: AuthError | null }> => {
  try {
    await apiFetch('/api/auth/update-password', { method: 'POST', body: { password: newPassword } });
    return { error: null };
  } catch (err) {
    return { error: asAuthError(err) };
  }
};

export const requestPasswordReset = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    await apiFetch('/api/auth/forgot-password', { method: 'POST', body: { email } });
    return { error: null };
  } catch (err) {
    return { error: asAuthError(err) };
  }
};

export const resetPasswordWithToken = async (
  token: string,
  password: string
): Promise<{ error: AuthError | null }> => {
  try {
    await apiFetch('/api/auth/reset-password', { method: 'POST', body: { token, password } });
    return { error: null };
  } catch (err) {
    return { error: asAuthError(err) };
  }
};
