import React, { useState } from 'react';
import { calcularProduccion } from '../../api/calculadora.api';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';

interface CalculatorForm {
  material_type: 'bovino' | 'porcino' | 'vegetal';
  vs_per_day: number;
  reactor_volume: number | null;
  temperature: number;
  HRT?: number;
  target_fraction?: number;
}

interface SeriesResult {
  days: number[];
  daily_biogas_m3: number[];
  cumulative_biogas_m3: number[];
  A_biogas_m3: number;
}

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const ProductionCalculator: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [formData, setFormData] = useState<CalculatorForm>({
    material_type: 'bovino',
    vs_per_day: 2500,
    reactor_volume: null,
    temperature: 35,
    HRT: undefined,
    target_fraction: 0.95,
  });
  const [series, setSeries] = useState<SeriesResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);

  const handleInputChange = (field: keyof CalculatorForm, value: string | number | null) => {
    setFormData((prev: CalculatorForm) => ({ ...prev, [field]: value as any }));
  };

  const calculateProduction = async () => {
    try {
      const result = await calcularProduccion(formData);
      setSeries({
        days: result.days,
        daily_biogas_m3: result.daily_biogas_m3,
        cumulative_biogas_m3: result.cumulative_biogas_m3,
        A_biogas_m3: result.A_biogas_m3,
      });
      setShowResults(true);
    } catch (error) {
      alert('Error al calcular producción.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await calculateProduction();
  };

  const handleClear = () => {
    setFormData({
      material_type: 'bovino',
      vs_per_day: 2500,
      reactor_volume: null,
      temperature: 35,
      HRT: undefined,
      target_fraction: 0.95,
    });
    setSeries(null);
    setShowResults(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <BarraLateral abierta={sidebarAbierta} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <BarraArriba
          vistaActual="Calculadora de Productos"
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        
        <div style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '0.5rem' }}>
            Calculadora de Producción (Biodigestor de bolsa)
          </h2>
          <div style={{ marginBottom: '2rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ margin: 0 }}>
              Estimación basada en Gompertz modificado, ajustado por temperatura y tipo de materia.
            </p>
            <button onClick={() => setShowFormulas(v => !v)} style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: 6, padding: '0.4rem 0.75rem', cursor: 'pointer' }}>
              {showFormulas ? 'Ocultar fórmulas' : 'Ver fórmulas'}
            </button>
          </div>
          {showFormulas && (
            <div style={{ background: '#f9fafb', border: '1px solid #ececec', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.92rem', color: '#333' }}>
              <strong>Resumen del modelo:</strong>
              <ul style={{ marginTop: '0.5rem' }}>
                <li>Gompertz modificado para biogás acumulado: B(t) = A * exp(-exp((μe/A)(λ - t) + 1))</li>
                <li>Producción diaria: dB/dt derivada de Gompertz</li>
                <li>Ajuste por temperatura (Q10): μ(T) = μref * Q10^((T-35)/10)</li>
                <li>Sustrato (Monod): μeff = μ(T) * S/(Ks + S)</li>
                <li>Parámetros por material: rendimiento Y, fCH4, μref, λ</li>
              </ul>
              <small>Referencias: Angelidaki et al., Batstone et al., Monod (1949).</small>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr',
            gap: '1.5rem'
          }}>
            {/* Formulario de Entrada */}
            <Card>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '1rem'
              }}>
                <i className="fas fa-edit" style={{
                  fontSize: '1.2rem',
                  color: '#28a745',
                  marginTop: '5px'
                }}></i>
                <div>
                  <h4 style={{ margin: 0, color: '#333' }}>Datos de Entrada</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                    Ingresa los parámetros del material para calcular la producción esperada.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                    Tipo de materia orgánica
                  </label>
                  <select
                    value={formData.material_type}
                    onChange={e => setFormData((prev: CalculatorForm) => ({ ...prev, material_type: e.target.value as any }))}
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem', backgroundColor: '#fdfdfd' }}
                  >
                    <option value="bovino">Desechos bovinos</option>
                    <option value="porcino">Desechos porcinos</option>
                    <option value="vegetal">Residuos vegetales</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                    Materia orgánica (kg VS / día)
                  </label>
                  <input
                    type="number"
                    value={formData.vs_per_day}
                    onChange={e => handleInputChange('vs_per_day', parseFloat(e.target.value) || 0)}
                    required
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem', backgroundColor: '#fdfdfd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                    Volumen del biodigestor (m³) (opcional)
                  </label>
                  <input
                    type="number"
                    value={formData.reactor_volume ?? ''}
                    onChange={e => handleInputChange('reactor_volume', e.target.value ? parseFloat(e.target.value) : null)}
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem', backgroundColor: '#fdfdfd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                    Temperatura (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.temperature}
                    onChange={e => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                    required
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem', backgroundColor: '#fdfdfd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                    Fracción objetivo del potencial (0 - 1)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={formData.target_fraction ?? 0.95}
                    onChange={e => handleInputChange('target_fraction', parseFloat(e.target.value) || 0.95)}
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem', backgroundColor: '#fdfdfd' }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '2rem'
                }}>
                  <button
                    type="button"
                    onClick={handleClear}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#555',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'color 0.3s'
                    }}
                  >
                    <i className="fas fa-undo"></i>
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '0.8rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-calculator"></i>
                    Calcular
                  </button>
                </div>
              </form>
            </Card>

            {/* Resultados */}
            <Card>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '1rem'
              }}>
                <i className="fas fa-chart-line" style={{
                  fontSize: '1.2rem',
                  color: '#28a745',
                  marginTop: '5px'
                }}></i>
                <div>
                  <h4 style={{ margin: 0, color: '#333' }}>Resultados de Producción</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                    Serie esperada de producción diaria y acumulada.
                  </p>
                </div>
              </div>

              {!showResults ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  height: '100%',
                  color: '#555'
                }}>
                  <i className="fas fa-calculator" style={{
                    fontSize: '3.5rem',
                    color: '#ccc',
                    marginBottom: '1.5rem'
                  }}></i>
                  <p>Ingresa los datos y presiona "Calcular" para obtener la estimación de producción.</p>
                </div>
              ) : (
                <div>
                  {series && (
                    <div>
                      <div style={{
                        backgroundColor: '#e8f5e8',
                        padding: '1rem',
                        borderRadius: '5px',
                        marginBottom: '1.5rem'
                      }}>
                        <h5 style={{ margin: 0, color: '#2e7d32' }}>Serie esperada (Gompertz modificado)</h5>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>A = {series.A_biogas_m3.toFixed(2)} m³</p>
                      </div>
                      <div style={{ height: 320 }}>
                        <Line
                          data={{
                            labels: series.days.map((d: number) => `Día ${d}`),
                            datasets: [
                              {
                                label: 'Diario (m³/día)',
                                data: series.daily_biogas_m3,
                                borderColor: '#26a69a',
                                backgroundColor: '#26a69a20',
                                tension: 0.3,
                                yAxisID: 'y1',
                              },
                              {
                                label: 'Acumulado (m³)',
                                data: series.cumulative_biogas_m3,
                                borderColor: '#42a5f5',
                                backgroundColor: '#42a5f520',
                                tension: 0.3,
                                yAxisID: 'y2',
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: { mode: 'index', intersect: false },
                            scales: {
                              y1: { type: 'linear', position: 'left', title: { display: true, text: 'm³/día' } },
                              y2: { type: 'linear', position: 'right', title: { display: true, text: 'm³' }, grid: { drawOnChartArea: false } },
                            },
                            plugins: { legend: { display: true }, title: { display: false } },
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};