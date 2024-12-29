**Documentación del Proyecto: Lucha de Robots**

-----
**Integrantes**

- Jorge Arze | jararze@gmail.com | 79680616
-----
**Introducción**

El proyecto "Lucha de Robots" permite la gestión de robots y torneos, así como la simulación de batallas entre ellos. Está desarrollado con tecnologías modernas como **Vue 3**, **Vite** y **JSON Server** para el backend simulado.

Esta documentación detalla la configuración, los componentes, y las funcionalidades, incluyendo ejemplos prácticos de uso.

-----
**Estructura del Proyecto**

```plaintext


lucha-robots/

├── src/

│   ├── components/          # Componentes Vue

│   ├── router.js            # Configuración de rutas

│   ├── App.vue              # Componente principal

│   ├── main.js              # Punto de entrada de la app

│   ├── api.js               # Configuración de Axios

│   ├── style.css            # Estilos globales

├── db.json                  # Base de datos simulada

├── package.json             # Configuración de dependencias

├── vite.config.js           # Configuración de Vite

```

-----
**Instalación**

**Requisitos Previos**

- **Node.js** versión >= 18
- **npm** o **yarn**
- **JSON Server**

**Pasos**

1. **Clonar el Repositorio**

```bash


git clone <url-del-repositorio>

cd lucha-robots

```

1. **Instalar Dependencias**

```bash


npm install
```

1. **Iniciar JSON Server**

```bash


json-server --watch db.json --port 3000

```
1. **Ejecutar la Aplicación**

```bash

npm run dev

```

1. **Acceso**
    1. Aplicación: http://localhost:5173
    1. API JSON Server: http://localhost:3000
-----
**Componentes**

**1. RobotList.vue**

- **Funcionalidad**:
    - Lista todos los robots con opciones para editar, eliminar y crear nuevos.
    - Incluye buscadores y filtros avanzados.
- **Integración API**:
    - GET /robots: Carga la lista de robots.
-----
**2. RobotForm.vue**

- **Funcionalidad**:
    - Formulario para crear o editar robots.
    - Validaciones para garantizar que los campos están completos y dentro de los rangos permitidos.
- **Validaciones**:
    - **Nombre**: No vacío.
    - **Atributos (Fuerza, Velocidad, Defensa)**: Valores entre 0 y 100.
- **Integración API**:
    - POST /robots: Crear un robot.
    - PUT /robots/:id: Editar un robot existente.
-----
**3. TorneoList.vue**

- **Funcionalidad**:
    - Lista todos los torneos disponibles.
    - Botón para simular la batalla entre los participantes del torneo.
- **Integración API**:
    - GET /torneos: Obtiene la lista de torneos.
    - DELETE /torneos/:id: Elimina un torneo.
-----
**4. TorneoForm.vue**

- **Funcionalidad**:
    - Permite la creación y edición de torneos.
    - Validaciones para garantizar que la fecha es válida y los participantes son diferentes.
- **Validaciones**:
    - **Fecha**: Formato válido.
    - **Participantes**: Deben ser diferentes.
-----
**5. SimulacionTorneo.vue**

- **Funcionalidad**:
    - Simula una batalla entre los dos robots seleccionados.
    - Calcula el daño basado en los atributos de cada robot.
    - Muestra un registro de eventos en tiempo real.
- **Lógica**:
    - Usa un intervalo para simular ataques y actualizar la vida de los robots.
    - Determina el ganador cuando uno de los robots queda con 0 vida.
-----
**Rutas**

Archivo: router.js

- **Definición de rutas**:

```javascript


const routes = [

`    `{ path: "/", redirect: "/robots" },

`    `{ path: "/robots", component: RobotList },

`    `{ path: "/robots/new", component: RobotForm },

`    `{ path: "/robots/edit/:id", component: RobotForm, props: true },

`    `{ path: "/torneos", component: TorneoList },

`    `{ path: "/torneos/new", component: TorneoForm },

`    `{ path: "/torneos/edit/:id", component: TorneoForm, props: true },

`    `{ path: "/simulacion/:participantes", component: SimulacionTorneo, props: true },

];
```

-----
**Configuración**

**1. Axios**

Archivo: api.js

- **Base URL**: http://localhost:3000
- **Ejemplo de uso**:

```javascript
apiClient.get("/robots").then(response => console.log(response.data));
```

**2. Vite**

Archivo: vite.config.js

- **Configuración**:

```javascript
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

export default defineConfig({

`  `plugins: [vue()],

})
```
-----
**Estilos**

Archivo: style.css

- **Tema oscuro y claro**:
    - Usa variables CSS para gestionar colores.
- **Estilos para componentes**:
    - Estiliza tablas, botones y formularios para una mejor experiencia visual.
-----
**Pruebas y Depuración**

**Pruebas Manuales**

- Crear robots y torneos.
- Editar elementos existentes.
- Simular batallas.

**Herramientas**

- **Vue DevTools**: Inspección de componentes.
- **Postman**: Validación de endpoints.
-----
**Mejoras Futuras**

1. **Autenticación**:
    1. Implementar un sistema de usuarios.
1. **Backend Real**:
    1. Sustituir JSON Server por Express o Django.
1. **Historial de Batallas**:
    1. Registrar los resultados de las simulaciones.

