import { spawn } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev` levanta también la API (server/api.mjs) en el puerto 3000.
// La app corre en el 5173: son orígenes distintos, como en producción.
function api() {
  return {
    name: 'api',
    configureServer() {
      const proceso = spawn(process.execPath, ['server/api.mjs'], { stdio: 'inherit' });
      process.on('exit', () => proceso.kill());
    },
  };
}

export default defineConfig({
  plugins: [react(), api()],
  server: { port: 5173, strictPort: true },
});
