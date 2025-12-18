// Supabase Edge Function: send-note-email (SendGrid version)
// Requires env vars:
// SENDGRID_API_KEY=<your_sendgrid_key>
// FROM=<verified_from_address>
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const FROM = Deno.env.get("FROM");

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  headers: HeadersInit = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...headers,
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (!SENDGRID_API_KEY || !FROM) {
    return jsonResponse(500, { error: "Missing SENDGRID_API_KEY or FROM" });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let payload: { to?: string; subject?: string; html?: string };
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  const { to, subject, html } = payload;
  if (!to || !subject || !html) {
    return jsonResponse(400, { error: "Missing to/subject/html" });
  }

  const sgResp = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });

  if (!sgResp.ok) {
    const msg = await sgResp.text();
    return jsonResponse(sgResp.status, {
      error: "SendGrid request failed",
      details: msg,
    });
  }

  return jsonResponse(200, { success: true });
});

