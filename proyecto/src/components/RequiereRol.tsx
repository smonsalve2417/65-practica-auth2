import { Outlet } from 'react-router';
import { useAuth } from '../store/auth';
import type { Usuario } from '../types/auth';
import { SinAcceso } from '../paginas/SinAcceso';

export function RequiereRol({ roles }: { roles: Usuario['rol'][] }) {
  const rol = useAuth((s) => s.usuario?.rol);

  if (!rol || !roles.includes(rol)) return <SinAcceso />;

  return <Outlet />;
}
