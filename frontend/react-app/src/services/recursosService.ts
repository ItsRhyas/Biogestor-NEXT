import axios from 'axios';

export interface Recurso {
  id: number;
  nombre: string;
  file: string;
  fecha_subida: string;
  tipo_acceso: 'publico' | 'privado';
  institucion: number;
  institucion_nombre: string;
  usuario_subio: number;
  usuario_subio_username: string;
}

export interface CreateRecursoRequest {
  nombre: string;
  file: File;
  tipo_acceso: 'publico' | 'privado';
}

export interface DownloadResponse {
  download_url: string;
  nombre: string;
  tipo_acceso: string;
  tamaño: number;
  tipo_archivo: string;
}

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Obtener la institución actual del localStorage
const getInstitucionActual = (): string => {
  return localStorage.getItem('institucionActual') || '';
};

export const recursosService = {
  async getRecursos(): Promise<Recurso[]> {
    const institucion = getInstitucionActual();
    const response = await api.get(`/api/${institucion}/recursos/`);
    return response.data;
  },

  async getMisRecursos(): Promise<Recurso[]> {
    const institucion = getInstitucionActual();
    const response = await api.get(`/api/${institucion}/recursos/mis-recursos/`);
    return response.data;
  },

  async createRecurso(data: CreateRecursoRequest): Promise<Recurso> {
    const institucion = getInstitucionActual();
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('file', data.file);
    formData.append('tipo_acceso', data.tipo_acceso);

    const response = await api.post(`/api/${institucion}/recursos/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getDownloadUrl(recursoId: number): Promise<DownloadResponse> {
    const institucion = getInstitucionActual();
    const response = await api.get(`/api/${institucion}/recursos/${recursoId}/descargar/`);
    return response.data;
  },

  async deleteRecurso(recursoId: number): Promise<void> {
    const institucion = getInstitucionActual();
    await api.delete(`/api/${institucion}/recursos/${recursoId}/`);
  },
};
