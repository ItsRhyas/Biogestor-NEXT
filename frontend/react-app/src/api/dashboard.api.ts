// api/dashboard.api.ts
import apiClient from '../services/authService';

export interface CreateFillingRequest {
  date?: string; // YYYY-MM-DD
  number: number;
  people?: string;
  material_type: 'bovino' | 'porcino' | 'vegetal';
  material_amount_kg: number;
  material_humidity_pct: number;
  added_water_m3?: number;
  temperature_c?: number;
}

export interface Series {
  days: number[];
  daily_biogas_m3: number[];
  cumulative_biogas_m3: number[];
}

export interface CurrentProductionResponse {
  stage: {
    id: number;
    number: number;
    date: string;
    material_type: 'bovino' | 'porcino' | 'vegetal' | string;
    material_amount_kg: number;
    temperature_c: number;
  };
  expected: Series & { A_biogas_m3?: number };
  actual: Series;
}

export async function createFilling(data: CreateFillingRequest) {
  const response = await apiClient.post('/api/dashboard/fillings/', data);
  return response.data as { id: number };
}

export async function getCurrentProduction() {
  const response = await apiClient.get('/api/dashboard/production/current/');
  return response.data as CurrentProductionResponse;
}

export const createReport = async (reportType: 'normal' | 'final', observations: string) => {
  const res = await apiClient.post('/api/dashboard/report/create/', {
    report_type: reportType,
    observations,
  });
  return res.data;
};

export const getReportHistory = async () => {
  const res = await apiClient.get('/api/dashboard/report/history/');
  return res.data.history;
};

export const downloadReportFile = async (url: string) => {
  const res = await apiClient.get(url, { responseType: 'blob' });
  return res.data;
};

export const closeCurrentFilling = async () => {
  const res = await apiClient.post('/api/dashboard/fillings/close-current/');
  return res.data as { detail: string; stage_id: number };
};

export const createActuatorCommand = async (payload: { device: string; target: string; action: 'OPEN'|'CLOSE'|'SET'; value?: number; extra?: any }) => {
  const res = await apiClient.post('/api/dashboard/actuators/command/', {
    device: payload.device,
    target: payload.target,
    action: payload.action,
    value: payload.value ?? null,
    payload: payload.extra ?? null,
  });
  return res.data;
};

export const getAlerts = async () => {
  const res = await apiClient.get('/api/dashboard/alerts/');
  return res.data as Array<{ id:number; level:string; message:string; created_at:string }>;
};

export const resolveAlert = async (id: number) => {
  const res = await apiClient.post(`/api/dashboard/alerts/${id}/resolve/`);
  return res.data;
};

export const reportByRange = async (start: string, end: string, format: 'excel'|'csv' = 'excel') => {
  const res = await apiClient.post(`/api/dashboard/report/by-range/?format=${format}`, { start_date: start, end_date: end }, { responseType: 'blob' });
  return res.data as Blob;
};

// Calibrations API
export type CalibrationRecord = {
  id: number;
  sensor_name: string;
  date: string; // ISO date
  notes: string;
  created_at: string;
};

export const getCalibrations = async () => {
  const res = await apiClient.get('/api/dashboard/calibrations/');
  return res.data as CalibrationRecord[];
};

export const createCalibration = async (payload: { sensor_name: string; date: string; notes?: string }) => {
  const res = await apiClient.post('/api/dashboard/calibrations/', payload);
  return res.data as CalibrationRecord;
};

export const exportCalibrations = async () => {
  const res = await apiClient.get('/api/dashboard/calibrations/export/', { responseType: 'blob' });
  return res.data as Blob;
};

// Practice sessions API
export type PracticeSession = {
  id: number;
  started_at: string;
  ended_at?: string | null;
  started_by?: number | null;
  ended_by?: number | null;
};

export const getPracticeStatus = async () => {
  const res = await apiClient.get('/api/dashboard/practice/status/');
  return res.data as { active: PracticeSession | null; last: PracticeSession | null };
};

export const startPractice = async () => {
  const res = await apiClient.post('/api/dashboard/practice/start/');
  return res.data as PracticeSession;
};

export const stopPractice = async (format: 'excel'|'csv' = 'excel') => {
  const res = await apiClient.post(`/api/dashboard/practice/stop/?format=${format}`, {}, { responseType: 'blob' });
  return res.data as Blob;
};
