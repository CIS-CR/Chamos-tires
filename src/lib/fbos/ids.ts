const randomSegment = () => crypto.randomUUID().split('-')[0].toUpperCase();

export const createLeadId = (): string => `CTL-${Date.now()}-${randomSegment()}`;
export const createActionId = (): string => `CTA-${Date.now()}-${randomSegment()}`;
export const createCustomerId = (): string => `CTC-${randomSegment()}`;
