import type { FbosAction } from '../../types/fbos';
import type { Lead } from '../../types/leads';

export interface LeadRecord {
  lead: Lead;
  action: FbosAction;
}

export const saveLeadRecord = async (kv: KVNamespace, record: LeadRecord): Promise<void> => {
  await Promise.all([
    kv.put(`lead:${record.lead.leadId}`, JSON.stringify(record.lead)),
    kv.put(`action:${record.action.actionId}`, JSON.stringify(record.action)),
    kv.put(`customer:${record.lead.customerId}`, JSON.stringify({
      customerId: record.lead.customerId,
      name: record.lead.customerName,
      phone: record.lead.phone,
      email: record.lead.email,
      createdAt: record.lead.createdAt,
      updatedAt: record.lead.updatedAt,
    })),
    kv.put(`index:leads:${record.lead.leadId}`, record.lead.createdAt),
  ]);
};
