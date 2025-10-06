# BioGestor - Documentación del Backend

## 📋 Introducción

BioGestor es un sistema de gestión desarrollado con Django REST Framework que proporciona una API robusta para la administración de usuarios, inventario y recursos biológicos. El sistema incluye autenticación JWT, aprobación de usuarios y múltiples módulos especializados.

## 🏗️ Arquitectura del Proyecto

### Tecnologías Utilizadas
- **Framework Backend**: Django 4.2.11
- **API**: Django REST Framework
- **Autenticación**: JWT (JSON Web Tokens)
- **Base de Datos**: PostgreSQL
- **CORS**: Configuración para frontend React
- **Variables de Entorno**: django-environ

### Estructura de Aplicaciones

```
backend/
├── BGProject/          # Configuración principal del proyecto
├── usuarios/           # Gestión de usuarios y autenticación
├── inventario/         # Sistema de gestión de inventario
├── recursos/           # Gestión de recursos adicionales
├── biocalculadora/     # Cálculos y herramientas especializadas
├── chatbot/            # Sistema de chatbot (en desarrollo)
└── dashboard/          # Panel de control administrativo
```

## 🔧 Configuración del Proyecto

### Variables de Entorno (.env)
```bash
DJANGO_SECRET_KEY=tu_clave_secreta
DEBUG=True
```

### Aplicaciones Instaladas
- `usuarios` - Sistema de usuarios y autenticación
- `inventario` - Gestión de productos y stock
- `recursos` - Recursos adicionales del sistema
- `biocalculadora` - Herramientas de cálculo
- `rest_framework` - Framework para APIs REST
- `corsheaders` - Configuración CORS
- `rest_framework_simplejwt` - Autenticación JWT

## 👥 Módulo de Usuarios

### Modelos

#### Perfil (Extensión de User)
```python
class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    aprobado = models.BooleanField(default=False)
```

**Descripción**: Extiende el modelo User de Django para incluir un campo de aprobación. Cada usuario debe ser aprobado por un administrador antes de poder acceder al sistema.

### Características Principales
- **Registro de usuarios** con aprobación pendiente
- **Autenticación JWT** con tokens de acceso y refresh
- **Sistema de aprobación** por administradores
- **Endpoints protegidos** con permisos de staff

## 📦 Módulo de Inventario

Sistema completo para la gestión de productos, stock y recursos del laboratorio.

### Funcionalidades
- Creación y edición de productos
- Control de stock e inventario
- Categorización de recursos
- Búsqueda y filtrado avanzado

## 🧮 Módulo Biocalculadora

Herramientas especializadas para cálculos biológicos y científicos.

### Características
- Cálculos específicos del dominio
- Formularios especializados
- Resultados en tiempo real
- Integración con otros módulos

## 🌐 Configuración API

### Autenticación
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```

### CORS
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

## 🗄️ Base de Datos

### Configuración PostgreSQL
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'biogestor',
        'USER': 'postgres',
        'PASSWORD': 'mi_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🚀 Despliegue

### Requisitos del Sistema
- Python 3.8+
- PostgreSQL 12+
- Virtualenv (recomendado)

### Comandos de Instalación
```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Levantar imágen docker
docker compose up

# Configurar base de datos
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

## 🔒 Seguridad

- Autenticación JWT con blacklist de tokens
- Validación de contraseñas
- Protección CORS configurada
- Variables de entorno para datos sensibles

## 📞 Soporte

Para problemas técnicos o consultas sobre el backend, contactar al equipo de desarrollo.

---

*Última actualización: 05/10/2025*