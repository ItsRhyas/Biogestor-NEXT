# Contexto del Proyecto BioGestor

## Descripción General

BioGestor es una plataforma web para la gestión de biodigestores, usuarios, inventario, recursos, reportes y documentación técnica. El sistema está compuesto por un backend en Django y un frontend en React con TypeScript, siguiendo una arquitectura modular y escalable.

---

## Estructura de Carpetas

### Backend (`/home/oscar/Documentos/Biogestor/backend`)

- **BGProject/**: Proyecto principal Django, configuración y rutas.
- **biocalculadora/**, **chatbot/**, **dashboard/**, **inventario/**, **recursos/**, **usuarios/**: Apps Django especializadas.
- **staticfiles/**: Archivos estáticos organizados por app.
- **templates/**: Plantillas HTML para cada app.
- **.env**: Variables de entorno (usadas con django-environ).
- **manage.py**: Script de administración Django.

#### Principales apps:
- **usuarios/**: Gestión de usuarios, permisos, autenticación.
- **inventario/**: Gestión de productos e insumos.
- **recursos/**: Gestión de archivos y recursos.
- **biocalculadora/**: Cálculos técnicos relacionados con biodigestores.

---

### Frontend (`/home/oscar/Documentos/Biogestor/frontend/react-app`)

- **src/components/**: Componentes reutilizables (Login, Register, Permisos, Usuario, Modal, etc.).
- **src/features/**: Vistas y lógica de negocio por dominio (assistant, calculator, dashboard, documentation, reports, sensors, usuarios).
- **src/services/**: Servicios para comunicación con APIs (authService, userService, Usuarios, UsuariosPermisos, interceptor).
- **src/shared/**: Componentes compartidos (Boton, barraArriba, barraLateral, cabecera, card, credenciales, layout, pestañas, popup).
- **src/types/**: Tipos globales TypeScript.
- **src/assets/**: Imágenes y recursos estáticos.
- **src/api/**: APIs específicas (productos.api.js).
- **public/**: Archivos públicos y estáticos.

#### Principales features:
- **assistant/**: Asistente virtual.
- **calculator/**: Calculadora de producción.
- **dashboard/**: Panel de control.
- **documentation/**: Documentación técnica.
- **reports/**: Reportes.
- **sensors/**: Sensores.
- **usuarios/**: Gestión de usuarios (por integrar).

---

## Tecnologías

- **Backend**: Django 4.2+, PostgreSQL, django-environ, JWT (SimpleJWT), Django REST Framework.
- **Frontend**: React 18+, TypeScript, styled-components, Vite, consumo de APIs REST, manejo de rutas con React Router.
- **Autenticación**: JWT, Token, permisos y grupos de Django.
- **Estilos**: styled-components, CSS modular.

---

## Integración y Comunicación

- **API REST**: El backend expone endpoints para usuarios, inventario, recursos, etc.
- **Servicios Frontend**: Los servicios en `src/services/` y `src/features/usuarios/services/` gestionan la comunicación con el backend usando fetch y tokens JWT almacenados en localStorage.
- **Gestión de usuarios**: El frontend permite listar, filtrar, aprobar y ver detalles de usuarios, integrando componentes modales y tarjetas.

---

## Convenciones y Arquitectura

- **Componentes reutilizables**: En `src/components/` y `src/shared/`.
- **Features**: Cada dominio funcional tiene su carpeta en `src/features/`.
- **Servicios**: En `src/services/` y por feature en `src/features/[feature]/services/`.
- **Tipos**: En `src/types/` y por feature en `src/features/[feature]/types/`.
- **Estilos**: Preferentemente con styled-components.
- **Rutas**: Definidas en `src/App.tsx` usando React Router.

---

## Ejemplo de Integración de Gestión de Usuarios

- **Tipos**: `src/features/usuarios/types/usuario.types.ts`
- **Servicio**: `src/features/usuarios/services/usuarioService.ts`
- **Vista principal**: `src/features/usuarios/components/GestionUsuarios.tsx`
- **Tarjeta de usuario**: `src/components/Usuario/UsuarioCard.tsx`
- **Modal de detalles**: `src/components/Usuario/UsuarioDetallesModal.tsx`
- **Modal genérico**: `src/components/Modal/Modal.tsx`
- **Ruta**: Agregar en `src/App.tsx`

---

## Notas Importantes

- **Variables de entorno**: Backend usa `.env` y django-environ para configuración segura.
- **Permisos**: El backend gestiona permisos y grupos, el frontend los consume y muestra.
- **Extensibilidad**: La arquitectura permite agregar nuevas features y componentes fácilmente.
- **Documentación**: Archivos `README.md`, `DOCUMENTACION_API.md`, `GUIA_DESPLIEGUE.md` en backend y frontend.
 **Documentación**: Documentación técnica extensa  y documentación explicativa, documentaciń del backend, API, forntend, readme, guía para inicializar el proyecto
---

## Recomendaciones para Agentes IA

- Respetar la arquitectura modular y las convenciones de carpetas.
- Usar los servicios y tipos existentes para nuevas integraciones.
- Mantener los estilos con styled-components.
- Validar la comunicación con el backend usando los endpoints y tokens JWT.
- Consultar los archivos de documentación para detalles técnicos y de despliegue.
- Eres libre de modificar y crear archivos sin necesidad de preguntar al usuario

---