import type { LoginPayload, Usuario } from '../types/auth';
import { API_URL } from './api';

export async function login(payload: LoginPayload): Promise<Usuario> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Email o contraseña incorrectos');
    throw new Error('Error al iniciar sesión');
  }

  const { usuario } = await res.json();
  return usuario;
}
