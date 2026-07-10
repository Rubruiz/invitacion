# Boss Baby vanilla template

Esta carpeta contiene la conversion del archivo `Boss Baby.html` a una plantilla web vanilla editable.

- `index.html`: estructura HTML principal.
- `assets/css/styles.css`: estilos extraidos de la pagina principal.
- `assets/js/scripts.js`: JavaScript extraido, si existia en el archivo original.
- `assets/images`: imagenes embebidas extraidas desde data URLs.
- `assets/fonts`: fuentes embebidas extraidas desde data URLs.

Notas:
- La pagina original venia de una exportacion SingleFile, por eso los nombres de clases son generados.
- El countdown esta dentro de un `iframe srcdoc`; sus estilos internos se conservaron dentro de ese bloque para que siga funcionando.
- Para editar textos, busca el contenido directamente en `index.html`.
- Para editar colores, tamanos o posiciones, trabaja sobre `assets/css/styles.css`.
- Se extrajeron 10 bloques CSS principales, 0 bloques JS y 49 assets embebidos.


## Edicion rapida

- Usa `index.html` como archivo principal. Ahora esta formateado con saltos de linea.
- Busca `data-editable-text="texto-001"`, `texto-002`, etc. para cambiar textos directamente en el HTML.
- Consulta `TEXTOS_EDITABLES.md` para ver la lista de textos encontrados.
- Consulta `editable-texts.json` si quieres automatizar cambios.
- Se corrigieron 68 imagenes que apuntaban a un SVG transparente de SingleFile y ahora usan archivos reales en `assets/images`.
- Se dejo una copia de respaldo en `index.original-extraido.html`.

- Se quito la meta CSP heredada de SingleFile para que los assets locales carguen sin bloqueos al abrir la plantilla.
- Se quitaron los atributos `crossorigin` de imagenes locales porque navegadores externos pueden bloquearlas al abrir por `file://`.

## Countdown y WhatsApp

- El countdown ahora es local y depende de estos textos:
  - `texto-005`: dia numerico.
  - `texto-007`: mes en espanol.
  - `texto-008`: ano oculto, no se muestra en la invitacion.
  - `texto-024`: hora visible, por ejemplo `14:00 pm` o `6:00 pm`.
- El espacio donde antes se veia el ano ahora muestra:
  - `texto-023`: etiqueta visible, por defecto `Hora`.
  - `texto-024`: hora visible y usada por el countdown.
- `texto-015` ahora es `enlace-003` de WhatsApp.
  - Cambia `data-whatsapp-phone` por el numero con codigo de pais, solo digitos.
  - Cambia `data-whatsapp-message` para editar el mensaje precargado en WhatsApp.

## Responsive movil

- La plantilla usa un diseno absoluto extraido de Canva, asi que el responsive se hace escalando el lienzo completo.
- En pantallas menores a 1351px el diseno se reduce proporcionalmente para evitar scroll horizontal.
- `texto-009` queda en una sola linea y centrado.
- `texto-023` y `texto-024` usan el mismo tamano base que `texto-006`.
