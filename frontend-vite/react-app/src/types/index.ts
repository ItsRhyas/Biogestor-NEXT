// Tipos principales de la aplicación

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: {
    aprobado: boolean;
    rol?: 'ADMIN' | 'COLAB' | 'VISIT';
    permisos?: {
      // Bandera de visualización del dashboard/sensores
      VerDashboard?: boolean;
      // Otras posibles banderas
      AprobarUsuarios?: boolean;
      VerReportes?: boolean;
      GenerarReportes?: boolean;
      VerInventario?: boolean;
      ModificarInventario?: boolean;
      // Permitir claves adicionales sin tipar estrictamente
      [key: string]: any;
    };
  };
}

export interface Permission {
  id: string;
  codename: string;
  name: string;
  granted: boolean;
}

export interface UserPermissions {
  usuario_id: number;
  username: string;
  permisos: Permission[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Tipos para componentes UI
export interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  color?: string;
  label: string;
  content?: string;
  icon?: React.ReactNode;
  onClick?: (label: string) => void;
  sinMovimiento?: boolean;
  centrado?: boolean;
}

export interface FormField {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

export interface FormButton {
  label: string;
  color: string;
  tipo: string;
  accion: 'submit' | 'navegacion';
}

export interface SidebarItem {
  label: string;
  content: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface DialogState {
  open: boolean;
  userId?: number;
}
