export type PreferredContactMethod = 'phone' | 'text' | 'email';

export interface LeadRequest {
  customerName: string;
  phone: string;
  email?: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  tireSize: string;
  tiresNeeded: number;
  preferredContactMethod: PreferredContactMethod;
  preferredVisitDate?: string;
  additionalNotes?: string;
  leadSource: string;
  consentToContact: boolean;
  turnstileToken?: string;
}

export interface Lead extends LeadRequest {
  leadId: string;
  customerId: string;
  actionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccessResponse {
  success: true;
  leadId: string;
  actionId: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  issues?: Record<string, string>;
}
