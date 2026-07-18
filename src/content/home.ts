export const navItems = [
  { href: '#services', label: 'Products and Services' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#why-choose-us', label: 'Why Choose Us' },
  { href: '#service-area', label: 'Service Area' },
  { href: '#faq', label: 'FAQ' },
  { href: '#request', label: 'Find Your Tire' },
];

export const trustItems = [
  'Tires visually inspected before being offered for sale.',
  'Affordable options for different budgets.',
  'Personalized assistance with size and vehicle information.',
  'Different sizes and brands, depending on inventory.',
  'Honest and transparent local service.',
];

export const serviceCards = [
  {
    icon: 'sedan',
    title: 'Used Tires for Cars',
    text: 'Availability requests for common passenger car tire sizes, including single tires, pairs, and replacement sets when available.',
    vehicleType: 'car',
  },
  {
    icon: 'suv',
    title: 'Used Tires for SUVs',
    text: 'Support for SUV tire availability requests using the tire size or the year, make, and model of the vehicle.',
    vehicleType: 'suv',
  },
  {
    icon: 'truck',
    title: 'Used Tires for Trucks and Work Vehicles',
    text: 'Used tire requests for trucks and work vehicles can be submitted for review. Final availability depends on current inventory.',
    vehicleType: 'truck',
  },
  {
    icon: 'set',
    title: 'Single Tires, Pairs, and Full Sets',
    text: 'Customers may request one tire, a pair, or a full set. Chamos Tire Co will confirm what is available before next steps.',
    vehicleType: 'set',
  },
] as const;

export const processSteps = [
  {
    title: 'Send your tire size or vehicle information.',
    text: 'Use the form to share your tire size, vehicle year, make, model, and quantity needed.',
  },
  {
    title: 'Chamos Tire Co reviews available options.',
    text: 'The request becomes an FBOS action for availability review and follow-up.',
  },
  {
    title: 'Receive availability and pricing information.',
    text: 'The team can respond with current options and next steps. Pricing is not displayed until confirmed.',
  },
  {
    title: 'Coordinate a visit or appointment.',
    text: 'Visits are available Monday through Saturday, by appointment only, at 1005 Goodworth Dr, Unit 105, Apex, NC 27539.',
  },
];

export const serviceAreaChips = [
  'Used tires Apex NC',
  'Used tires Holly Springs NC',
  'Used tires Fuquay-Varina NC',
  'Used tires Cary NC',
  'Used tires Raleigh NC',
];

export const faqItems = [
  {
    question: 'How do I find my tire size?',
    answer: 'Look on the sidewall of your current tire for a size such as 225/65R17. You can also send your vehicle year, make, and model so Chamos Tire Co can review the request.',
  },
  {
    question: 'Can I purchase only one used tire?',
    answer: 'Yes, you can request a single used tire. Availability depends on current inventory and the tire size needed.',
  },
  {
    question: 'Do you sell pairs and full sets?',
    answer: 'You can request pairs or full sets through the form. Chamos Tire Co will confirm whether matching options are available.',
  },
  {
    question: 'Are the tires inspected?',
    answer: 'Tires are visually inspected before being offered for sale. Details about tread depth, brands, and condition should be confirmed during follow-up.',
  },
  {
    question: 'What types of vehicles do you serve?',
    answer: 'The request form supports cars, SUVs, trucks, and work vehicles. Final availability depends on the tire size and current inventory.',
  },
  {
    question: 'How can I check tire availability?',
    answer: 'Use the Find Your Tire form with your tire size, vehicle information, quantity needed, and preferred contact method.',
  },
  {
    question: 'Do I need an appointment?',
    answer: 'Yes. Visits are by appointment only, Monday through Saturday. You can submit a preferred visit date so the team can coordinate next steps.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'The website is prepared for Apex and nearby Triangle communities including Holly Springs, Fuquay-Varina, Cary, and Raleigh.',
  },
];
