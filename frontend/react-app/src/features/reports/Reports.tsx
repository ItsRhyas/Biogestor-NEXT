import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import styled from 'styled-components';
import { createReport, getReportHistory, downloadReportFile, closeCurrentFilling, reportByRange } from '../../api/dashboard.api';

// Styled-components missing definitions
const ContentWrapper = styled.div`
  width: 100%;
  margin: 0;
  padding: 2rem 1.5rem;
`;

const WelcomeBanner = styled.div`
  background: #e6f7ff;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px #eee;
`;

const WelcomeTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  color: #007bff;
`;

const WelcomeDescription = styled.p`
  margin: 0;
  color: #555;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $borderColor?: string }>`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #eee;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 5px solid ${props => props.$borderColor || '#007bff'};
`;

const StatNumber = styled.div`
  font-size: 2.2rem;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #888;
`;

const FiltersCard = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #eee;
  margin-bottom: 2rem;
`;

const FiltersHeader = styled.div`
  padding: 1rem 1.5rem 0.5rem 1.5rem;
`;

const FiltersTitle = styled.h4`
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const CreateReportButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;



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
  flex-grow: 1;
  position: relative;
`;

const Icon = styled.i``;
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

// (Eliminado) Layout de dos columnas para vista previa



export const Reports: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  // const [stageClosed, setStageClosed] = useState(false);
  const [reportType, setReportType] = useState<'normal' | 'final'>('normal');
  const [observations, setObservations] = useState('');
  const [reportLinks, setReportLinks] = useState<{ pdf?: string; excel?: string; csv?: string }>({});
  const [rangeStart, setRangeStart] = useState<string>('');
  const [rangeEnd, setRangeEnd] = useState<string>('');
  // (Eliminado) Estado de vista previa

  // Estado para datos reales
  const [history, setHistory] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true); // No usado
  const [stats, setStats] = useState<ReportStats>({ total: 0, completados: 0, enProceso: 0, fallidos: 0 });

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true); // Eliminar referencia a setLoading
      try {
        // Historial de reportes
        const histRes = await axios.get('/api/dashboard/report/history/');
        setHistory(histRes.data.history || []);
        // Estadísticas
        const total = histRes.data.history.length;
        const completados = histRes.data.history.filter((h: any) => h.finalizado).length;
        const enProceso = histRes.data.history.filter((h: any) => h.active).length;
        const fallidos = 0; // Si hay lógica de fallidos, actualizar aquí
        setStats({ total, completados, enProceso, fallidos });
        // Etapa activa
  // const active = histRes.data.history.find((h: any) => h.active);
        // Producción actual vs esperada
        // (Eliminado: setActiveStage y setCurrentProduction)
  // setStageClosed(!active);
      } catch (err) {
        setDownloadError('Error al cargar datos de reportes.');
      } finally {
        // setLoading(false); // Eliminar referencia a setLoading
      }
    };
    fetchData();
  }, []);

  // Filtrado de historial


  // (Eliminado) handleDownloadReport no se usa actualmente

  // Nueva función para solicitar reporte
  const handleCreateReport = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await createReport(reportType, observations);
      setReportLinks({ pdf: res.pdf_url, excel: res.excel_url, csv: res.csv_url });
      // Vista previa eliminada: no establecemos previsualización automática
      // Actualizar historial
      const hist = await getReportHistory();
      setHistory(hist);
    } catch (err) {
      // Mostrar detalle de backend si existe
      const e: any = err;
      const detail = e?.response?.data?.detail || e?.message || 'Error al solicitar el reporte.';
      setDownloadError(detail);
    } finally {
      setDownloading(false);
    }
  };

  // Nueva función para descargar archivo
  const handleDownloadFile = async (type: 'pdf' | 'excel' | 'csv') => {
    if (!reportLinks[type]) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const data = await downloadReportFile(reportLinks[type]!);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError('Error al descargar el archivo.');
    } finally {
      setDownloading(false);
    }
  };

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
            </FiltersContainer>
          </FiltersCard>

          {/* Solicitar reporte (ocupa ancho completo) */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px #eee' }}>
            <h4>Solicitar Reporte</h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={reportType} onChange={e => setReportType(e.target.value as 'normal' | 'final')}>
                <option value="normal">Reporte Regular</option>
                <option value="final">Reporte Final de Producción</option>
              </select>
              <input
                type="text"
                placeholder="Observaciones opcionales"
                value={observations}
                onChange={e => setObservations(e.target.value)}
                style={{ flex: 1, minWidth: 240, padding: '0.5rem' }}
              />
              <CreateReportButton disabled={downloading} onClick={handleCreateReport}>
                <Icon className="fas fa-file-alt" /> Solicitar Reporte
              </CreateReportButton>
              <ExportButton onClick={async () => {
                try {
                  const res = await closeCurrentFilling();
                  alert(res.detail);
                  const hist = await getReportHistory();
                  setHistory(hist);
                } catch (e: any) {
                  const detail = e?.response?.data?.detail || 'No se pudo cerrar la etapa activa.';
                  alert(detail);
                }
              }}>
                <Icon className="fas fa-lock" /> Cerrar etapa activa
              </ExportButton>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
              <input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)} />
              <input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} />
              <ExportButton onClick={async () => {
                if (!rangeStart || !rangeEnd) { setDownloadError('Selecciona rango de fechas'); return; }
                try {
                  setDownloading(true);
                  const blob = await reportByRange(rangeStart, rangeEnd, 'excel');
                  const url = URL.createObjectURL(new Blob([blob]));
                  const a = document.createElement('a');
                  a.href = url; a.download = 'reporte_rango.xlsx'; a.click();
                  URL.revokeObjectURL(url);
                } catch (e) {
                  setDownloadError('Error generando reporte por rango');
                } finally {
                  setDownloading(false);
                }
              }}>
                <Icon className="fas fa-file-excel" /> Reporte por Rango
              </ExportButton>
            </div>
            {/* Botones de descarga si hay links */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {reportLinks.pdf && (
                <ExportButton onClick={() => handleDownloadFile('pdf')}>
                  <Icon className="fas fa-download" /> Descargar PDF
                </ExportButton>
              )}
              {reportLinks.excel && (
                <ExportButton onClick={() => handleDownloadFile('excel')}>
                  <Icon className="fas fa-download" /> Descargar Excel
                </ExportButton>
              )}
              {reportLinks.csv && (
                <ExportButton onClick={() => handleDownloadFile('csv')}>
                  <Icon className="fas fa-download" /> Descargar CSV de lecturas
                </ExportButton>
              )}
            </div>
            {downloading && <p>Procesando reporte...</p>}
            {downloadError && <p style={{ color: 'red' }}>{downloadError}</p>}
          </div>


          {/* Historial de Reportes */}
          <TableCard>
            <TableTitle>
              <Icon className="fas fa-history" />
              Historial de Reportes
            </TableTitle>
            <TableDescription>
              Registro real de todos los reportes generados
            </TableDescription>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>ID</TableHeader>
                    <TableHeader>Fecha</TableHeader>
                    <TableHeader>Usuario</TableHeader>
                    <TableHeader>Tipo</TableHeader>
                    <TableHeader>Observaciones</TableHeader>
                    <TableHeader>PDF</TableHeader>
                    <TableHeader>Excel</TableHeader>
                    <TableHeader>CSV</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.created_at?.slice(0, 19).replace('T', ' ')}</TableCell>
                      <TableCell>{r.user_name || 'Anónimo'}</TableCell>
                      <TableCell>{r.report_type}</TableCell>
                      <TableCell>{r.observations || '-'}</TableCell>
                      <TableCell>
                        {r.file_pdf ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <ExportButton as="a" href={`/api/dashboard/report/download/${r.id}/pdf/`} target="_blank" rel="noopener noreferrer">
                              <Icon className="fas fa-download" /> PDF
                            </ExportButton>
                            {/* Vista previa eliminada */}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {r.file_excel ? (
                          <ExportButton as="a" href={`/api/dashboard/report/download/${r.id}/excel/`} target="_blank" rel="noopener noreferrer">
                            <Icon className="fas fa-download" /> Excel
                          </ExportButton>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {r.file_csv ? (
                          <ExportButton as="a" href={`/api/dashboard/report/download/${r.id}/csv/`} target="_blank" rel="noopener noreferrer">
                            <Icon className="fas fa-download" /> CSV
                          </ExportButton>
                        ) : '-'}
                      </TableCell>
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