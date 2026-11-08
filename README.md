# Sitio web Quinto Elemento (5E)

Sitio corporativo B2B de **Quinto Elemento**, fabricante caleño de productos de limpieza y desinfección concentrados. Es un sitio **estático** (HTML, CSS y JavaScript sin librerías), sin servidor, sin base de datos y **sin paso de build**: se publica tal cual en Cloudflare Pages.

## Estructura

```
/
├── index.html                  Inicio (hero, pilares, guía por áreas, sectores)
├── quienes-somos.html          Historia, misión, visión, diferenciadores, valores
├── productos.html              Catálogo de 18 líneas con filtros por categoría y por área
├── beneficios.html             Pilares, comparativo y calculadora de costo por litro preparado
├── clientes.html               Cobertura, cifras, logos y testimonios (PLACEHOLDERS)
├── preguntas-frecuentes.html   12 preguntas de compradores corporativos
├── contacto.html               WhatsApp, correo, redes, ubicación y formulario
├── politica-de-datos.html      Aviso legal y política de datos (Ley 1581 de 2012)
├── 404.html                    Página de error
├── favicon.ico / favicon.svg / favicon-16x16.png / favicon-32x32.png / apple-touch-icon.png
├── site.webmanifest, robots.txt, sitemap.xml
├── _headers                    Cabeceras de caché y seguridad para Cloudflare Pages
└── assets/
    ├── css/styles.css          Todos los estilos (colores de marca al inicio del archivo)
    ├── js/main.js              Menú móvil, filtros, calculadora y formulario
    ├── fonts/                  Montserrat (alojada localmente, carga más rápida)
    └── img/
        ├── logo/               Logotipos oficiales (color y negativo) e isotipo
        ├── fotos/              Ilustraciones PLACEHOLDER (reemplazar por fotos propias)
        └── clientes/           Carpeta para los logos de clientes
```

El encabezado, el menú, el pie de página y el botón flotante de WhatsApp se repiten en cada archivo `.html`. Si cambia algo en ellos (por ejemplo, un enlace del menú), cámbielo en todos los archivos.

## Previsualizar en su computador

Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Luego abra http://localhost:8000 en el navegador. (También puede abrir `index.html` con doble clic; casi todo funciona igual).

## Publicar en Cloudflare Pages

1. Suba esta carpeta a un repositorio de GitHub (el contenido debe quedar en la raíz del repositorio).
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elija el repositorio.
3. Configuración de build:
   - **Framework preset:** None
   - **Build command:** (dejar vacío)
   - **Build output directory:** `/` (la raíz)
4. Guarde y publique. Cada `git push` a la rama principal vuelve a publicar el sitio.
5. En **Custom domains** agregue `www.5elementocol.com` (dominio principal del sitio). Agregue también `5elementocol.com` y, en Cloudflare, cree una regla de redirección (**Rules → Redirect Rules**, código 301) de `5elementocol.com/*` hacia `https://www.5elementocol.com/${1}`, para que todo el tráfico llegue a la versión con www.

El sitio ya está configurado para `https://www.5elementocol.com` (etiquetas `canonical` y `og:` de cada página, `sitemap.xml`, `robots.txt` y datos estructurados). Si algún día cambia el dominio, busque `www.5elementocol.com` en todos los archivos y reemplácelo. El correo de contacto sigue siendo `contacto@5toelemento.com`.

## Activar el formulario de contacto (Web3Forms, gratis)

El canal principal es WhatsApp y no depende del formulario. Para activar el formulario:

1. Entre a https://web3forms.com y genere una **Access Key** con el correo `contacto@5toelemento.com`.
2. En `contacto.html` busque `REEMPLAZAR_CON_SU_ACCESS_KEY` y pegue su clave en ese lugar.
3. Haga una prueba de envío. Mientras la clave no esté configurada, el formulario muestra un mensaje que invita a escribir por WhatsApp o correo.

La Access Key de Web3Forms es pública por diseño (no es un secreto), por eso puede ir en el HTML.

## Reglas que el sitio ya respeta (manténgalas al editar)

- Único enlace de WhatsApp válido: `https://wa.me/573332399059`.
- Colores: azul oscuro `#154A5B`, azul claro `#37AAE1` (nunca en textos largos sobre blanco), verde `#6FB636`, gris de texto `#333333`. El rojo `#C0392B` solo se usa para advertencias de seguridad.
- Tipografía: Montserrat. Tratamiento de "usted".
- No mencionar certificación INVIMA, competidores ni nombres de los fundadores.
- No usar guiones largos para aclaraciones (usar paréntesis).
- Logotipo: no deformar, rotar, recolorear ni agregar sombras. Versión a color sobre fondos claros, versión negativa sobre azul oscuro.

## Contenido pendiente antes de producción

Busque en el código los comentarios `PLACEHOLDER` y `PENDIENTE`:

| Qué | Dónde | Cómo reemplazarlo |
|---|---|---|
| 8 logos de clientes | `clientes.html` | Guardar el logo en `assets/img/clientes/` y cambiar el `div` por la etiqueta `img` indicada en el comentario. Solo con autorización escrita del cliente. |
| 3 testimonios | `clientes.html` | Reemplazar el texto, el cargo, la empresa y la ciudad por testimonios reales y autorizados. Quitar la etiqueta "Espacio para testimonio". |
| Fotografías | `assets/img/fotos/` | Reemplazar cada ilustración por una foto propia **con el mismo nombre de archivo** en formato WebP: versión de 1200 px de ancho y versión `-640` de 640 px. Sin personas identificables (o con autorización) y sin marcas de terceros. |
| Razón social, NIT y dirección | `politica-de-datos.html` | Completar y pedir revisión del asesor legal. |
| Clave del formulario | `contacto.html` | Ver "Activar el formulario de contacto". |
