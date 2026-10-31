import { Link } from 'react-router';

export function SinAcceso() {
  return (
    <>
      <h1>Sin acceso</h1>
      <p>Tu rol no tiene permiso para ver esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}
