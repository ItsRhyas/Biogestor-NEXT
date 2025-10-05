import React, { useEffect } from 'react';
import { Card } from '../../shared/card/card'
import { useState } from 'react';

import { BarraLateral  } from '../../shared/barraLateral/barraLateral'
import { BarraArriba } from '../../shared/barraAriiba/barraArriba'
import { ListarUsuariosAprobados, ListarUsuariosPendientes } from '../../services/UsuariosPermisos'
import BasicTabs from "../../shared/pestañas/pestañas"
import Button from "@mui/material/Button";

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

export const PermisosVista = () => {

    const [vistaActual, setVistaActual] = useState('Perfil');
    const [sidebarAbierta, setSidebarAbierta] = useState(true);

    const [usuariosAprobados, setUsuariosAprobados] = useState<Usuario[]>([]);
    const [usuariosNoAprobados, setUsuariosNoAprobados] = useState<Usuario[]>([]);

    const ObtenerDatos = async () => {
        try {
            const respuesta_aprobados = await ListarUsuariosAprobados ()
            const respuesta_pendientes = await ListarUsuariosPendientes ()

            const UsuariosAprobados = respuesta_aprobados.usuarios || []
            const UsuariosPendientes = respuesta_pendientes.usuarios || []

            setUsuariosAprobados(UsuariosAprobados);
            setUsuariosNoAprobados(UsuariosPendientes);

        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
}

    // Usa useEffect para llamar la función
    useEffect(() => {
        ObtenerDatos();
    }, []);

    return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <BarraLateral abierta={sidebarAbierta} onBotonClick={setVistaActual} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <BarraArriba
          vistaActual={vistaActual}
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        <div style={{ padding: 20 }}>
          {/* El código continúa aquí, no me quiero volver a perder */}
          <Card ancho= {1500}  >
                <BasicTabs
                  tab1='Usuarios'
                  tab2='No aprobados'
                  usuariosAprobados={usuariosAprobados}
                  usuariosNoAprobados={usuariosNoAprobados}
                />
          </Card>
        </div>
      </div>
    </div>
  );
}