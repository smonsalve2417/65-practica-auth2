import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { Usuario } from '../types/auth';

interface Resumen {
  total:   number;
  activos: number;
  porRol:  Record<Usuario['rol'], number>;
}

export function Inicio() {
  const [resumen, setResumen] = useState<Resumen | null>(null);

  useEffect(() => {
    apiFetch('/resumen').then(async (res) => {
      if (res.ok) setResumen(await res.json());
    });
  }, []);

  if (!resumen) return <p>Cargando...</p>;

  return (
    <>
      <h1>Inicio</h1>
      <div className="tarjetas">
        <div className="tarjeta"><strong>{resumen.total}</strong> usuarios</div>
        <div className="tarjeta"><strong>{resumen.activos}</strong> activos</div>
        <div className="tarjeta"><strong>{resumen.porRol.admin}</strong> admins</div>
        <div className="tarjeta"><strong>{resumen.porRol.editor}</strong> editores</div>
        <div className="tarjeta"><strong>{resumen.porRol.viewer}</strong> viewers</div>
      </div>
    </>
  );
}
