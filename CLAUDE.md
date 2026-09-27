# CLAUDE.md

Contexto de trabajo para continuar el portfolio de Guillermo López con Claude Code.

Actualizado: 30 de julio de 2026.

## Objetivo del proyecto

Portfolio personal de Guillermo López, grafista de televisión, diseñador,
desarrollador y creador de automatizaciones.

La web debe sentirse como el portfolio de un diseñador: visual, directa,
editorial y con personalidad. No debe parecer una landing corporativa de
servicios ni una plantilla generada por IA.

## Repositorio y despliegue

- GitHub: `GuillesDev/portfolio-guilles`
- Rama de producción: `master`
- Producción: <https://portfolio-guilles.vercel.app>
- Proyecto Vercel: `guille008rm-blips-projects/portfolio-guilles`
- Stack principal: Astro, TypeScript, Three.js y Vercel Serverless.
- Node requerido: `20.x`.

Flujo de trabajo habitual:

1. Partir de `master` actualizado.
2. Crear una rama `agent/<descripcion>`.
3. Implementar y ejecutar la compilación.
4. Hacer commit y push solo cuando Guillermo lo pida.
5. Abrir un PR en borrador para que Vercel genere una preview.
6. Revisar la preview.
7. Fusionar en `master` solo con permiso explícito.

No incluir secretos en commits. La clave de NVIDIA está guardada en Vercel
como variable sensible para Production y Preview.

## Estado actual de Git

Todo lo anterior está ya en producción:

- PR `#2`: `Mejora el portfolio e integra el asistente NVIDIA`.
- PR `#3`: `Rediseña Automatización, Desarrollo y Grafismo`. Fusionado con
  squash el 30 de julio de 2026 y desplegado.
- 31 de julio de 2026: rediseño de `/automatizacion` como página de prompts
  más la voz y el carácter del robot, publicados directamente en `master`
  desde la rama `agent/automatizacion-prompts`, a petición expresa de
  Guillermo. No hubo PR porque `gh` no está instalado en esta máquina; la
  rama quedó subida por si hace falta revisar el diff.
- Las ramas `agent/*` siguen existiendo en GitHub. El repositorio no borra
  ramas al fusionar.

El PR `#3` se publicó sin revisión visual de la preview, a petición expresa
de Guillermo. Quedaron sin ver en movimiento el vídeo de Black Gum y el
glitch de Grafismo. El rediseño del 31 de julio sí se revisó en local,
escritorio y móvil, antes de publicar.

## Comandos útiles

- `npm run dev`: servidor local.
- `npm run build`: comprobación principal.
- Si el Node local no es 20:
  `npx -y node@20 node_modules/astro/astro.js build`
- `git diff --check`: detectar errores de formato antes del commit.

La salida de Astro es híbrida y usa `@astrojs/vercel/serverless`.

## Arquitectura relevante

- `src/layouts/BaseLayout.astro`
  - Layout global.
  - Contiene header, `main`, footer y el robot persistente.
- `src/layouts/SectionLayout.astro`
  - Aplica los tokens visuales de cada sección.
- `src/pages/index.astro`
  - Portada.
- `src/pages/grafismo.astro`
  - Portfolio de televisión y motion.
- `src/pages/automatizacion.astro`
  - After Effects y automatizaciones de negocio.
- `src/pages/desarrollo.astro`
  - Desarrollo web y Black Gum.
- `src/pages/fratelli-pazzi.astro`
  - Caso de marca de la pizzería.
- `src/components/global/RobotGuide.astro`
  - Robot global, chat, navegación y personalizaciones por página.
- `src/lib/robotRig.ts`
  - Geometría base del robot.
- `src/pages/api/robot-chat.ts`
  - Endpoint de servidor para NVIDIA NIM.
- `src/components/global/ProjectCTA.astro`
  - CTA reutilizable entre proyectos.
- `src/data/projects.ts`
  - Datos y medios de los proyectos.
- `src/data/site.ts`
  - Datos generales, contacto y navegación.

## Reglas técnicas transversales

Dos cosas que ya han fallado en más de una página. Merecen mirarse cada vez
que se toque un vídeo o se escriba un `init` nuevo.

Vídeos con `poster` y carga diferida:

- `play()` apaga el póster en el mismo instante en que se llama, aunque el
  vídeo no tenga ni un frame decodificado. Con `preload="none"` eso deja un
  hueco del tamaño de la descarga y se ve el fondo del `<video>`. Ese era el
  frame negro de los vídeos de redes de Fratelli, y estaba igual en el vídeo
  de Black Gum.
- No llamar a `play()` hasta `readyState >= 2`, y subir `preload` a `auto` al
  asignar el `src` o el elemento no llega a descargar nada.
- Grafismo lo resuelve distinto, con el póster en un `::before` y el vídeo
  oculto hasta reproducir, porque allí el primer frame real sí es negro.

Listeners globales en funciones que corren en `astro:page-load`:

- Astro solo cambia el `<body>`, así que lo que se cuelgue de `window` o
  `document` sobrevive a la navegación y se apila en cada visita. Van siempre
  con `AbortController` y su `signal`, abortando al principio del `init` y en
  `astro:before-preparation`. Pasó en Grafismo, se arregló allí, y seguía
  igual en las partículas de Fratelli.
- Para comprobarlo: contar callbacks únicos vivos por tipo, no llamadas a
  `addEventListener`. GSAP registra la misma función compartida muchas veces
  y el DOM la deduplica, así que contar llamadas da falsos positivos.

## Dirección visual acordada

### Principios

- Reducir el texto total aproximadamente entre un 35 % y un 45 %.
- Enseñar antes de explicar.
- Usar vídeos, imágenes, interfaces, movimiento y composición tipográfica.
- Mantener frases cortas y humanas.
- Cada proyecto debe tener una identidad visual propia.
- Usar datos o métricas solo cuando sean reales.
- Revisar siempre escritorio y móvil.
- Heroes y cabeceras de sección van centrados en todas las páginas. Es la
  convención del portfolio y Automatización se salía de ella.
- Un vídeo o una imagen deben compartir borde con su propio título. Si el
  bloque de medios cuelga fuera del `.container`, sobresale por los lados y
  se ve descolgado del texto.

### Evitar

- Numeraciones decorativas como `( 01 )`, `01 / 03` o procesos numerados.
- Cuadros tipo:
  `Mi papel / Alcance / Resultado`.
  Este patrón apareció en Automatización, Desarrollo y Grafismo, y se eliminó
  de los tres. Casi siempre repetía algo que ya estaba a la vista.
- Etiquetas obvias como:
  `Grafismo broadcast · pieza en movimiento`.
- Listas largas de servicios o herramientas.
- Copy corporativo, abstracto o con tono de consultora.
- Frases que suenen escritas por IA.
- Estética de terminal/hacker usada solo como decoración.
- Tarjetas genéricas repetidas sin material visual real.
- Métricas inventadas.

### Tono

- Cercano, seguro, directo y natural.
- Español de España.
- Evitar grandilocuencia.
- Preferir “esto hace” o “así funciona” a explicar metodologías completas.

## Trabajo realizado en la portada y páginas

- Se redujo gran parte del texto visible.
- Se eliminaron numeraciones editoriales que parecían generadas por IA.
- Se eliminó de portada:
  `Grafista de televisión que diseña y automatiza sistemas visuales.`
- Los proyectos se presentan con mayor peso de vídeo e imagen.
- Se añadieron CTA reutilizables para conectar proyectos y contacto.
- Varios vídeos de Grafismo fueron recomprimidos para mejorar la carga.
- Los vídeos usan `muted`, `playsinline`, posters y carga diferida cuando
  corresponde.

El problema inicial de vídeo/robot ausente solo se observó en un escritorio
remoto. No se confirmó como fallo general de producción.

## Fratelli Pazzi

La sección se transformó para responder a la marca real:

- Hero con el logotipo original en alfa.
- Fondo gris oscuro con textura de tiza en toda la página.
- Partículas de pizza tenues sobre el fondo y movimiento con scroll.
- Se eliminaron círculos de color y cuadros informativos genéricos.
- La composición usa material real: logo, cartel, carta, flyers y vídeos.
- El robot lleva gorro y ropa de pizzero.
- En Fratelli no muestra la burbuja normal del tour.
- El robot aparece después de dejar respirar el hero.
- Al pulsarlo, recibe el golpe animado y abre el chat.

Regla de copy:

- Guillermo fundó Fratelli Pazzi.
- Usar `fundé` o `fundador`.
- Nunca usar `cofundé` ni `cofundador`.

## Automatización

Cambios que trajo el PR `#3`:

- Nuevo hero:
  `Lo repetitivo, automático.`
- Dos demostraciones visuales iniciales:
  - After Effects.
  - Flujo de negocio.
- Cartelas, Comodines y Quesitos aparecen como casos audiovisuales grandes.
- Se eliminaron:
  - Carrusel con `01 / 03`.
  - Tags genéricos.
  - Franja de comandos de terminal.
  - Proceso numerado en cuatro pasos.
  - Partículas de código sin función narrativa.
- Fratelli se presenta como caso real:
  - Conversación de WhatsApp.
  - Disponibilidad comprobada.
  - Reserva guardada.
  - Equipo avisado.
- Conversación y estados del flujo se animan de forma sincronizada.
- CTA:
  `¿Qué repites cada semana?`
- `ProjectCTA` acepta ahora una prop opcional `label`.

Puntos que conviene mirar cada vez que se toque esta página:

- Ritmo y tamaño del hero.
- Reproducción de los tres vídeos.
- Sincronización del chat y el flujo.
- Robot y chat flotante.
- Ausencia de overflow horizontal.

### Segunda pasada sobre `/automatizacion`

La página se reescribió por completo, de 1360 a 704 líneas:

- Hero con los tres vídeos reales turnándose con fundido. Usa las versiones
  `-holo`, que pesan 536 KB las tres juntas.
- El scrim es un viñeteado radial simétrico. El degradado lateral anterior
  oscurecía el 68 % izquierdo y hacía leer el vídeo como desplazado.
- Fuera los dos mockups CSS del hero y la franja `ENTRADA → SALIDA`.
- Los tres vídeos de plantilla, grandes y sin frase explicativa debajo.
- Chat y estados del flujo fusionados en un único visual, con una etiqueta de
  dos palabras por paso en vez de título más frase más badge.
- Texto visible de unas 210 palabras a unas 75.

Aviso técnico que costó encontrar: las burbujas del chat las crea el JS con
`createElement`, así que no reciben el atributo de scope de Astro y sus
estilos se pierden. Van con `:global()` colgando del contenedor. Lo mismo
aplica al carácter de escritura (`.caret`) del rediseño de prompts.

### Tercera pasada: la página como prompts (publicada el 31/7/2026)

Concepto elegido por Guillermo tras descartar otros: la página se pide sola.
Cada bloque es un encargo que se escribe solo en una barra de prompt, se
envía, y el resultado se genera delante del visitante.

- Hero a pantalla completa (`100svh`), sin vídeo de fondo, con el prompt
  centrado: `Guille, necesito todas las versiones de las cartelas para esta
  tarde.` Al enviarse, la zona del prompt se funde y colapsa
  (`grid-template-rows: 1fr → 0fr`) y los tres vídeos nacen en su lugar,
  escalonados 520 ms, con curva overshoot `cubic-bezier(0.22, 1.3, 0.36, 1)`
  y `✓ generado`.
- Fratelli: segundo prompt (`Guille, el WhatsApp de la pizzería no da
  abasto…`) que al enviarse despliega el teléfono y los cuatro estados.
  El guion del chat es el mismo de la segunda pasada.
- CTA propio en la página: `Este prompt es tuyo.` con una barra de prompt
  real (placeholder `Guille, necesito…`) que abre mailto con el asunto
  rellenado. `ProjectCTA` ya no se usa aquí; el componente compartido sigue
  intacto para el resto de páginas.
- Fondo: retícula de puntos y dos brillos con el acento que derivan y laten
  en opacidad, desfasados. Colores desde los tokens de la sección.
- Los disparos van por posición (`getBoundingClientRect` en scroll/resize
  con rAF), no por `IntersectionObserver`: un scroll rápido o una ancla
  pueden saltarse el elemento entre frame y frame y el observer no dispara.
  También hay recomprobaciones a los 400 y 1200 ms de cargar, porque el
  viewport puede medirse tarde.
- Con `prefers-reduced-motion`, la página se muestra completa y estática con
  los prompts ya escritos.
- Vídeos y flujo van ocultos por defecto en el CSS y los revela el JS. Al
  principio era al revés (visibles y ocultados por una clase que ponía el
  JS), y al entrar por transición de Astro se pintaban unos frames de las
  cartelas antes de correr el script. Un `<noscript>` los muestra y esconde
  las barras de prompt cuando no hay JS.

Direcciones que Guillermo rechazó para esta página, no reintentar: línea de
proceso con nodos y estados, estética de editor de nodos con cables y LEDs,
vídeo de fondo en el hero, y diseñar antes en Stitch. Lo que funcionó fue
maquetar la idea en un HTML suelto en `public/` servido por el dev server
(vídeos reales incluidos) y afinarla con él antes de tocar la página.

## Desarrollo

- Black Gum es el caso principal.
- No usar como reclamos:
  - `en producción`
  - `+40 páginas generadas`
  - `100% TypeScript`
  - `0 CMS`
- La sección debe demostrar el producto y la experiencia, no presumir de
  estadísticas técnicas sin contexto.

### Segunda pasada sobre `/desarrollo`

- Fuera el cuadro `Mi papel / Producto / Tecnología` y los dos párrafos que
  sonaban a IA. El hero de arriba ya dice el stack y muestra código real.
- El caso lo enseña ahora un vídeo del producto hecho con Remotion, en
  `remotion/src/compositions/BlackGumProduct`: web pública, luego panel
  privado subiendo un vídeo por trozos, luego ese vídeo apareciendo publicado
  en la web. Sale a `public/media/blackgum/blackgum-product.{mp4,webm}`.
- La interfaz del panel de ese vídeo es una representación estilizada, no una
  captura del producto real. Si aparecen capturas de verdad, rehacerlo.
- La sección `Por qué un grafista puede ser tu desarrollador` se redujo a una
  línea sobre el mantenimiento continuo, lo único que no se demostraba ya en
  el resto de la página.
- El `CinematicReveal` antiguo sigue en Remotion, pero ya no en la web: la
  tarjeta de la portada salía como un recuadro beige vacío (su póster es casi
  todo negro y la tarjeta era la única clara). Ahora es oscura, con el acento
  naranja de la página y el vídeo de producto de Black Gum. Sus archivos en
  `public/` se borraron.

### Caso "Este portfolio": despiece del robot (27 de septiembre de 2026)

- Segundo caso de `/desarrollo`, `#este-portfolio`, entre Black Gum y la
  línea de mantenimiento. La propia web como proyecto, enseñada y no contada.
- Sección alta (330vh; 300vh en móvil) con un escenario `sticky`. Lo avanzado
  por ella desmonta el robot como un plano técnico, lo deja quieto y lo vuelve
  a montar; al final saluda y aparecen los botones.
- Es el mismo `buildRobotRig` del robot global, que ahora devuelve también
  `parts` (cada pieza suelta).
- Las etiquetas cuentan decisiones de diseño de Guillermo (te sigue con la
  mirada, cambian de color en cada sección, se viste de pizzero…), no
  medidas. Una primera versión decía "ni un modelo 3D descargado" y daba las
  medidas de cada pieza: a Guillermo le pareció que vendía que lo había hecho
  la IA y que él no hacía nada. En toda la web el protagonista es él y lo que
  decide; no presumir de técnica, código o IA como mérito en sí. Cada
  etiqueta tiene que ser cierta en el robot de verdad: si se cambia un gesto
  en RobotGuide, revisarlas.
- Etiquetas HTML con línea SVG hasta la pieza. Cada fotograma se proyecta el
  punto de anclaje de cada pieza y se reparten por lado sin solaparse. El lado
  de cada una (`data-side`) está elegido para que su línea no cruce otra pieza
  con el giro del desmontaje; si se cambia el giro, revisarlo. En móvil se
  ocultan las dos menores (`part--minor`) y las medidas van cortas.
- El botón («Pregúntale por mi trabajo») lanza `rg:open-chat` con `¿Qué hace
  Guille?`: se cambió desde "¿Cómo estás hecho?" al reorientar la sección
  hacia la autoría de Guillermo. El robot global abre su chat y se la hace.
- Primera versión descartada por Guillermo por poco visual: dos tarjetas (código
  del robot y pads de sonido con osciloscopio). No volver a ella.

## Grafismo

Segunda pasada sobre `/grafismo`:

- Fuera el cuadro `Mi papel / Contexto / Experiencia`. La barra de
  experiencia que está justo encima ya daba Mediaset, RTVE y Movistar+.
- Fuera `Pasa el ratón por cualquier vídeo y se reproduce`. Tapaba un fallo
  real: el icono `▶` solo aparecía con `:hover`, así que en táctil no había
  ninguna pista. Ahora con `@media (hover: none)` se queda visible, y las
  tarjetas ya respondían al `click`.
- El selector de canales dejó de ser una píldora con indicador deslizante,
  que chocaba con el glitch. Ahora es una tira de emisión: número `01`–`04`,
  nombre, filete superior que se enciende al sintonizar y punto REC
  parpadeando solo en el canal activo.
- El rótulo del glitch se lee del propio botón, número y etiqueta. Antes era
  una cadena de ternarios que decía `SIN IA` y `CON IA` mientras los botones
  decían `Grafismos` e `IA Generativa`.
- El rótulo va a dos líneas porque en una sola, en monoespaciada al tamaño
  del número, `IA GENERATIVA` se salía del viewport.

### Limpieza del 27 de septiembre de 2026

- Fuera la sección `Stack técnico` (seis tarjetas con logos de Adobe, ChatGPT
  y Magnific): era justo la lista de herramientas en tarjetas que esta guía
  pide evitar. Las herramientas siguen en el contexto del robot, que las
  cuenta si se le pregunta. Los logos se borraron de `public/media/logos/`.
- En la franja de experiencia, Mediaset decía `Actual` y la trayectoria de la
  portada `Puntual`. Las dos cosas son ciertas (En Boca de Todos, de
  Mandarina, se emite en Cuatro; lo puntual son las colaboraciones directas),
  pero juntas parecían una contradicción. Ahora la etiqueta es
  `Cuatro · Telecinco`.

### Visor grande de las piezas (4 de agosto de 2026)

Pulsar una pieza la abre a tamaño grande. Antes el click alternaba el mute,
que era una función escondida y sin pista visual.

- Visor propio, no `requestFullscreen`. El fullscreen nativo abre el
  reproductor del navegador y en iOS se lleva la pieza a la interfaz del
  sistema. El visor reutiliza las esquinas de encuadre del reproductor de
  cabeceras y la tipografía mono, así que se lee como parte de la página.
- Es un `<dialog>` con `showModal()`, no un `div` con `z-index`. Con `div` el
  robot se podía pulsar por encima del visor: `.section-page` lleva
  `isolation: isolate`, así que cualquier `z-index` de dentro de la página
  solo compite ahí, y el robot cuelga de `<body>`. Subir el número no
  arreglaba nada de fondo; `showModal()` va a la capa superior del navegador,
  que ignora los contextos de apilamiento. Comprobación:
  `document.elementFromPoint` sobre el robot devuelve el vídeo, no su canvas.
- `showModal()` trae de regalo el atrapado del foco. El `cancel` de Escape se
  intercepta para pasar por `closeViewer`, que además pausa, quita el `src` y
  suelta el scroll.
- El bloqueo del scroll vive en `<body>`, fuera del contenido que Astro
  intercambia, así que se suelta también en `astro:before-swap`. Si no, salir
  con el visor abierto dejaba la página siguiente sin scroll.
- Uno solo para toda la página, que el JS rellena con la pieza pulsada.
- Las flechas recorren solo la rejilla del canal abierto, no las 22 piezas.
- El sonido va activo al abrir: el click es gesto del usuario y lo permite.
  Si la política de autoplay lo rechazara, cae a silenciado y sigue viéndose.
- Al cerrar se quita el `src`, o el vídeo seguiría descargando de fondo.
- Las tarjetas son ahora `role="button"` con `tabindex`, y responden a Enter
  y espacio. Antes no se alcanzaban con teclado, cosa que no se notaba porque
  el click solo cambiaba el mute; ahora abre algo y sí importa.
- El reproductor de cabeceras (CH 03) no se tocó: ya tenía su propio botón.

Piezas mudas:

- 14 de las 22 piezas no tienen pista de audio. En las de emisión es lo
  normal, el audio lo pone el programa; en el canal de IA está mezclado.
- La detección se hace al compilar, en `src/lib/hasAudioTrack.ts`, que abre
  el MP4 y busca un manejador `soun` dentro de `moov`. En el navegador no hay
  forma fiable: `audioTracks` no está en Chrome y
  `webkitAudioDecodedByteCount` solo dice algo una vez ha decodificado.
- Sale como `data-muda` en la tarjeta. El visor pinta un icono de altavoz
  tachado, sin texto, y esconde el control de volumen entero: contenedor,
  deslizador y botón. Si solo se esconden los dos últimos queda el hueco del
  contenedor reservado en la barra.
- La ruta se resuelve con `process.cwd()`, no con `import.meta.url`: el
  módulo de la página se empaqueta y su URL en compilación no apunta a
  `src/pages/`. Con `import.meta.url` fallaba en silencio y marcaba cero.
- Ojo al comprobar la salida: la compilación escribe en
  `.vercel/output/static/`, no en `dist/`, que puede estar viejo.

`VOX IS COMING` está mudo por importarse el archivo equivocado. El original
`AA GRAFICA/PORTFOLIO/IA/VOX IS COMING.MP4` (84,7 MB) sí lleva audio; lo que
entró al repo es `NUEVOS/VOX IS COMING 2.mp4`, mudo de origen (MD5 idéntico
al del commit `8ca545a`). No se perdió recomprimiendo.

## El CV en PDF (19 de agosto de 2026)

Guillermo se quejó de faltas de ortografía y de que faltaban las eñes. No era
cosa del PDF ni de una fuente sin glifos: el HTML del que sale estaba escrito en
ASCII puro, sin una sola tilde ni eñe, y el PDF solo lo reflejaba.

- El CV se edita en `cv/*.html` y de ahí sale el PDF. Los de `public/cv/` son
  copia, y son los que sirve la web. Van juntos o se desincronizan: el HTML ya
  decía `Fundador` y el PDF de julio seguía diciendo `Cofundador` desde que se
  aplicó la regla de Fratelli.
- `cv/generar-pdf.sh` imprime los dos con Chrome y los copia a `public/cv/`. Es
  el hermano en macOS de `generar-pdf.ps1`, que solo corre en Windows.
- El script comprueba que las fuentes web están dentro del PDF y falla si no.
  Sin eso Chrome imprime con las de reserva del sistema cuando Google Fonts
  tarda, y sale otra tipografía sin avisar: así se generaron los PDF de julio,
  con Segoe UI y Consolas de Windows en vez de Sora, Source Sans 3, Literata e
  IBM Plex Mono. Pasó tres veces seguidas mientras se rehacían, así que no basta
  con mirar el render una vez.
- Al comprobarlas, ojo: Chrome embebe las variables como Type3, que no llevan
  `/BaseFont`, y el nombre está en su `/FontDescriptor`. Mirando solo
  `/BaseFont` parece que no han cargado cuando sí.
- La foto es `cv/foto-cv.jpg`, del CV y no de la web. Antes tiraba de
  `public/media/guillermo-lopez.jpeg`, que la auditoría borró al pasar a WebP. Y
  con el WebP el PDF se iba a 1,3 MB: Chrome solo pasa el JPEG tal cual al PDF y
  lo demás lo mete como mapa de bits sin comprimir.
- Con Literata de verdad, el nombre del corporativo ya no cabía a 8,7 mm y
  partía `Castillo-Olivares` por el guion.

## Sonidos de interfaz

Guillermo pidió "una musiquita de fondo muy suave". Se descartó la música y se
quedó en sonidos de interfaz, con un botón en el header apagado por defecto.
Empezaron en Grafismo y luego se extendieron a todo el sitio.

- No hay ningún archivo de audio. Se sintetizan con Web Audio en
  `src/lib/uiSound.ts`, igual que la voz del robot. Cero bytes de descarga,
  cero licencias, y cada sonido se afina desde el código.
- Apagados por defecto y guardados en `localStorage` (`pf-sound-on`). El
  navegador bloquea el audio hasta que hay un gesto, así que el propio click
  del botón es lo que abre el contexto. Al encenderlo suena una vez, para que
  se oiga qué se acaba de activar.
- Nueve sonidos, repartidos por todo el sitio:
  - Grafismo: `canal` (golpe más estática al sintonizar, también en las
    cabeceras), `abrir` y `cerrar` del visor, `paso` al cambiar de pieza.
  - Automatización: `tecla` mientras los prompts se escriben (ruido cortísimo
    con tono aleatorio, y solo en ~55 % de los caracteres para que suene a
    teclado y no a metralleta), `enviar` al salir el prompt, `generado`
    cuando nacen los vídeos o el flujo (una firma por grupo, no por vídeo),
    `burbuja` en el chat de Fratelli. El chat va en bucle: los pops solo
    suenan la primera pasada (`data-chat-sounded`).
  - Desarrollo: `tecla` por línea del editor y `generado` al "guardado".
  - Portada y header: `nav` al pulsar tarjetas de área, enlaces del menú y
    el toggle del menú móvil.
  - Fratelli: `paso` al tocar los vídeos.
  - Botones (`Button.astro`): el principal (`btn--primary`) suena `enviar`
    por ser acción afirmativa; el resto (`secondary`, `ghost`, LinkedIn, CV)
    suena `nav`. `ProjectCTA` suena `enviar` por ser un arranque de proyecto.
  - Robot: `burbuja` al enviar un mensaje en el chat y `cerrar` al cerrarlo.
    Abrirlo no lleva sonido de interfaz a propósito: el robot ya reacciona
    con su voz (la queja del golpe). La respuesta del bot también la pone su
    voz, así que hay llamada (burbuja) y respuesta (voz) sin pisarse.
  - Robot grande de /desarrollo (el `editor-bot` que asoma sobre el editor):
    se queja al pegarle, con `playRobotHurt()`, réplica del `playHurt` del
    robot global para que los dos gemelos suenen igual. Va por `rg-voice-muted`
    (la voz del robot, encendida por defecto), NO por el interruptor del
    header: por eso suena aunque los sonidos de interfaz estén apagados, y se
    calla con el botón de silencio del robot. El gesto del click abre el
    contexto de audio.
- Medidos en el hilo de audio: entre −25 y −38 dBFS, y silencio absoluto en
  reposo. `tecla` es el más bajo porque es el que más se repite. Si se
  retocan, mantener ese rango: son avisos, no protagonistas.
- La caché de `isSoundOn()` vive en memoria: escribir `localStorage` a mano
  no la actualiza, hay que pasar por `setSoundOn`. Solo importa al probar; el
  botón real ya lo hace.
- El script de `/automatizacion` dejó de ser `is:inline` para poder importar
  el módulo. Su patrón (`dataset.ready` + `astro:page-load` + limpieza en
  `astro:before-swap`) ya era compatible con módulo; verificado que la
  secuencia de prompts corre también al entrar por navegación interna.
- El robot tiene su propia voz y su propio silencio (`rg-voice-muted`). De
  momento van por separado; si algún día se pisan, unificar los dos controles.

## Robot global

El robot vive en `src/components/global/RobotGuide.astro`.

Características:

- Three.js cargado de forma diferida.
- `transition:persist` para sobrevivir a las transiciones de Astro.
- Ojos, luz y prop cambian según la página.
- Entrada tipo cohete.
- Reacciona al click con una animación de golpe.
- Abre un chat al pulsarlo.
- El chat usa bocadillos de conversación.
- El historial se conserva durante la sesión al cambiar de página.
- Puede llevar al visitante a una sección concreta sin perder el hilo.

Anatomía y brazos (27 de septiembre de 2026):

- `robotRig.ts` es el robot de los tres sitios (global, gemelo del editor y
  despiece). Tiene cuello, hombros (articulaciones oscuras metidas en el
  costado), brazo, puño y mano, laca en el plástico, pantalla de cristal y
  halos en ojos, pecho y antena. `rig.look(x, y)` mueve los ojos dentro de
  la pantalla.
- Antes saludaba y sujetaba los objetos girando el brazo hacia DENTRO: cruzaba
  la cara y el cuerpo, y se tapaba adelantándolo en Z. Guillermo lo vio
  ("el brazo pasa por detrás"). Regla: fuera de Grafismo, los brazos solo se
  abren hacia fuera (z positiva en el derecho, negativa en el izquierdo) o
  van hacia delante (x negativa). Saludo: z ≈ 2.45; queja: los dos arriba;
  objeto: brazo hacia delante (x ≈ -1.2).
- Los objetos de cada sección van en `propSocket`, en la mano derecha, que
  deshace el giro del brazo cada fotograma: dentro, "arriba" es arriba y
  "delante" es la cámara. Sus posiciones son pequeñas, relativas a la mano.
- Grafismo conserva sus poses propias (de espaldas en la silla y los brazos
  cruzados al enfadarse).
- Para revisar poses: fotogramas del `#robot-guide` a deviceScaleFactor 3
  con Playwright al entrar en cada página y al pegarle.

Reglas técnicas importantes:

- Cualquier estado que mueva el robot fuera de pantalla debe resetearse al
  cambiar de página.
- Fuera de `/grafismo`, resetear la posición completa en cada frame normal,
  incluyendo `x = 0`, para no heredar la salida lateral de Grafismo.
- Cada sección tiene un prop propio en la mano salvo Grafismo.
- En Fratelli usa el prop y la ropa de pizzero.

En móvil vive en la cabecera (27 de septiembre de 2026):

- Flotando en la esquina tapaba títulos, textos y botones en todas las
  páginas. Se probó que se escondiera por el borde al tener algo debajo y
  Guillermo lo descartó: quedaba raro. No volver a esa idea.
- Hasta 768px el robot no flota: es una cabeza dibujada con CSS en la cabecera
  (`#header-robot`, Header.astro), con los ojos del color de la página
  (`--rg-accent` en `<html>`, lo pone RobotGuide). Al tocarla lanza
  `rg:open-chat`, y el robot entra volando debajo del chat. Al cerrar el chat
  se vuelve a guardar.
- Guardado no se pinta el canvas (`renderer.render` se salta) y en Grafismo
  va el robot normal: la silla con pantallas no cabe bajo el chat.
- Con el chat abierto, las páginas que esperan a pasar su hero ya no lo
  esconden (`setOffstage` lo respeta): en móvil se puede abrir en el hero.
- En escritorio sigue flotando. Lo único que tapaba era el botón del CV del
  pie, y los enlaces del pie van ahora junto al nombre, lejos de su esquina.

Cambios responsive del PR `#3`:

- Robot compacto entre 320 px y 1024 px.
- Versión todavía menor entre 320 px y 359 px.
- Solo se oculta por debajo de 320 px o con movimiento reducido.
- Chat móvil anclado con margen lateral y sin recorte por la izquierda.

## Setup especial de Grafismo

- En `/grafismo` no aparece la burbuja normal.
- El robot está sentado en una silla gaming con pantallas flotantes.
- Primera y segunda interacción:
  se gira, se levanta, se enfada, habla y vuelve a sentarse.
- Tercera interacción:
  hace aspavientos y se va por la derecha.
- Ignorar clicks durante una animación activa.
- Cuando se va, el setup permanece visible y la silla queda girada.
- Robot y silla deben girar en la misma dirección.

## Asistente de IA

Estado tras la auditoría del 27 de septiembre de 2026 (42/42 en la batería,
~1 s de respuesta típica):

- Modelos: `nvidia/nemotron-3.5-lightning-30b-a3b` y
  `nvidia/nemotron-3-super-120b-a12b` (`DEFAULT_MODELS`). Son los dos únicos
  del catálogo que contestan rápido con la clave del portfolio; el resto da
  404 con esta clave o tarda más de 14 s.
- `nvidia/nemotron-3-nano-30b-a3b` llegó a su fin de vida el 1/9/2026. Desde
  ese día cada pregunta devolvía 410 y el robot contestaba siempre con la base
  local sin que nadie lo notara: el fallo es silencioso. Para comprobar si la
  IA contesta, un POST a `/api/robot-chat` debe dar 200 y la cabecera
  `X-Robot-Model`; un 502/504 es que ha caído a la base local.
- El servicio gratuito de NVIDIA es muy irregular: el mismo modelo tarda 0,6 s
  o más de 30 según el momento, y Super responde 503 ("saturado") la mitad de
  las veces, aunque al instante. Por eso los modelos compiten: se lanzan a la
  vez, gana la primera respuesta buena y al resto se le corta. Los 503/429 se
  reintentan con pausas cortas. La carrera dura 12 s como mucho; el navegador
  espera 15 antes de usar su base local.
- Temperatura 0.3, `max_tokens` 220, razonamiento desactivado en Nemotron.
- Si hace falta más fiabilidad o calidad que la del servicio gratuito, la
  opción es un proveedor de pago (se habló con Guillermo; decisión suya).

Funcionamiento:

1. El navegador envía pregunta, historial y la página en la que está.
2. El endpoint añade el contexto cerrado sobre Guillermo, la fecha, su edad y
   qué hay en esa página (`PAGE_CONTEXT`).
3. El modelo solo redacta. El servidor limpia cualquier Markdown o lista,
   corta en el último punto si pasa de ~75 palabras y decide él el enlace y su
   botón (`navigationFor`), nunca el modelo.
4. Cada respuesta sale firmada (HMAC con la clave). El historial vuelve del
   navegador y solo se aceptan las respuestas del robot con firma válida: así
   nadie puede inventarse "lo que dijo el robot antes" para manipularlo.
5. Si la IA falla o tarda, el navegador usa la base local (`chatAnswer`).

Seguridad del endpoint: exige cabecera `Origin` del propio sitio, limita el
tamaño leído del cuerpo (24 KB, no se fía de Content-Length), 12 preguntas por
minuto y visitante y 60 por minuto e instancia (sin base de datos compartida no
hay límite global exacto).

El prompt, lo que más ha costado:

- Habla de Guillermo en tercera persona. El modelo pequeño tendía a contestar
  como si fuera él ("tengo experiencia", "fui fundador").
- Lo que mejor funciona con estos modelos son los ejemplos (`EJEMPLOS DE CÓMO
  RESPONDES`): cada fallo repetido se arregló con un ejemplo concreto (tortilla,
  traducción, NASA, disponibilidad, "¿eres una IA?").
- Nunca copiar frases literales de las instrucciones: el modelo las repetía
  ("ofrece el contacto", "texto plano, sin Markdown").
- Las comparaciones de fechas fallaban (decía que la etapa más corta era Miss
  Motion): la trayectoria lleva ya la duración de cada etapa calculada.
- Black Gum es un cliente, no un estudio de Guillermo: lo confundía.
- Disponibilidad, tarifas, remoto o freelance: no constan; no suponerlos.
- Contesta en el idioma de la persona.
- Solo ofrece lo que puede hacer: contar algo o llevar a una sección, y
  concreta cuál. Antes ofrecía "enseñarte un gesto de Guillermo" y, al
  contestarle "sí", se iba por otro lado.
- "Sí", "vale", "venga"... se interpretan contra la última oferta del robot
  (`isAffirmative`): el destino sale de esa oferta (su última pregunta), se le
  dice al modelo adónde lleva la web para que lo diga en una frase, y el
  servidor devuelve `navigate: true` para que el chat navegue. El cliente hace
  lo mismo con la base local si la IA falla.
- Si le piden bailar, el robot baila de verdad 5 s (`api.dance()`, lo lanza
  el cliente al detectar la palabra) y el modelo solo dice algo corto; nada
  de acotaciones entre paréntesis.
- En todas las páginas hay un botón «¡Baila!» entre las preguntas sugeridas.
  Una petición de baile a secas no pasa por el modelo (repetía siempre la
  frase de su ejemplo): el servidor contesta al instante con una de
  `DANCE_LINES`, firmada, sin preguntas ni ofertas. En Grafismo baila sentado
  en la silla.
- Se probó Gemini (Google AI Studio) el 27/9/2026 como alternativa gratuita:
  la clave de Guillermo estaba en un proyecto de prepago sin saldo y todo
  daba 402, incluso modelos gratuitos. Guillermo decidió quedarse con NVIDIA.

Batería de pruebas: `scripts/probar-robot.mjs` (necesita `npm run dev` y la
clave en `.env`; tarda unos 4 min). Pasarla después de tocar el prompt o los
modelos.

Variables de entorno:

- `NVIDIA_API_KEY`: obligatoria en Vercel, nunca en el repositorio.
- `NVIDIA_MODEL`: opcional; si está, se suma a la carrera de modelos.
- En local, la clave va en `.env` (ignorado por git) para poder probar la IA.

Saludos y cortesía:

- El prompt incluye un bloque `TRATO`. Saludar, despedirse o dar las gracias
  no son preguntas sobre Guillermo, así que se responden con naturalidad y
  nunca con un «no me consta». Antes el prompt lo prohibía sin darse cuenta.
- La base local `chatAnswer` cubre saludos, `qué tal estás`, gracias,
  despedidas, `qué eres` y `qué puedes hacer`. Importa porque en local no hay
  clave y la API devuelve `503`, así que la base local es la que responde.
- Las de cortesía se comprueban ancladas al mensaje completo y sin signos de
  puntuación, para que `hola` salude pero `hola, ¿qué hace Guillermo?` siga
  cayendo en la respuesta temática.

Voz, precisión y carácter (publicado el 31/7/2026, venía de una sesión
anterior y estaba sin commitear en el working tree):

- El robot tiene voz y un botón de silencio junto al de cerrar el chat. El
  silencio se guarda en `localStorage` (`rg-voice-muted`), no en
  `sessionStorage`: quien lo silencia quiere que siga callado en la próxima
  visita.
- El prompt lleva bloques `PRECISIÓN` y `GRUPOS Y CADENAS`: sin fechas (no
  constan en el portfolio), sin atribuir proyectos a cadenas que no los
  llevan al lado, y Telecinco/Cuatro cuentan como Mediaset. De RTVE y
  Movistar+ no consta proyecto concreto.
- Bloque `CARÁCTER Y LIBERTAD`: puede bromear y opinar, pero el humor nunca
  toca los datos. La base local tiene chistes propios y la comprobación de
  fechas va antes que las temáticas, para que `¿cuándo estuvo en Mediaset?`
  no caiga en la respuesta de experiencia.

Seguridad y límites:

- La API key solo existe en servidor.
- Se validan longitud, formato y frecuencia de peticiones.
- Hay timeout y fallback local.
- La IA no navega por Internet.
- No genera imágenes ni vídeos.
- Solo conoce el contexto que recibe del portfolio.

## Estado del chat

- Preguntas sugeridas distintas en cada página (`PAGE_QUESTIONS`); los botones
  los crea el JS, así que sus estilos van con `:global()`.
- Tres puntos de "escribiendo" y la respuesta aparece palabra a palabra (de
  golpe con movimiento reducido). "Limpiar" aborta la petición en curso.
- En móvil la escena 3D no se crea hasta abrir el chat. Con movimiento
  reducido no hay 3D, pero el chat sigue: cabeza en la cabecera (móvil) o
  botón redondo abajo a la derecha (escritorio).

- Historial guardado en `sessionStorage`.
- Se conservan hasta 30 registros.
- El hilo sobrevive a la navegación interna durante la sesión.
- El robot cambia de aspecto según la nueva página.
- Preguntas imperativas como “llévame a Fratelli” pueden navegar después de
  responder.
- Las rutas se determinan con lógica local para evitar enlaces inventados.

## Rendimiento (auditoría del 27 de septiembre de 2026)

- Lighthouse antes → después: Grafismo escritorio 50 → 85 (bloqueo de 3 s a
  0,02), portada escritorio 68 → 97, Desarrollo móvil 73 → 89, accesibilidad
  100 en casi todo.
- Imágenes: el fondo de Black Gum era un PNG de 3,3 MB mostrado al 8 %, la
  carta de Fratelli un JPG de 2480×3508 para una tarjeta de 300 px. Pasaron a
  WebP al tamaño real (5 KB, 145 KB). Vigilar cualquier imagen nueva.
- La pantalla de carga dura más a propósito: Guillermo prefiere que sea
  épica a que sea rápida (ver "Pantalla de carga" más abajo).
- URL canónica sin barra final, igual que el menú y el sitemap.

## Pantalla de carga (27 de septiembre de 2026)

- `RobotLoader.astro` sustituye al "GL". Solo en la primera carga completa
  de la sesión (`sessionStorage` `gl-loader-seen`); en navegaciones internas y
  recargas la página sale al instante.
- El robot entra pieza a pieza desde fuera del plano (cuerpo desde abajo,
  brazos por los lados, cabeza desde arriba, luego detalles), cada pieza encaja
  con un aro naranja y deja su línea en un registro de montaje. Se enciende
  (ojos de apagados a destello blanco y luego al color de la página), saluda
  hacia fuera y vuela a su sitio: el widget en escritorio, la cabeza de la
  cabecera en móvil. Tiempos: montaje 2,6 s, encendido 1,15 s, vuelo 0,9 s;
  tope de seguridad 8,5 s.
- Traspaso: dispara `gl:loader-done` con `handoff` y deja
  `window.__glLoaderState`. RobotGuide espera a eso antes de su primera
  aparición y, con traspaso, aparece en su sitio sin la entrada cohete
  (`api.land()`). En móvil la cabeza de la cabecera rebota al recibirlo.
- El traspaso en escritorio es un fundido cruzado, no un cambio de robot:
  al empezar el vuelo el robot de la esquina se pone en reposo (invisible) y
  publica dónde están en pantalla unos puntos suyos (`__rgAnchors`: antena,
  ojos, pecho, cuerpo, hombros); el del loader ajusta escala y posición a
  esos puntos (mínimos cuadrados) y aterriza encima. Al llegar, el de la
  esquina aparece de golpe debajo, mirando al frente, y el del loader se
  funde encima. Antes aparecía con un fundido de opacidad desde invisible,
  apuntando al centro de la caja: un fotograma vacío, un robot gris a medio
  fundir y un salto de tamaño. En Grafismo el del loader se da la vuelta en
  el vuelo (el de la esquina está de espaldas en la silla) y espera encima a
  que la silla y las pantallas se fundan.
- En móvil (probado con CPU x6 y 4G/3G simulados) el 3D tardaba: unos 2 s
  sin JS con todo quieto, la barra subía al 85 % y volvía a 0 %, y con mala
  cobertura el loader llegaba al tope de 8,5 s y salía la web sin robot.
  Ahora: plano del robot en discontinua con CSS hasta que entra el canvas,
  barra que nunca retrocede y no llega a pararse, tope de 16 s (a partir de
  11 s sin 3D, barra sencilla) y el vídeo del hero de la portada no empieza
  hasta que el robot despega (le quitaba ancho de banda). Para medirlo como
  en producción: compilar y servir `.vercel/output/static`; el servidor de
  desarrollo carga 7 MB sin empaquetar y no sirve para esto.
- Sin WebGL, barra sencilla; con movimiento reducido, sin loader.
- A Guillermo no le importa que dure: prefiere que sea espectacular.

## Preferencias de Git y seguridad

- No hacer `git push`, merge ni despliegue de producción sin permiso explícito.
- Preservar cambios ajenos o no relacionados.
- Crear PR en borrador para revisión visual.
- No imprimir ni copiar valores de variables sensibles.
- No guardar `.env` real.
- Mantener `.env.example` actualizado solo con nombres y ejemplos seguros.

## Memoria y contexto

Este archivo es la memoria principal del proyecto. Se lee una vez al arrancar
y a partir de ahí las preguntas sobre el proyecto no cuestan nada.

- Para decisiones, criterios y por qué se hizo algo: este archivo.
- Para localizar un símbolo dentro de un archivo grande, como
  `RobotGuide.astro`: Codebase Memory, que devuelve el fragmento en vez del
  archivo entero.
- Nunca los dos para la misma pregunta, y nada de duplicar en memoria externa
  lo que ya esté escrito aquí.
- Si el código contradice a este archivo, gana el código.

Disciplina para que no crezca sin control: aquí van decisiones y reglas, no
detalles de implementación. Lo que explica el *por qué* se queda; lo que
explica el *cómo* vive en el código. Conviene podarlo, no solo ampliarlo.

## Qué hacer al retomar

1. Ejecutar `git status -sb`.
2. Confirmar la rama actual.
3. Leer este archivo antes de proponer cambios.
4. Si se continúa Automatización, revisar en local la secuencia de prompts
   completa antes de tocarla: hero, fundido, vídeos, Fratelli y CTA.
5. No rehacer trabajo ya terminado.
6. Antes de editar, explicar brevemente el diagnóstico y la dirección.
7. Compilar antes de cerrar.
8. Pedir aprobación antes de fusionar o publicar en producción.
