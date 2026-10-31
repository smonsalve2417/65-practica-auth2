import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { Usuario } from '../types/auth';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/usuarios').then(async (res) => {
      if (res.ok) setUsuarios(await res.json());
      else if (res.status === 403) setError('No tienes permiso para ver los usuarios.');
      else setError('No se pudieron cargar los usuarios.');
    });
  }, []);

  if (error) return <p role="alert" className="error">{error}</p>;
  if (!usuarios) return <p>Cargando...</p>;

  return (
    <>
      <h1>Usuarios</h1>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
