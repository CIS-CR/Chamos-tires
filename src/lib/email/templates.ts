import type { FbosAction } from '../../types/fbos';
import type { Lead } from '../../types/leads';

export const customerConfirmationEmail = (lead: Lead): { subject: string; html: string; text: string } => {
  const vehicle = `${lead.vehicleYear} ${lead.vehicleMake} ${lead.vehicleModel}`;
  return {
    subject: 'We received your tire availability request',
    text: `Hi ${lead.customerName}, we received your request for ${lead.tiresNeeded} tire(s), size ${lead.tireSize}, for ${vehicle}. Chamos Tire Co will verify availability and respond with pricing and next steps.`,
    html: `<p>Hi ${lead.customerName},</p><p>We received your request for <strong>${lead.tiresNeeded} tire(s)</strong>, size <strong>${lead.tireSize}</strong>, for <strong>${vehicle}</strong>.</p><p>Chamos Tire Co will verify availability and respond with pricing and next steps.</p>`,
  };
};

export const internalNotificationEmail = (lead: Lead, action: FbosAction): { subject: string; html: string; text: string } => {
  const lines = [
    `Lead ID: ${lead.leadId}`,
    `Action ID: ${action.actionId}`,
    `Name: ${lead.customerName}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || '-'}`,
    `Vehicle: ${lead.vehicleYear} ${lead.vehicleMake} ${lead.vehicleModel}`,
    `Tire size: ${lead.tireSize}`,
    `Quantity: ${lead.tiresNeeded}`,
    `Preferred date: ${lead.preferredVisitDate || '-'}`,
    `Lead source: ${lead.leadSource}`,
    `Notes: ${lead.additionalNotes || '-'}`,
  ];
  return {
    subject: `New tire availability request: ${lead.tireSize}`,
    text: lines.join('\n'),
    html: `<ul>${lines.map((line) => `<li>${line}</li>`).join('')}</ul>`,
  };
};
