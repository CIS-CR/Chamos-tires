import type { FbosAction } from '../../types/fbos';
import type { Lead } from '../../types/leads';
import { business } from '../../config/business';
import { customerConfirmationEmail, internalNotificationEmail } from './templates';

interface EmailEnv {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_NOTIFICATION_EMAIL?: string;
}

const sendResendEmail = async (
  env: EmailEnv,
  payload: { to: string; subject: string; html: string; text: string; replyTo?: string },
): Promise<void> => {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    throw new Error('Resend is not configured.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
    }),
  });

  if (!response.ok) throw new Error('Resend email request failed.');
};

export const notifyLeadCreated = async (
  env: EmailEnv,
  lead: Lead,
  action: FbosAction,
): Promise<{ status: FbosAction['emailNotificationStatus']; error?: string }> => {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !business.email) {
    return { status: 'skipped' };
  }

  try {
    const internal = internalNotificationEmail(lead, action);
    await sendResendEmail(env, {
      to: business.email,
      ...internal,
      ...(lead.email ? { replyTo: lead.email } : {}),
    });

    if (lead.email) {
      const customer = customerConfirmationEmail(lead);
      await sendResendEmail(env, { to: lead.email, ...customer });
    }

    return { status: 'sent' };
  } catch (error) {
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Email failed.',
    };
  }
};
