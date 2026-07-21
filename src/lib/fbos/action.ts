import type { FbosAction } from '../../types/fbos';
import type { Lead } from '../../types/leads';

export const createFbosAction = (lead: Lead): FbosAction => ({
  actionId: lead.actionId,
  leadId: lead.leadId,
  createdAt: lead.createdAt,
  updatedAt: lead.updatedAt,
  customer: {
    customerId: lead.customerId,
    name: lead.customerName,
    phone: lead.phone,
    email: lead.email,
    preferredContactMethod: lead.preferredContactMethod,
    consentToContact: lead.consentToContact,
  },
  vehicle: {
    year: lead.vehicleYear,
    make: lead.vehicleMake,
    model: lead.vehicleModel,
  },
  tireRequirements: {
    tireSize: lead.tireSize,
    tiresNeeded: lead.tiresNeeded,
  },
  leadSource: lead.leadSource,
  currentStatus: 'New',
  statusHistory: [
    {
      status: 'New',
      changedAt: lead.createdAt,
      changedBy: 'website',
      note: 'Lead created from Chamos Tire Co landing page.',
    },
  ],
  notes: lead.additionalNotes ? [lead.additionalNotes] : [],
  emailNotificationStatus: 'pending',
  assignedOwner: undefined,
  preferredAppointmentDate: lead.preferredVisitDate,
});
