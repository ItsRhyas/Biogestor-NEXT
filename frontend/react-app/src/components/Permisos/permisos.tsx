import React, { useEffect } from 'react';
import { Card } from '../../shared/card/card';
import { useState } from 'react';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import { userService } from '../../services/userService';
import BasicTabs from "../../shared/pestañas/pestañas";
import { User } from '../../types';
export const PermisosVista = () => {
    const [vistaActual, setVistaActual] = useState('Perfil');
    const [sidebarAbierta, setSidebarAbierta] = useState(true);
    const [usuariosAprobados, setUsuariosAprobados] = useState<User[]>([]);
    const [usuariosNoAprobados, setUsuariosNoAprobados] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const obtenerDatos = async () => {
        setLoading(true);
        setError('');

        try {
            const [respuestaAprobados, respuestaPendientes] = await Promise.all([
                userService.getApprovedUsers(),
                userService.getPendingUsers()
            ]);
            setUsuariosAprobados(respuestaAprobados.usuarios || []);
            setUsuariosNoAprobados(respuestaPendientes.usuarios || []);

        } catch (error: any) {
            console.error('Error al obtener usuarios:', error);
            setError(error.message || 'Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        obtenerDatos();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div>Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <BarraLateral abierta={sidebarAbierta} onBotonClick={setVistaActual} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <BarraArriba
                    vistaActual={vistaActual}
                    onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
                />
                <div style={{ padding: 20 }}>
                    {error && (
                        <div style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}
                    <Card ancho={1500}>
                        <BasicTabs
                            tab1='Usuarios Aprobados'
                            tab2='Usuarios Pendientes'
                            usuariosAprobados={usuariosAprobados}
                            usuariosNoAprobados={usuariosNoAprobados}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};
