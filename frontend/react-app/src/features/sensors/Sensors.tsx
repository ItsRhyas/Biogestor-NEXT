import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface SensorData {
  temperatura: number;
  ph: number;
  presion: number;
  produccionGas: number;
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

const ChartCanvas = styled.canvas`
  width: 100%;
  height: 300px;
`;

export const Sensors: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData>({
    temperatura: 37.5,
    ph: 7.1,
    presion: 1.1,
    produccionGas: 23
  });
  const location = useLocation();

  const tempChartRef = useRef<HTMLCanvasElement>(null);
  const phChartRef = useRef<HTMLCanvasElement>(null);
  const pressureChartRef = useRef<HTMLCanvasElement>(null);
  const gasChartRef = useRef<HTMLCanvasElement>(null);

  const sensorSummaries: SensorSummary[] = [
    {
      label: 'Temperatura Actual',
      value: `${sensorData.temperatura}°C`,
      status: 'Estable',
      icon: 'fas fa-thermometer-half',
      color: '#26a69a',
      borderColor: '#26a69a'
    },
    {
      label: 'Nivel de pH',
      value: sensorData.ph.toString(),
      status: 'Neutro',
      icon: 'fas fa-flask',
      color: '#42a5f5',
      borderColor: '#42a5f5'
    },
    {
      label: 'Presión de Gas',
      value: `${sensorData.presion} bar`,
      status: 'Óptima',
      icon: 'fas fa-tachometer-alt',
      color: '#ffa726',
      borderColor: '#ffa726'
    },
    {
      label: 'Producción Biogás',
      value: `${sensorData.produccionGas} m³/día`,
      status: 'Alta',
      icon: 'fas fa-gas-pump',
      color: '#7e57c2',
      borderColor: '#7e57c2'
    }
  ];

  useEffect(() => {
    // Simular actualización de datos en tiempo real
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperatura: 37.5 + (Math.random() - 0.5) * 0.5,
        ph: 7.1 + (Math.random() - 0.5) * 0.1,
        presion: 1.1 + (Math.random() - 0.5) * 0.05,
        produccionGas: 23 + (Math.random() - 0.5) * 2
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <BarraLateral abierta={sidebarAbierta} />

      <MainContent>
        <BarraArriba
          vistaActual="Sensores"
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        
        <ContentWrapper>
          {/* Tarjetas de Resumen */}
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

          {/* Gráficos */}
          <ChartsGrid>
            <ChartCard>
              <ChartTitle>
                <ChartIcon className="fas fa-chart-line" />
                Temperatura (Últimas 24h)
              </ChartTitle>
              <ChartDescription>
                Variación de la temperatura del biodigestor.
              </ChartDescription>
              <ChartCanvas ref={tempChartRef} />
            </ChartCard>

            <ChartCard>
              <ChartTitle>
                <ChartIcon className="fas fa-chart-line" />
                Nivel de pH (Últimas 24h)
              </ChartTitle>
              <ChartDescription>
                Seguimiento de la acidez/alcalinidad.
              </ChartDescription>
              <ChartCanvas ref={phChartRef} />
            </ChartCard>

            <ChartCard>
              <ChartTitle>
                <ChartIcon className="fas fa-chart-bar" />
                Presión (Últimas 24h)
              </ChartTitle>
              <ChartDescription>
                Niveles de presión dentro del biodigestor.
              </ChartDescription>
              <ChartCanvas ref={pressureChartRef} />
            </ChartCard>

            <ChartCard>
              <ChartTitle>
                <ChartIcon className="fas fa-chart-area" />
                Producción de Gas (Últimas 24h)
              </ChartTitle>
              <ChartDescription>
                Volumen de biogás generado.
              </ChartDescription>
              <ChartCanvas ref={gasChartRef} />
            </ChartCard>
          </ChartsGrid>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};