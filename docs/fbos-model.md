# FBOS Model

Each tire availability request creates a lead and an FBOS action.

## Status flow

1. New Lead
2. Availability Review
3. Quote Sent
4. Appointment Scheduled
5. Completed
6. Follow-Up

## KV keys

- `lead:{leadId}`
- `action:{actionId}`
- `customer:{customerId}`
- `index:leads:{leadId}`
- `config:business`

KV is suitable for this low-volume first version. If Chamos Tire Co needs advanced querying, reporting, deduplication, or multi-user operations, migrate the persistence layer to D1 or another database while keeping the repository interfaces stable.
