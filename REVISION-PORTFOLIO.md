# Revisión del portfolio

## Recorrido y criterio de diseño

Se conserva la identidad editorial: Manrope, DM Sans, acentos serif, carbón `#171916`, crema `#f3f2eb` y lima `#d5f578`.

El recorrido principal es **propuesta → caso AcroGravity → otros trabajos → experiencia propia → servicios → sistemas prácticos → persona y proceso → preguntas frecuentes → WhatsApp**.

- El caso AcroGravity ocupa el primer lugar dentro de Trabajos y tiene acceso directo desde la cabecera y la portada.
- Su testimonio utiliza una portada del propio vídeo, reproducción vertical en un diálogo y carga bajo demanda.
- Las cifras del cliente se identifican como su comunidad: Instagram de BlueGravity y academia The Gravity King. Se diferencia ese contexto del trabajo web y de las cifras de los canales de Sergio.
- Las capturas del caso se pueden desplegar y ampliar. Las capturas generales conservan navegación horizontal y ampliación, sin recortar su contenido.
- Los cuatro proyectos restantes forman una cuadrícula equilibrada; AcroGravity no se repite como una segunda tarjeta.
- Los servicios permiten seleccionar el motivo de la conversación. WhatsApp recibe un mensaje contextual en el idioma seleccionado.
- Los recursos comparten navegación, identidad visual, acceso rápido al prompt, ejemplos del flujo de trabajo y enlaces a los otros recursos y al caso real.
- Los botones que abren WhatsApp se describen como conversaciones, no como una reserva de cita.
- Las preguntas frecuentes aclaran alcance, presupuesto, colaboración y cómo empezar con una idea todavía abierta.

## Correcciones funcionales

- Eliminadas las reglas acumuladas de las modificaciones anteriores que competían entre sí y añadían resplandores verdes.
- Corregido el error de JavaScript que intentaba acceder a un modal inexistente.
- La galería solo registra enlaces a imágenes; el vídeo tiene su interacción independiente.
- Reparadas las rutas inexistentes `gravity_skook.png` y `acrogravity_web.png` usando los archivos reales.
- Restaurados navegación por teclado, cierre con Escape y fondo del modal, devolución del foco y pausa al cerrar el vídeo.
- Conservadas las traducciones de la portada y añadidas traducciones a los nuevos bloques.
- Corregida la traducción del titular inglés.
- Unificado el perfil de contacto de Sergio en `@sergio.creator`.
- Corregida la palabra en ruso dentro del prompt del Director de Contenido.
- El copiado de prompts muestra confirmación y selecciona el texto para copia manual si el navegador deniega el portapapeles.
- Corregida la posición del `@import` y la solicitud de Georgia en la hoja de marca de carruseles.

## Inventario revisado

Se revisaron las cuatro páginas HTML y todas las carpetas del proyecto.

| Recurso original | Contenido / uso |
| --- | --- |
| `assets/Yo.jpg` | Retrato; portada, presentación y firma |
| `assets/acrogravity.png` | Portada web y test de nivel; pruebas del caso |
| `assets/acrogravityclub_web.jpg` | Captura vertical de la web; pruebas del caso |
| `assets/bluegravity_instagram.png` | Perfil con 213 mil seguidores; evidencia de Instagram |
| `assets/gravityking_skool.png` | Academia con 319 miembros; evidencia de Skool |
| `assets/testimonio_bluegravity.mp4` | Vídeo vertical original, 1080 × 1920, 68,43 segundos, con subtítulos integrados |
| `assets/arkanica.png` | Interfaz del producto; tarjeta del proyecto |
| `assets/arkanica2.png` | Segunda captura de Arkanica; conservada como material adicional |
| `assets/convertidorsrt.png` | Herramienta de subtítulos; tarjeta de producto |
| `assets/antigua-marca-personal.png` | Perfil de RojoMoves; proyecto y galería |
| `assets/muevete-y-disfruta.png` | Comunidad de Facebook; proyecto y galería |
| `assets/60k-likes.PNG` | Captura con 1.526.132 reproducciones; el texto se ajustó al dato visible, no al nombre del archivo |
| `assets/metricas-instagram.png` | Estadísticas de Instagram; galería |
| `assets/metricas-facebook.png` | Estadísticas de Facebook; galería |
| `assets/metricas-youtube.png` | Estadísticas de YouTube; galería |
| `assets/tiktok.PNG` | Perfil de TikTok; galería |
| `assets/ultimos-videos.PNG` | Mosaico de contenido; galería |
| `assets/Podcast.PNG` | Captura de un canal de podcast; conservada, sin atribuir una colaboración que la captura por sí sola no explica |
| `assets/favicon.svg` | Identidad del sitio |
| `carruseles/` | Generador, dependencias y hoja de marca; las cinco plantillas HTML referenciadas no están en el proyecto |
| `ultimos-trabajos/` | Carpeta vacía |

### Recursos derivados

- `assets/acrogravity-testimonio.jpg`: portada vertical extraída del testimonio.
- `assets/acrogravity-testimonio-web.mp4`: versión H.264/AAC de 720 × 1280, misma duración y formato; aproximadamente 13,2 MB. El original se conserva y se puede abrir desde el modal.
- `assets/resources.css` y `assets/resources.js`: presentación e interacciones compartidas de los recursos.

## Verificación realizada

En Chrome mediante Playwright, sirviendo los archivos por HTTP local:

- Cuatro páginas a 360, 390, 768, 1024 y 1440 píxeles: sin desbordamiento horizontal del documento.
- Portada inglesa también comprobada a 360, 768, 1024 y 1440 píxeles.
- Resolución de enlaces y recursos locales y de los destinos de anclas de cada página.
- Decodificación de las imágenes visibles y revisión de capturas de escritorio y móvil.
- Filtros de proyectos, selector ES/EN y mensajes de WhatsApp por servicio.
- Apertura de las evidencias, cambio de imagen y cierre por teclado.
- Reproducción real del vídeo optimizado, formato vertical y encaje del modal en móvil.
- Cierre por botón, Escape y fondo; pausa, devolución del foco y paso desde el vídeo a contacto.
- Menú móvil y cierre después de navegar.
- Botones de copia de los cuatro prompts y botón de aplicación del Story Engine.
- Sin errores JavaScript durante los recorridos comprobados.
- Las tres webs externas de proyectos responden HTTP 200.

Las conversiones reales requieren datos después de publicar. El indicador principal será conversaciones cualificadas por visita; como señales intermedias, aperturas del testimonio, exploración de pruebas y uso de recursos. No se atribuye una mejora porcentual de conversión sin medición.

## Material pendiente en el repositorio

El generador de carruseles requiere `6-trabajos/carrousel.html`, `3-servicios/carrousel.html`, `numeros/carrousel.html`, `quienes-somos/carrousel.html` y `cta/carrousel.html`. Ahora identifica las plantillas ausentes antes de abrir el navegador o crear carpetas de salida. Este material no bloquea el portfolio público.
