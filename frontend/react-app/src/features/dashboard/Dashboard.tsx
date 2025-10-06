import React from 'react';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface DashboardStats {
  sensoresActivos: number;
  reportesGenerados: number;
  biodigestoresConectados: number;
}

interface BiodigestorStatus {
  temperatura: string;
  ph: string;
  presion: string;
  nivelGas: string;
  biogas24h: string;
  fertilizante24h: string;
  estadoOperativo: string;
}

export const Dashboard: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const location = useLocation();

  // Get current view name based on route
  const getCurrentViewName = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Perfil';
      case '/sensores':
        return 'Sensores';
      case '/reportes':
        return 'Reportes';
      case '/calculadora':
        return 'Calculadora de Productos';
      case '/asistente':
        return 'Asistente Virtual';
      case '/documentacion':
        return 'Documentación Técnica';
      default:
        return 'Dashboard';
    }
  };

  const stats: DashboardStats = {
    sensoresActivos: 12,
    reportesGenerados: 159,
    biodigestoresConectados: 1
  };

  const biodigestorStatus: BiodigestorStatus = {
    temperatura: '37.5°C',
    ph: '7.1',
    presion: '1.1 bar',
    nivelGas: '78%',
    biogas24h: '23 m³',
    fertilizante24h: '150 L',
    estadoOperativo: 'Normal'
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <BarraLateral abierta={sidebarAbierta} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <BarraArriba
          vistaActual={getCurrentViewName()}
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        
        <div style={{ padding: 20 }}>
          {/* Perfil de Usuario */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#e0f2f1',
                color: '#28a745',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 600,
                marginRight: '1.5rem'
              }}>
                JP
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#333' }}>Juan Pérez</h3>
                <p style={{ margin: 0, color: '#555' }}>juan.perez@biogestor.com</p>
                <span style={{
                  backgroundColor: '#f2faf4',
                  color: '#28a745',
                  border: '1px solid #28a745',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  marginTop: '0.5rem',
                  display: 'inline-block'
                }}>
                  Operador Senior
                </span>
              </div>
            </div>
          </Card>

          {/* Estadísticas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 45,
                  height: 45,
                  borderRadius: '8px',
                  backgroundColor: '#e0f2f1',
                  color: '#26a69a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '1.2rem'
                }}>
                  <i className="fas fa-microchip"></i>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>{stats.sensoresActivos}</h2>
                  <p style={{ margin: 0, color: '#555' }}>Sensores Activos</p>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 45,
                  height: 45,
                  borderRadius: '8px',
                  backgroundColor: '#e3f2fd',
                  color: '#42a5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '1.2rem'
                }}>
                  <i className="fas fa-file-alt"></i>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>{stats.reportesGenerados}</h2>
                  <p style={{ margin: 0, color: '#555' }}>Reportes Generados</p>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 45,
                  height: 45,
                  borderRadius: '8px',
                  backgroundColor: '#ede7f6',
                  color: '#7e57c2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '1.2rem'
                }}>
                  <i className="fas fa-seedling"></i>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>{stats.biodigestoresConectados}</h2>
                  <p style={{ margin: 0, color: '#555' }}>Biodigestor Conectado</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Estado del Biodigestor */}
          <Card>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>Estado Actual del Biodigestor</h4>
              <p style={{ margin: 0, color: '#555' }}>Datos en tiempo real del sistema principal.</p>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1.5rem',
              marginTop: '1.5rem',
              borderTop: '1px solid #e0e0e0',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h5 style={{ fontSize: '1rem', color: '#333', marginBottom: '1rem' }}>Parámetros Clave</h5>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', color: '#555' }}>
                    Temperatura 
                    <span style={{
                      fontSize: '0.85rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '5px',
                      fontWeight: 500,
                      backgroundColor: '#fff3e0',
                      color: '#ffa726'
                    }}>
                      {biodigestorStatus.temperatura}
                    </span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', color: '#555' }}>
                    pH
                    <span style={{
                      fontSize: '0.85rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '5px',
                      fontWeight: 500,
                      backgroundColor: '#e0f2f1',
                      color: '#26a69a'
                    }}>
                      {biodigestorStatus.ph}
                    </span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', color: '#555' }}>
                    Presión
                    <span style={{
                      fontSize: '0.85rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '5px',
                      fontWeight: 500,
                      backgroundColor: '#e3f2fd',
                      color: '#42a5f5'
                    }}>
                      {biodigestorStatus.presion}
                    </span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', color: '#555' }}>
                    Nivel de Gas
                    <span>{biodigestorStatus.nivelGas}</span>
                  </li>
                </ul>
              </div>

              <div style={{ flex: 1, minWidth: '250px' }}>
                <h5 style={{ fontSize: '1rem', color: '#333', marginBottom: '1rem' }}>Producción Estimada</h5>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', color: '#555' }}>
                    Biogás (últimas 24h)
                    <strong style={{ fontWeight: 600, color: '#333' }}>{biodigestorStatus.biogas24h}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', color: '#555' }}>
                    Fertilizante (últimas 24h)
                    <strong style={{ fontWeight: 600, color: '#333' }}>{biodigestorStatus.fertilizante24h}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', color: '#555' }}>
                    Estado Operativo
                    <strong style={{ fontWeight: 600, color: '#28a745' }}>{biodigestorStatus.estadoOperativo}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};