import { FBOS_STATUSES, type FbosAction, type FbosStatus } from '../../src/types/fbos';

interface Env {
  CHAMOS_TIRES_KV: KVNamespace;
}

type PagesContext = EventContext<Env, string, Record<string, unknown>>;

const CANVAS_STATUSES: FbosStatus[] = ['New', 'Quoted', 'Confirmed', 'In Progress', 'Done'];
const NEXT_STATUS: Partial<Record<FbosStatus, FbosStatus>> = {
  New: 'Quoted',
  Quoted: 'Confirmed',
  Confirmed: 'In Progress',
  'In Progress': 'Done',
};

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });

const isFbosStatus = (value: unknown): value is FbosStatus =>
  FBOS_STATUSES.includes(value as FbosStatus);

const normalizeAction = (action: FbosAction): FbosAction => {
  const legacyStatus = String(action.currentStatus || '');
  const statusMap: Record<string, FbosStatus> = {
    'New Lead': 'New',
    'Availability Review': 'New',
    'Quote Sent': 'Quoted',
    'Appointment Scheduled': 'Confirmed',
    Completed: 'Done',
    'Follow-Up': 'Done',
  };

  const currentStatus = isFbosStatus(action.currentStatus)
    ? action.currentStatus
    : statusMap[legacyStatus] || 'New';

  return {
    ...action,
    currentStatus,
    statusHistory: Array.isArray(action.statusHistory) ? action.statusHistory : [],
  };
};

const parseBody = async (request: Request): Promise<Record<string, unknown> | null> =>
  (await request.json().catch(() => null)) as Record<string, unknown> | null;

const readAllActions = async (kv: KVNamespace): Promise<FbosAction[]> => {
  const actions: FbosAction[] = [];
  let cursor: string | undefined;

  do {
    const result = await kv.list({ prefix: 'action:', cursor });
    await Promise.all(
      result.keys.map(async ({ name }) => {
        const action = await kv.get<FbosAction>(name, 'json');
        if (action) actions.push(normalizeAction(action));
      }),
    );
    cursor = result.list_complete ? undefined : result.cursor;
  } while (cursor);

  return actions.sort((a, b) => {
    const bTime = Date.parse(b.updatedAt || b.createdAt || '');
    const aTime = Date.parse(a.updatedAt || a.createdAt || '');
    return bTime - aTime;
  });
};

const saveAction = async (kv: KVNamespace, action: FbosAction): Promise<void> => {
  await Promise.all([
    kv.put(`action:${action.actionId}`, JSON.stringify(action)),
    kv.put(`index:actions:${action.actionId}`, action.updatedAt),
  ]);
};

export const onRequestGet = async ({ request, env }: PagesContext): Promise<Response> => {
  const kv = env.CHAMOS_TIRES_KV;
  if (!kv) return json({ success: false, error: 'Action storage is not configured.' }, 500);

  const url = new URL(request.url);
  const view = url.searchParams.get('view') || 'canvas';
  const actions = await readAllActions(kv);

  return json({
    success: true,
    actions: view === 'history' ? actions : actions.filter((action) => CANVAS_STATUSES.includes(action.currentStatus)),
  });
};

export const onRequestPatch = async ({ request, env }: PagesContext): Promise<Response> => {
  const kv = env.CHAMOS_TIRES_KV;
  if (!kv) return json({ success: false, error: 'Action storage is not configured.' }, 500);

  const body = await parseBody(request);
  if (!body) return json({ success: false, error: 'Invalid request body.' }, 400);

  const actionId = String(body.actionId || '').trim();
  if (!actionId) return json({ success: false, error: 'Missing actionId.' }, 400);

  const stored = await kv.get<FbosAction>(`action:${actionId}`, 'json');
  if (!stored) return json({ success: false, error: 'Action not found.' }, 404);

  const action = normalizeAction(stored);
  const now = new Date().toISOString();
  const operation = String(body.operation || 'advance');

  if (operation === 'discard') {
    const discardReason = String(body.discardReason || '').trim();
    if (!discardReason) return json({ success: false, error: 'Discard reason is required.' }, 400);

    action.currentStatus = 'Discarded';
    action.discardReason = discardReason;
    action.discardedAt = now;
    action.updatedAt = now;
    action.statusHistory.unshift({
      status: 'Discarded',
      changedAt: now,
      changedBy: 'canvas',
      note: 'Action discarded.',
      discardReason,
    });
    await saveAction(kv, action);
    return json({ success: true, action });
  }

  const requestedStatus = String(body.status || '').trim();
  const nextStatus = requestedStatus && isFbosStatus(requestedStatus)
    ? requestedStatus
    : NEXT_STATUS[action.currentStatus];

  if (!nextStatus || !CANVAS_STATUSES.includes(nextStatus)) {
    return json({ success: false, error: 'Invalid status transition.' }, 400);
  }

  const historyEntry = {
    status: nextStatus,
    changedAt: now,
    changedBy: 'canvas',
    note: String(body.note || '').trim() || undefined,
  };

  if (nextStatus === 'Quoted') {
    const quoteAmount = Number(body.quoteAmount);
    if (!Number.isFinite(quoteAmount) || quoteAmount <= 0) {
      return json({ success: false, error: 'Quote amount is required for Quoted status.' }, 400);
    }
    const quoteCurrency = String(body.quoteCurrency || 'USD').trim() || 'USD';
    action.quote = { amount: quoteAmount, currency: quoteCurrency, quotedAt: now };
    Object.assign(historyEntry, { quoteAmount, quoteCurrency });
  }

  action.currentStatus = nextStatus;
  action.updatedAt = now;
  action.statusHistory.unshift(historyEntry);
  await saveAction(kv, action);

  return json({ success: true, action });
};

export const onRequest = async (): Promise<Response> =>
  json({ success: false, error: 'Method not allowed.' }, 405);
