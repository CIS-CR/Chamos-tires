import { business } from '../../config/business';

const pruneEmpty = <T>(value: T): T | undefined => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (Array.isArray(value)) {
    const items = value.map(pruneEmpty).filter((item) => item !== undefined);
    return items.length ? (items as T) : undefined;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, nestedValue]) => [key, pruneEmpty(nestedValue)])
      .filter(([, nestedValue]) => nestedValue !== undefined);
    return entries.length ? (Object.fromEntries(entries) as T) : undefined;
  }
  return value;
};

export const createTireShopJsonLd = (url: string, imageUrl: string): Record<string, unknown> => {
  const address = {
    '@type': 'PostalAddress',
    streetAddress: business.streetAddress,
    addressLocality: business.city,
    addressRegion: business.state,
    postalCode: business.zipCode,
    addressCountry: business.country,
  };

  return pruneEmpty({
    '@context': 'https://schema.org',
    '@type': 'TireShop',
    name: business.publicName,
    url,
    logo: new URL(business.logoPath, business.mainDomain).toString(),
    image: imageUrl,
    telephone: business.phone,
    email: business.email,
    address,
    geo: business.latitude && business.longitude
      ? {
          '@type': 'GeoCoordinates',
          latitude: business.latitude,
          longitude: business.longitude,
        }
      : undefined,
    openingHoursSpecification: business.businessHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
    openingHours: business.operatingHoursText,
    areaServed: business.serviceAreas.map((area) => ({
      '@type': 'Place',
      name: area,
    })),
    sameAs: [
      business.googleBusinessProfileUrl,
      ...business.socialUrls,
    ],
    priceRange: business.priceRange,
  }) || {};
};
