# BioGestor - Documentación Técnica Completa

## 📋 Descripción General del Proyecto

BioGestor es un sistema integral de gestión para laboratorios biológicos desarrollado con una arquitectura moderna que combina Django REST Framework en el backend y React con TypeScript en el frontend. El sistema proporciona gestión de usuarios, inventario, recursos biológicos, herramientas de cálculo especializado y un sistema de permisos granular.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

**Backend:**
- **Framework**: Django 4.2.11
- **API**: Django REST Framework
- **Autenticación**: JWT (JSON Web Tokens) con Simple JWT
- **Base de Datos**: PostgreSQL
- **Variables de Entorno**: django-environ
- **CORS**: django-cors-headers

**Frontend:**
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **UI Components**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Routing**: React Router

### Estructura del Proyecto

```
BioGestor/
├── backend/                 # Aplicación Django
│   ├── BGProject/          # Configuración principal
│   ├── usuarios/           # Gestión de usuarios y autenticación
│   ├── inventario/         # Sistema de gestión de inventario
│   ├── recursos/           # Gestión de recursos adicionales
│   ├── biocalculadora/     # Herramientas de cálculo especializado
│   ├── chatbot/            # Sistema de asistente virtual
│   └── dashboard/          # Panel de control administrativo
├── frontend/               # Aplicación React
│   └── react-app/
│       ├── src/
│       │   ├── components/     # Componentes reutilizables
│       │   ├── features/       # Funcionalidades específicas
│       │   ├── shared/         # Componentes compartidos
│       │   ├── services/       # Servicios de API
│       │   └── types/          # Definiciones TypeScript
└── Docs/                   # Documentación del proyecto
```

---

## 🔧 Módulo Backend

### Configuración Principal (`backend/BGProject/`)

#### settings.py

**Propósito**: Configuración central de la aplicación Django que define todos los aspectos del comportamiento del sistema.

**Configuraciones Clave:**

- **Seguridad**: Variables de entorno para secret key y modo debug
- **Aplicaciones**: Lista de aplicaciones Django instaladas
- **Middleware**: Configuración de seguridad, CORS y autenticación
- **Base de Datos**: Configuración PostgreSQL
- **REST Framework**: Configuración de autenticación JWT
- **CORS**: Orígenes permitidos para frontend

**Interacciones:**
- Define la configuración de base de datos para todos los modelos
- Configura autenticación JWT para todas las APIs
- Habilita CORS para comunicación con frontend

**Ejemplo de Configuración:**
```python
# Autenticación JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# Configuración CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### Módulo de Usuarios (`backend/usuarios/`)

#### models.py

**Propósito**: Define los modelos de datos para usuarios, perfiles y sistema de permisos.

**Modelos Principales:**

**Permisos:**
- **Propósito**: Modelo escalable para gestión granular de permisos
- **Campos**: 11 campos booleanos que representan permisos específicos del sistema
- **Uso**: Asociado a cada perfil de usuario para control de acceso

**Perfil:**
- **Propósito**: Extiende el modelo User de Django con campos adicionales
- **Relaciones**: OneToOne con User, ForeignKey con Permisos
- **Campos**: 
  - `aprobado`: Boolean que controla si el usuario puede acceder al sistema
  - `permisos`: Relación con el modelo Permisos

**Interacciones:**
- Se conecta con el sistema de autenticación de Django
- Proporciona datos para serializadores y vistas
- Base para sistema de permisos en frontend

#### serializers.py

**Propósito**: Serialización y validación de datos para la API de usuarios.

**Serializadores Principales:**

**UsuarioSerializer:**
- **Campos**: id, username, email, first_name, last_name, perfil
- **Propósito**: Serializar datos completos del usuario incluyendo perfil

**ValidarAprobacion:**
- **Herencia**: Extiende TokenObtainPairSerializer de Simple JWT
- **Funcionalidad**: Valida que el usuario esté aprobado antes de generar tokens
- **Flujo**: 
  1. Valida credenciales con super().validate()
  2. Verifica `user.perfil.aprobado`
  3. Incluye datos de usuario en respuesta

**RegistrarUsuario:**
- **Validaciones**: 
  - Email único
  - Username único
  - Coincidencia de contraseñas
  - Validación de fortaleza de contraseña
- **Creación**: Crea usuario y perfil asociado

#### views.py

**Propósito**: Controladores para endpoints de API relacionados con usuarios.

**Endpoints Principales:**

**Autenticación:**
- `crear_usuario()`: Registro de nuevos usuarios (POST /api/registro/)
- `IniciarSesionView`: Login con validación de aprobación (POST /api/login/)
- `cerrar_sesion()`: Logout con blacklist de tokens (POST /api/logout/)

**Gestión de Usuarios:**
- `aprobar_usuario()`: Aprobación de usuarios pendientes (POST /api/usuarios/{id}/aprobar/)
- `listar_usuarios()`: Lista usuarios aprobados (GET /api/usuarios/)
- `usuarios_pendientes()`: Lista usuarios pendientes (GET /api/usuarios/pendientes/)

**Gestión de Permisos:**
- `ver_permisos_usuarios()`: Obtiene permisos actuales de usuario (GET /api/usuarios/{id}/ver-permisos/)
- `cambiar_permisos()`: Actualiza permisos de usuario (POST /api/usuarios/{id}/cambiar-permisos/)

**Información de Usuario:**
- `obtener_usuario_actual()`: Obtiene datos del usuario autenticado (GET /api/usuario/actual/)

**Sistema de Permisos:**
- **PuedeAprobarUsuarios**: Permiso personalizado que requiere autenticación y capacidad de aprobar usuarios
- **IsAdminUser**: Permiso Django estándar para usuarios staff

#### permisos.py

**Propósito**: Definición de permisos personalizados para control de acceso.

**Clase Principal:**
```python
class PuedeAprobarUsuarios(permissions.BasePermission):
    """
    Permite acceso solo a usuarios que pueden aprobar otros usuarios
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.perfil.permisos.AprobarUsuarios
```

#### urls.py

**Propósito**: Configuración de rutas URL para el módulo de usuarios.

**Endpoints Configurados:**
```python
urlpatterns = [
    path('api/registro/', crear_usuario, name='registro'),
    path('api/login/', IniciarSesionView.as_view(), name='login'),
    path('api/logout/', cerrar_sesion, name='logout'),
    path('api/usuarios/', listar_usuarios, name='listar_usuarios'),
    path('api/usuarios/pendientes/', usuarios_pendientes, name='usuarios_pendientes'),
    path('api/usuarios/<int:usuario_id>/aprobar/', aprobar_usuario, name='aprobar_usuario'),
    path('api/usuarios/<int:usuario_id>/ver-permisos/', ver_permisos_usuarios, name='ver_permisos'),
    path('api/usuarios/<int:usuario_id>/cambiar-permisos/', cambiar_permisos, name='cambiar_permisos'),
    path('api/usuario/actual/', obtener_usuario_actual, name='usuario_actual'),
]
```

### Módulos Adicionales del Backend

#### inventario/
- **Propósito**: Gestión completa de productos y stock del laboratorio
- **Funcionalidades**: CRUD de productos, control de inventario, categorización
- **Integración**: Conecta con módulo de usuarios para permisos

#### recursos/
- **Propósito**: Gestión de recursos adicionales del sistema
- **Funcionalidades**: Subida/descarga de archivos, organización de recursos
- **Permisos**: Control granular de acceso a recursos

#### biocalculadora/
- **Propósito**: Herramientas especializadas para cálculos biológicos
- **Ejemplos**: Cálculos de concentración, diluciones, conversiones
- **Integración**: API para cálculos en tiempo real

#### chatbot/
- **Propósito**: Sistema de asistente virtual (en desarrollo)
- **Funcionalidades**: Respuestas automatizadas, integración con otros módulos

#### dashboard/
- **Propósito**: Panel de control administrativo
- **Métricas**: Resumen de usuarios, inventario, actividad del sistema

---

## 🎨 Módulo Frontend

### Estructura de la Aplicación React

#### Configuración Principal (`frontend/react-app/`)

**package.json**
- **Dependencias Principales**: React 18, TypeScript, Material-UI, Axios, React Router
- **Scripts**: Desarrollo con Vite, build para producción
- **Configuración**: ESLint, TypeScript configurado

**vite.config.ts**
- **Propósito**: Configuración del bundler Vite
- **Características**: Hot reload, optimizaciones de build

### Componentes Principales

#### App.tsx

**Propósito**: Componente raíz de la aplicación React que configura el routing y la estructura general.

**Funcionalidades:**
- Configuración de React Router
- Proveedor de autenticación
- Layout principal de la aplicación
- Manejo de rutas públicas y protegidas

#### Layout Components (`src/shared/`)

**MainLayout.tsx**
- **Propósito**: Layout principal que incluye barra lateral y superior
- **Componentes**: Integra BarraLateral y BarraArriba
- **Estado**: Control de sidebar abierto/cerrado

**BarraLateral/barraLateral.tsx**
- **Propósito**: Navegación lateral con menú de la aplicación
- **Elementos**: Enlaces a diferentes módulos, información de usuario
- **Interacciones**: Cambio de vista, cierre de sesión

**BarraArriba/barraArriba.tsx**
- **Propósito**: Barra superior con información contextual
- **Funcionalidades**: Título de vista actual, acciones rápidas

### Módulo de Autenticación

#### Login Component (`src/components/Login/login.tsx`)

**Propósito**: Interfaz para inicio de sesión de usuarios.

**Estado:**
- `username`: Nombre de usuario ingresado
- `password`: Contraseña ingresada
- `loading`: Estado de carga durante autenticación
- `error`: Mensajes de error de autenticación

**Flujo de Autenticación:**
1. Usuario ingresa credenciales
2. Se valida formato de datos
3. Se realiza petición a `/api/login/`
4. Se almacenan tokens en localStorage
5. Se redirige al dashboard

**Integración:**
- Utiliza `authService` para comunicación con API
- Maneja errores de credenciales y aprobación pendiente

#### Register Component (`src/components/Register/register.tsx`)

**Propósito**: Interfaz para registro de nuevos usuarios.

**Validaciones:**
- Campos requeridos: username, email, password, password2
- Validación de formato de email
- Coincidencia de contraseñas
- Fortaleza de contraseña

**Flujo de Registro:**
1. Usuario completa formulario
2. Se validan datos localmente
3. Se envía petición a `/api/registro/`
4. Se muestra confirmación de registro pendiente

### Módulo de Gestión de Usuarios

#### PermisosVista (`src/components/Permisos/permisos.tsx`)

**Propósito**: Vista principal para gestión de usuarios y permisos (solo administradores).

**Estado:**
```typescript
{
  usuariosAprobados: User[],
  usuariosNoAprobados: User[], 
  loading: boolean,
  error: string | null,
  sidebarAbierta: boolean
}
```

**Funciones Principales:**
- `obtenerDatos()`: Carga usuarios aprobados y pendientes
- `getCurrentViewName()`: Determina nombre de vista para barra superior

**Integración:**
- Utiliza `userService` para operaciones de API
- Renderiza componente `BasicTabs` para organización por pestañas

#### BasicTabs (`src/shared/pestañas/pestañas.tsx`)

**Propósito**: Componente de pestañas para mostrar usuarios aprobados y pendientes.

**Props:**
- `tab1`: Etiqueta pestaña usuarios aprobados
- `tab2`: Etiqueta pestaña usuarios pendientes  
- `usuariosAprobados`: Array de usuarios aprobados
- `usuariosNoAprobados`: Array de usuarios pendientes

**Estado Interno:**
- `value`: Índice de pestaña activa
- `usuarioDialogAbierto`: Control de modal de aprobación
- `permisosDialogAbierto`: Control de modal de permisos
- `permisosUsuario`: Permisos del usuario seleccionado

**Funciones de Gestión:**
- `handleAprobar()`: Aprueba usuario pendiente
- `handlePermisoChange()`: Cambia estado de permiso individual
- `handleGuardarPermisos()`: Guarda cambios de permisos

### Servicios de API (`src/services/`)

#### authService.ts

**Propósito**: Servicio para operaciones de autenticación.

**Métodos:**
- `login(credentials)`: Autenticación y obtención de tokens
- `logout()`: Cierre de sesión e invalidación de tokens
- `getCurrentUser()`: Obtiene información del usuario actual
- `isAuthenticated()`: Verifica si el usuario está autenticado

**Manejo de Tokens:**
- Almacenamiento seguro en localStorage
- Inclusión automática en headers de peticiones
- Renovación automática con refresh tokens

#### userService.ts

**Propósito**: Servicio para gestión de usuarios y permisos.

**Métodos Principales:**
```typescript
// Gestión de usuarios
getApprovedUsers(): Promise<{ usuarios: User[], total: number }>
getPendingUsers(): Promise<{ usuarios: User[], total_pendientes: number }>
approveUser(userId: number): Promise<ApiResponse<User>>

// Gestión de permisos  
getUserPermissions(userId: number): Promise<Permission[]>
updateUserPermissions(userId: number, permisos: Permission[]): Promise<ApiResponse<User>>
```

**Integración:**
- Utiliza Axios con interceptor para autenticación
- Maneja errores HTTP de forma consistente
- Proporciona tipos TypeScript para respuestas

#### interceptor.ts

**Propósito**: Interceptor de Axios para manejo automático de autenticación.

**Funcionalidades:**
- Inclusión automática de token JWT en headers
- Manejo de errores 401 (redirección a login)
- Renovación automática de tokens expirados
- Gestión centralizada de errores de API

### Features Especializadas (`src/features/`)

#### Dashboard (`features/dashboard/Dashboard.tsx`)
- **Propósito**: Panel de control con métricas del sistema
- **Métricas**: Usuarios activos, estado de inventario, actividad reciente
- **Permisos**: Requiere permiso `VerDashboard`

#### ProductionCalculator (`features/calculator/ProductionCalculator.tsx`) 
- **Propósito**: Herramientas de cálculo para producción biológica
- **Integración**: Conecta con API de biocalculadora
- **Permisos**: Requiere permiso específico de cálculo

#### VirtualAssistant (`features/assistant/VirtualAssistant.tsx`)
- **Propósito**: Interfaz para chatbot de asistencia
- **Funcionalidades**: Chat en tiempo real, respuestas contextuales
- **Permisos**: Requiere `InteractuarChatbot`

#### TechnicalDocumentation (`features/documentation/TechnicalDocumentation.tsx`)
- **Propósito**: Visualización de documentación técnica
- **Contenido**: Manuales, protocolos, documentación de API
- **Permisos**: Requiere `VerDocumentacion`

#### Reports (`features/reports/Reports.tsx`)
- **Propósito**: Generación y visualización de reportes
- **Tipos**: Reportes de inventario, usuarios, actividad
- **Permisos**: Requiere `VerReportes` o `GenerarReportes`

#### Sensors (`features/sensors/Sensors.tsx`)
- **Propósito**: Monitoreo de sensores y equipos del laboratorio
- **Integración**: Datos en tiempo real de equipos conectados
- **Permisos**: Requiere permisos específicos de monitoreo

### Tipos TypeScript (`src/types/index.ts`)

**Interfaces Principales:**
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
