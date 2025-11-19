import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Configuración de axios para sensores
const sensorClient = axios.create({
  baseURL: `${API_BASE_URL}/api/dashboard`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si existe
sensorClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tipos
export interface Sensor {
  id: number;
  name: string;
  topic: string;
  unit: string;
  threshold_min: number | null;
  threshold_max: number | null;
  color: string;
  icon: string;
  room: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  time: number; // Unix timestamp
  value: number;
}

export interface SensorReadingDetail {
  id: number;
  sensor: number;
  sensor_name: string;
  value: number;
  timestamp: string;
}

// Servicios
export const sensorService = {
  // Obtener todos los sensores
  getAllSensors: async (): Promise<Sensor[]> => {
    const response = await sensorClient.get('/sensors/');
    return response.data;
  },

  // Obtener sensor por ID
  getSensorById: async (id: number): Promise<Sensor> => {
    const response = await sensorClient.get(`/sensors/${id}/`);
    return response.data;
  },

  // Obtener datos de un sensor con rango de tiempo
  getSensorData: async (
    id: number,
    range: 'day' | 'week' | 'month' = 'day'
  ): Promise<SensorReading[]> => {
    const response = await sensorClient.get(`/sensors/${id}/data/`, {
      params: { range }
    });
    return response.data;
  },

  // Crear sensor
  createSensor: async (sensor: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>): Promise<Sensor> => {
    const response = await sensorClient.post('/sensors/', sensor);
    return response.data;
  },

  // Actualizar sensor
  updateSensor: async (id: number, sensor: Partial<Sensor>): Promise<Sensor> => {
    const response = await sensorClient.put(`/sensors/${id}/`, sensor);
    return response.data;
  },

  // Eliminar sensor
  deleteSensor: async (id: number): Promise<void> => {
    await sensorClient.delete(`/sensors/${id}/`);
  },

  // Obtener lecturas
  getReadings: async (sensorId?: number): Promise<SensorReadingDetail[]> => {
    const params = sensorId ? { sensor: sensorId } : {};
    const response = await sensorClient.get('/readings/', { params });
    return response.data;
  },

  // Obtener última lectura de un sensor
  getLatestReading: async (sensorId: number): Promise<number | null> => {
    try {
      const readings = await sensorService.getReadings(sensorId);
      if (readings.length > 0) {
        return readings[0].value;
      }
      return null;
    } catch (error) {
      console.error('Error getting latest reading:', error);
      return null;
    }
  }
};
