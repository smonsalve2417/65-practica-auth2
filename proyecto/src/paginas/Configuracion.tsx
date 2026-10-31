export function Configuracion() {
  return (
    <>
      <h1>Configuración</h1>
      <p>Solo para administradores.</p>
      <label className="opcion">
        <input type="checkbox" defaultChecked /> Permitir registro de usuarios nuevos
      </label>
      <label className="opcion">
        <input type="checkbox" /> Modo mantenimiento
      </label>
    </>
  );
}
