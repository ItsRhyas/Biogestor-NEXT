import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from "@mui/material/DialogTitle";
import { Boton, ContenidoBoton } from '../Boton/boton';
import { userService } from '../../services/userService';
import { User, TabPanelProps } from '../../types';

interface PestañaProps {
    tab1: string;
    tab2: string;
}

interface TiposUsuarios {
  usuariosAprobados: User[];
  usuariosNoAprobados: User[];
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props: PestañaProps & TiposUsuarios) {
  const [value, setValue] = React.useState(0);
  const {tab1, tab2, usuariosAprobados, usuariosNoAprobados} = props;

  // Estado para controlar qué diálogo está abierto
  const [usuarioDialogAbierto, setUsuarioDialogAbierto] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = (usuarioId: number) => {
    setUsuarioDialogAbierto(usuarioId);
  };

  const handleClose = () => {
    setUsuarioDialogAbierto(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleAprobar = async () => {
    if (!usuarioSeleccionado) return;

    setLoading(true);
    try {
      await userService.approveUser(usuarioSeleccionado.id);
      console.log("El usuario ha sido aprobado");
      handleClose();
      // Aquí podrías recargar los datos o actualizar el estado local
    } catch (error) {
      console.error("Error al aprobar usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  // Encontrar el usuario que tiene el diálogo abierto
  const usuarioSeleccionado = usuariosNoAprobados.find(u => u.id === usuarioDialogAbierto);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={tab1} {...a11yProps(0)} />
          <Tab label={tab2} {...a11yProps(1)} />
        </Tabs>
      </Box>
      
      <CustomTabPanel value={value} index={0}>
        <div>
          {usuariosAprobados.map(usuario => (
            <div key={usuario.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
              <strong>{usuario.first_name} {usuario.last_name}</strong> - {usuario.email}
            </div>
          ))}
        </div>
      </CustomTabPanel>
      
      <CustomTabPanel value={value} index={1}>
        <div>
          {usuariosNoAprobados.map(usuario => (
            <div key={usuario.id}>
              <Button 
                variant="outlined" 
                onClick={() => handleClickOpen(usuario.id)}
                style={{ margin: '5px' }}
              >
                {usuario.first_name} {usuario.last_name}
              </Button>
            </div>
          ))}
        </div>
      </CustomTabPanel>

      {/* Dialog fuera del map - solo uno */}
      <Dialog
        open={usuarioDialogAbierto !== null}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Aprobar Usuario?"}
        </DialogTitle>
        <DialogContent>
          {usuarioSeleccionado && (
            <>
              <p><strong>Nombre:</strong> {usuarioSeleccionado.first_name} {usuarioSeleccionado.last_name}</p>
              <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
              <p><strong>Usuario:</strong> {usuarioSeleccionado.username}</p>

              <ContenidoBoton>
                <Boton 
                  label={loading ? 'Aprobando...' : 'Aprobar'} 
                  color='#fafafa' 
                  sinMovimiento={true} 
                  onClick={handleAprobar}
                  disabled={loading}
                />
                <Boton 
                  label='Denegar' 
                  color='#fafafa' 
                  sinMovimiento={true}
                  onClick={handleClose}
                />
              </ContenidoBoton>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}