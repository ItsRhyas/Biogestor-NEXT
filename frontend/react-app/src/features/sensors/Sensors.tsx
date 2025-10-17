import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { sensorService, Sensor, SensorReading } from '../../services/sensorService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SensorData {
  temperatura: number;
  ph: number;
  presion: number;
  produccionGas: number;
}

interface SensorWithData extends Sensor {
  currentValue: number | null;
  historicalData: SensorReading[];
}

interface SensorSummary {
  label: string;
  value: string;
  status: string;
  icon: string;
  color: string;
  borderColor: string;
}

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  padding: 20px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled(Card)<{ $borderColor: string }>`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-left: 4px solid ${props => props.$borderColor};
`;

const IconContainer = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
  background-color: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const SummaryContent = styled.div`
  flex: 1;
`;

const SummaryLabel = styled.p`
  margin: 0;
  color: #555;
  font-weight: 500;
`;

const SummaryValue = styled.h3`
  margin: 0.25rem 0;
  font-size: 1.75rem;
  color: #333;
`;

const SummaryStatus = styled.small<{ $color: string }>`
  font-weight: 500;
  color: ${props => props.$color};
`;

const ChartCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
`;

const ChartIcon = styled.i`
  margin-right: 0.5rem;
  color: #28a745;
`;

const ChartDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #555;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
`;

export const Sensors: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [sensors, setSensors] = useState<SensorWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Función para preparar datos del gráfico
  const prepareChartData = (sensor: SensorWithData) => {
    const labels = sensor.historicalData.map(d => {
      const date = new Date(d.time * 1000);
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    });

    return {
      labels,
      datasets: [
        {
          label: `${sensor.name} (${sensor.unit})`,
          data: sensor.historicalData.map(d => d.value),
          borderColor: sensor.color,
          backgroundColor: `${sensor.color}33`,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        grid: {
          color: '#e0e0e0'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  // Función para obtener el estado del sensor basado en umbrales
  const getSensorStatus = (sensor: SensorWithData): string => {
    if (sensor.currentValue === null) return 'Sin datos';
    
    if (sensor.threshold_min !== null && sensor.currentValue < sensor.threshold_min) {
      return 'Bajo';
    }
    if (sensor.threshold_max !== null && sensor.currentValue > sensor.threshold_max) {
      return 'Alto';
    }
    return 'Normal';
  };

  // Generar datos históricos simulados realistas para biodigestor (últimas 24 horas)
  const generateMockHistoricalData = (
    baseValue: number, 
    variation: number, 
    sensorType: 'temperatura' | 'ph' | 'presion' | 'gas'
  ): SensorReading[] => {
    const data: SensorReading[] = [];
    const now = Date.now() / 1000;
    const hoursAgo24 = 24 * 60 * 60;
    const interval = 5 * 60; // Cada 5 minutos
    
    let currentValue = baseValue;
    
    for (let i = hoursAgo24; i >= 0; i -= interval) {
      const hourOfDay = new Date((now - i) * 1000).getHours();
      
      // Patrones específicos por tipo de sensor
      switch (sensorType) {
        case 'temperatura':
          // Ciclo diurno: más calor durante el día (10am-6pm)
          const tempCycle = Math.sin((hourOfDay - 6) * Math.PI / 12) * 1.5;
          currentValue = baseValue + tempCycle + (Math.random() - 0.5) * 0.3;
          break;
          
        case 'ph':
          // pH más estable, pequeñas variaciones graduales
          currentValue += (Math.random() - 0.5) * 0.05;
          currentValue = Math.max(6.8, Math.min(7.4, currentValue)); // Mantener rango
          break;
          
        case 'presion':
          // Presión aumenta gradualmente con producción de gas
          const pressureTrend = Math.sin(i / (6 * 60 * 60) * Math.PI) * 0.15;
          currentValue = baseValue + pressureTrend + (Math.random() - 0.5) * 0.05;
          break;
          
        case 'gas':
          // Producción de gas con picos durante digestión activa
          const gasCycle = Math.sin((hourOfDay - 8) * Math.PI / 10) * 3;
          const gasNoise = (Math.random() - 0.5) * 1.5;
          currentValue = Math.max(18, baseValue + gasCycle + gasNoise);
          break;
      }
      
      data.push({
        time: now - i,
        value: parseFloat(currentValue.toFixed(2))
      });
    }
    
    return data;
  };

  // Datos simulados de fallback
  const getMockSensors = (): SensorWithData[] => {
    const tempData = generateMockHistoricalData(37.5, 2, 'temperatura');
    const phData = generateMockHistoricalData(7.1, 0.3, 'ph');
    const presionData = generateMockHistoricalData(1.1, 0.2, 'presion');
    const gasData = generateMockHistoricalData(23, 4, 'gas');
    
    return [
      {
        id: 1,
        name: 'Temperatura',
        topic: 'sensor/temperatura',
        unit: '°C',
        threshold_min: 30,
        threshold_max: 42,
        color: '#26a69a',
        icon: 'fas fa-thermometer-half',
        room: 'biodigestor_1',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        currentValue: tempData[tempData.length - 1].value,
        historicalData: tempData
      },
      {
        id: 2,
        name: 'Nivel de pH',
        topic: 'sensor/ph',
        unit: 'pH',
        threshold_min: 6.5,
        threshold_max: 7.5,
        color: '#42a5f5',
        icon: 'fas fa-flask',
        room: 'biodigestor_1',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        currentValue: phData[phData.length - 1].value,
        historicalData: phData
      },
      {
        id: 3,
        name: 'Presión de Gas',
        topic: 'sensor/presion',
        unit: 'bar',
        threshold_min: 0.8,
        threshold_max: 1.5,
        color: '#ffa726',
        icon: 'fas fa-tachometer-alt',
        room: 'biodigestor_1',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        currentValue: presionData[presionData.length - 1].value,
        historicalData: presionData
      },
      {
        id: 4,
        name: 'Producción Biogás',
        topic: 'sensor/gas',
        unit: 'm³/día',
        threshold_min: 18,
        threshold_max: 35,
        color: '#7e57c2',
        icon: 'fas fa-gas-pump',
        room: 'biodigestor_1',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        currentValue: gasData[gasData.length - 1].value,
        historicalData: gasData
      }
    ];
  };

  // Cargar sensores desde la API
  const loadSensors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sensorsData = await sensorService.getAllSensors();
      
      // Si no hay sensores en la API, usar datos simulados
      if (sensorsData.length === 0) {
        console.log('No hay sensores en la API, usando datos simulados');
        setSensors(getMockSensors());
        setLoading(false);
        return;
      }
      
      // Obtener datos actuales e históricos para cada sensor
      const sensorsWithData = await Promise.all(
        sensorsData.map(async (sensor) => {
          try {
            const [readings, historicalData] = await Promise.all([
              sensorService.getReadings(sensor.id),
              sensorService.getSensorData(sensor.id, 'day')
            ]);
            
            const currentValue = readings.length > 0 ? readings[0].value : null;
            
            return {
              ...sensor,
              currentValue,
              historicalData
            };
          } catch (err) {
            console.error(`Error loading data for sensor ${sensor.id}:`, err);
            return {
              ...sensor,
              currentValue: null,
              historicalData: []
            };
          }
        })
      );
      
      setSensors(sensorsWithData);
    } catch (err) {
      console.error('Error loading sensors:', err);
      // Si hay error de conexión, usar datos simulados
      console.log('Backend no disponible, usando datos simulados');
      setSensors(getMockSensors());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensors();
    
    // Actualizar datos cada 10 segundos
    const interval = setInterval(() => {
      loadSensors();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Generar tarjetas de resumen dinámicamente desde los sensores
  const sensorSummaries: SensorSummary[] = sensors.map(sensor => ({
    label: sensor.name,
    value: sensor.currentValue !== null 
      ? `${sensor.currentValue.toFixed(2)} ${sensor.unit}`
      : 'Sin datos',
    status: getSensorStatus(sensor),
    icon: sensor.icon || 'fas fa-sensor',
    color: sensor.color,
    borderColor: sensor.color
  }));

  return (
    <Container>
      <BarraLateral abierta={sidebarAbierta} />

      <MainContent>
        <BarraArriba
          vistaActual="Sensores"
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        
        <ContentWrapper>
          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Cargando sensores...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fee', 
              color: '#c33', 
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Info: Usando datos simulados */}
          {!loading && sensors.length > 0 && sensors[0].id <= 4 && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fff3cd', 
              color: '#856404', 
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #ffeaa7'
            }}>
              <strong>ℹ️ Modo Demo:</strong> Mostrando datos simulados. Configura sensores reales en el admin de Django para ver datos en vivo.
            </div>
          )}

          {/* Tarjetas de Resumen */}
          {!loading && sensors.length > 0 && (
            <SummaryGrid>
              {sensorSummaries.map((summary, index) => (
                <SummaryCard key={index} $borderColor={summary.borderColor}>
                  <IconContainer $color={summary.color}>
                    <i className={summary.icon}></i>
                  </IconContainer>
                  <SummaryContent>
                    <SummaryLabel>{summary.label}</SummaryLabel>
                    <SummaryValue>{summary.value}</SummaryValue>
                    <SummaryStatus $color={summary.color}>
                      {summary.status}
                    </SummaryStatus>
                  </SummaryContent>
                </SummaryCard>
              ))}
            </SummaryGrid>
          )}

          {/* Gráficos - Mostrar dinámicamente basado en sensores */}
          {!loading && sensors.length > 0 && (
            <ChartsGrid>
              {sensors.slice(0, 4).map((sensor) => (
                <ChartCard key={sensor.id}>
                  <ChartTitle>
                    <ChartIcon className="fas fa-chart-line" />
                    {sensor.name} (Últimas 24h)
                  </ChartTitle>
                  <ChartDescription>
                    Historial de {sensor.name.toLowerCase()} - {sensor.unit}
                  </ChartDescription>
                  {sensor.historicalData.length > 0 ? (
                    <ChartContainer>
                      <Line data={prepareChartData(sensor)} options={chartOptions} />
                    </ChartContainer>
                  ) : (
                    <ChartContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ textAlign: 'center', color: '#999' }}>
                        Sin datos históricos disponibles
                      </p>
                    </ChartContainer>
                  )}
                </ChartCard>
              ))}
            </ChartsGrid>
          )}
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};