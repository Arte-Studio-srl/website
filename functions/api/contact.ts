/// <reference types="@cloudflare/workers-types" />

interface Env {
  RATE_LIMITER: { limit: (input: { key: string }) => Promise<{ success: boolean }> };
  RESEND_API_KEY: string;
  CONTACT_FROM: string;
  CONTACT_TO: string;
}

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = {
  name: 200,
  email: 320,
  phone: 40,
  subject: 200,
  message: 5000,
  source: 60,
} as const;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function validatePayload(body: Partial<ContactPayload>): string[] {
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push('Name is required');
  if (!body.email?.trim()) errors.push('Email is required');
  else if (!EMAIL_REGEX.test(body.email.trim())) errors.push('Invalid email');
  if (!body.subject?.trim()) errors.push('Subject is required');
  if (!body.message?.trim()) errors.push('Message is required');

  for (const [field, max] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
    const value = body[field];
    if (typeof value === 'string' && value.length > max) {
      errors.push(`${field} exceeds ${max} characters`);
    }
  }
  return errors;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ success: false, error: 'Content-Type must be application/json' }, 415);
  }

  const payload = (await request.json().catch(() => null)) as Partial<ContactPayload> | null;
  if (!payload) {
    return json({ success: false, error: 'Invalid JSON' }, 400);
  }

  const email = payload.email?.toLowerCase().trim() || 'anonymous';
  const { success: allowed } = await env.RATE_LIMITER.limit({ key: `contact:${email}` });
  if (!allowed) {
    return json({ success: false, error: 'Too many requests. Please try again in a minute.' }, 429);
  }

  const validationErrors = validatePayload(payload);
  if (validationErrors.length > 0) {
    return json({ success: false, error: validationErrors.join(', ') }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO) {
    return json({ success: false, error: 'Email service is not configured' }, 500);
  }

  const textLines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : '',
    payload.source ? `Source: ${payload.source}` : '',
    '',
    'Message:',
    payload.message ?? '',
  ]
    .filter(Boolean)
    .join('\n');

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO,
      reply_to: payload.email,
      subject: `New contact: ${payload.subject}`,
      text: textLines,
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text().catch(() => '');
    console.error('[Contact] Resend send failed', resendResponse.status, detail);
    return json({ success: false, error: 'Failed to send message' }, 500);
  }

  return json({ success: true });
};
