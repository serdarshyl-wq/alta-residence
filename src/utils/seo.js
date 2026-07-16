import livings from '../data/livings.json'
import { LIVING_SLUGS } from './livingSlugs'

export const SITE_URL = 'https://altra-residence.vercel.app'
export const SITE_NAME = 'Altra Residence'
export const DEFAULT_TITLE = 'Altra Residence — Holistic Luxury Living'
export const DEFAULT_DESCRIPTION =
  'A cinematic showcase of Altra Residence — Maison Aurélie, Marbre Grand, and Lumière Atelier. Discover holistic luxury living, wellness-centered amenities, and timeless design.'
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`

// Structured data (JSON-LD). Kept to plain, verifiable facts that already
// appear on the page — no fabricated address, phone, or ratings — since this
// is a design portfolio piece, not an active listing.
export function getHomeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
      {
        '@type': 'ApartmentComplex',
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        url: `${SITE_URL}/`,
        image: OG_IMAGE,
        numberOfAccommodationUnits: livings.length,
        containsPlace: livings.map((living) => ({
          '@type': 'Apartment',
          name: living.name,
          url: `${SITE_URL}/${LIVING_SLUGS[living.name]}`,
        })),
      },
    ],
  }
}

export function getLivingSchema(details, pageUrl, imageUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: details.name,
    description: details.description,
    url: pageUrl,
    image: imageUrl,
    isPartOf: {
      '@type': 'ApartmentComplex',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  }
}
