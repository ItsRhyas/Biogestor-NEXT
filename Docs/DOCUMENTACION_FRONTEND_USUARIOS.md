# BioGestor - Documentación Frontend: Gestión de Usuarios

## 📋 Descripción General

El módulo de gestión de usuarios en el frontend de BioGestor permite a los administradores:
- Ver usuarios aprobados y pendientes
- Aprobar usuarios pendientes
- Gestionar permisos de usuarios aprobados
- Utilizar una interfaz modal para operaciones específicas

## 🏗️ Arquitectura de Componentes

### Estructura de Archivos

```
frontend/react-app/src/
├── components/
│   ├── Login/
│   │   └── login.tsx           # Componente de inicio de sesión
│   ├── Register/
│   │   └── register.tsx        # Componente de registro
│   └── Permisos/
│       └── permisos.tsx        # Vista principal de gestión de permisos
├── shared/
│   └── pestañas/
│       └── pestañas.tsx        # Componente de pestañas para usuarios
├── services/
│   └── userService.ts          # Servicio para gestión de usuarios
└── types/
    └── index.ts                # Definiciones de tipos TypeScript
```

## 🔧 Componentes Principales

### PermisosVista (`components/Permisos/permisos.tsx`)

**Propósito**: Vista principal para la gestión de usuarios y permisos

**Props**: No recibe props externos

**Estado**:
- `usuariosAprobados`: Array de usuarios aprobados
- `usuariosNoAprobados`: Array de usuarios pendientes
- `loading`: Estado de carga
- `error`: Mensajes de error
- `sidebarAbierta`: Estado de la barra lateral

**Funciones**:
- `obtenerDatos()`: Obtiene usuarios aprobados y pendientes
- `getCurrentViewName()`: Determina el nombre de la vista actual

**Diseño**: Utiliza layout con barra lateral y superior, con contenido principal centrado

### BasicTabs (`shared/pestañas/pestañas.tsx`)

**Propósito**: Componente de pestañas para mostrar usuarios aprobados y pendientes

**Props**:
- `tab1`: Etiqueta de la primera pestaña
- `tab2`: Etiqueta de la segunda pestaña
- `usuariosAprobados`: Array de usuarios aprobados
- `usuariosNoAprobados`: Array de usuarios pendientes

**Estado**:
- `value`: Índice de pestaña activa
- `usuarioDialogAbierto`: ID del usuario pendiente seleccionado
- `permisosDialogAbierto`: ID del usuario aprobado seleccionado
- `permisosUsuario`: Array de permisos del usuario seleccionado
- `loading`: Estado de carga para aprobación
- `permisosLoading`: Estado de carga para permisos

**Funciones**:
- `handleClickOpen()`: Abre diálogo para aprobar usuario
- `handlePermisosClickOpen()`: Abre diálogo para gestionar permisos
- `handleAprobar()`: Aprueba usuario pendiente
- `handlePermisoChange()`: Cambia estado de un permiso
- `handleGuardarPermisos()`: Guarda cambios de permisos

## 🔌 Servicios

### userService (`services/userService.ts`)

**Propósito**: Servicio para comunicación con API de usuarios

**Métodos**:

#### `getApprovedUsers()`
- **Descripción**: Obtiene lista de usuarios aprobados
- **Endpoint**: `GET /api/usuarios/`
- **Respuesta**: `{ usuarios: User[], total: number }`
- **Permisos**: Requiere autenticación y rol de administrador

#### `getPendingUsers()`
- **Descripción**: Obtiene lista de usuarios pendientes
- **Endpoint**: `GET /api/usuarios/pendientes/`
- **Respuesta**: `{ usuarios: User[], total_pendientes: number }`
- **Permisos**: Requiere autenticación y rol de administrador

#### `approveUser(userId: number)`
- **Descripción**: Aprueba un usuario pendiente
- **Endpoint**: `POST /api/usuarios/{id}/aprobar/`
- **Respuesta**: `ApiResponse<User>`
- **Permisos**: Requiere autenticación y rol de administrador

#### `getUserPermissions(userId: number)`
- **Descripción**: Obtiene permisos de un usuario
- **Endpoint**: `GET /api/usuarios/{id}/ver-permisos/`
- **Respuesta**: `Permission[]`
- **Permisos**: Requiere autenticación y rol de administrador

#### `updateUserPermissions(userId: number, permisos: Permission[])`
- **Descripción**: Actualiza permisos de un usuario
- **Endpoint**: `POST /api/usuarios/{id}/cambiar-permisos/`
- **Body**: `{ permisos: Permission[] }`
- **Respuesta**: `ApiResponse<User>`
- **Permisos**: Requiere autenticación y rol de administrador

## 🎨 Interfaz de Usuario

### Vista de Usuarios Aprobados

**Características**:
- Lista de usuarios con nombre, apellido y email
- Botón "Gestionar Permisos" para cada usuario
- Diseño de lista con separadores

**Flujo de Interacción**:
1. Usuario hace clic en "Gestionar Permisos"
2. Se abre modal con lista de permisos (checkboxes)
3. Usuario modifica permisos deseados
4. Usuario hace clic en "Confirmar cambios" o "Cancelar"

### Vista de Usuarios Pendientes

**Características**:
- Lista de usuarios con botones para cada usuario
- Modal de confirmación para aprobación
- Diseño de botones agrupados

**Flujo de Interacción**:
1. Usuario hace clic en botón de usuario pendiente
2. Se abre modal con información del usuario
3. Usuario hace clic en "Aprobar" o "Denegar"

### Modal de Gestión de Permisos

**Estructura**:
- **Cabecera**: "Gestionar Permisos del Usuario"
- **Información del usuario**: Nombre, email, username
- **Lista de permisos**: Checkboxes con nombre y código del permiso
- **Botones**: "Confirmar cambios" y "Cancelar"

**Características**:
- Scroll para lista larga de permisos
- Estados de carga durante operaciones
- Feedback visual de cambios

## 📊 Tipos TypeScript

### User
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: {
    aprobado: boolean;
  };
}
```

### Permission
```typescript
interface Permission {
  id: string;
  codename: string;
  name: string;
  granted: boolean;
}
```

### ApiResponse
```typescript
interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
```

## 🔒 Flujo de Autenticación y Permisos

### Verificación de Permisos
1. **Autenticación**: Usuario debe estar logueado
2. **Rol de Administrador**: Usuario debe tener `is_staff = true`
3. **Permisos Específicos**: Algunas acciones requieren permisos adicionales

### Manejo de Errores
- **401 No Autorizado**: Redirige a login
- **403 Prohibido**: Muestra mensaje de falta de permisos
- **404 No Encontrado**: Muestra mensaje de recurso no encontrado
- **500 Error del Servidor**: Muestra mensaje genérico de error

## 🧪 Pruebas Recomendadas

### Pruebas de Componente
- Renderizado correcto de pestañas
- Apertura y cierre de modales
- Cambio de estado de checkboxes
- Estados de carga

### Pruebas de Integración
- Conexión con servicios API
- Manejo de respuestas exitosas y errores
- Actualización de estado después de operaciones

### Pruebas de Usabilidad
- Navegación entre pestañas
- Interacción con modales
- Feedback visual durante operaciones

## 🚀 Mejoras Futuras

### Funcionalidades Pendientes
- Búsqueda y filtrado de usuarios
- Paginación para listas largas
- Confirmación antes de cambios críticos
- Historial de cambios de permisos

### Optimizaciones
- Carga lazy de componentes
- Cache de datos de usuarios
- Mejoras de accesibilidad
- Responsive design mejorado

---

*Documentación actualizada para BioGestor Frontend v1.0 - Módulo de Gestión de Usuarios*