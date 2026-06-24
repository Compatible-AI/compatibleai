// Proxies the signup wizard's "create my account" step to the Compatible AI
// backend, keeping the signup secret server-side. POST a JSON body through.
// Requires COMPATIBLEAI_SIGNUP_SECRET in Netlify env.
const BACKEND = "https://compatibleai-305988892128.us-east1.run.app";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "method not allowed" }) };
  }
  const secret = process.env.COMPATIBLEAI_SIGNUP_SECRET || "";
  try {
    const resp = await fetch(`${BACKEND}/onboarding/start?key=${encodeURIComponent(secret)}`, {
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
    return { statusCode: 502, body: JSON.stringify({ error: "onboarding failed" }) };
  }
}
