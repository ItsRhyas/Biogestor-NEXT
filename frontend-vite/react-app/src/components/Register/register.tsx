// Register.jsx
import { useState } from 'react';
import { FormBase } from '../../shared/credenciales/formulario';
import { authService } from '../../services/Usuarios';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const camposRegistro = [
    { name: 'username', type: 'text', placeholder: 'Nombre de usuario', required: true },
    { name: 'email', type: 'email', placeholder: 'Correo electrónico', required: true },
    { name: 'first_name', type: 'text', placeholder: 'Nombre', required: true },
    { name: 'last_name', type: 'text', placeholder: 'Apellido', required: true },
    { name: 'password', type: 'password', placeholder: 'Contraseña', required: true },
    { name: 'password2', type: 'password', placeholder: 'Confirmar contraseña', required: true }
  ];

  const botonesRegistro = [
    { 
      label: loading ? "Creando cuenta..." : "Registrarse", 
      color: "#01663d",
      tipo: "registro",
      accion: "submit" as const
    },
    { 
      label: "Volver al Login", 
      color: "#fafafa", 
      tipo: "login",
      accion: "navegacion" as const
    }
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const datosRegistro = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        password2: formData.password2
      };

      const respuesta = await authService.registrarUsuario(datosRegistro);
      
      console.log('Registro exitoso:', respuesta);
      
      // Opcional: iniciar sesión automáticamente después del registro
      if (respuesta.token) {
        localStorage.setItem('authToken', respuesta.token);
        localStorage.setItem('user', JSON.stringify(respuesta.user));
        navigate('/dashboard');
      } else {
        // Si no hay token, redirigir al login
        navigate('/login');
      }

     } catch (error: any) { // ← Agrega ': any' aquí también
      setError(error.message || 'Error en el registro');
      console.error('Error en registro:', error);
    } finally {
    setLoading(false);
  }
  };

  const handleNavegacion = (tipo: string) => {
    if (tipo === 'login') {
      navigate('/login');
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
        titulo="Crear Cuenta"
        campos={camposRegistro}
        botones={botonesRegistro}
        onSubmit={handleSubmit}
        onNavegacion={handleNavegacion}
      />
    </>
  );
};