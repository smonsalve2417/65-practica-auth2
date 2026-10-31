import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../store/auth';

export function RutaProtegida() {
  const usuario  = useAuth((s) => s.usuario);
  const cargando = useAuth((s) => s.cargando);
  const location = useLocation();

  if (cargando) return <p>Cargando...</p>;
  if (!usuario) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}
