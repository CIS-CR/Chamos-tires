import type { Lead } from './leads';

export const FBOS_STATUSES = [
  'New',
  'Quoted',
  'Confirmed',
  'In Progress',
  'Done',
  'Discarded',
] as const;

export type FbosStatus = (typeof FBOS_STATUSES)[number];

export interface FbosStatusHistoryEntry {
  status: FbosStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
  quoteAmount?: number;
  quoteCurrency?: string;
  discardReason?: string;
}

export interface FbosAction {
  actionId: string;
  leadId: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    customerId: string;
    name: string;
    phone: string;
    email?: string;
    preferredContactMethod: Lead['preferredContactMethod'];
    consentToContact: boolean;
  };
  vehicle: {
    year: string;
    make: string;
    model: string;
  };
  tireRequirements: {
    tireSize: string;
    tiresNeeded: number;
  };
  leadSource: string;
  currentStatus: FbosStatus;
  statusHistory: FbosStatusHistoryEntry[];
  quote?: {
    amount: number;
    currency: string;
    quotedAt: string;
  };
  notes: string[];
  discardReason?: string;
  discardedAt?: string;
  emailNotificationStatus: 'pending' | 'sent' | 'skipped' | 'failed';
  emailNotificationError?: string;
  assignedOwner?: string;
  preferredAppointmentDate?: string;
}
