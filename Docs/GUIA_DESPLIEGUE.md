# BioGestor - Guía de Despliegue

## 📋 Prerrequisitos

### Software Requerido
- **Python**: 3.8 o superior
- **PostgreSQL**: 12 o superior
- **pip**: Gestor de paquetes de Python
- **virtualenv** (recomendado)

### Dependencias del Sistema
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv postgresql postgresql-contrib


# macOS (con Homebrew)
brew install python3 postgresql
```

## 🚀 Instalación Paso a Paso

### 1. Clonar el Proyecto
```bash
git clone <url-del-repositorio>
cd backend
```

### 2. Configurar Entorno Virtual
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### 3. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar Base de Datos PostgreSQL

#### Crear Base de Datos
```sql
-- Levantar imágen docker que contiene la base de datos
sudo -u postgres psql


-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE biogestor TO biogestor_user;
\q
```

#### Configurar Variables de Entorno
Crear archivo `.env` en la carpeta `backend/`:
```bash
DJANGO_SECRET_KEY=tu_clave_secreta_muy_larga_y_compleja_aqui
DEBUG=False
DB_NAME=biogestor
DB_USER=postgres
DB_PASSWORD=tu_password_postgres
DB_HOST=localhost
DB_PORT=5432
```

### 5. Configurar el Proyecto Django

#### Aplicar Migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Crear Superusuario
```bash
python manage.py createsuperuser
```
Seguir las instrucciones para crear el usuario administrador.

#### Recopilar Archivos Estáticos
```bash
python manage.py collectstatic 
```

### 6. Verificar Instalación
```bash
# Ejecutar servidor de desarrollo
python manage.py runserver
```

Visitar `http://localhost:8000/admin` para verificar que el backend funciona correctamente.

## 🔧 Configuración para Producción

### Configuración de Seguridad
En `settings.py` para producción:
```python
# Deshabilitar debug
DEBUG = False

# Configurar hosts permitidos
ALLOWED_HOSTS = ['tu-dominio.com', 'www.tu-dominio.com']

# Configuración de base de datos para producción
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST', 'localhost'),
        'PORT': env('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,  # Conexiones persistentes
    }
}
```

### Configuración CORS para Producción
```python
CORS_ALLOWED_ORIGINS = [
    "https://tu-frontend.com",
    "https://www.tu-frontend.com",
]

# O permitir todos los orígenes (solo para desarrollo)
# CORS_ALLOW_ALL_ORIGINS = True
```

## 🐳 Despliegue con Docker

### Archivo docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: biogestor
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password_seguro
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=db
      - DB_NAME=biogestor
      - DB_USER=postgres
      - DB_PASSWORD=password_seguro
    depends_on:
      - db

volumes:
  postgres_data:
```

### Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### Comandos Docker
```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs

# Detener servicios
docker-compose down
```

## 🔄 Despliegue Continuo

### Ejemplo de Script de Despliegue
```bash
#!/bin/bash

# Script de despliegue para BioGestor

echo "Iniciando despliegue de BioGestor..."

# Activar entorno virtual
source venv/bin/activate

# Obtener últimos cambios
git pull origin main

# Instalar nuevas dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Recopilar archivos estáticos
python manage.py collectstatic --noinput

# Reiniciar servicio (depende del servidor)
# systemctl restart gunicorn  # Para producción con Gunicorn

echo "Despliegue completado exitosamente!"
```

## 📊 Monitoreo y Mantenimiento

### Comandos de Mantenimiento
```bash
# Backup de base de datos
pg_dump -U postgres biogestor > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U postgres biogestor < backup_archivo.sql

# Limpiar migraciones (desarrollo)
python manage.py flush

# Verificar estado del proyecto
python manage.py check
```

### Logs y Monitoreo
```bash
# Ver logs de la aplicación
tail -f /var/log/django/app.log

# Monitorear base de datos
pg_top  # Si está instalado

# Ver uso de memoria
free -h
```

## 🚨 Solución de Problemas Comunes

### Error: No se puede conectar a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar conexión
psql -h localhost -U postgres -d biogestor
```

### Error: Migraciones pendientes
```bash
# Aplicar migraciones
python manage.py migrate

# Si hay conflictos, resetear (solo desarrollo):
python manage.py migrate --fake
```

### Error: Archivos estáticos no cargan
```bash
# Recopilar archivos estáticos
python manage.py collectstatic

# Verificar permisos
chmod -R 755 staticfiles/
```

### Error: CORS bloqueado
```python
# En settings.py, verificar:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev server
    "http://localhost:5173",  # Vite dev server
]
```

## 🔐 Consideraciones de Seguridad

1. **Nunca commitear `.env`** - Usar `.env.example` como template
2. **Usar HTTPS en producción**
3. **Configurar firewall** adecuadamente
4. **Mantener dependencias actualizadas**
5. **Usar variables de entorno** para datos sensibles
6. **Configurar backup automático** de base de datos

## 📞 Soporte

Para problemas de despliegue:
1. Verificar logs de la aplicación
2. Revisar configuración de base de datos
3. Confirmar que todas las dependencias estén instaladas
4. Verificar permisos de archivos y directorios

---

*Guía de despliegue actualizada para BioGestor v1.0*