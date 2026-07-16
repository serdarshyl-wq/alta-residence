export const LIVING_SLUGS = {
  'Maison Aurélie': 'maison-aurelie',
  'Marbre Grand': 'marbre-grand',
  'Lumière Atelier': 'lumiere-atelier',
}

export const SLUG_TO_LIVING = Object.fromEntries(
  Object.entries(LIVING_SLUGS).map(([name, slug]) => [slug, name])
)
