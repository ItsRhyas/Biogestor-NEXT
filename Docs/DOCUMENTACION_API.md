# BioGestor - Documentación de la API

## 📡 Endpoints de la API

### Autenticación y Usuarios

#### 1. Registrar Usuario
**POST** `/api/registro/`

**Descripción**: Crea un nuevo usuario en estado "pendiente de aprobación"

**Body**:
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura",
  "first_name": "Nombre",
  "last_name": "Apellido"
}
```

**Respuesta Exitosa** (201):
```json
{
  "mensaje": "Usuario registrado exitosamente. Espera aprobación del administrador.",
  "usuario": {
    "id": 1,
    "username": "nuevo_usuario",
    "email": "usuario@ejemplo.com",
    "first_name": "Nombre",
    "last_name": "Apellido",
    "perfil": {
      "aprobado": false
    }
  }
}
```

#### 2. Iniciar Sesión
**POST** `/api/login/`

**Descripción**: Autentica usuario y devuelve tokens JWT

**Body**:
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Respuesta Exitosa** (200):
```json
{
  "access": "token_de_acceso",
  "refresh": "token_de_refresh",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@ejemplo.com",
    "first_name": "Nombre",
    "last_name": "Apellido",
    "perfil": {
      "aprobado": true
    }
  }
}
```

#### 3. Cerrar Sesión
**POST** `/api/logout/`

**Descripción**: Invalida el token de refresh

**Body**:
```json
{
  "refresh_token": "token_de_refresh"
}
```

**Headers**:
```
Authorization: Bearer [access_token]
```

**Respuesta Exitosa** (200):
```json
{
  "mensaje": "Sesión cerrada exitosamente"
}
```

### Gestión de Usuarios (Solo Administradores)

#### 4. Aprobar Usuario
**POST** `/api/usuarios/{id}/aprobar/`

**Descripción**: Aprueba un usuario pendiente (requiere permisos de staff)

**Headers**:
```
Authorization: Bearer [access_token]
```

**Respuesta Exitosa** (200):
```json
{
  "mensaje": "Usuario usuario_aprobado aprobado exitosamente",
  "usuario": {
    "id": 1,
    "username": "usuario_aprobado",
    "email": "usuario@ejemplo.com",
    "first_name": "Nombre",
    "last_name": "Apellido",
    "perfil": {
      "aprobado": true
    }
  }
}
```

#### 5. Listar Usuarios Aprobados
**GET** `/api/usuarios/`

**Descripción**: Obtiene lista de usuarios aprobados (solo administradores)

**Headers**:
```
Authorization: Bearer [access_token]
```

**Respuesta Exitosa** (200):
```json
{
  "total": 15,
  "usuarios": [
    {
      "id": 1,
      "username": "usuario1",
      "email": "usuario1@ejemplo.com",
      "first_name": "Nombre1",
      "last_name": "Apellido1",
      "perfil": {
        "aprobado": true
      }
    }
  ]
}
```

#### 6. Listar Usuarios Pendientes
**GET** `/api/usuarios/pendientes/`

**Descripción**: Obtiene lista de usuarios pendientes de aprobación (solo administradores)

**Headers**:
```
Authorization: Bearer [access_token]
```

**Respuesta Exitosa** (200):
```json
{
  "total_pendientes": 3,
  "usuarios": [
    {
      "id": 2,
      "username": "usuario_pendiente",
      "email": "pendiente@ejemplo.com",
      "first_name": "Nombre",
      "last_name": "Apellido",
      "perfil": {
        "aprobado": false
      }
    }
  ]
}
```

#### 7. Obtener Usuario Actual
**GET** `/api/usuario/actual/`

**Descripción**: Obtiene información del usuario autenticado

**Headers**:
```
Authorization: Bearer [access_token]
```

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "username": "usuario_actual",
  "email": "actual@ejemplo.com",
  "first_name": "Nombre",
  "last_name": "Apellido",
  "perfil": {
    "aprobado": true
  }
}
```

## 🔐 Autenticación JWT

### Flujo de Autenticación
1. **Login**: Obtener access_token y refresh_token
2. **Acceso a API**: Usar access_token en header Authorization
3. **Refresh**: Renovar access_token cuando expire
4. **Logout**: Invalidar refresh_token

### Headers de Autenticación
```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Refresh Token
**POST** `/api/token/refresh/`

**Body**:
```json
{
  "refresh": "token_de_refresh"
}
```

## 🚨 Códigos de Estado HTTP

- `200` OK - Solicitud exitosa
- `201` Created - Recurso creado exitosamente
- `400` Bad Request - Datos inválidos
- `401` Unauthorized - No autenticado
- `403` Forbidden - No tiene permisos
- `404` Not Found - Recurso no encontrado

## 📝 Ejemplos de Uso

### Ejemplo: Registro y Aprobación de Usuario

```javascript
// 1. Registrar nuevo usuario
const respuestaRegistro = await fetch('/api/registro/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'nuevo_cientifico',
    email: 'cientifico@lab.com',
    password: 'Password123!',
    first_name: 'María',
    last_name: 'García'
  })
});

// 2. Administrador aprueba usuario
const respuestaAprobacion = await fetch('/api/usuarios/1/aprobar/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + adminToken
  }
});

// 3. Usuario inicia sesión
const respuestaLogin = await fetch('/api/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'nuevo_cientifico',
    password: 'Password123!'
  })
});

const datosLogin = await respuestaLogin.json();
const accessToken = datosLogin.access;
```

### Ejemplo: Gestión de Sesión

```javascript
// Obtener información del usuario actual
const respuestaUsuario = await fetch('/api/usuario/actual/', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
});

// Cerrar sesión
const respuestaLogout = await fetch('/api/logout/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify({
    refresh_token: refreshToken
  })
});
```

## 🔍 Endpoints Adicionales

### Módulo de Inventario

#### Listar Productos
**GET** `/api/inventario/productos/`

**Parámetros Query**:
- `categoria` - Filtrar por categoría
- `stock_min` - Stock mínimo
- `search` - Búsqueda por nombre

### Módulo Biocalculadora

#### Realizar Cálculo
**POST** `/api/biocalculadora/calcular/`

**Body** (ejemplo):
```json
{
  "tipo_calculo": "concentracion_adn",
  "parametros": {
    "volumen": 50,
    "absorbancia": 0.8
  }
}
```

## 📊 Manejo de Errores

### Respuestas de Error Comunes

#### 400 - Datos Inválidos
```json
{
  "error": "Los datos proporcionados son inválidos",
  "detalles": {
    "username": ["Este campo es requerido."],
    "email": ["Ingrese un email válido."]
  }
}
```

#### 401 - No Autenticado
```json
{
  "error": "Usuario no autenticado"
}
```

#### 403 - Sin Permisos
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

#### 404 - Usuario No Encontrado
```json
{
  "error": "Usuario no encontrado"
}
```

---

*Documentación actualizada para BioGestor v1.0*