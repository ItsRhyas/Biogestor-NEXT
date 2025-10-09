import React, { useState } from 'react';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';

interface CalculatorForm {
  materialType: string;
  quantity: number;
  organicContent: number;
  humidityLevel: number;
  temperature: number;
  retentionTime: number;
}

interface CalculationResult {
  biogasProduction: number;
  energyEquivalent: number;
  fertilizerProduction: number;
  efficiency: string;
}

export const ProductionCalculator: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [formData, setFormData] = useState<CalculatorForm>({
    materialType: '',
    quantity: 2500,
    organicContent: 85,
    humidityLevel: 75,
    temperature: 37,
    retentionTime: 25
  });
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const materialTypes = [
    { value: 'estiercol_vacuno', label: 'Estiércol Vacuno' },
    { value: 'estiercol_porcino', label: 'Estiércol Porcino' },
    { value: 'residuos_agricolas', label: 'Residuos Agrícolas' },
    { value: 'residuos_comida', label: 'Residuos de Comida' }
  ];

  const handleInputChange = (field: keyof CalculatorForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateProduction = () => {
    // Cálculos basados en parámetros del biodigestor
    const biogasFactor = {
      'estiercol_vacuno': 0.035,
      'estiercol_porcino': 0.045,
      'residuos_agricolas': 0.030,
      'residuos_comida': 0.050
    }[formData.materialType] || 0.035;

    const biogasProduction = formData.quantity * biogasFactor * (formData.organicContent / 100);
    const energyEquivalent = biogasProduction * 6; // 6 kWh por m³ de biogás
    const fertilizerProduction = formData.quantity * 0.6; // 60% del material se convierte en fertilizante
    
    const efficiency = formData.temperature >= 35 && formData.temperature <= 40 ? 'Alta' :
                      formData.temperature >= 30 && formData.temperature < 35 ? 'Media' : 'Baja';

    setResults({
      biogasProduction: Math.round(biogasProduction * 100) / 100,
      energyEquivalent: Math.round(energyEquivalent * 100) / 100,
      fertilizerProduction: Math.round(fertilizerProduction * 100) / 100,
      efficiency
    });
    setShowResults(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialType) {
      alert('Por favor selecciona el tipo de material');
      return;
    }
    calculateProduction();
  };

  const handleClear = () => {
    setFormData({
      materialType: '',
      quantity: 2500,
      organicContent: 85,
      humidityLevel: 75,
      temperature: 37,
      retentionTime: 25
    });
    setResults(null);
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
            Calculadora de Producción
          </h2>
          <p style={{ marginBottom: '2rem', color: '#555' }}>
            Estima la producción de biogás basada en los datos de llenado.
          </p>

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
                    Ingresa los parámetros del material para calcular la producción estimada.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    color: '#555',
                    fontSize: '0.9rem'
                  }}>
                    Tipo de Material
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.materialType}
                      onChange={(e) => handleInputChange('materialType', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '1px solid #e0e0e0',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        backgroundColor: '#fdfdfd',
                        appearance: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" disabled>Selecciona el tipo de material</option>
                      {materialTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-chevron-down" style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#555',
                      pointerEvents: 'none'
                    }}></i>
                  </div>
                </div>

                {['quantity', 'organicContent', 'humidityLevel', 'temperature', 'retentionTime'].map((field, index) => {
                  const labels = {
                    quantity: 'Cantidad (kg)',
                    organicContent: 'Contenido Orgánico (%)',
                    humidityLevel: 'Nivel de Humedad (%)',
                    temperature: 'Temperatura (°C)',
                    retentionTime: 'Tiempo de Retención (días)'
                  };

                  return (
                    <div key={field} style={{ marginBottom: '1rem' }}>
                      <label style={{
                        display: 'block',
                        fontWeight: 500,
                        marginBottom: '0.5rem',
                        color: '#555',
                        fontSize: '0.9rem'
                      }}>
                        {labels[field as keyof typeof labels]}
                      </label>
                      <input
                        type="number"
                        value={formData[field as keyof CalculatorForm]}
                        onChange={(e) => handleInputChange(field as keyof CalculatorForm, parseFloat(e.target.value) || 0)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '1px solid #e0e0e0',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          backgroundColor: '#fdfdfd'
                        }}
                      />
                    </div>
                  );
                })}

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
                    Estimación de la producción de biogás y energía equivalente.
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
                  {results && (
                    <div>
                      <div style={{
                        backgroundColor: '#e8f5e8',
                        padding: '1rem',
                        borderRadius: '5px',
                        marginBottom: '1.5rem'
                      }}>
                        <h5 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>
                          Eficiencia: {results.efficiency}
                        </h5>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                          Basado en los parámetros ingresados
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '5px'
                        }}>
                          <span style={{ fontWeight: 500 }}>Producción de Biogás:</span>
                          <strong style={{ color: '#28a745' }}>
                            {results.biogasProduction} m³/día
                          </strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '5px'
                        }}>
                          <span style={{ fontWeight: 500 }}>Energía Equivalente:</span>
                          <strong style={{ color: '#ffa726' }}>
                            {results.energyEquivalent} kWh
                          </strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '5px'
                        }}>
                          <span style={{ fontWeight: 500 }}>Fertilizante:</span>
                          <strong style={{ color: '#7e57c2' }}>
                            {results.fertilizerProduction} L
                          </strong>
                        </div>
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