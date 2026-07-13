import type { LeadRequest, PreferredContactMethod } from '../../types/leads';
import { normalizeEmail, normalizePhone, sanitizeText } from './sanitize';

export interface ValidationResult {
  ok: boolean;
  data?: LeadRequest;
  issues?: Record<string, string>;
}

const CONTACT_METHODS: PreferredContactMethod[] = ['phone', 'text', 'email'];

const required = (value: string): boolean => value.trim().length > 0;

export const validateLeadRequest = (input: Record<string, unknown>): ValidationResult => {
  const tiresNeeded = Number(input.tiresNeeded);
  const preferredContactMethod = sanitizeText(input.preferredContactMethod, 16) as PreferredContactMethod;
  const consentToContact =
    input.consentToContact === true ||
    input.consentToContact === 'true' ||
    input.consentToContact === 'on';

  const data: LeadRequest = {
    customerName: sanitizeText(input.customerName, 120),
    phone: normalizePhone(input.phone),
    email: normalizeEmail(input.email),
    vehicleYear: sanitizeText(input.vehicleYear, 12),
    vehicleMake: sanitizeText(input.vehicleMake, 80),
    vehicleModel: sanitizeText(input.vehicleModel, 80),
    tireSize: sanitizeText(input.tireSize, 40).toUpperCase(),
    tiresNeeded,
    preferredContactMethod,
    preferredVisitDate: sanitizeText(input.preferredVisitDate, 30),
    additionalNotes: sanitizeText(input.additionalNotes, 1200),
    leadSource: sanitizeText(input.leadSource || 'website', 80),
    consentToContact,
    turnstileToken: sanitizeText(input.turnstileToken || input['cf-turnstile-response'], 2048),
  };

  const issues: Record<string, string> = {};

  if (!required(data.customerName)) issues.customerName = 'Customer name is required.';
  if (!required(data.phone)) issues.phone = 'Phone number is required.';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    issues.email = 'Email address is not valid.';
  }
  if (!required(data.vehicleYear)) issues.vehicleYear = 'Vehicle year is required.';
  if (!required(data.vehicleMake)) issues.vehicleMake = 'Vehicle make is required.';
  if (!required(data.vehicleModel)) issues.vehicleModel = 'Vehicle model is required.';
  if (!required(data.tireSize)) issues.tireSize = 'Tire size is required.';
  if (!Number.isInteger(tiresNeeded) || tiresNeeded < 1 || tiresNeeded > 8) {
    issues.tiresNeeded = 'Number of tires must be between 1 and 8.';
  }
  if (!CONTACT_METHODS.includes(data.preferredContactMethod)) {
    issues.preferredContactMethod = 'Preferred contact method is required.';
  }
  if (!data.consentToContact) {
    issues.consentToContact = 'Consent to be contacted is required.';
  }

  return Object.keys(issues).length ? { ok: false, issues } : { ok: true, data };
};
