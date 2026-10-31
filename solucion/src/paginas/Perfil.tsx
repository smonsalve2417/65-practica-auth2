import { useAuth } from '../store/auth';

export function Perfil() {
  const usuario = useAuth((s) => s.usuario);

  return (
    <>
      <h1>Perfil</h1>
      <dl className="perfil">
        <dt>Nombre</dt><dd>{usuario?.nombre}</dd>
        <dt>Email</dt><dd>{usuario?.email}</dd>
        <dt>Rol</dt><dd>{usuario?.rol}</dd>
      </dl>
    </>
  );
}
