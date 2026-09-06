# Sabora

App de recetas con IA: describe qué tienes en la despensa (o qué te apetece) y genera una receta completa con foto, pasos y un chef de IA para resolver dudas mientras cocinas.

Este documento es la referencia **de código** (stack, arquitectura, cómo levantar el proyecto, API, esquema de datos). Para entender **qué hace la app** desde el punto de vista de un usuario, ver [`docs/FUNCIONAMIENTO.md`](docs/FUNCIONAMIENTO.md).

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + React Router.
- **Backend**: Node.js + Express + TypeScript, driver `pg` directo (sin ORM).
- **Base de datos**: PostgreSQL (local, vía Docker).
- **IA**: [Groq](https://groq.com) (texto de las recetas y chat del chef) + Gemini (opcional, solo para generar la foto del plato).
- **Auth**: propia — email/password, JWT firmado por el servidor en una cookie `httpOnly`. No usa Supabase ni ningún proveedor externo.

## Estructura del repo

```
sabora-app/
  src/                    Frontend (Vite)
    components/           Páginas y componentes de React
    context/               Theme, Toast, Subscription (React Context)
    services/
      api.ts                Wrapper fetch de bajo nivel (cookies, JSON, errores)
      auth.ts                Login/signup/logout/reset — llama a /api/auth/*
      data.ts                Recetas/preferencias/suscripción — llama al resto de /api/*
      gemini-edge.ts          Llama a /api/ai/* (generar receta, imagen, chat)
    types.ts               Tipos compartidos del dominio (Recipe, UserProfile, ...)
  server/                 Backend (Express)
    src/
      index.ts              Punto de entrada, monta las rutas y el CORS
      db.ts                  Pool de Postgres + helper de transacciones
      schema.sql             Esquema canónico de la BBDD (fuente de verdad)
      env.ts                 Lectura/validación de variables de entorno
      middleware/auth.ts      Verifica el JWT de la cookie, exige sesión
      lib/groq.ts             Cliente HTTP a la API de Groq
      lib/mailer.ts           Envío de emails (Nodemailer / Gmail)
      routes/                 Un archivo por área: auth, recipes, profile, subscription, ai
  docker-compose.yml      Postgres + Adminer para desarrollo local
  archive/                Código de la versión antigua con Supabase (referencia, no se usa)
```

## Desarrollo local

Requiere Docker (para Postgres) y Node 18+.

```bash
# 1. Levantar Postgres local (+ Adminer, interfaz web para ver la BBDD)
docker compose up -d

# 2. Backend (API propia: auth, recetas, IA, etc.)
cd server
cp .env.example .env   # y añade tu GROQ_API_KEY (ver "Variables de entorno")
npm install
npm run db:init        # aplica server/src/schema.sql
npm run dev             # http://localhost:3001

# 3. Frontend (en otra terminal, desde la raíz)
npm install
npm run dev             # http://localhost:5173
```

El backend hay que dejarlo corriendo en su propia terminal mientras se desarrolla — si se cierra, el frontend no puede hacer login ni generar recetas (`ERR_CONNECTION_REFUSED`).

### Scripts disponibles

| Comando (raíz) | Qué hace |
|---|---|
| `npm run dev` | Frontend en modo desarrollo (Vite) |
| `npm run build` | `tsc -b` + build de producción del frontend |
| `npm run lint` | ESLint sobre `src/` |

| Comando (`server/`) | Qué hace |
|---|---|
| `npm run dev` | API en modo desarrollo (`tsx watch`) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm run start` | Arranca la API compilada (`dist/index.js`) |
| `npm run db:init` | Aplica `src/schema.sql` a la BBDD de `DATABASE_URL` |

### Variables de entorno

**Raíz** (`.env`, ver `.env.example`):

| Variable | Para qué |
|---|---|
| `VITE_API_URL` | URL base del backend (`http://localhost:3001` en local) |

**`server/.env`** (ver `server/.env.example`):

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Cadena de conexión a Postgres |
| `JWT_SECRET` | Firma de las cookies de sesión — cambiarlo cierra la sesión a todo el mundo |
| `CORS_ORIGIN` | Origen permitido para llamar a la API (el del frontend) |
| `APP_URL` | Usada para construir el link de "restablecer contraseña" en el email |
| `GROQ_API_KEY` / `GROQ_MODEL` | Generación de recetas y chat del chef |
| `GEMINI_API_KEY` / `GEMINI_MODEL_IMAGE` | Opcional — solo la foto del plato. Sin ella, la receta se genera igual, sin imagen |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Opcional — envío real de emails (bienvenida, reset de contraseña). Sin ellas, el email se loguea en consola en vez de enviarse |

### Ver la base de datos (Adminer)

Con `docker compose up -d` levantado, entra en **http://localhost:8081** y conecta con:

| Campo    | Valor    |
|----------|----------|
| Sistema  | PostgreSQL |
| Servidor | `postgres` |
| Usuario  | `sabora` |
| Contraseña | `sabora` |
| Base de datos | `sabora` |

(El puerto es 8081, no el 8080 habitual de Adminer, porque esta máquina ya tenía otro Adminer ocupándolo.)
Si prefieres un cliente de escritorio en vez del navegador, el mismo Postgres es accesible en `localhost:5434` con esas mismas credenciales (DBeaver, TablePlus, pgAdmin, etc.).

## Esquema de datos

Fuente de verdad: [`server/src/schema.sql`](server/src/schema.sql).

| Tabla | Para qué |
|---|---|
| `users` | Cuentas: email, hash de contraseña, username, avatar, `email_verified` |
| `password_reset_tokens` | Tokens de un solo uso para "olvidé mi contraseña" (hasheados, con caducidad) |
| `email_verification_tokens` | Tokens de un solo uso para verificar el email al registrarse (hasheados, caducan a las 24h) |
| `sessions` | Una fila por sesión activa (login). El JWT de la cookie referencia su id; revocarla (logout, cambio de contraseña) la invalida antes de que expire sola |
| `subscriptions` | Plan activo del usuario (`nipote` / `mamma` / `nonna`) |
| `user_profiles` | Preferencias del chef IA: alergias, ingredientes que no gustan, nivel de habilidad |
| `recipes` | Cabecera de cada receta generada (título, descripción, macros, imagen...) |
| `recipe_steps` | Pasos de una receta |
| `ingredients` / `recipe_ingredients` | Catálogo de ingredientes y su relación (con cantidad) con cada receta |
| `utensils` / `recipe_utensils` | Igual que ingredientes, para utensilios |

No hay ORM ni migraciones versionadas todavía: `schema.sql` usa `CREATE TABLE IF NOT EXISTS`, así que es seguro volver a ejecutar `npm run db:init`.

## API

Todas las rutas (salvo `/api/auth/signup`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`) exigen sesión — leen el JWT de la cookie `sabora_session` (`credentials: 'include'` en el fetch del frontend). Las rutas de `/api/recipes/*`, `/api/profile/*`, `/api/subscription/*` y `/api/ai/*` exigen además el email verificado (403 `EMAIL_NOT_VERIFIED` si no); solo las rutas de gestión de la propia cuenta (`me`, `logout`, `update-password`, `resend-verification`) siguen abiertas para un usuario sin verificar. `/signup`, `/login` y `/forgot-password` están limitadas a 8 intentos / 15 min por IP (cada una con su propio contador); `/reset-password`, `/verify-email` y `/resend-verification` a 20 / 15 min.

| Método | Ruta | Auth | Qué hace |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Crea cuenta + suscripción `nipote` gratis, inicia sesión, envía email de verificación |
| POST | `/api/auth/login` | — | Inicia sesión |
| POST | `/api/auth/logout` | ✔ | Revoca la sesión actual en BBDD y borra la cookie |
| GET | `/api/auth/me` | ✔ | Devuelve el usuario autenticado (restaura sesión al recargar) |
| PATCH | `/api/auth/me` | ✔ | Cambia el username |
| POST | `/api/auth/update-password` | ✔ | Cambia la contraseña; revoca todas las demás sesiones activas del usuario |
| POST | `/api/auth/forgot-password` | — | Envía email con link de recuperación (respuesta genérica siempre) |
| POST | `/api/auth/reset-password` | — | Cambia la contraseña con el token del email; revoca todas las sesiones del usuario |
| POST | `/api/auth/verify-email` | — | Marca el email como verificado con el token del email (un solo uso, caduca en 24h) |
| POST | `/api/auth/resend-verification` | ✔ | Reenvía el email de verificación si aún no está verificado |
| GET | `/api/recipes/recent` | ✔ + verificado | Últimas 3 recetas del usuario (Dashboard) |
| GET | `/api/recipes/history` | ✔ + verificado | Historial completo del usuario |
| GET | `/api/recipes/:id` | ✔ + verificado | Receta completa (pasos, ingredientes, utensilios) — 404 si no es tuya |
| POST | `/api/recipes` | ✔ + verificado | Guarda una receta generada (aplica el límite diario del plan gratis) |
| GET | `/api/profile/preferences` | ✔ + verificado | Preferencias del chef + si el plan es "pro" |
| PUT | `/api/profile/preferences` | ✔ + verificado | Guarda preferencias |
| GET | `/api/subscription` | ✔ + verificado | Plan activo |
| POST | `/api/subscription/toggle` | ✔ + verificado | **Demo**, sin pago real: activa/desactiva el plan Mamma |
| POST | `/api/ai/generate-recipe` | ✔ + verificado | Genera una receta (Groq) |
| POST | `/api/ai/generate-image` | ✔ + verificado | Genera la foto del plato (Gemini, opcional) |
| POST | `/api/ai/chat` | ✔ + verificado | Chat del chef sobre una receta (Groq) |

## Notas de arquitectura

- **Sin Supabase**: la app usaba Supabase (auth + BBDD + Edge Functions) hasta que se migró a Postgres local + este backend propio. El código y los scripts SQL de esa época quedan en `archive/` solo como referencia — no se ejecutan.
- **Sesión**: JWT en cookie `httpOnly` + `SameSite=Lax`, nunca en `localStorage` (evita robo por XSS). El frontend nunca toca el token directamente. El JWT lleva además el id de una fila en la tabla `sessions` — `requireAuth` comprueba en cada request que esa sesión no esté revocada, así que se puede invalidar una sesión concreta (logout) o todas las de un usuario (cambio de contraseña, reset) sin esperar a que el JWT expire solo.
- **Verificación de email**: al registrarse se manda un email con un link de un solo uso (`/verify-email?token=...`, caduca en 24h). Hasta que se verifica, la cuenta no puede usar nada de la app: el backend devuelve 403 `EMAIL_NOT_VERIFIED` en `/api/recipes/*`, `/api/profile/*`, `/api/subscription/*` y `/api/ai/*` (middleware `requireVerifiedEmail`), y el frontend muestra una pantalla de bloqueo en cualquier ruta de `/app` en vez del contenido real (`ProtectedRoute` en `App.tsx` + `EmailVerificationGate.tsx`). Las rutas de gestión de la propia cuenta (`/me`, `/logout`, `/update-password`, `/resend-verification`) siguen abiertas para que el usuario pueda reenviar el email o cerrar sesión.
- **Rate limiting**: `express-rate-limit` en las rutas de auth más sensibles a fuerza bruta / abuso (login, signup, forgot-password, reset-password, verify-email). En memoria del proceso — se resetea si el backend se reinicia; suficiente para un solo proceso, no pensado para desplegar detrás de varias instancias sin un store compartido (Redis).
- **Validación de entrada**: todas las rutas que reciben body (`auth`, `recipes`, `profile`, `subscription`, `ai`) validan con `zod` (`server/src/lib/schemas.ts` + `server/src/lib/validate.ts`) — tipos, longitudes máximas y formatos antes de tocar la BBDD o llamar a la IA.
- **IA**: la clave de Groq/Gemini vive solo en `server/.env` — el frontend nunca ve una API key de IA, todo pasa por `/api/ai/*` con sesión y email verificado.
- **Fuera de alcance por ahora** (decisiones tomadas conscientemente, no descuidos): login con Google, pasarela de pago real para los planes de pago, subida de avatar.
