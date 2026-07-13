import type { APIRoute } from 'astro';
import { checkBasicRateLimit } from '../../lib/cloudflare/rateLimit';
import { saveLeadRecord } from '../../lib/cloudflare/kv';
import { verifyTurnstile } from '../../lib/cloudflare/turnstile';
import { createFbosAction } from '../../lib/fbos/action';
import { createActionId, createCustomerId, createLeadId } from '../../lib/fbos/ids';
import { notifyLeadCreated } from '../../lib/email/resend';
import { validateLeadRequest } from '../../lib/validation/leads';
import type { ApiErrorResponse, ApiSuccessResponse, Lead } from '../../types/leads';

export const prerender = false;

const getRuntimeEnv = (locals: App.Locals): Partial<Env> => {
  const runtime = locals as App.Locals & { runtime?: { env?: Env }; env?: Env };
  return runtime.runtime?.env || runtime.env || {};
};

const json = (body: ApiSuccessResponse | ApiErrorResponse, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });

const parseBody = async (request: Request): Promise<Record<string, unknown> | null> => {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await request.json().catch(() => null)) as Record<string, unknown> | null;
  }

  if (contentType.includes('form')) {
    const formData = await request.formData().catch(() => null);
    if (!formData) return null;
    return Object.fromEntries(formData.entries());
  }

  return null;
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getRuntimeEnv(locals);
    const kv = env.CHAMOS_TIRES_KV;
    if (!kv) {
      return json({ success: false, error: 'Lead storage is not configured.' }, 500);
    }

    const clientIp = request.headers.get('cf-connecting-ip') || 'local';
    const isAllowed = await checkBasicRateLimit(kv, clientIp);
    if (!isAllowed) {
      return json({ success: false, error: 'Too many requests. Please try again later.' }, 429);
    }

    const body = await parseBody(request);
    if (!body) {
      return json({ success: false, error: 'Invalid request body.' }, 400);
    }

    const validated = validateLeadRequest(body);
    if (!validated.ok || !validated.data) {
      return json({ success: false, error: 'Please review the required fields.', issues: validated.issues }, 400);
    }

    const turnstile = await verifyTurnstile({
      token: validated.data.turnstileToken,
      secret: env.TURNSTILE_SECRET_KEY,
      remoteIp: clientIp,
    });
    if (!turnstile.ok) {
      return json({ success: false, error: 'Security verification failed.' }, 403);
    }

    const now = new Date().toISOString();
    const lead: Lead = {
      ...validated.data,
      leadId: createLeadId(),
      actionId: createActionId(),
      customerId: createCustomerId(),
      createdAt: now,
      updatedAt: now,
    };

    const action = createFbosAction(lead);
    const emailResult = await notifyLeadCreated(env, lead, action);
    action.emailNotificationStatus = emailResult.status;
    action.emailNotificationError = emailResult.error;

    await saveLeadRecord(kv, { lead, action });

    return json(
      {
        success: true,
        leadId: lead.leadId,
        actionId: action.actionId,
        message: 'Your request was received. Chamos Tire Co will follow up with availability and next steps.',
      },
      201,
    );
  } catch {
    return json({ success: false, error: 'Unable to process the request at this time.' }, 500);
  }
};

export const ALL: APIRoute = async () =>
  json({ success: false, error: 'Method not allowed.' }, 405);
