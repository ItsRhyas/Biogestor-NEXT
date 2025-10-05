// Login.jsx - VERSIÓN CORREGIDA
import { useState } from 'react';
import { FormBase } from '../../shared/credenciales/formulario';
import { authService } from '../../services/Usuarios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const camposLogin = [
    { name: 'username', type: 'text', placeholder: 'Nombre de usuario', required: true },
    { name: 'password', type: 'password', placeholder: 'Contraseña', required: true }
  ];

  const botonesLogin = [
    { 
      label: loading ? "Iniciando sesión..." : "Iniciar Sesión", 
      color: "#01663d",
      tipo: "login",
      accion: "submit" as const
    },
    { 
      label: "Registrarse", 
      color: "#fafafa", 
      tipo: "registro",
      accion: "navegacion" as const
    }
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true);
    setError('');

    try {
      const credenciales = {
        username: formData.username,
        password: formData.password
      };

      console.log('Enviando credenciales:', credenciales);
      
      const respuesta = await authService.iniciarSesion(credenciales);
      
      console.log('Respuesta completa del servidor:', respuesta);
      
      // DEPURACIÓN: Verificar la estructura real de la respuesta
      if (!respuesta) {
        throw new Error('No se recibió respuesta del servidor');
      }

      // OPCIÓN 1: Si usa "token"
      if (respuesta.token) {
        localStorage.setItem('authToken', respuesta.token);
        console.log('Token guardado (token):', respuesta.token);
      }
      // OPCIÓN 2: Si usa "access" 
      else if (respuesta.access) {
        localStorage.setItem('authToken', respuesta.access);
        console.log('Token guardado (access):', respuesta.access);
      }
      // OPCIÓN 3: Si usa "access_token"
      else if (respuesta.access_token) {
        localStorage.setItem('authToken', respuesta.access_token);
        console.log('Token guardado (access_token):', respuesta.access_token);
      }
      else {
        console.warn('No se encontró token en la respuesta:', respuesta);
        throw new Error('No se recibió token de autenticación');
      }

      // Guardar usuario si existe
      if (respuesta.user) {
        localStorage.setItem('user', JSON.stringify(respuesta.user));
      }

      // Guardar refresh token si existe
      if (respuesta.refresh) {
        localStorage.setItem('refreshToken', respuesta.refresh);
      } else if (respuesta.refresh_token) {
        localStorage.setItem('refreshToken', respuesta.refresh_token);
      }

      // Verificar que se guardó correctamente
      const tokenGuardado = localStorage.getItem('authToken');
      console.log('Token verificado en localStorage:', tokenGuardado);

      // Redirigir al dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error completo en login:', error);
      
      // Mejor manejo de errores
      const mensajeError = error.response?.data?.message || 
                          error.message || 
                          'Error al iniciar sesión';
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const handleNavegacion = (tipo: string) => {
    if (tipo === 'registro') {
      navigate('/registro');
    }
  };

  return (
    <>
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
      <FormBase
        titulo="Iniciar Sesión"
        campos={camposLogin}
        botones={botonesLogin}
        onSubmit={handleSubmit}
        onNavegacion={handleNavegacion}
      />
    </>
  );
};