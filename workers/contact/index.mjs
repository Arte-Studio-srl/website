const CONTACT_PATH = "/api/contact";
const CONTACT_FROM = "website@forms.artestudiosrl.it";
const CONTACT_TO = "progetto@progettoartestudio.it";
const MAX_BODY_BYTES = 12_000;

const ALLOWED_ORIGINS = new Set([
  "https://artestudiosrl.it",
  "https://www.artestudiosrl.it",
]);

const FIELD_LIMITS = {
  name: 200,
  email: 320,
  phone: 40,
  subject: 200,
  message: 5000,
  source: 60,
};

const REQUIRED_FIELDS = ["name", "email", "subject", "message"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin) {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};

  return {
    "access-control-allow-origin": origin,
    vary: "Origin",
  };
}

function json(body, status = 200, origin) {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

function normalizePayload(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  return Object.fromEntries(
    Object.keys(FIELD_LIMITS).map((field) => [
      field,
      typeof value[field] === "string" ? value[field].trim() : "",
    ]),
  );
}

function validatePayload(payload) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!payload[field]) errors.push(`${field} is required`);
  }

  if (payload.email && !EMAIL_PATTERN.test(payload.email)) {
    errors.push("Invalid email");
  }

  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    if (payload[field].length > limit) {
      errors.push(`${field} exceeds ${limit} characters`);
    }
  }

  return errors;
}

function cleanHeaderValue(value) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

const contactWorker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== CONTACT_PATH) {
      return new Response("Not Found", { status: 404 });
    }

    const origin = request.headers.get("origin");

    if (request.method === "OPTIONS") {
      if (!origin || !ALLOWED_ORIGINS.has(origin)) {
        return json({ success: false, error: "Origin not allowed" }, 403);
      }

      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(origin),
          "access-control-allow-headers": "Content-Type",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-max-age": "86400",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "POST" },
      });
    }

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ success: false, error: "Origin not allowed" }, 403);
    }

    const contentType = request.headers.get("content-type") || "";
    const supportedContentType =
      contentType.includes("application/json") ||
      contentType.startsWith("text/plain");

    if (!supportedContentType) {
      return json(
        {
          success: false,
          error: "Content-Type must be application/json or text/plain",
        },
        415,
        origin,
      );
    }

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return json(
        { success: false, error: "Request is too large" },
        413,
        origin,
      );
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return json(
        { success: false, error: "Request is too large" },
        413,
        origin,
      );
    }

    const parsed = await Promise.resolve()
      .then(() => JSON.parse(rawBody))
      .catch(() => null);
    const payload = normalizePayload(parsed);

    if (!payload) {
      return json({ success: false, error: "Invalid JSON" }, 400, origin);
    }

    const validationErrors = validatePayload(payload);
    if (validationErrors.length > 0) {
      return json(
        { success: false, error: validationErrors.join(", ") },
        400,
        origin,
      );
    }

    const clientKey =
      request.headers.get("cf-connecting-ip") || payload.email.toLowerCase();
    const { success: allowed } = await env.RATE_LIMITER.limit({
      key: `contact:${clientKey}`,
    });

    if (!allowed) {
      return json(
        {
          success: false,
          error: "Too many requests. Please try again in a minute.",
        },
        429,
        origin,
      );
    }

    const text = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : "",
      payload.source ? `Source: ${payload.source}` : "",
      "",
      "Message:",
      payload.message,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await env.EMAIL.send({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        replyTo: payload.email,
        subject: `[Website] ${cleanHeaderValue(payload.subject)}`,
        text,
      });
    } catch (error) {
      console.error("[Contact] Cloudflare email send failed", error);
      return json(
        { success: false, error: "Failed to send message" },
        502,
        origin,
      );
    }

    return json({ success: true }, 200, origin);
  },
};

export default contactWorker;
