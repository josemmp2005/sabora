# Sabora

## Desarrollo local

Requiere Docker (para Postgres) y Node 18+.

```bash
# 1. Levantar Postgres local (+ Adminer, interfaz web para ver la BBDD)
docker compose up -d

# 2. Backend (API propia: auth, recetas, IA, etc.)
cd server
cp .env.example .env   # y añade tu GEMINI_API_KEY
npm install
npm run db:init        # aplica server/src/schema.sql
npm run dev             # http://localhost:3001

# 3. Frontend (en otra terminal, desde la raíz)
npm install
npm run dev             # http://localhost:5173
```

El login es propio (email/password, JWT en cookie httpOnly) — Supabase ya no se usa en runtime.
El código antiguo de Supabase (Edge Functions, parches SQL) queda archivado en `archive/` como referencia.

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

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```