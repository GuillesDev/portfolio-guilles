/**
 * Sonidos de interfaz, sintetizados con Web Audio.
 *
 * No hay ningún archivo de audio: se generan en el navegador. Así no se añade
 * un solo byte a la descarga, no hay licencias de por medio y cada sonido se
 * puede afinar desde aquí. Es el mismo enfoque que usa la voz del robot en
 * `RobotGuide.astro`, para que todo suene de la misma familia.
 *
 * Apagados por defecto. Los navegadores bloquean el audio hasta que hay un
 * gesto del visitante, y encima nadie quiere que una web suene sin pedirlo.
 */

const CLAVE = 'pf-sound-on';
// La queja del robot va por su propio silencio, el mismo que usa la voz del
// robot global (`RobotGuide.astro`), no por el interruptor del header: los dos
// gemelos del robot deben comportarse igual y callarse con el mismo botón.
const VOZ_MUTED = 'rg-voice-muted';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let activo = false;
let leido = false;
let ultimaQueja = 0;

function contexto(): AudioContext | null {
  try {
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;

    if (!ctx) {
      ctx = new AudioCtor();
      master = ctx.createGain();
      // Techo general bajo: son avisos, no protagonistas. En móvil el altavoz
      // es pequeño y el audio web sale más flojo, así que sube bastante: los
      // picos de los sonidos son ~0.15 como mucho, hay margen de sobra antes
      // de saturar (el clip está en 1.0).
      const tactil = window.matchMedia('(pointer: coarse)').matches;
      master.gain.value = tactil ? 1.35 : 0.5;
      master.connect(ctx.destination);
    }
    // Safari deja el contexto suspendido hasta el primer gesto.
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Ruido filtrado: la estática que acompaña al cambio de canal. */
function estatica(c: AudioContext, at: number, dur: number, nivel: number) {
  const muestras = Math.max(1, Math.floor(c.sampleRate * dur));
  const buffer = c.createBuffer(1, muestras, c.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;

  const fuente = c.createBufferSource();
  fuente.buffer = buffer;

  // Paso de banda estrecho: sin esto suena a chorro de aire, no a televisor.
  const banda = c.createBiquadFilter();
  banda.type = 'bandpass';
  banda.frequency.setValueAtTime(2600, at);
  banda.frequency.exponentialRampToValueAtTime(900, at + dur);
  banda.Q.value = 0.9;

  const g = c.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(nivel, at + dur * 0.15);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  fuente.connect(banda);
  banda.connect(g);
  g.connect(master!);
  fuente.start(at);
  fuente.stop(at + dur);
}

/** Golpecito de ruido cortísimo: la pulsación de una tecla. */
function ruidoCorto(c: AudioContext, at: number, freq: number, dur: number, nivel: number) {
  const muestras = Math.max(1, Math.floor(c.sampleRate * dur));
  const buffer = c.createBuffer(1, muestras, c.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;

  const fuente = c.createBufferSource();
  fuente.buffer = buffer;

  const banda = c.createBiquadFilter();
  banda.type = 'bandpass';
  banda.frequency.value = freq;
  banda.Q.value = 1.4;

  const g = c.createGain();
  g.gain.setValueAtTime(nivel, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  fuente.connect(banda);
  banda.connect(g);
  g.connect(master!);
  fuente.start(at);
  fuente.stop(at + dur);
}

/** Tono suave con ataque redondeado. La calidez viene del paso bajo. */
function tono(
  c: AudioContext,
  at: number,
  desde: number,
  hasta: number,
  dur: number,
  nivel: number,
) {
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(desde, at);
  if (hasta !== desde) osc.frequency.exponentialRampToValueAtTime(hasta, at + dur * 0.85);

  // Un armónico muy por debajo le quita el punto de pitido de test.
  const cuerpo = c.createOscillator();
  cuerpo.type = 'triangle';
  cuerpo.frequency.setValueAtTime(desde * 2, at);
  const cuerpoG = c.createGain();
  cuerpoG.gain.value = nivel * 0.18;

  const suave = c.createBiquadFilter();
  suave.type = 'lowpass';
  suave.frequency.value = 2400;

  const g = c.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(nivel, at + Math.min(0.02, dur * 0.25));
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  osc.connect(g);
  cuerpo.connect(cuerpoG);
  cuerpoG.connect(g);
  g.connect(suave);
  suave.connect(master!);

  osc.start(at);
  cuerpo.start(at);
  osc.stop(at + dur);
  cuerpo.stop(at + dur);
}

type Sonido =
  | 'canal'
  | 'abrir'
  | 'cerrar'
  | 'paso'
  | 'tecla'
  | 'enviar'
  | 'generado'
  | 'burbuja'
  | 'nav';

export function playSound(nombre: Sonido) {
  if (!isSoundOn()) return;
  const c = contexto();
  if (!c || !master) return;

  const t = c.currentTime + 0.005;
  switch (nombre) {
    case 'canal':
      // Sintonizar: golpe seco y un rastro de estática.
      tono(c, t, 220, 130, 0.09, 0.1);
      estatica(c, t, 0.14, 0.045);
      break;
    case 'abrir':
      // Dos notas que suben, cálidas y cortas.
      tono(c, t, 392, 392, 0.1, 0.075);
      tono(c, t + 0.06, 587, 587, 0.16, 0.06);
      break;
    case 'cerrar':
      tono(c, t, 392, 262, 0.14, 0.055);
      break;
    case 'paso':
      tono(c, t, 660, 660, 0.045, 0.035);
      break;
    case 'tecla':
      // Pulsación: ruido cortísimo con el tono variado en cada golpe, para
      // que una ráfaga suene a teclado y no a metrónomo. Es el sonido que
      // más se repite, así que es también el más bajo de todos.
      ruidoCorto(c, t, 1900 + Math.random() * 1500, 0.014 + Math.random() * 0.008, 0.05);
      break;
    case 'enviar':
      // El prompt sale: barrido corto hacia arriba.
      tono(c, t, 340, 680, 0.13, 0.06);
      break;
    case 'generado':
      // El resultado nace: arpegio de tres notas, la firma más cálida.
      tono(c, t, 523, 523, 0.09, 0.05);
      tono(c, t + 0.055, 659, 659, 0.09, 0.045);
      tono(c, t + 0.11, 784, 784, 0.16, 0.04);
      break;
    case 'burbuja':
      // Mensaje de chat: gota que cae, como los pops de mensajería.
      tono(c, t, 820, 340, 0.07, 0.06);
      break;
    case 'nav':
      // Cambio de sitio: blip neutro, casi un roce.
      tono(c, t, 494, 494, 0.05, 0.03);
      break;
  }
}

/**
 * La queja del robot cuando le pegan: un "ay" corto y nasal. Réplica del
 * `playHurt` del robot global, para que su gemelo grande de /desarrollo suene
 * igual. Va por `rg-voice-muted`, no por el interruptor del header: es la voz
 * del robot, encendida por defecto, y el gesto del click abre el contexto.
 */
export function playRobotHurt() {
  try {
    if (localStorage.getItem(VOZ_MUTED) === '1') return;
  } catch {
    // Sin almacenamiento se asume no silenciado, como el robot global.
  }
  const c = contexto();
  if (!c || !master) return;

  const now = c.currentTime;
  // Aporrearlo encadenaría osciladores y acumularía volumen.
  if (now - ultimaQueja < 0.09) return;
  ultimaQueja = now;

  const t = now + 0.005;
  const base = 300 + Math.random() * 80;
  const dur = 0.22 + Math.random() * 0.06;

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  // Sube de golpe y se desliza hacia abajo: eso se lee como un "¡ay!".
  osc.frequency.setValueAtTime(base * 0.92, t);
  osc.frequency.exponentialRampToValueAtTime(base * 1.34, t + dur * 0.2);
  osc.frequency.exponentialRampToValueAtTime(base * 0.6, t + dur * 0.92);

  // Vibrato: sin esto suena a nota, no a voz.
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 32 + Math.random() * 8;
  lfoGain.gain.value = base * 0.06;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  // Banda estrecha para el timbre nasal, y un techo para quitar aspereza.
  const formant = c.createBiquadFilter();
  formant.type = 'bandpass';
  formant.frequency.value = 900 + Math.random() * 220;
  formant.Q.value = 5.5;
  const tope = c.createBiquadFilter();
  tope.type = 'lowpass';
  tope.frequency.value = 1850;

  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.5, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(formant);
  formant.connect(tope);
  tope.connect(g);
  g.connect(master);

  lfo.start(t);
  osc.start(t);
  lfo.stop(t + dur);
  osc.stop(t + dur);
}

export function isSoundOn(): boolean {
  if (!leido) {
    try {
      activo = localStorage.getItem(CLAVE) === '1';
    } catch {
      activo = false;
    }
    leido = true;
  }
  return activo;
}

export function setSoundOn(valor: boolean) {
  activo = valor;
  leido = true;
  try {
    localStorage.setItem(CLAVE, valor ? '1' : '0');
  } catch {
    // Navegación privada: se queda solo en memoria.
  }
  if (valor) contexto();
}
