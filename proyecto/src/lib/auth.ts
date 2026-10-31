import type { LoginPayload, Usuario } from "../types/auth";
import { API_URL } from "./api";

export async function login(payload: LoginPayload): Promise<Usuario> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Email o contraseña incorrectos");
    throw new Error("Error al iniciar sesión");
  }

  const { usuario } = await res.json();
  return usuario;
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include" as const,
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Algo salio mal en el logout");
    throw new Error("Error en Logout");
  }
  await res;
}
