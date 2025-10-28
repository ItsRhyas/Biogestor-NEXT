// api/dashboard.api.ts
import axios from 'axios';

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
  const response = await axios.post('/api/dashboard/fillings/', data);
  return response.data as { id: number };
}

export async function getCurrentProduction() {
  const response = await axios.get('/api/dashboard/production/current/');
  return response.data as CurrentProductionResponse;
}

export const createReport = async (reportType: 'normal' | 'final', observations: string) => {
  const res = await axios.post('/api/dashboard/report/create/', {
    report_type: reportType,
    observations,
  });
  return res.data;
};

export const getReportHistory = async () => {
  const res = await axios.get('/api/dashboard/report/history/');
  return res.data.history;
};

export const downloadReportFile = async (url: string) => {
  const res = await axios.get(url, { responseType: 'blob' });
  return res.data;
};
