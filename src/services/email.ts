import { supabaseClient } from './supabase';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
}

/**
 * Envía un email usando la Edge Function de Supabase
 * @param params - Parámetros del email (to, subject, html, text opcional)
 * @returns Promesa con la respuesta del envío
 */
export const sendEmail = async (params: SendEmailParams): Promise<SendEmailResponse> => {
  try {
    // Obtener el token de sesión del usuario autenticado
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      throw new Error('Usuario no autenticado');
    }

    // Llamar a la Edge Function
    const { data, error } = await supabaseClient.functions.invoke('send-email', {
      body: {
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      },
    });

    if (error) {
      console.error('Error al invocar función:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return data as SendEmailResponse;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Plantillas de emails predefinidas

/**
 * Envía email de bienvenida al registrarse
 */
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">¡Bienvenido a Sabora! 🍳</h1>
      <p>Hola <strong>${userName}</strong>,</p>
      <p>Estamos emocionados de tenerte en nuestra comunidad culinaria.</p>
      <p>Con Sabora puedes:</p>
      <ul>
        <li>Generar recetas personalizadas con IA</li>
        <li>Guardar tus recetas favoritas</li>
        <li>Crear listas de compras</li>
        <li>Y mucho más...</li>
      </ul>
      <p style="margin-top: 30px;">
        <a href="${window.location.origin}/generator" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Crear mi primera receta
        </a>
      </p>
      <p style="color: #666; font-size: 14px; margin-top: 40px;">
        Si tienes alguna pregunta, no dudes en contactarnos.
      </p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: '¡Bienvenido a Sabora! 🎉',
    html,
    text: `Hola ${userName}, bienvenido a Sabora. Estamos emocionados de tenerte en nuestra comunidad culinaria.`,
  });
};

/**
 * Envía email cuando se crea una nueva receta
 */
export const sendRecipeCreatedEmail = async (
  userEmail: string,
  recipeName: string,
  recipeId: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">¡Nueva receta creada! 🎉</h1>
      <p>Tu receta <strong>${recipeName}</strong> ha sido guardada exitosamente.</p>
      <p style="margin-top: 30px;">
        <a href="${window.location.origin}/recipe/${recipeId}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Ver mi receta
        </a>
      </p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Nueva receta: ${recipeName}`,
    html,
    text: `Tu receta ${recipeName} ha sido guardada exitosamente.`,
  });
};
