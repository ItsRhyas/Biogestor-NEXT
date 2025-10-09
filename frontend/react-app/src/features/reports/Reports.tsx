import React, { useState } from 'react';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import styled from 'styled-components';

interface Report {
  id: number;
  fecha: string;
  operador: string;
  cantidad: string;
  estado: 'Completado' | 'En Proceso' | 'Fallido';
  observaciones: string;
}

interface ReportStats {
  total: number;
  completados: number;
  enProceso: number;
  fallidos: number;
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

const WelcomeBanner = styled(Card)`
  background-color: #28a745;
  color: #000000;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h2`
  margin: 0 0 0.5rem 0;
`;

const WelcomeDescription = styled.p`
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)<{ $borderColor?: string }>`
  border-left: 4px solid ${props => props.$borderColor || '#e0e0e0'};
  padding: 1.5rem;
`;

const StatNumber = styled.h2`
  margin: 0;
  font-size: 2.5rem;
  color: #333;
`;

const StatLabel = styled.p`
  margin: 0;
  color: #555;
`;

const FiltersCard = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FiltersTitle = styled.h4`
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
`;

const Icon = styled.i`
  margin-right: 0.5rem;
`;

const CreateReportButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

const SearchIcon = styled(Icon)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #28a745;
  }
`;

const FilterSelectContainer = styled.div`
  position: relative;
  min-width: 180px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  appearance: none;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #28a745;
  }
`;

const SelectIcon = styled(Icon)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  pointer-events: none;
`;

const ExportButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const TableCard = styled(Card)`
  padding: 1.5rem;
`;

const TableTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  color: #333;
  display: flex;
  align-items: center;
`;

const TableDescription = styled.p`
  margin: 0 0 1.5rem 0;
  color: #555;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const TableHeader = styled.th`
  background-color: #f9f9f9;
  padding: 0.9rem 1.2rem;
  text-align: left;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 0.9rem 1.2rem;
  color: #555;
`;

const StatusTag = styled.span<{ $estado: 'Completado' | 'En Proceso' | 'Fallido' }>`
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
  
  ${props => {
    switch (props.$estado) {
      case 'Completado':
        return `
          background-color: #e6ffed;
          color: #28a745;
        `;
      case 'En Proceso':
        return `
          background-color: #fff8e1;
          color: #ffc107;
        `;
      case 'Fallido':
        return `
          background-color: #ffe6e6;
          color: #dc3545;
        `;
      default:
        return `
          background-color: #f0f0f0;
          color: #555;
        `;
    }
  }}
`;

export const Reports: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const stats: ReportStats = {
    total: 159,
    completados: 145,
    enProceso: 8,
    fallidos: 6
  };

  const reports: Report[] = [
    {
      id: 1,
      fecha: '2024-01-15',
      operador: 'Juan Pérez',
      cantidad: '2,500 Kg',
      estado: 'Completado',
      observaciones: 'Llenado exitoso con materia orgánica fresca'
    },
    {
      id: 2,
      fecha: '2024-01-14',
      operador: 'María García',
      cantidad: '2,200 Kg',
      estado: 'Completado',
      observaciones: 'Mezcla equilibrada de residuos vegetales'
    },
    {
      id: 3,
      fecha: '2024-01-13',
      operador: 'Carlos López',
      cantidad: '2,000 Kg',
      estado: 'En Proceso',
      observaciones: 'Llenado parcial, pendiente segunda carga'
    },
    {
      id: 4,
      fecha: '2024-01-12',
      operador: 'Ana Rodríguez',
      cantidad: '2,600 Kg',
      estado: 'Completado',
      observaciones: 'Excelente calidad de materia prima'
    },
    {
      id: 5,
      fecha: '2024-01-11',
      operador: 'Juan Pérez',
      cantidad: '2,100 Kg',
      estado: 'Fallido',
      observaciones: 'Problema en sistema de bombeo, carga incompleta'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.observaciones.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || report.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container>
      <BarraLateral abierta={sidebarAbierta} />

      <MainContent>
        <BarraArriba
          vistaActual="Reportes"
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        
        <ContentWrapper>
          {/* Banner de Bienvenida */}
          <WelcomeBanner>
            <WelcomeTitle>Reportes de Llenado</WelcomeTitle>
            <WelcomeDescription>Historial completo de cargas del biodigestor</WelcomeDescription>
          </WelcomeBanner>

          {/* Estadísticas de Reportes */}
          <StatsGrid>
            <StatCard>
              <StatNumber>{stats.total}</StatNumber>
              <StatLabel>Total Reportes</StatLabel>
            </StatCard>

            <StatCard $borderColor="#28a745">
              <StatNumber>{stats.completados}</StatNumber>
              <StatLabel>Completados</StatLabel>
            </StatCard>

            <StatCard $borderColor="#ffc107">
              <StatNumber>{stats.enProceso}</StatNumber>
              <StatLabel>En Proceso</StatLabel>
            </StatCard>

            <StatCard $borderColor="#dc3545">
              <StatNumber>{stats.fallidos}</StatNumber>
              <StatLabel>Fallidos</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* Filtros y Búsqueda */}
          <FiltersCard>
            <FiltersHeader>
              <FiltersTitle>
                <Icon className="fas fa-filter" />
                Filtros y Búsqueda
              </FiltersTitle>
              <CreateReportButton>
                <Icon className="fas fa-plus" />
                Crear Reporte Automático
              </CreateReportButton>
            </FiltersHeader>

            <FiltersContainer>
              {/* Búsqueda */}
              <SearchContainer>
                <SearchIcon className="fas fa-search" />
                <SearchInput
                  type="text"
                  placeholder="Buscar por operador u observaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchContainer>

              {/* Filtro por Estado */}
              <FilterSelectContainer>
                <FilterSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>Todos los estados</option>
                  <option>Completados</option>
                  <option>En Proceso</option>
                  <option>Fallidos</option>
                </FilterSelect>
                <SelectIcon className="fas fa-chevron-down" />
              </FilterSelectContainer>

              <ExportButton>
                <Icon className="fas fa-download" />
                Exportar
              </ExportButton>
            </FiltersContainer>
          </FiltersCard>

          {/* Tabla de Reportes */}
          <TableCard>
            <TableTitle>
              <Icon className="fas fa-history" />
              Historial de Reportes
            </TableTitle>
            <TableDescription>
              Registro detallado de todas las operaciones y reportes automáticos del biodigestor
            </TableDescription>

            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Fecha</TableHeader>
                    <TableHeader>Operador</TableHeader>
                    <TableHeader>Cantidad</TableHeader>
                    <TableHeader>Estado</TableHeader>
                    <TableHeader>Observaciones</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.fecha}</TableCell>
                      <TableCell>{report.operador}</TableCell>
                      <TableCell>{report.cantidad}</TableCell>
                      <TableCell>
                        <StatusTag $estado={report.estado}>
                          {report.estado}
                        </StatusTag>
                      </TableCell>
                      <TableCell>{report.observaciones}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </TableCard>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};