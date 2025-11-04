import styled from 'styled-components'
import { Boton } from "../Boton/boton"
import logo from '../../assets/logo.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { LuActivity } from "react-icons/lu";
import { LuFileText } from "react-icons/lu";
import { LuUser } from "react-icons/lu";
import { LuCalculator } from "react-icons/lu";
import { LuWrench } from "react-icons/lu";
import { userService } from '../../services/userService'
import { Permission } from '../../types'


// #dee2e6

// tailwind css

interface BarraLateralProps {
  onBotonClick?: (nombreBoton: string) => void;
  abierta?: boolean;
}

const SidebarStyled = styled.div<{ $abierta?: boolean  }>`
  width: ${({ $abierta }) => ($abierta ? '280px' : '0')};
  flex: 0 0 auto; /* evita que el contenedor flex colapse el ancho */
  height: 100vh;
  background-color: #fafafa;
  overflow: hidden; /* oculta contenido cuando está cerrada */
  transition: width 0.3s;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const Encabezado = styled.div`
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center; 
  
  gap: 10px;
`
const ContenedorTexto = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left; 
`

export const Titulo = styled.div`
    margin: 0;
    color: #01663d;
    font-size: 1.6rem;
    font-weight: bold;

`
const Subtitulo = styled.div`
    margin: 0;
    color: #333;
    font-size: 1rem;
`
export const Logo = styled.img`
  border-radius: 15px;
  width: 50px;
  height: 50px;
`

const Menu = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  box-sizing: border-box;
`


export const BarraLateral = ({ abierta = true, onBotonClick }: BarraLateralProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canViewDashboard, setCanViewDashboard] = useState<boolean>(true);
  const [canManagePermissions, setCanManagePermissions] = useState<boolean>(false);
  const [canViewCalibrations, setCanViewCalibrations] = useState<boolean>(false);

  useEffect(() => {
    // Cargar permisos del usuario actual y determinar si puede ver el dashboard/sensores
    (async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        const direct = (currentUser as any)?.perfil?.permisos?.VerDashboard;
        if (typeof direct === 'boolean') {
          setCanViewDashboard(direct);
          const permsAny = (currentUser as any)?.perfil?.permisos || {};
          setCanManagePermissions(!!permsAny.AprobarUsuarios);
          setCanViewCalibrations(!!permsAny.VerCalibraciones);
          return;
        }
        // Fallback a endpoint de permisos (restringido para admins)
        try {
          const perms = await userService.getUserPermissions(currentUser.id);
          const puedeVer = perms.permisos.some((p: Permission) => p.codename === 'VerDashboard' && p.granted);
          const puedePermisos = perms.permisos.some((p: Permission) => p.codename === 'AprobarUsuarios' && p.granted);
          const puedeCal = perms.permisos.some((p: Permission) => p.codename === 'VerCalibraciones' && p.granted);
          setCanViewDashboard(puedeVer);
          setCanManagePermissions(puedePermisos);
          setCanViewCalibrations(puedeCal);
        } catch (_err) {
          // Si no se puede consultar, por seguridad ocultar
          setCanViewDashboard(false);
          setCanManagePermissions(false);
          setCanViewCalibrations(false);
        }
      } catch (e) {
        // Si falla, por seguridad no mostrar Sensores
        setCanViewDashboard(false);
        setCanManagePermissions(false);
        setCanViewCalibrations(false);
      }
    })();
  }, []);

  const itemsMenu = [
    { 
      label: "Perfil", 
      content: "Información del usuario",
      icon: <LuUser/>,
      color: "#fafafa",
      path: "/perfil",
      isActive: location.pathname === '/perfil'
    },

    { 
      label: "Permisos", 
      content: "Asignación de permisos",
      icon: <LuUser/>,
      color: "#fafafa",
      path: "/permisos",
      isActive: location.pathname === '/permisos'
    },

    { 
      label: "Sensores", 
      content: "Monitoreo en tiempo real",
      icon: <LuActivity/>,
      color: "#fafafa", 
      path: "/sensores",
      isActive: location.pathname === '/sensores'
    },
    { 
      label: "Reportes", 
      content: "Historial y análisis",
      icon: <LuFileText/>,
      color: "#fafafa",
      path: "/reportes",
      isActive: location.pathname === '/reportes'
    },
    { 
      label: "Calibraciones", 
      content: "Historial y registro",
      icon: <LuWrench/>,
      color: "#fafafa",
      path: "/calibraciones",
      isActive: location.pathname === '/calibraciones'
    },
    { 
      label: "Calculadora de productos", 
      content: "Estimación de producción",
      icon: <LuCalculator/>,
      color: "#fafafa",
      path: "/calculadora",
      isActive: location.pathname === '/calculadora'
    }
  ]

  const handleBotonClick = (item: typeof itemsMenu[0]) => {
    // Navigate to the corresponding route
    navigate(item.path);
    
    // Call the parent callback if provided
    if (onBotonClick) {
      onBotonClick(item.label);
    }
  }
 
  // Filtrar por permisos (ocultar Sensores si no tiene VerDashboard)
  const visibleItems = itemsMenu.filter(item => {
    if (item.label === 'Sensores' && !canViewDashboard) return false;
    if (item.label === 'Permisos' && !canManagePermissions) return false;
    if (item.label === 'Calibraciones' && !canViewCalibrations) return false;
    return true;
  });

  return (
    <SidebarStyled $abierta={abierta}>
      <Encabezado>
        
        <Logo src={logo} alt="Biogestor Logo"/>

        <ContenedorTexto>
            <Titulo>Biogestor</Titulo>
            <Subtitulo>Sistema de Monitoreo</Subtitulo>
        </ContenedorTexto>
        
      </Encabezado>
      
      <Menu>
        {visibleItems.map((item, index) => (
          <Boton
            key={index}
            size="medium"
            label={item.label}
            content={item.content}
            icon={item.icon}
            color={item.color}
            isActive={item.isActive}
            onClick={() => handleBotonClick(item)}
          />
        ))}
      </Menu>
    </SidebarStyled>
  )
}