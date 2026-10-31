# Clave: Práctica de Autenticación y Depuración

Solo para el profesor. No va en lo que se entrega a los estudiantes.

```
proyecto/      lo que se entrega (5 bugs sembrados)
solucion/      el mismo proyecto arreglado
```

Es práctica sin nota: no hay calificador. Cada bug aplica un tema de los decks
61 a 64 y sale con una herramienta concreta del deck de depuración (59). La
columna "Herramienta" sirve para destrabar a quien se quede quieto: la pista es
la herramienta, no el archivo.

Los reportes 1 a 4 son de usuarios: lo que se ve. El 5 es del líder técnico: un
usuario normal no lo notaría.

`proyecto/` y `solucion/` solo difieren en las líneas de los arreglos. Los dos
compilan con `npm run build`: ningún bug lo atrapa TypeScript.

## Los bugs

Las líneas son las de `proyecto/`.

| # | Reporte (síntoma) | Dónde | Causa | Arreglo | Herramienta | Deck |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Entra y lo devuelve al login | `src/lib/auth.ts:5-9` | El `fetch` del login no lleva `credentials: 'include'`. La API está en otro origen (`:3000`), así que el navegador ignora el `Set-Cookie`. La siguiente petición sale sin cookie, da `401`, el refresh también, y `apiFetch` borra el usuario | Agregar `credentials: 'include'` | Network: la respuesta del login trae `Set-Cookie`, pero Application → Cookies queda vacío. Comparar el `fetch` del login con el de `apiFetch` | 62 |
| 2 | Recargar pide login | `src/components/RutaProtegida.tsx:4-8` | No espera a `cargarSesion`: en el primer render `usuario` es `null` y redirige antes de que `/auth/me` responda | `if (cargando) return <p>Cargando...</p>;` antes del `if (!usuario)` | Network: `/auth/me` responde `200`, pero la URL ya cambió a `/login` | 64 |
| 3 | Cerrar sesión no cierra | `src/store/auth.ts:23-25` | `logout` solo limpia el store; nunca llama a `/auth/logout`. Las cookies siguen ahí y `cargarSesion` restaura la sesión al abrir | `await apiFetch('/auth/logout', { method: 'POST' });` antes del `set` | Network: al cerrar sesión no sale ninguna petición. Application → Cookies: las dos siguen | 61, 63 |
| 4 | Un viewer pierde la sesión en Usuarios | `src/lib/api.ts:17` | `apiFetch` trata el `403` como si fuera `401` y borra el usuario. `403` es "sesión válida, sin permiso" | Solo `res.status === 401` | Network: `/usuarios` responde `403`, no `401`. Tabla de status del 61 | 61 |
| 5 | (Líder técnico) Un viewer entra a `/configuracion` | `src/App.tsx:29-30` | `<RequiereRol>` está cerrado con `/>` y `/configuracion` quedó como hermana, no como hija: el guardia no envuelve nada | Anidar la ruta dentro de `<RequiereRol>` | Sources: un breakpoint en `RequiereRol` no se detiene al abrir `/configuracion`. Después, leer `App.tsx` con la regla "ruta padre sin path" del 64 | 64 |

## Cómo se tapan entre sí

- El 1 bloquea todo lo demás: sin cookie no hay sesión que dure.
- El 3 se ve mejor con el 2 arreglado. Con el 2 roto, después de cerrar sesión
  y recargar sale el login de todos modos, pero `/auth/me` en Network responde
  `200`: la sesión sigue viva.
- El 4 y el 5 se prueban con `carla@demo.co`.
- Si alguien envía el login en el primer medio segundo después de cargar, un
  `/auth/me` en vuelo puede responder `401` después y borrar el usuario. No es
  uno de los bugs: con una persona escribiendo no pasa.
