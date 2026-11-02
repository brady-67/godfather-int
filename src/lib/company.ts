const HUB_QUERY = 'Lotus Plaza, Westlands, Nairobi, Kenya';

export const COMPANY = {
  name: 'Godfather International Trading LLC',
  shortName: 'Godfather International',
  phoneDisplay: '+86 135 7024 8083',
  phoneHref: 'tel:+8613570248083',
  phoneWhatsappHref: 'https://wa.me/8613570248083',
  headquarters: 'Guangzhou, China',
  hub: {
    name: 'Nairobi Hub',
    building: 'Lotus Plaza',
    area: 'Westlands',
    city: 'Nairobi, Kenya',
    short: 'Lotus Plaza, Westlands, Nairobi',
    mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(HUB_QUERY)}&z=16&output=embed`,
    mapsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HUB_QUERY)}`,
    directionsHref: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(HUB_QUERY)}`,
  },
} as const;
