import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../store/auth';

export function Layout() {
  const usuario = useAuth((s) => s.usuario);
  const logout  = useAuth((s) => s.logout);

  return (
    <>
      <header className="navbar">
        <span className="logo">Panel</span>
        <nav>
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/usuarios">Usuarios</NavLink>
          <NavLink to="/perfil">Perfil</NavLink>
          {usuario?.rol === 'admin' && <NavLink to="/configuracion">Configuración</NavLink>}
        </nav>
        <div className="sesion">
          <span>Hola, {usuario?.nombre}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
