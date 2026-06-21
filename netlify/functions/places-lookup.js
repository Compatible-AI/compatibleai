// Proxies the Compatible AI onboarding Places lookup so the shared secret
// stays server-side (never shipped to the browser). The browser calls
// /.netlify/functions/places-lookup?q=...
//
// Required: set COMPATIBLEAI_SIGNUP_SECRET in Netlify → Site configuration →
// Environment variables. When the custom domain is mapped, update BACKEND.
const BACKEND = "https://compatibleai-305988892128.us-east1.run.app";

export async function handler(event) {
  const q = ((event.queryStringParameters && event.queryStringParameters.q) || "").trim();
  if (!q) {
    return { statusCode: 400, body: JSON.stringify({ error: "missing q" }) };
  }
  const secret = process.env.COMPATIBLEAI_SIGNUP_SECRET || "";
  const url =
    `${BACKEND}/onboarding/places-lookup?q=${encodeURIComponent(q)}&key=${encodeURIComponent(secret)}`;
  try {
    const resp = await fetch(url);
    const body = await resp.text();
    return {
      statusCode: resp.status,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body,
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: "lookup failed" }) };
  }
}
