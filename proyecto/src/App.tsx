import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./store/auth";
import { RutaProtegida } from "./components/RutaProtegida";
import { RequiereRol } from "./components/RequiereRol";
import { Layout } from "./components/Layout";
import { Login } from "./paginas/Login";
import { Inicio } from "./paginas/Inicio";
import { Usuarios } from "./paginas/Usuarios";
import { Perfil } from "./paginas/Perfil";
import { Configuracion } from "./paginas/Configuracion";

export default function App() {
  const cargarSesion = useAuth((s) => s.cargarSesion);

  useEffect(() => {
    cargarSesion();
  }, [cargarSesion]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route element={<RequiereRol roles={["admin", "editor"]} />}>
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
          <Route path="/perfil" element={<Perfil />} />
          <Route element={<RequiereRol roles={["admin"]} />}>
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
