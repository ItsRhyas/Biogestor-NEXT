import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import { Card } from '../../shared/card/card';
import { createCalibration, exportCalibrations, getCalibrations, CalibrationRecord } from '../../api/dashboard.api';

// Layout styles aligned with existing sections
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0;
  padding: 2rem 1.5rem;
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
`;

const PrimaryButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  &:hover { background-color: #218838; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const SecondaryButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background-color: #e8e8e8; }
`;

const TableCard = styled(Card)`
  padding: 1.5rem;
`;

const FormCard = styled(Card)`
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const Th = styled.th`
  background-color: #f9f9f9;
  padding: 0.9rem 1.2rem;
  text-align: left;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 0.9rem 1.2rem;
  color: #555;
  border-bottom: 1px solid #e0e0e0;
`;

export const Calibrations: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [items, setItems] = useState<CalibrationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [sensorName, setSensorName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCalibrations();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Error cargando calibraciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!sensorName || !date) {
      setError('Sensor y fecha son requeridos');
      return;
    }
    try {
      await createCalibration({ sensor_name: sensorName, date, notes });
      setSuccess('Calibración registrada');
      setSensorName(''); setDate(''); setNotes('');
      load();
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Error registrando calibración');
    }
  };

  const onExport = async () => {
    try {
      const blob = await exportCalibrations();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'calibraciones.xlsx'; a.click();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || 'Error exportando calibraciones');
    }
  };

  return (
    <Container>
      <BarraLateral abierta={sidebarAbierta} />
      <MainContent>
        <BarraArriba vistaActual="Calibraciones" onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)} />
        <ContentWrapper>
          <FormCard>
            <SectionTitle>Nueva Calibración</SectionTitle>
            <form onSubmit={onAdd}>
              <ActionsRow>
                <Input type="text" placeholder="Sensor" value={sensorName} onChange={(e) => setSensorName(e.target.value)} />
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <Input type="text" placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ minWidth: 240, flex: 1 }} />
                <PrimaryButton type="submit">Agregar</PrimaryButton>
                <SecondaryButton type="button" onClick={onExport}>Exportar Excel</SecondaryButton>
              </ActionsRow>
            </form>
            {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: 8 }}>{success}</p>}
          </FormCard>

          <TableCard>
            <SectionTitle style={{ marginBottom: '0.75rem' }}>Historial</SectionTitle>
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <Th>Sensor</Th>
                      <Th>Fecha</Th>
                      <Th>Notas</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i) => (
                      <tr key={i.id}>
                        <Td>{i.sensor_name}</Td>
                        <Td>{new Date(i.date).toLocaleDateString()}</Td>
                        <Td>{i.notes}</Td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <Td colSpan={3} style={{ textAlign: 'center', color: '#666', padding: 12 }}>Sin registros</Td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </TableCard>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

export default Calibrations;
