import { useAuth } from '../store/auth';

export const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, init: RequestInit = {}) {
  const opciones = { ...init, credentials: 'include' as const };
  let res = await fetch(`${API_URL}${path}`, opciones);

  if (res.status === 401) {
    const refresh = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refresh.ok) res = await fetch(`${API_URL}${path}`, opciones);
  }

  if (res.status === 401) useAuth.setState({ usuario: null });
  return res;
}
