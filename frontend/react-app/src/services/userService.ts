import apiClient from './authService';
import { User, ApiResponse } from '../types';

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
      const response = await apiClient.post(`/api/usuarios/${userId}/aprobar/`);
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
};

export default userService;