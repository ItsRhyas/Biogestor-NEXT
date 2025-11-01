import apiClient from './authService';
import { User, ApiResponse, Permission } from '../types';

export const userService = {
  async getApprovedUsers(): Promise<{ usuarios: User[]; total: number }> {
    try {
      const response = await apiClient.get('/api/usuarios/');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
        'Error al obtener usuarios aprobados'
      );
    }
  },

  async getPendingUsers(): Promise<{ usuarios: User[]; total_pendientes: number }> {
    try {
      const response = await apiClient.get('/api/usuarios/pendientes/');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
        'Error al obtener usuarios pendientes'
      );
    }
  },

  async approveUser(userId: number): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post(`/api/usuario/${userId}/aprobar/`);
      return {
        data: response.data.usuario,
        message: response.data.mensaje,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
        'Error al aprobar usuario'
      );
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/api/usuario/actual/');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
        'Error al obtener información del usuario'
      );
    }
  },

  async getUserPermissions(userId: number): Promise<{ usuario_id: number; username: string; permisos: Permission[] }> {
    try {
      const response = await apiClient.get(`/api/usuarios/${userId}/ver-permisos/`);
      
      // CONVERTIR respuesta del backend a formato frontend
      const backendData = response.data;
      const permisosArray: Permission[] = [];
      
      // Si los permisos vienen como objeto, convertirlos a array
      if (backendData.Permisos && typeof backendData.Permisos === 'object') {
        for (const [key, value] of Object.entries(backendData.Permisos)) {
          if (key !== 'id') {
            permisosArray.push({
              id: key,
              codename: key,
              name: key.replace(/([A-Z])/g, ' $1').trim(), // "AprobarUsuarios" -> "Aprobar Usuarios"
              granted: value as boolean
            });
          }
        }
      }
      
      return {
        usuario_id: backendData.Usuario_id,
        username: backendData.UserName,
        permisos: permisosArray
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
        'Error al obtener permisos del usuario'
      );
    }
  },

  async updateUserPermissions(userId: number, permisos: Permission[]): Promise<ApiResponse<any>> {
    try {
      // CONVERTIR array frontend a objeto backend
      const permisosObj: { [key: string]: boolean } = {};
      permisos.forEach(permiso => {
        permisosObj[permiso.codename] = permiso.granted;
      });
      
      const response = await apiClient.post(
        `/api/usuarios/${userId}/cambiar-permisos/`, 
        permisosObj  // Enviar como objeto, no array
      );
      
      return {
        data: response.data,
        message: response.data.mensaje || 'Permisos actualizados correctamente',
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
        'Error al actualizar permisos del usuario'
      );
    }
  }
}; // ✅ ESTA ES LA LLAVE DE CIERRE QUE FALTABA

export default userService;