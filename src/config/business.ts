export interface BusinessConfig {
  name: string;
  publicName: string;
  phone: string;
  phoneE164: string;
  phoneSchema: string;
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
  operatingHoursText: string;
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
  preferredContactMethods: Array<{
    value: 'phone_call' | 'text_message' | 'email';
    label: string;
  }>;
}

const env = import.meta.env;
const confirmedContact = {
  phone: '919-633-3720',
  phoneE164: '+19196333720',
  phoneSchema: '+1-919-633-3720',
  email: 'chamostireco@gmail.com',
} as const;

export const business: BusinessConfig = {
  name: env.PUBLIC_BUSINESS_NAME || 'Chamos Tire Co',
  publicName: env.PUBLIC_BUSINESS_NAME || 'Chamos Tire Co',
  phone: confirmedContact.phone,
  phoneE164: confirmedContact.phoneE164,
  phoneSchema: confirmedContact.phoneSchema,
  email: confirmedContact.email,
  streetAddress: env.PUBLIC_BUSINESS_STREET_ADDRESS || '1005 Goodworth Dr, Unit 105',
  city: env.PUBLIC_BUSINESS_CITY || 'Apex',
  state: env.PUBLIC_BUSINESS_STATE || 'NC',
  zipCode: env.PUBLIC_BUSINESS_ZIP || '27539',
  country: env.PUBLIC_BUSINESS_COUNTRY || 'US',
  latitude: env.PUBLIC_BUSINESS_LATITUDE || '',
  longitude: env.PUBLIC_BUSINESS_LONGITUDE || '',
  businessHours: [],
  operatingHoursText: env.PUBLIC_BUSINESS_OPERATING_HOURS || 'Monday through Saturday, By Appointment Only.',
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
  logoPath: '/chamos-tires-icon.svg',
  defaultSocialImage: env.PUBLIC_SOCIAL_IMAGE || '/images/chamos-tires-whatsapp.svg',
  customersVisitAddress: env.PUBLIC_CUSTOMERS_VISIT_ADDRESS
    ? env.PUBLIC_CUSTOMERS_VISIT_ADDRESS === 'true'
    : true,
  installationOffered: env.PUBLIC_INSTALLATION_OFFERED
    ? env.PUBLIC_INSTALLATION_OFFERED === 'true'
    : null,
  priceRange: env.PUBLIC_PRICE_RANGE || '',
  preferredContactMethods: [
    { value: 'phone_call', label: 'Phone call' },
    { value: 'text_message', label: 'Text message' },
    { value: 'email', label: 'Email' },
  ],
};

export const businessLocationLabel = [business.city, business.state].filter(Boolean).join(', ');

export const getPublicPhoneHref = (): string =>
  business.phoneE164 ? `tel:${business.phoneE164}` : '';

export const getPublicSmsHref = (): string =>
  business.phoneE164 ? `sms:${business.phoneE164}` : '';

export const getPublicEmailHref = (): string =>
  business.email ? `mailto:${business.email}` : '';
