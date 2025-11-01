import React, { useEffect } from 'react';
import { Card } from '../../shared/card/card';
import { useState } from 'react';
import { MainLayout } from '../../shared/layout/MainLayout';
import { userService } from '../../services/userService';
import BasicTabs from "../../shared/pestañas/pestañas";
import { User } from '../../types';
import { useLocation } from 'react-router-dom';

export const PermisosVista = () => {
    const [usuariosAprobados, setUsuariosAprobados] = useState<User[]>([]);
    const [usuariosNoAprobados, setUsuariosNoAprobados] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();

    // Función para obtener el nombre de la vista actual basado en la ruta
    const getCurrentViewName = () => {
        switch (location.pathname) {
            case '/perfil':
                return 'Perfil';
            case '/permisos':
                return 'Permisos';
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
                return 'Permisos';
        }
    };

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
        <MainLayout currentView={getCurrentViewName()} onViewChange={() => {}}>
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
        </MainLayout>
    );
};