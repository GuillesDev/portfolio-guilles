export interface Project {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
  featured?: boolean;
}

export interface AreaProjects {
  slug: string;
  label: string;
  projects: Project[];
}

export interface AutomationVisualiser {
  title: string;
  description: string;
  tags: string[];
  video: string;
  poster: string;
}

export const grafismoProjects: Project[] = [
  {
    title: 'En Boca de Todos',
    description:
      'Grafismo en directo para el programa diario de actualidad de Cuatro (Mediaset). Diseño de piezas gráficas, rótulos, cortinillas y elementos de emisión bajo la presión del directo.',
    tags: ['Directo', 'Cuatro', 'Mediaset', 'After Effects'],
    featured: true,
  },
  {
    title: 'Especial Ana Obregón — Telecinco',
    description:
      'Diseño y producción de la gráfica completa para el especial en prime time de Telecinco. Identidad visual del programa, cabecera, transiciones y motion graphics.',
    tags: ['Prime Time', 'Telecinco', 'Mediaset', 'Motion Graphics'],
    featured: true,
  },
  {
    title: 'Infinity — Cabecera Podcast',
    description:
      'Cabecera audiovisual para el podcast de la plataforma de contenido de Mediaset. Concepto visual, animación y producción completa del opening.',
    tags: ['Podcast', 'Mediaset', 'Branding', 'Motion'],
    featured: true,
  },
];

export const automatizacionVisualisers: AutomationVisualiser[] = [
  {
    title: 'Plantilla Cartelas',
    description:
      'Base editorial para titulares y bloques de información. Estructura modular con variables de texto, color y timing controladas por expresiones.',
    tags: ['Plantilla', 'Expresiones', 'After Effects'],
    video: '/media/automatizacion/cartelas-si.mp4',
    poster: '/media/automatizacion/cartelas-si-poster.jpg',
  },
  {
    title: 'Plantilla Comodines',
    description:
      'Sistema modular para recursos de apoyo en directo. Del dato al asset final en segundos para mantener ritmo de emisión.',
    tags: ['Directo', 'Workflow', 'Modular'],
    video: '/media/automatizacion/comodines-si.mp4',
    poster: '/media/automatizacion/comodines-si-poster.jpg',
  },
  {
    title: 'Plantilla Quesitos',
    description:
      'Gráficos segmentados con acabado broadcast-ready. Variables de datos, colores automáticos y composición adaptable.',
    tags: ['Broadcast', 'Automatizado', 'Datos'],
    video: '/media/automatizacion/quesitos-si.mp4',
    poster: '/media/automatizacion/quesitos-si-poster.jpg',
  },
];

export const desarrolloProjects: Project[] = [
  {
    title: 'Black Gum Studio',
    description:
      'Web a medida para una productora audiovisual en Madrid: parte pública, panel privado de administración, pagos con Stripe y gestión de contenidos.',
    tags: ['Next.js 14', 'TypeScript', 'Prisma', 'Stripe', 'Full-Stack'],
    link: 'https://blackgumgroup.com/',
    featured: true,
  },
];

export const fratelliProjects: Project[] = [
  {
    title: 'Identidad de marca',
    description:
      'Creación integral de la identidad visual de Fratelli Pazzi: logotipo, paleta cromática, tipografías, y sistema visual completo para todos los puntos de contacto.',
    tags: ['Branding', 'Identidad Visual', 'Logo'],
    featured: true,
  },
  {
    title: 'Sistema visual para el local',
    description:
      'Aplicación de la marca en carta, flyers, redes, piezas promocionales y pantallas del local para mantener una experiencia reconocible.',
    tags: ['Diseño aplicado', 'Carta', 'Redes'],
    featured: true,
  },
  {
    title: 'Experiencia de producto',
    description:
      'Auténtica pizzería napolitana en Las Rozas (Madrid). Ingredientes importados de Italia, masa fermentada 48h, horno de leña a 450°C. 4.7 estrellas en Google con +300 clientes.',
    tags: ['Producto Real', 'Gastronomía', 'Las Rozas'],
    featured: true,
  },
];
