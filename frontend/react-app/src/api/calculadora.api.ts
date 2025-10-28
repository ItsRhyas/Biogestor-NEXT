// api/calculadora.api.ts
import axios from 'axios';


export interface CalculatorRequest {
  material_type: 'bovino' | 'porcino' | 'vegetal';
  vs_per_day: number;
  reactor_volume?: number | null;
  temperature: number;
  HRT?: number;
  target_fraction?: number; // 0..1
}

export interface CalculatorResponse {
  biogas_m3_per_day_estimated: number;
  methane_m3_per_day: number;
  vs_degraded_kg_per_day: number;
  biol_volume_m3_per_day: number;
  cumulative_biogas_m3_at_HRT: number;
  efficiency: string;
}

export async function calcularProduccion(data: CalculatorRequest) {
  const response = await axios.post('/api/biocalculadora/estimate/', data);
  return response.data as {
    days: number[];
    daily_biogas_m3: number[];
    cumulative_biogas_m3: number[];
    A_biogas_m3: number;
    params: Record<string, unknown>;
  };
}
