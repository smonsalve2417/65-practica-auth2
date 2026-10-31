# Panel

Un panel de administración hecho con Vite, React, TypeScript, React Router y
Zustand, con sesión por cookies `HttpOnly`. El login funciona… más o menos:
llegaron reportes de usuarios y un pedido del líder técnico. El trabajo es
encontrar cada falla con las herramientas de depuración y arreglarla.

Es práctica: no tiene nota.

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre <http://localhost:5173>. `npm run dev` levanta también la API en
<http://localhost:3000/api>: son dos orígenes distintos, como en producción.

| Cuenta | Rol |
| --- | --- |
| `ana@demo.co` | admin |
| `beto@demo.co` | editor |
| `carla@demo.co` | viewer |

La contraseña de todas es `clase123`. La cookie `access_token` dura **un
minuto**; la `refresh_token`, un día.

## La API

| Método y ruta | Qué hace |
| --- | --- |
| `POST /api/auth/login` | Recibe `{ email, password }`, responde `{ usuario }` y pone las cookies |
| `GET /api/auth/me` | El usuario de la sesión, o `401` |
| `POST /api/auth/refresh` | Renueva `access_token` con `refresh_token` |
| `POST /api/auth/logout` | Cierra la sesión y borra las cookies |
| `GET /api/resumen` | Totales para el inicio |
| `GET /api/usuarios` | La lista; un viewer recibe `403` |

## Qué hay en el proyecto

```
server/api.mjs               la API (está bien: no se toca)
src/
├── main.tsx
├── App.tsx                  rutas; carga la sesión al abrir
├── types/auth.ts
├── lib/
│   ├── api.ts               apiFetch: cookies, refresh y 401
│   └── auth.ts              login()
├── store/auth.ts            el store de Zustand
├── components/
│   ├── RutaProtegida.tsx
│   ├── RequiereRol.tsx
│   └── Layout.tsx           navbar y cerrar sesión
└── paginas/
    ├── Login.tsx
    ├── Inicio.tsx
    ├── Usuarios.tsx
    ├── Perfil.tsx
    ├── Configuracion.tsx    solo admin
    └── SinAcceso.tsx
```

## Reportes de usuario

1. Pongo mi correo y mi contraseña, veo el inicio medio segundo y me devuelve al login.
2. Cada vez que recargo la página me pide iniciar sesión otra vez.
3. Cerré sesión en un computador de la biblioteca. El siguiente que lo usó abrió la página y quedó dentro de mi cuenta.
4. Soy viewer. Le di click a Usuarios y me sacó de la sesión. Si no puedo ver esa página, que me lo diga.

## Pedido del líder técnico

5. QA encontró que un viewer que escribe `/configuracion` en la barra de direcciones entra a la página. Es solo para admins.

## Reglas

- Se puede usar el material del curso y la documentación de React, React
  Router, Zustand y TypeScript.
- Se arregla el código que hay: no se reescribe la app desde cero.
- No se cambian los nombres de los archivos ni las carpetas, ni lo que exporta
  cada uno.
- No se toca `server/`.
