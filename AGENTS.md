# AGENTS.md

## Proyecto

Portfolio personal de Guillermo Lopez construido con Astro y componentes 3D en Three.js.

## Comandos utiles

- `npm run dev`: servidor local de desarrollo.
- `npm run build`: comprobacion principal antes de cerrar cambios.

## Preferencias de trabajo

- No hacer `git push` sin permiso explicito del usuario.
- Ante una petición de implementación, completar los cambios locales necesarios y las verificaciones pertinentes sin pedir confirmaciones sobre decisiones rutinarias y reversibles. Antes de solicitar permiso para `git push`, dejar el cambio concreto y revisable y comunicar el resultado de las verificaciones. No repetir la solicitud si el usuario ya autorizó ese envío concreto y no ha cambiado su alcance. Si una aprobación o dato imprescindible bloquea una parte, continuar el trabajo independiente y describir exactamente lo pendiente; no presentar la tarea como completada.
- Mantener el tono de la web cercano, humano y directo. Evitar copy que suene generico, corporativo o escrito por IA.
- En Fratelli Pazzi usar siempre `fundé` / `fundador`; no usar `cofundé` ni `cofundador`.
- En la seccion de desarrollo no usar etiquetas tipo `en produccion`, `+40 paginas generadas`, `100% TypeScript` o `0 CMS` como reclamos.

## Robot global

- El robot principal vive en `src/components/global/RobotGuide.astro`.
- La geometria base esta en `src/lib/robotRig.ts`.
- El robot usa `transition:persist`, asi que cualquier estado que lo mueva fuera de pantalla debe resetearse al cambiar de pagina.
- Fuera de `/grafismo`, el robot debe resetear su posicion completa en cada frame normal, incluyendo `x = 0`, para no heredar la salida lateral de grafismo.
- Cada seccion tiene un prop propio en la mano salvo grafismo, donde el robot cambia a un setup especial.

## Setup de grafismo

- En `/grafismo` no aparece la burbuja normal de indicaciones.
- El robot esta sentado en una silla gaming dentro de un setup futurista con pantallas flotantes.
- Al hacer click:
  - Primera y segunda interaccion: se gira, se levanta, se enfada, habla y vuelve a sentarse.
  - Tercera interaccion: hace aspavientos y se va por la derecha.
  - Los clicks durante una animacion activa deben ignorarse para no reiniciar estados a mitad.
- Cuando el robot se va, el setup debe quedarse visible y la silla debe mantenerse girada.
- Cuidar especialmente que robot y silla giren en la misma direccion para que no parezca que atraviesa la silla.
