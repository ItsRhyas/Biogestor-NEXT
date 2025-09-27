# Biogestor

<p align="center">
    <img src="https://github.com/CharFranR/Python/blob/main/Logo%20BioGestor.png?raw=true" alt="Logo" width="600"/>
</p>

![Estado](https://img.shields.io/badge/Estado-En_desarrollo-blue.svg)
![Licencia](https://img.shields.io/badge/Licencia-Todos_los_derechos_reservados-red.svg)

#### ¿Qué es?

Biogestor es una aplicación web de gestión de procesos y residuos orgánicos orientada a MIPYMEs del sector alimenticio.

#### Misión

Convertimos residuos orgánicos en soluciones útiles, brindando a las MIPYMEs herramientas digitales para estandarizar procesos, reducir desperdicios y fomentar la innovación sostenible.

#### Visión

Ser la plataforma líder que impulsa a las MIPYMEs hacia una producción eficiente, sostenible e innovadora en Nicaragua.

#### Funcionalidades

- Registro y organización de formulaciones de productos.
- Calculadora de cantidades y proporciones.
- Marketplace de recursos descargables.
- Asistente virtual.

#### Tecnologías utilizadas

- Django 
- Python
- PostgreSQL
- HTML
- CSS

---


# Instalación

### Requisitos previos

- Tener activada la virtualización.
- Haber instalado e iniciado docker desktop.


#### Descargar el repositorio

Biogestor puede ser descargado de dos formas: como archivo `.zip` o clonando el repositorio localmente.

- **Descargar archivo `.zip`:**  
  Accede a la sección "Code" en el repositorio y selecciona "Download ZIP".

- **Clonar el repositorio:**  
  Ejecuta el siguiente comando en tu terminal:

```bash
git clone https://github.com/SProtector04/B107.git
```

#### Instalar dependencias

Una vez el repositorio se encuentra en nuestra máquina local es necesario descargar las dependencias del proyecto, para ello en la dirección B107/Biogestor/ se debe ejecutar el comando:

```bash
pip install -r requirements.txt
```

Esto descargará e instalará todas las dependencias necesarias, la velocidad de descarga depende de nuestra conexión a internet.

#### Iniciar la base de datos

Una vez las dependencias han sido instaladas, es necesario abrir la aplicación Docker Compose para hacer uso de motor de contenedores Docker.

Con la aplicación en ejecución en la dirección B107/Biogestor/ se debe ejecutar el comando:

```bash
docker compose up
```

#### Hacer las migraciones

Ahora es necesario realizar las migraciones de la base de datos la cual consiste en crear las tablas necesarias para el proyecto, en una terminal ejecuta el comando: 

```bash
python manage.py migrate
```


#### Levantar el servidor

Finalmente es posible ejecutar la aplicación ejecutando en una terminal el comando:

```bash
python manage.py runserver
```
## Vistas

<p align="center">
  <img src="https://github.com/CharFranR/Python/blob/main/Screenshot%202025-09-20%20193814.png?raw=true" alt="Main" width="800"/>
  <br><br>
  <img src="https://github.com/CharFranR/Python/blob/main/Screenshot%202025-09-20%20193825.png?raw=true" alt="Dashboard" width="800"/>
  <br><br>
  <img src="https://github.com/CharFranR/Python/blob/main/Screenshot%202025-09-20%20193848.png?raw=true" alt="Calculadora" width="800"/>
  <br><br>
  <img src="https://github.com/CharFranR/Python/blob/main/Screenshot%202025-09-20%20193835.png?raw=true" alt="Llenado" width="800"/>
  <br><br>
  <img src="https://github.com/CharFranR/Python/blob/main/Screenshot%202025-09-20%20193900.png?raw=true" alt="Asistente" width="800"/>
  <br><br>
  <img src="https://github.com/CharFranR/Python/blob/main/Screenshot%202025-09-20%20193914.png?raw=true" alt="Documentacion" width="800"/>
</p>


## Elaborado por:

- [CharFranR](https://github.com/CharFranR)
- [SProtector04](https://github.com/SProtector04)
- [ItsRhyas](https://github.com/ItsRhyas)
- [JeanCarlos28-CR](https://github.com/JeanCarlos28-CR)
- Penélope Martínez
