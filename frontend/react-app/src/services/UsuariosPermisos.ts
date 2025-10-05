import axios from "axios";

export const ListarUsuariosAprobados = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/usuarios/");
    return response.data;
  } catch (error) {
    console.error("Error en ListarUsuarios:", error);
    throw error;
  }
};

export const ListarUsuariosPendientes = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/usuarios/pendientes/"
    );
    return response.data;
  } catch (error) {
    console.error("Error en ListarUsuarios:", error);
    throw error;
  }
};

export const aprobarUsuario = async (usuarioId: number) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/usuario/${usuarioId}/aprobar/`
    );
    return response.data;
  } catch (error) {
    console.error("Error al aprobar usuario:", error);
    throw error;
  }
};
