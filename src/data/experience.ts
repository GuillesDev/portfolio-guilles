export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  logo?: string;
}

export const experience: Experience[] = [
  {
    company: 'Producciones Mandarina',
    role: 'Grafista',
    period: 'Mar 2022 – Actualidad',
    description:
      'Grafismo en entorno audiovisual y televisivo. Nuevo formato en Cuatro. Diseño y ejecución de piezas gráficas, rótulos y elementos de emisión bajo la presión del directo.',
    tags: ['Directo', 'After Effects', 'Photoshop', 'TV'],
    logo: '/media/companies/mandarina.png',
  },
  {
    company: 'Catorce Comunicación',
    role: 'Grafista',
    period: 'Oct 2023 – Mar 2024',
    description:
      'Producción gráfica y motion design en régimen de jornada parcial y formato remoto.',
    tags: ['Motion Graphics', 'Remoto', 'Diseño Gráfico'],
    logo: '/media/companies/catorce.png',
  },
  {
    company: 'ABC Live Experience',
    role: 'Coordinador de personal',
    period: 'Jul 2023 – Ago 2023',
    description:
      'Coordinador de HUB en la gira de festivales RBF. Gestión de personal y resolución de incidencias en directo.',
    tags: ['Eventos', 'Coordinación', 'Festivales'],
    logo: '/media/companies/abc-live.png',
  },
  {
    company: 'Fratelli Pazzi',
    role: 'Fundador / Director de Marca',
    period: '2022 – Actualidad',
    description:
      'Creación integral del negocio: identidad de marca, carta, cartelería, contenido para redes, piezas para el local y gestión operativa. Pizzería napolitana real en Las Rozas (Madrid).',
    tags: ['Emprendimiento', 'Branding', 'Negocio'],
    logo: '/media/companies/fratelli.png',
  },
  {
    company: 'Miss Motion',
    role: 'Grafista',
    period: 'Jun 2021 – Dic 2021',
    description:
      'Grafismo y motion design para proyectos audiovisuales.',
    tags: ['Motion Graphics', 'After Effects', 'Diseño'],
    logo: '/media/companies/miss-motion.png',
  },
  {
    company: 'Telefónica',
    role: 'Grafista',
    period: 'Nov 2020 – Feb 2021',
    description:
      'Producción gráfica y diseño para la plataforma audiovisual de Telefónica.',
    tags: ['Plataforma', 'Motion Design', 'Post-producción'],
    logo: '/media/companies/telefonica.png',
  },
  {
    company: 'Mediaset España',
    role: 'Colaboraciones en Fiesta de Mediaset',
    period: 'Puntual',
    description:
      'Trabajos puntuales de grafismo para especiales y eventos de Mediaset.',
    tags: ['Prime Time', 'Especiales', 'Broadcast'],
    logo: '/media/companies/mediaset-fiesta.png',
  },
];

export const skills = {
  design: ['After Effects', 'Photoshop', 'Illustrator', 'Motion Graphics', 'Grafismo TV', 'Dirección de Arte'],
  ai: ['ChatGPT', 'Nano Banana 2', 'Kling', 'IA Generativa', 'Prompt Engineering'],
  dev: ['HTML/CSS', 'JavaScript', 'Astro', 'Diseño Web', 'UI/UX'],
  business: ['Gestión de Marca', 'E-commerce', 'Marketing Digital', 'Operaciones'],
} as const;
