// Proxies the wizard's plan step to the Compatible AI backend's mock billing
// confirm (grants the no-card free trial). Stripe replaces the backend side
// later; this proxy stays the same. Requires COMPATIBLEAI_SIGNUP_SECRET.
const BACKEND = "https://compatibleai-305988892128.us-east1.run.app";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "method not allowed" }) };
  }
  const secret = process.env.COMPATIBLEAI_SIGNUP_SECRET || "";
  try {
    const resp = await fetch(`${BACKEND}/billing/confirm?key=${encodeURIComponent(secret)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: event.body || "{}",
    });
    const body = await resp.text();
    return {
      statusCode: resp.status,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body,
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: "billing failed" }) };
  }
}
