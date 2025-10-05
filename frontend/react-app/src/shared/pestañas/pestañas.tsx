import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from "@mui/material/DialogTitle";
import { Boton, ContenidoBoton } from '../Boton/boton'
import { aprobarUsuario } from '../../services/UsuariosPermisos'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface pestañaProps {
    tab1: string;
    tab2: string;
    
}

interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: {
    aprobado: boolean;
  };
}

interface TiposUsuarios {
  usuariosAprobados: Usuario[];
  usuariosNoAprobados: Usuario[];
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

export default function BasicTabs(props: pestañaProps & TiposUsuarios) {
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

  const handleAprobar = async() => {

    if (!usuarioSeleccionado) return

    setLoading(true);
    try{
       await aprobarUsuario (usuarioSeleccionado.id)
      console.log("El usuario ha sido aprobado")

      handleClose();

    } catch (error){
       console.log(error)
      } finally {
        setLoading(false)
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
              {usuario.first_name} - {usuario.email}
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
                <Boton label='Aprobar' color='#fafafa' sinMovimiento={true} onClick={handleAprobar}></Boton>
                <Boton label='Denegar' color='#fafafa' sinMovimiento={true}></Boton>
              </ContenidoBoton>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}