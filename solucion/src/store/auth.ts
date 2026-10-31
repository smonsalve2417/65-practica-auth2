import { create } from 'zustand';
import type { LoginPayload, Usuario } from '../types/auth';
import { apiFetch } from '../lib/api';
import { login as apiLogin } from '../lib/auth';

interface AuthState {
  usuario:  Usuario | null;
  cargando: boolean;
  login:    (datos: LoginPayload) => Promise<void>;
  logout:   () => Promise<void>;
  cargarSesion: () => Promise<void>;
}

export const useAuth = create<AuthState>()((set) => ({
  usuario:  null,
  cargando: true,

  async login(datos) {
    const usuario = await apiLogin(datos);
    set({ usuario });
  },

  async logout() {
    await apiFetch('/auth/logout', { method: 'POST' });
    set({ usuario: null });
  },

  async cargarSesion() {
    try {
      const res = await apiFetch('/auth/me');
      set({ usuario: res.ok ? await res.json() : null });
    } finally {
      set({ cargando: false });
    }
  },
}));
