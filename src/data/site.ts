export const site = {
  name: 'Guillermo López',
  fullName: 'Guillermo López del Castillo-Olivares',
  title: 'Guillermo López — Grafismo · Automatización · Desarrollo · Marca',
  description:
    'Portfolio y CV digital de Guillermo López del Castillo-Olivares. Grafismo en TV, automatización con IA, desarrollo web y gestión de marca real.',
  url: 'https://portfolio-guilles.vercel.app',
  locale: 'es_ES',
  ogImage: '/images/og-image.jpg',
} as const;

export const social = {
  linkedin:
    'https://es.linkedin.com/in/guillermo-l%C3%B3pez-del-castillo-olivares-a05777201',
  email: 'guillelopez1999@hotmail.com',
} as const;

export const nav = [
  { label: 'Inicio', href: '/' },
  { label: 'Grafismo', href: '/grafismo' },
  { label: 'Automatización', href: '/automatizacion' },
  { label: 'Desarrollo', href: '/desarrollo' },
  { label: 'Fratelli Pazzi', href: '/fratelli-pazzi' },
  { label: 'Contacto', href: '/#contacto' },
] as const;
