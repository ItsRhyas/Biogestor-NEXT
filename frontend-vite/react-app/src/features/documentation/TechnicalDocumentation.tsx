import React, { useState } from 'react';
import styled from 'styled-components';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import { Card } from '../../shared/card/card';

const DocumentationContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;  // ← Cambia flexDirection por flex-direction
`;

const PageContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const SectionHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: #555;
`;

const TabsNavigation = styled.div`
  display: flex;
  background-color: #f1f3f5;
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  text-align: center;
  background-color: ${props => props.active ? '#333' : 'transparent'};
  border: none;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: ${props => props.active ? 600 : 500};
  cursor: pointer;
  color: ${props => props.active ? 'white' : '#555'};
  transition: all 0.3s ease;
  border-radius: 6px;

  &:hover {
    background-color: ${props => props.active ? '#333' : '#e9ecef'};
  }
`;

const TabContent = styled.div<{ active: boolean }>`
  display: ${props => props.active ? 'block' : 'none'};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
`;

const SummaryItem = styled.div`
  h3 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #555;
    line-height: 1.6;
  }

  > h4 {
    font-size: 1rem;
    color: #333;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
    margin-bottom: 1rem;
    color: #555;
  }

  ul li h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
  }

  ul li p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const ProcessSection = styled.div`
  h3 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 0.25rem;
  }

  > p {
    color: #555;
    margin-bottom: 1.5rem;
  }
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  text-align: center;
`;

const Step = styled.div<{ stepNumber: number }>`
  padding: 1.5rem;
  border-radius: 10px;
  background-color: ${props => {
    switch(props.stepNumber) {
      case 1: return '#e7f7ec';
      case 2: return '#e9f0fa';
      case 3: return '#fff8e1';
      case 4: return '#f3e5f5';
      default: return '#f9f9f9';
    }
  }};
`;

const StepNumber = styled.div<{ stepNumber: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0 auto 1rem auto;
  background-color: ${props => {
    switch(props.stepNumber) {
      case 1: return '#28a745';
      case 2: return '#42a5f5';
      case 3: return '#ff9800';
      case 4: return '#9c27b0';
      default: return '#555';
    }
  }};
`;

const StepTitle = styled.h4`
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin: 0;
`;

export const TechnicalDocumentation: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'videos', label: 'Videos' },
    { id: 'galeria', label: 'Galería' }
  ];

  return (
    <DocumentationContainer>
      <BarraLateral abierta={sidebarAbierta} />

      <ContentContainer>
        <BarraArriba
          vistaActual="Documentación Técnica"
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        
        <PageContent>
          <SectionHeader>
            <SectionTitle>Documentación Técnica</SectionTitle>
            <SectionDescription>
              Recursos técnicos y educativos sobre biodigestores
            </SectionDescription>
          </SectionHeader>

          <TabsNavigation>
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </TabsNavigation>

          <TabContent active={activeTab === 'resumen'}>
            <SummaryGrid>
              <SummaryItem>
                <h3>¿Qué es un Biodigestor?</h3>
                <p>
                  Un biodigestor es un sistema biotecnológico que aprovecha la fermentación 
                  anaerobia para degradar la materia orgánica y producir biogás y fertilizante 
                  orgánico. Este proceso natural ocurre en ausencia de oxígeno y es realizado 
                  por microorganismos especializados.
                </p>
                <h4>Beneficios principales:</h4>
                <ul>
                  <li>Producción de energía renovable (biogás)</li>
                  <li>Tratamiento de residuos orgánicos</li>
                  <li>Obtención de fertilizante orgánico</li>
                  <li>Reducción de emisiones de gases de efecto invernadero</li>
                </ul>
              </SummaryItem>

              <SummaryItem>
                <h3>Componentes del Sistema</h3>
                <ul>
                  <li>
                    <h4>Cámara de Digestión</h4>
                    <p>Contenedor hermético donde ocurre la fermentación anaeróbica</p>
                  </li>
                  <li>
                    <h4>Sistema de Alimentación</h4>
                    <p>Mecanismo para introducir materia orgánica al biodigestor</p>
                  </li>
                  <li>
                    <h4>Gasómetro</h4>
                    <p>Almacena el biogás producido para su posterior uso</p>
                  </li>
                  <li>
                    <h4>Sistema de Monitoreo</h4>
                    <p>Sensores para controlar temperatura, pH y presión</p>
                  </li>
                </ul>
              </SummaryItem>
            </SummaryGrid>

            <ProcessSection>
              <h3>Proceso de Digestión Anaeróbica</h3>
              <p>Las cuatro etapas del proceso de fermentación</p>
              <ProcessSteps>
                <Step stepNumber={1}>
                  <StepNumber stepNumber={1}>1</StepNumber>
                  <StepTitle>Hidrólisis</StepTitle>
                  <StepDescription>
                    Descomposición de compuestos complejos en moléculas simples
                  </StepDescription>
                </Step>
                <Step stepNumber={2}>
                  <StepNumber stepNumber={2}>2</StepNumber>
                  <StepTitle>Acidogénesis</StepTitle>
                  <StepDescription>
                    Conversión en ácidos orgánicos simples
                  </StepDescription>
                </Step>
                <Step stepNumber={3}>
                  <StepNumber stepNumber={3}>3</StepNumber>
                  <StepTitle>Acetogénesis</StepTitle>
                  <StepDescription>
                    Formación de acetato, hidrógeno y CO₂
                  </StepDescription>
                </Step>
                <Step stepNumber={4}>
                  <StepNumber stepNumber={4}>4</StepNumber>
                  <StepTitle>Metanogénesis</StepTitle>
                  <StepDescription>
                    Producción final de metano y CO₂
                  </StepDescription>
                </Step>
              </ProcessSteps>
            </ProcessSection>
          </TabContent>

          <TabContent active={activeTab === 'documentos'}>
            <Card>
              <h3>Documentos Técnicos</h3>
              <p>Próximamente: Documentos descargables sobre operación y mantenimiento</p>
            </Card>
          </TabContent>

          <TabContent active={activeTab === 'videos'}>
            <Card>
              <h3>Videos Educativos</h3>
              <p>Próximamente: Videos instructivos sobre biodigestores</p>
            </Card>
          </TabContent>

          <TabContent active={activeTab === 'galeria'}>
            <Card>
              <h3>Galería de Imágenes</h3>
              <p>Próximamente: Imágenes de sistemas de biodigestión</p>
            </Card>
          </TabContent>
        </PageContent>
      </ContentContainer>
    </DocumentationContainer>
  );
};