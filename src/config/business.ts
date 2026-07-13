export interface BusinessConfig {
  name: string;
  publicName: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: string;
  longitude: string;
  businessHours: Array<{
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  serviceAreas: string[];
  googleBusinessProfileUrl: string;
  googleDirectionsUrl: string;
  googleReviewUrl: string;
  socialUrls: string[];
  mainDomain: string;
  logoPath: string;
  defaultSocialImage: string;
  customersVisitAddress: boolean;
  installationOffered: boolean | null;
  priceRange: string;
}

const env = import.meta.env;

export const business: BusinessConfig = {
  name: env.PUBLIC_BUSINESS_NAME || 'Chamos Tire Co',
  publicName: env.PUBLIC_BUSINESS_NAME || 'Chamos Tire Co',
  phone: env.PUBLIC_BUSINESS_PHONE || '',
  email: env.PUBLIC_BUSINESS_EMAIL || '',
  streetAddress: env.PUBLIC_BUSINESS_STREET_ADDRESS || '',
  city: env.PUBLIC_BUSINESS_CITY || 'Apex',
  state: env.PUBLIC_BUSINESS_STATE || 'NC',
  zipCode: env.PUBLIC_BUSINESS_ZIP || '',
  country: env.PUBLIC_BUSINESS_COUNTRY || 'US',
  latitude: env.PUBLIC_BUSINESS_LATITUDE || '',
  longitude: env.PUBLIC_BUSINESS_LONGITUDE || '',
  businessHours: [],
  serviceAreas: [
    'Apex',
    'Holly Springs',
    'Fuquay-Varina',
    'Cary',
    'Raleigh',
    'North Carolina Triangle Area',
  ],
  googleBusinessProfileUrl: env.PUBLIC_GOOGLE_BUSINESS_PROFILE_URL || '',
  googleDirectionsUrl: env.PUBLIC_GOOGLE_DIRECTIONS_URL || '',
  googleReviewUrl: env.PUBLIC_GOOGLE_REVIEW_URL || '',
  socialUrls: [
    env.PUBLIC_FACEBOOK_URL || '',
    env.PUBLIC_INSTAGRAM_URL || '',
  ].filter(Boolean),
  mainDomain: env.PUBLIC_SITE_URL || 'https://chamos-tires.pages.dev',
  logoPath: '/favicon.svg',
  defaultSocialImage: env.PUBLIC_SOCIAL_IMAGE || '/images/chamos-tires-social-placeholder.svg',
  customersVisitAddress: env.PUBLIC_CUSTOMERS_VISIT_ADDRESS === 'true',
  installationOffered: env.PUBLIC_INSTALLATION_OFFERED
    ? env.PUBLIC_INSTALLATION_OFFERED === 'true'
    : null,
  priceRange: env.PUBLIC_PRICE_RANGE || '',
};

export const businessLocationLabel = [business.city, business.state].filter(Boolean).join(', ');

export const getPublicPhoneHref = (): string =>
  business.phone ? `tel:${business.phone.replace(/[^\d+]/g, '')}` : '';

export const getPublicSmsHref = (): string =>
  business.phone ? `sms:${business.phone.replace(/[^\d+]/g, '')}` : '';
