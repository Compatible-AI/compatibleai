// Proxies Compatible AI's Places onboarding endpoints, keeping the secret
// server-side. Two modes via query params:
//   ?q=<text>&session=<token>        -> autocomplete predictions
//   ?place_id=<id>&session=<token>   -> full place details
//
// Requires COMPATIBLEAI_SIGNUP_SECRET in Netlify env. Update BACKEND when the
// custom domain is mapped.
const BACKEND = "https://compatibleai-305988892128.us-east1.run.app";

export async function handler(event) {
  const p = event.queryStringParameters || {};
  const secret = process.env.COMPATIBLEAI_SIGNUP_SECRET || "";
  const session = p.session ? `&session=${encodeURIComponent(p.session)}` : "";

  let path;
  if (p.place_id) {
    path = `/onboarding/places-details?place_id=${encodeURIComponent(p.place_id)}${session}`;
  } else {
    const q = (p.q || "").trim();
    if (!q) return { statusCode: 400, body: JSON.stringify({ error: "missing q" }) };
    path = `/onboarding/places-autocomplete?q=${encodeURIComponent(q)}${session}`;
  }
  path += `&key=${encodeURIComponent(secret)}`;

  try {
    const resp = await fetch(BACKEND + path);
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
