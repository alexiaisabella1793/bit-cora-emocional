# Bitácora Emocional — El mapa de tu mundo interior

Web estática (HTML + CSS + JavaScript puro, sin dependencias de build) del proyecto de Alexia Rólan e Isabella Ramírez.

## Estructura

```
index.html      → estructura de la página
estilos.css      → todos los estilos
app.js           → toda la lógica (salas, publicar, progresos)
img/
  logo-72.webp   → logo pequeño (barra superior)
  logo-512.webp  → logo grande (portada)
```

Todo funciona en local con solo abrir `index.html`, no necesita servidor ni instalación.

## Desplegar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `bitacora-emocional`).
2. Sube estos 5 elementos (`index.html`, `estilos.css`, `app.js` y la carpeta `img/`) a la raíz del repositorio, tal cual están aquí, sin meterlos dentro de otra carpeta.
3. En el repositorio, ve a **Settings → Pages**.
4. En "Build and deployment", en **Source** elige **Deploy from a branch**.
5. En **Branch** elige `main` (o `master`) y la carpeta `/ (root)`. Guarda.
6. Espera 1–2 minutos y GitHub te dará la URL pública, con esta forma:
   `https://tu-usuario.github.io/bitacora-emocional/`

Cada vez que subas cambios a esos archivos, la página se actualiza sola en uno o dos minutos.

## Notas

- Los datos que escriba cada persona (desahogos, ánimo diario) se guardan solo en su propio navegador (`localStorage`), no se comparten entre usuarios ni se suben a ningún servidor.
- Las tipografías (Bricolage Grotesque y Newsreader) se cargan desde Google Fonts vía CDN, así que hace falta conexión a internet para que se vean exactamente iguales; si no hay conexión, el navegador usa una alternativa similar.
