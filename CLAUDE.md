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

El trabajo general anterior ya está en producción:

- PR `#2`: `Mejora el portfolio e integra el asistente NVIDIA`
- Commit de `master`: `211e8e8`
- Estado: fusionado y desplegado.

Trabajo actual pendiente de revisión:

- Rama: `agent/redisenar-automatizacion`
- Commit: `13e0b4a`
- PR: <https://github.com/GuillesDev/portfolio-guilles/pull/3>
- Estado: abierto como borrador, mergeable y con Vercel en verde.
- Preview:
  <https://portfolio-guilles-795551tjk-guille008rm-blips-projects.vercel.app/automatizacion>
- No fusionar el PR `#3` sin que Guillermo lo pida.

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

## Dirección visual acordada

### Principios

- Reducir el texto total aproximadamente entre un 35 % y un 45 %.
- Enseñar antes de explicar.
- Usar vídeos, imágenes, interfaces, movimiento y composición tipográfica.
- Mantener frases cortas y humanas.
- Cada proyecto debe tener una identidad visual propia.
- Usar datos o métricas solo cuando sean reales.
- Revisar siempre escritorio y móvil.

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

La versión de producción todavía contiene la sección anterior. El PR `#3`
propone el nuevo diseño.

Cambios del PR `#3`:

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

Antes de fusionar el PR `#3`, revisar visualmente la preview en escritorio y
móvil, especialmente:

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
estilos se pierden. Van con `:global()` colgando del contenedor.

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
- El `CinematicReveal` antiguo sigue en Remotion y en la tarjeta de la
  portada. Solo se sustituyó en el caso de estudio.

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

Reglas técnicas importantes:

- Cualquier estado que mueva el robot fuera de pantalla debe resetearse al
  cambiar de página.
- Fuera de `/grafismo`, resetear la posición completa en cada frame normal,
  incluyendo `x = 0`, para no heredar la salida lateral de Grafismo.
- Cada sección tiene un prop propio en la mano salvo Grafismo.
- En Fratelli usa el prop y la ropa de pizzero.

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

Modelo actual:

- `nvidia/nemotron-3-nano-30b-a3b`
- NVIDIA NIM mediante endpoint compatible con Chat Completions.
- El razonamiento largo está desactivado.
- Temperatura `0`.
- Respuestas breves, normalmente hasta unas 70 palabras.

Funcionamiento:

1. El navegador envía pregunta e historial a `/api/robot-chat`.
2. El endpoint añade contexto cerrado sobre Guillermo y sus proyectos.
3. NVIDIA genera solo el texto de la respuesta.
4. El servidor calcula de forma determinista el enlace y CTA seguros.
5. Si NVIDIA falla o tarda demasiado, se usa la base local de respuestas.

Decisiones tomadas:

- Llama 3.3 70B se descartó por timeout.
- Phi-4 Mini se descartó porque el endpoint devolvía `410`.
- Llama 3.1 8B funcionaba, pero Nemotron dio mejores respuestas para FAQ.
- Nemotron respondió correctamente en Vercel con estado `200`.

Variables de entorno:

- `NVIDIA_API_KEY`: obligatoria en Vercel, nunca en el repositorio.
- `NVIDIA_NIM_MODEL`: opcional para cambiar el modelo.

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

Seguridad y límites:

- La API key solo existe en servidor.
- Se validan longitud, formato y frecuencia de peticiones.
- Hay timeout y fallback local.
- La IA no navega por Internet.
- No genera imágenes ni vídeos.
- Solo conoce el contexto que recibe del portfolio.

## Estado del chat

- Historial guardado en `sessionStorage`.
- Se conservan hasta 30 registros.
- El hilo sobrevive a la navegación interna durante la sesión.
- El robot cambia de aspecto según la nueva página.
- Preguntas imperativas como “llévame a Fratelli” pueden navegar después de
  responder.
- Las rutas se determinan con lógica local para evitar enlaces inventados.

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
4. Si se continúa Automatización, abrir la preview del PR `#3`.
5. No rehacer trabajo ya terminado.
6. Antes de editar, explicar brevemente el diagnóstico y la dirección.
7. Compilar antes de cerrar.
8. Pedir aprobación antes de fusionar o publicar en producción.
