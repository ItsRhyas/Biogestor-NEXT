# BioGestor Frontend - Documentación Técnica 

## 🎯 Introducción

Este documento proporciona una documentación técnica completa del frontend de BioGestor, diseñado para cualquiera que busque entender patrones modernos de desarrollo React con TypeScript.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **React 18** + **TypeScript** - Framework principal con tipado estático
- **Vite** - Build tool y dev server de última generación
- **Material-UI (MUI)** - Biblioteca de componentes UI
- **Styled Components** - CSS-in-JS para estilos componentizados
- **React Router DOM** - Navegación y routing
- **Axios** - Cliente HTTP para APIs
- **React Icons** - Iconografía consistente

### Estructura de Carpetas Refactorizada

```
src/
├── components/          # Componentes de UI reutilizables
│   ├── Login/
│   ├── Register/
│   └── Permisos/
├── features/           # Funcionalidades específicas (en desarrollo)
├── services/           # Lógica de negocio y APIs
│   ├── authService.ts
│   └── userService.ts
├── shared/             # Componentes y utilidades compartidas
│   ├── Boton/
│   ├── barraLateral/
│   ├── pestañas/
│   └── credenciales/
├── types/              # Definiciones TypeScript
│   └── index.ts
└── hooks/              # Custom hooks (futura implementación)
```

## 🔧 Patrones de Diseño Implementados

### 1. Separación de Responsabilidades

**Antes (Patrón Monolítico):**
```typescript
// Servicios mezclados con lógica de UI
export const authService = {
  async iniciarSesion(credenciales) {
    // Lógica de API + manejo de localStorage + redirección
  }
}
```

**Después (Separación Clara):**
```typescript src/services/authService.ts
// Servicio puro - Solo lógica de API
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/api/iniciar-sesion/', credentials);
    return response.data;
  }
}

// Componente - Solo lógica de UI
const handleSubmit = async (formData) => {
  const respuesta = await authService.login(credenciales);
  // Manejo de estado UI y navegación
}
```

### 2. Tipado Estático con TypeScript

**Interfaces Centralizadas:**
```typescript src/types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: {
    aprobado: boolean;
  };
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}
```

**Ventajas:**
- **Detección temprana de errores** en tiempo de desarrollo
- **Autocompletado inteligente** en IDEs
- **Documentación automática** de estructuras de datos
- **Refactorización segura** del código

### 3. Patrón de Servicios con Axios Interceptors

**Cliente HTTP Configurado:**
```typescript src/services/authService.ts
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para autenticación automática
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Interceptor para manejo centralizado de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir al login automáticamente
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Conceptos Aplicados:**
- **Inyección de Dependencias** - Servicios independientes
- **Separación de Concerns** - Lógica separada por responsabilidad
- **Patrón Interceptor** - Middleware para requests HTTP

## 🎨 Sistema de Diseño y Componentes

### Componente Boton - Ejemplo de Buenas Prácticas

```typescript src/shared/Boton/boton.tsx
import { ButtonProps } from '../../types';

export const Boton: React.FC<ButtonProps> = ({
  size = "small",
  disabled = false,
  color = "blue",
  icon,
  label,
  content,
  onClick,
  sinMovimiento = false,
  centrado = false,
}) => {
  return (
    <BotonStyled 
      $size={size}
      $color={color}
      $disabled={disabled}
      onClick={onClick}
    >
      {/* Implementación con styled-components */}
    </BotonStyled>
  );
};
```

**Características:**
- **Props con valores por defecto** - Comportamiento predecible
- **Propiedades opcionales** - Flexibilidad de uso
- **Tipado estricto** - Prevención de errores
- **Composición visual** - Icono + texto + descripción

### Styled Components - CSS-in-JS

**Ventajas:**
- **CSS con scope** - No hay conflictos de clases
- **Props dinámicos** - Estilos condicionales
- **Tema consistente** - Design system unificado
- **TypeScript integration** - Tipado de estilos

```typescript
const BotonStyled = styled.button<{
  $size: string;
  $color?: string;
  $disabled: boolean;
}>`
  padding: ${props => 
    props.$size === 'small' ? '5px 10px' : 
    props.$size === 'large' ? '15px 30px' : '10px 20px'
  };
  background-color: ${props => props.$color};
  opacity: ${props => props.$disabled ? 0.6 : 1};
`;
```

## 🔐 Sistema de Autenticación

### Flujo JWT (JSON Web Token)

```typescript
// 1. Login
const respuesta = await authService.login(credenciales);

// 2. Almacenamiento seguro
localStorage.setItem('authToken', respuesta.access);
localStorage.setItem('refreshToken', respuesta.refresh);

// 3. Uso automático en requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 4. Refresh automático
const newToken = await authService.refreshToken();
```

**Conceptos de Seguridad:**
- **Tokens de acceso** - Corta duración (15-30 min)
- **Tokens de refresh** - Larga duración (7 días)
- **Interceptores** - Inyección automática de headers
- **Blacklist** - Invalidación de tokens

### Protección de Rutas

```typescript src/App.tsx
const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

<Route 
  path="/dashboard" 
  element={
    isAuthenticated() ? (
      <Dashboard />
    ) : (
      <Navigate to="/login" />
    )
  } 
/>
```

## 📊 Gestión de Estado

### Estado Local con useState

**Ejemplo en Componente de Permisos:**
```typescript
const [usuariosAprobados, setUsuariosAprobados] = useState<User[]>([]);
const [usuariosNoAprobados, setUsuariosNoAprobados] = useState<User[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

**Patrón de Carga de Datos:**
```typescript
const obtenerDatos = async () => {
  setLoading(true);
  setError('');
  
  try {
    const [aprobados, pendientes] = await Promise.all([
      userService.getApprovedUsers(),
      userService.getPendingUsers()
    ]);
    
    setUsuariosAprobados(aprobados.usuarios);
    setUsuariosNoAprobados(pendientes.usuarios);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Futura Implementación - Context API/Redux

**Para escalabilidad:**
```typescript
// Ejemplo de contexto de autenticación
const AuthContext = createContext<AuthContextType>({});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🔄 Patrones de Renderizado

### Conditional Rendering

```typescript
{loading && (
  <div>Cargando usuarios...</div>
)}

{error && (
  <div style={{ color: 'red' }}>{error}</div>
)}

{usuariosAprobados.map(usuario => (
  <div key={usuario.id}>{usuario.first_name}</div>
))}
```

### Render Props en Tabs

```typescript
<CustomTabPanel value={value} index={0}>
  {/* Contenido condicional por tab */}
  <div>
    {usuariosAprobados.map(usuario => (
      <div key={usuario.id}>{usuario.first_name}</div>
    ))}
  </div>
</CustomTabPanel>
```

## 🧪 Testing y Calidad de Código

### Estrategias de Testing Recomendadas

**Unit Tests - Servicios:**
```typescript
describe('authService', () => {
  it('should login user successfully', async () => {
    const credentials = { username: 'test', password: 'test' };
    const response = await authService.login(credentials);
    expect(response.access).toBeDefined();
  });
});
```

**Component Tests - React Testing Library:**
```typescript
describe('Login Component', () => {
  it('should show error on failed login', async () => {
    render(<Login />);
    fireEvent.click(screen.getByText('Iniciar Sesión'));
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
```

### ESLint y TypeScript Config

**Configuración de Calidad:**
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "react-hooks/recommended"
  ],
  "rules": {
    "no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 🚀 Optimizaciones de Performance

### Code Splitting con React.lazy

```typescript
const PermisosVista = React.lazy(() => import('./components/Permisos/permisos'));

<Suspense fallback={<div>Cargando...</div>}>
  <PermisosVista />
</Suspense>
```

### Memoización con React.memo y useMemo

```typescript
const ExpensiveComponent = React.memo(({ users }) => {
  const processedUsers = useMemo(() => 
    users.map(user => expensiveCalculation(user)), 
    [users]
  );
  
  return <div>{processedUsers}</div>;
});
```

## 📈 Escalabilidad y Mantenibilidad

### Estructura para Crecimiento

**Features por Dominio:**
```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   └── services/
├── users/
│   ├── components/
│   ├── hooks/
│   └── services/
└── inventory/
    ├── components/
    ├── hooks/
    └── services/
```

### Custom Hooks para Lógica Reutilizable

```typescript
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUsers = async () => {
    setLoading(true);
    const data = await userService.getApprovedUsers();
    setUsers(data.usuarios);
    setLoading(false);
  };
  
  return { users, loading, fetchUsers };
};
```

## 🎓 Conceptos Aplicados

### 1. Arquitectura de Software
- **Separación de Concerns** - Servicios, componentes, tipos
- **Patrón Repository** - Acceso centralizado a datos
- **Inversión de Dependencias** - Servicios independientes del framework

### 2. Patrones de Diseño
- **Factory Pattern** - Creación de servicios
- **Observer Pattern** - React state management
- **Strategy Pattern** - Diferentes implementaciones de servicios

### 3. Principios SOLID
- **Single Responsibility** - Cada componente una responsabilidad
- **Open/Closed** - Extensible sin modificar código existente
- **Dependency Inversion** - Dependencias abstraídas

### 4. Clean Code
- **Nomenclatura significativa** - Variables y funciones descriptivas
- **Funciones pequeñas** - Una responsabilidad por función
- **Código auto-documentado** - Tipos y estructura claros

## 🔮 Próximos Pasos y Mejoras

### Para Implementar:
1. **Context API** - Estado global de aplicación
2. **Custom Hooks** - Lógica reutilizable
3. **Error Boundaries** - Manejo elegante de errores
4. **PWA** - Progressive Web App capabilities
5. **Testing Suite** - Cobertura completa de tests

### Para Aprendizaje:
1. **GraphQL** - Alternativa a REST APIs
2. **State Machines** - XState para flujos complejos
3. **Micro-frontends** - Arquitectura escalable
4. **WebAssembly** - Cálculos de alto rendimiento

---

## 📚 Recursos para Estudiantes

### Prerrequisitos Recomendados:
- JavaScript ES6+ (arrow functions, destructuring, async/await)
- TypeScript Fundamentals (interfaces, tipos genéricos)
- React Hooks (useState, useEffect, custom hooks)
- CSS-in-JS Concepts (styled-components, emotion)

### Proyectos de Práctica:
1. **Clonar este proyecto** - Entender la estructura
2. **Agregar nuevas features** - Practicar patrones aprendidos
3. **Implementar testing** - Asegurar calidad de código
4. **Optimizar performance** - Aplicar técnicas avanzadas

---

*Documentación técnica dirigida a miembros del proyecto Biogestor*