# Calendario de Recordatorios

Este es un proyecto de calendario que permite a los usuarios agregar, editar, y eliminar recordatorios para fechas específicas. Además, el sistema obtiene información del clima de una ciudad específica y la muestra junto con el recordatorio.

## Características

- Crear, editar y eliminar recordatorios.
- Ver información del clima para la ciudad especificada en el recordatorio.
- Guardar los recordatorios en `localStorage` para persistencia.

## Tecnologías Utilizadas

- Vue.js
- Vuex
- Axios
- SweetAlert2
- OpenWeatherMap API

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente.

### Prerrequisitos

- Node.js (versión 12 o superior)
- Yarn

##Instalar dependencias
- yarn install

## Configuración
- Crea un archivo .env en la raíz del proyecto y añade tu API key de OpenWeatherMap
- VUE_APP_WEATHER_API_KEY=tu_api_key

##Ejecución en desarrollo

- yarn serve

