import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import { Boton } from '../../shared/Boton/boton';
import { recursosService, Recurso } from '../../services/recursosService';

// Styled Components
const ResourcesContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ContentArea = styled.div`
  padding: 24px;
  flex: 1;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const ResourceCard = styled(Card)`
  padding: 20px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ResourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ResourceName = styled.h3`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const AccessBadge = styled.span<{ tipo: string }>`
  background-color: ${props => props.tipo === 'publico' ? '#e6fffa' : '#fffaf0'};
  color: ${props => props.tipo === 'publico' ? '#234e52' : '#dd6b20'};
  border: 1px solid ${props => props.tipo === 'publico' ? '#234e52' : '#dd6b20'};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ResourceInfo = styled.div`
  margin-bottom: 16px;
`;

const ResourceDetail = styled.p`
  margin: 4px 0;
  color: #718096;
  font-size: 0.9rem;
  
  strong {
    color: #2d3748;
  }
`;

const ResourceActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const UploadModal = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 20px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  background-color: #f7fafc;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #718096;
  
  h3 {
    margin: 0 0 12px 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 1rem;
  }
`;

export const Resources: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'mis-recursos'>('todos');

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    file: null as File | null,
    tipo_acceso: 'privado' as 'publico' | 'privado',
  });

  // Load resources
  const loadRecursos = async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'todos') {
        data = await recursosService.getRecursos();
      } else {
        data = await recursosService.getMisRecursos();
      }
      setRecursos(data);
    } catch (error) {
      console.error('Error loading resources:', error);
      alert('Error al cargar los recursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecursos();
  }, [activeTab]);

  // Handle file upload
  const handleUpload = async () => {
    if (!formData.nombre || !formData.file) {
      alert('Por favor completa todos los campos');
      return;
    }

    setUploading(true);
    try {
      await recursosService.createRecurso({
        nombre: formData.nombre,
        file: formData.file,
        tipo_acceso: formData.tipo_acceso,
      });
      
      setShowUploadModal(false);
      setFormData({ nombre: '', file: null, tipo_acceso: 'privado' });
      await loadRecursos();
      alert('Recurso subido exitosamente');
    } catch (error) {
      console.error('Error uploading resource:', error);
      alert('Error al subir el recurso');
    } finally {
      setUploading(false);
    }
  };

  // Handle download
  const handleDownload = async (recurso: Recurso) => {
    try {
      const downloadData = await recursosService.getDownloadUrl(recurso.id);
      window.open(downloadData.download_url, '_blank');
    } catch (error) {
      console.error('Error downloading resource:', error);
      alert('Error al descargar el recurso');
    }
  };

  // Handle delete
  const handleDelete = async (recursoId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
      try {
        await recursosService.deleteRecurso(recursoId);
        await loadRecursos();
        alert('Recurso eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Error al eliminar el recurso');
      }
    }
  };

  // Get file extension
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  return (
    <ResourcesContainer>
      <BarraLateral abierta={sidebarAbierta} />
      
      <MainContent>
        <BarraArriba
          vistaActual="Recursos"
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        
        <ContentArea>
          <HeaderSection>
            <Title>Gestor de Recursos</Title>
            <ActionsContainer>
              <Boton
                size="medium"
                label="Subir Recurso"
                content="Agregar nuevo archivo"
                color="#01663d"
                onClick={() => setShowUploadModal(true)}
              />
            </ActionsContainer>
          </HeaderSection>

          {/* Tabs */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
            <Boton
              size="small"
              label="Todos los Recursos"
              content="Ver todos los recursos accesibles"
              color={activeTab === 'todos' ? '#01663d' : '#fafafa'}
              onClick={() => setActiveTab('todos')}
            />
            <Boton
              size="small"
              label="Mis Recursos"
              content="Ver solo mis recursos subidos"
              color={activeTab === 'mis-recursos' ? '#01663d' : '#fafafa'}
              onClick={() => setActiveTab('mis-recursos')}
            />
          </div>

          {/* Resources Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando recursos...</p>
            </div>
          ) : recursos.length === 0 ? (
            <EmptyState>
              <h3>No hay recursos disponibles</h3>
              <p>
                {activeTab === 'todos' 
                  ? 'No hay recursos públicos o de tu institución disponibles.'
                  : 'No has subido ningún recurso todavía.'
                }
              </p>
            </EmptyState>
          ) : (
            <ResourcesGrid>
              {recursos.map((recurso) => (
                <ResourceCard key={recurso.id}>
                  <ResourceHeader>
                    <ResourceName>{recurso.nombre}</ResourceName>
                    <AccessBadge tipo={recurso.tipo_acceso}>
                      {recurso.tipo_acceso === 'publico' ? 'Público' : 'Privado'}
                    </AccessBadge>
                  </ResourceHeader>
                  
                  <ResourceInfo>
                    <ResourceDetail>
                      <strong>Institución:</strong> {recurso.institucion_nombre}
                    </ResourceDetail>
                    <ResourceDetail>
                      <strong>Subido por:</strong> {recurso.usuario_subio_username}
                    </ResourceDetail>
                    <ResourceDetail>
                      <strong>Fecha:</strong> {new Date(recurso.fecha_subida).toLocaleDateString()}
                    </ResourceDetail>
                    <ResourceDetail>
                      <strong>Tipo:</strong> {getFileExtension(recurso.file)}
                    </ResourceDetail>
                  </ResourceInfo>
                  
                  <ResourceActions>
                    <Boton
                      size="small"
                      label="Descargar"
                      content="Descargar archivo"
                      color="#4299e1"
                      onClick={() => handleDownload(recurso)}
                    />
                    {recurso.usuario_subio_username === localStorage.getItem('username') && (
                      <Boton
                        size="small"
                        label="Eliminar"
                        content="Eliminar recurso"
                        color="#e53e3e"
                        onClick={() => handleDelete(recurso.id)}
                      />
                    )}
                  </ResourceActions>
                </ResourceCard>
              ))}
            </ResourcesGrid>
          )}

          {/* Upload Modal */}
          <UploadModal show={showUploadModal}>
            <ModalContent>
              <ModalTitle>Subir Nuevo Recurso</ModalTitle>
              
              <FormGroup>
                <Label htmlFor="nombre">Nombre del Recurso</Label>
                <Input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Manual de Usuario"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="tipo_acceso">Tipo de Acceso</Label>
                <Select
                  id="tipo_acceso"
                  value={formData.tipo_acceso}
                  onChange={(e) => setFormData({ ...formData, tipo_acceso: e.target.value as 'publico' | 'privado' })}
                >
                  <option value="privado">Privado (Solo mi institución)</option>
                  <option value="publico">Público (Todas las instituciones)</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="file">Archivo</Label>
                <FileInput
                  type="file"
                  id="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                />
              </FormGroup>

              <ModalActions>
                <Boton
                  size="medium"
                  label="Cancelar"
                  content="Cancelar subida"
                  color="#718096"
                  onClick={() => setShowUploadModal(false)}
                />
                <Boton
                  size="medium"
                  label={uploading ? "Subiendo..." : "Subir"}
                  content="Subir archivo"
                  color="#01663d"
                  onClick={handleUpload}
                  disabled={uploading}
                />
              </ModalActions>
            </ModalContent>
          </UploadModal>
        </ContentArea>
      </MainContent>
    </ResourcesContainer>
  );
};