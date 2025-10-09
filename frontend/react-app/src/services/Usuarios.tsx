const API_BASE_URL = 'http://localhost:8000'; 

// Servicio de autenticacion
export const authService = {
  async registrarUsuario(datosUsuario) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crear-usuario/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores específicos del backend
        const errorMessage = data.detail || data.message || 
                           (data.username && data.username[0]) ||
                           (data.email && data.email[0]) ||
                           'Error en el registro';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async iniciarSesion(credenciales) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/iniciar-sesion/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credenciales),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.message || 
                           'Error en el inicio de sesión';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};