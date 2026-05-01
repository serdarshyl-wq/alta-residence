export class Living {
  constructor({ id, name, tagline, description, image }) {
    this.id = id
    this.name = name
    this.tagline = tagline
    this.description = description
    this.image = image
  }
}

export const livings = [
  new Living({
    id: 1,
    name: 'Maison Solène',
    tagline: 'Twin-level sanctuaries',
    description:
      'Two-level sanctuaries flooded with natural light, where floor-to-ceiling glass meets hand-crafted stonework. Each duplex offers a private terrace with unobstructed city views.',
    image: '/products/interior-1.webp',
  }),
  new Living({
    id: 2,
    name: 'Velour Grand',
    tagline: 'The pinnacle of residential artistry',
    description:
      'Commanding the uppermost floors, the Crown Penthouse is a singular expression of refined luxury — double-height living, private rooftop garden, and bespoke finishes throughout.',
    image: '/products/exterior-2.webp',
  }),
  new Living({
    id: 3,
    name: 'Obsidian Atelier',
    tagline: 'Quiet elegance, refined proportions',
    description:
      'Intimate residences designed around natural rhythms — each suite pairs warm oak millwork with travertine surfaces, framed by gardens that drift into the horizon.',
    image: '/products/interior-3.webp',
  }),
]
