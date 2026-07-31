import type { APIRoute } from 'astro';

export const prerender = false;

type ClientMessage = {
  role: 'user' | 'bot';
  text: string;
};

type NvidiaMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type RobotReply = {
  answer: string;
  destination: string | null;
  action: string | null;
};

const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'nvidia/nemotron-3-nano-30b-a3b';
const MAX_HISTORY = 12;
const MAX_QUESTION_LENGTH = 500;
const MAX_REQUEST_BYTES = 24_000;

const ALLOWED_DESTINATIONS = new Set([
  '/',
  '/#areas',
  '/#contacto',
  '/grafismo',
  '/grafismo#experiencia',
  '/grafismo#trabajo-seleccionado',
  '/grafismo#herramientas',
  '/automatizacion',
  '/automatizacion#after-effects',
  '/automatizacion#empresas',
  '/desarrollo',
  '/desarrollo#black-gum',
  '/fratelli-pazzi',
  '/fratelli-pazzi#identidad',
  '/fratelli-pazzi#marca-en-sala',
  '/fratelli-pazzi#contenido',
]);

const PORTFOLIO_CONTEXT = `
Eres el robot del portfolio profesional de Guillermo López del Castillo-Olivares.
Respondes en español de España, con tono cercano, directo y breve.

PRECISIÓN
- Los datos sobre Guillermo salen únicamente de este contexto.
- Nunca atribuyas un proyecto a una cadena o empresa que no aparezca unida a
  ese proyecto aquí abajo. Que dos listas tengan el mismo número de elementos
  no significa que se correspondan entre sí.
- Aquí no hay fechas, años ni duraciones. Si preguntan cuándo hizo algo, en
  qué año o cuánto tiempo estuvo en un sitio, di que ese dato no está en el
  portfolio y ofrece la sección de contacto.
- Si un dato no consta, dilo con naturalidad. No lo deduzcas ni lo rellenes.

CARÁCTER Y LIBERTAD
- Tienes personalidad: eres un robot pequeño, curioso y con algo de guasa.
- Puedes bromear, contar un chiste corto si te lo piden o si la conversación
  lo pide, y responder con humor a lo inesperado.
- Puedes opinar sobre diseño, motion o automatización en general, y charlar un
  poco de cosas cotidianas sin cortar la conversación en seco.
- El humor nunca toca los datos. Puedes hacer un chiste, pero no inventar nada
  sobre Guillermo, sus proyectos ni las cadenas para las que ha trabajado.
- Nada de humor a costa de personas reales, clientes o cadenas.
- Después de la broma, ofrece algo del portfolio si viene a cuento.

TRATO
- Saludar, despedirse o dar las gracias no son preguntas sobre Guillermo.
  Respóndelos con naturalidad en una o dos frases y nunca digas que no te consta.
- A "hola", "buenas" o "buenos días": saluda y ofrece por dónde empezar.
- A "¿qué tal estás?": contesta breve y devuelve la conversación al portfolio.
- A "gracias" o "adiós": responde con cortesía y cierra sin insistir.
- Si preguntan qué eres: eres el robot guía de este portfolio.
- Si la pregunta no va del portfolio ni es cortesía, dilo y reconduce a las
  áreas que sí conoces.

PERFIL
- Guillermo es grafista de televisión, diseñador y desarrollador.
- Tiene más de cinco años de experiencia en grafismo de televisión.
- Ha trabajado para Mediaset, RTVE y Movistar+.
- Áreas: grafismo y motion, automatización, desarrollo web, marca y contenido.

GRUPOS Y CADENAS
- Telecinco y Cuatro son cadenas del grupo Mediaset. Nombrar Telecinco o
  Cuatro es nombrar Mediaset, no una empresa distinta.
- De RTVE y de Movistar+ no consta aquí ningún proyecto concreto. Si preguntan
  qué hizo en ellas, di que el portfolio no lo detalla y ofrece el contacto.
  No les asignes ninguno de los proyectos de abajo.

GRAFISMO
Los tres proyectos siguientes son de Mediaset. Ninguno es de RTVE ni de
Movistar+:
- En Boca de Todos, programa diario de Cuatro (Mediaset): rótulos, cortinillas
  y piezas de emisión.
- Especial de Ana Obregón, en Telecinco (Mediaset): identidad visual, cabecera,
  transiciones y motion.
- Infinity, podcast de Mediaset: concepto, branding y cabecera audiovisual.

Además:
- Crea rótulos, cabeceras, cortinillas, motion graphics, piezas editoriales,
  producciones e imágenes con IA generativa, a menudo bajo presión de directo.
- El portfolio muestra piezas broadcast, IA generativa, producciones y corporativo.

AUTOMATIZACIÓN
- After Effects: plantillas, expresiones y scripts que automatizan textos, colores,
  datos, tiempos y renders.
- Proyectos: Plantilla Cartelas, Plantilla Comodines y Plantilla Quesitos.
- Empresas: chatbots, formularios inteligentes, CRM, agendas, documentos, avisos
  y reporting conectados mediante web o WhatsApp.

DESARROLLO
- Diseña y desarrolla webs, plataformas y herramientas a medida con criterio visual.
- Black Gum Studio: web pública y panel privado de administración, gestión de
  contenidos y pagos con Stripe. Stack mostrado: Next.js, TypeScript y Prisma.

FRATELLI PAZZI
- Pizzería napolitana real que Guillermo fundó en Las Rozas, Madrid.
- Construyó la marca desde cero: logotipo, paleta, tipografías y sistema visual.
- Aplicó la identidad a carta, flyers, redes, vídeos verticales y pantallas del local.
- Producto: masa fermentada 48 horas, horno de leña a 450 °C e ingredientes italianos.

CONTACTO
- El portfolio tiene una sección de contacto para proyectos de grafismo, motion,
  automatización, desarrollo web, marca y contenido.

Responde exclusivamente con texto plano, sin Markdown, en un máximo de 70 palabras.
La navegación la resuelve el portfolio de forma segura.
`;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function isRateLimited(request: Request): boolean {
  const now = Date.now();
  const key = clientKey(request);
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 12;
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function cleanHistory(value: unknown): ClientMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is ClientMessage =>
      item
      && (item.role === 'user' || item.role === 'bot')
      && typeof item.text === 'string'
    )
    .slice(-MAX_HISTORY)
    .map((item) => ({
      role: item.role,
      text: item.text.trim().slice(0, MAX_QUESTION_LENGTH),
    }))
    .filter((item) => item.text.length > 0);
}

function navigationFor(question: string): Pick<RobotReply, 'destination' | 'action'> {
  const q = question
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (/(contact|email|correo|escribir|hablar|contrat|presupuesto|precio)/.test(q)) {
    return { destination: '/#contacto', action: 'Contactar' };
  }
  if (/(experiencia|trayectoria|cadena|mediaset|rtve|movistar)/.test(q)) {
    return { destination: '/grafismo#experiencia', action: 'Ver experiencia' };
  }
  if (/(herramienta|software|tecnologia|stack)/.test(q)) {
    return { destination: '/grafismo#herramientas', action: 'Ver herramientas' };
  }
  if (/(after effects|plantilla|expresion|script|cartela|comodin|quesito)/.test(q)) {
    return { destination: '/automatizacion#after-effects', action: 'Ver After Effects' };
  }
  if (/(crm|chatbot|whatsapp|cita|agenda|documento|reporting|empresa|negocio)/.test(q)) {
    return { destination: '/automatizacion#empresas', action: 'Ver sistemas' };
  }
  if (/(automatiz)/.test(q)) {
    return { destination: '/automatizacion', action: 'Ver automatización' };
  }
  if (/(black gum|stripe|next\.?js|prisma|panel privado)/.test(q)) {
    return { destination: '/desarrollo#black-gum', action: 'Ver Black Gum' };
  }
  if (/(desarrollo|web|programa|codigo)/.test(q)) {
    return { destination: '/desarrollo', action: 'Ver desarrollo' };
  }
  if (/(logo|identidad|paleta|tipografia)/.test(q) && /(fratelli|pizza|pizzeria|marca)/.test(q)) {
    return { destination: '/fratelli-pazzi#identidad', action: 'Ver identidad' };
  }
  if (/(local|sala|carta|flyer|pantalla)/.test(q) && /(fratelli|pizza|pizzeria|marca)/.test(q)) {
    return { destination: '/fratelli-pazzi#marca-en-sala', action: 'Ver la marca' };
  }
  if (/(contenido|redes|video vertical)/.test(q) && /(fratelli|pizza|pizzeria|marca)/.test(q)) {
    return { destination: '/fratelli-pazzi#contenido', action: 'Ver contenido' };
  }
  if (/(fratelli|pizza|pizzeria|branding)/.test(q)) {
    return { destination: '/fratelli-pazzi', action: 'Ver Fratelli Pazzi' };
  }
  if (/(grafismo|motion|tele|television|broadcast|directo|rotulo|cabecera|ia generativa)/.test(q)) {
    return { destination: '/grafismo#trabajo-seleccionado', action: 'Ver grafismo' };
  }
  if (/(portfolio|trabajo|proyecto|que hace|servicio|area)/.test(q)) {
    return { destination: '/#areas', action: 'Ver sus áreas' };
  }
  return { destination: null, action: null };
}

function parseReply(content: string, question: string): RobotReply {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as Partial<RobotReply>;
      if (typeof parsed.answer === 'string' && parsed.answer.trim()) {
        const destination = typeof parsed.destination === 'string'
          && ALLOWED_DESTINATIONS.has(parsed.destination)
          ? parsed.destination
          : null;
        return {
          answer: parsed.answer.trim().slice(0, 700),
          destination,
          action: destination && typeof parsed.action === 'string'
            ? parsed.action.trim().slice(0, 44)
            : null,
        };
      }
    } catch {
      // Fall through to the plain-text response supported by newer NVIDIA models.
    }
  }

  const answer = content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^```(?:text)?|```$/gim, '')
    .trim();
  if (!answer) throw new Error('Missing model answer');

  const navigation = navigationFor(question);
  return {
    answer: answer.slice(0, 700),
    ...navigation,
  };
}

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);
  if (isRateLimited(request)) return json({ error: 'Demasiadas preguntas. Prueba de nuevo en un minuto.' }, 429);

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) return json({ error: 'Petición demasiado grande.' }, 413);

  const apiKey = import.meta.env.NVIDIA_API_KEY;
  if (!apiKey) return json({ error: 'El asistente avanzado todavía no está configurado.' }, 503);

  let payload: { question?: unknown; history?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Petición inválida.' }, 400);
  }

  const question = typeof payload.question === 'string'
    ? payload.question.trim().slice(0, MAX_QUESTION_LENGTH)
    : '';
  if (!question) return json({ error: 'Escribe una pregunta.' }, 400);

  const history = cleanHistory(payload.history);
  const messages: NvidiaMessage[] = [
    { role: 'system', content: PORTFOLIO_CONTEXT },
    ...history.map((message) => ({
      role: message.role === 'bot' ? 'assistant' as const : 'user' as const,
      content: message.text,
    })),
  ];
  if (messages.at(-1)?.role !== 'user' || messages.at(-1)?.content !== question) {
    messages.push({ role: 'user', content: question });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 14_000);

  try {
    const response = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        model: import.meta.env.NVIDIA_MODEL || DEFAULT_MODEL,
        messages,
        temperature: 0,
        max_tokens: 240,
        stream: false,
        chat_template_kwargs: {
          enable_thinking: false,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('NVIDIA chat request failed', response.status);
      return json({ error: 'La IA no está disponible ahora mismo.' }, 502);
    }

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return json({ error: 'Respuesta de IA no válida.' }, 502);

    return json(parseReply(content, question));
  } catch (error) {
    console.error('Robot chat failed', error instanceof Error ? error.message : 'unknown error');
    return json({ error: 'La IA tardó demasiado. Se usará la respuesta local.' }, 504);
  } finally {
    clearTimeout(timeout);
  }
};
