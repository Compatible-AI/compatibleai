# Compatible AI — Vision & Architecture Notes

> Conversation log and strategic planning document.

---

## What Is Compatible AI?

Compatible AI connects independent service businesses to AI assistants (Claude, ChatGPT, Google AI) so customers can discover and book them without leaving the conversation.

**Current state:**
- Marketing site live at `index.html` (deployed via Netlify)
- MCP app widget built — lives locally, not yet in GitHub
- Widget is a custom Claude connector planned for submission to the Anthropic connectors directory
- Widget includes a map displaying mock businesses with Apple Maps-style business cards (name, phone, website, services, etc.)

---

## The Core Product Vision

Compatible AI is **middleware for AI commerce** — the booking rail between AI assistants and the platforms businesses already use.

```
Claude / ChatGPT / Google AI
         ↓
  Compatible AI MCP Server   ← the connector hub
         ↓
  [Jobber] [HCP] [Mindbody] [OpenTable] [Toast] ...
         ↓
    Merchant calendar / menu / inventory
```

The business card in the widget is the UI surface. The real product is the connector layer underneath.

---

## Three Core Questions Answered

### 1. Can we pull live merchant account info into the business card?

**Yes.** Once a business completes OAuth during onboarding and connects their booking platform, the MCP server holds their access token. The card can then display live data:

- Business name, photo, description, phone, website
- Real services and pricing from their platform
- Live availability (not mocked)
- A "Book Now" action that triggers an actual booking call

### 2. Can we build our own connector hub?

**Yes — this is the core value of Compatible AI.**

Think Plaid (for banking) or Stripe (for payments) but for AI booking. The flow:

1. Business signs up on the marketing site
2. They select their booking platform (Jobber, HCP, Mindbody, ServiceTitan, OpenTable, Toast, etc.)
3. OAuth connects their account — one-time sign-in
4. Compatible AI stores the token and maintains the connection
5. The MCP server exposes all platforms through a single normalized interface
6. Claude (and eventually ChatGPT / Google AI) books through Compatible AI regardless of the underlying platform

### 3. Can we branch beyond services (restaurants, etc.)?

**Yes.** UCP and ACP are both designed to be generic. The same connector hub pattern applies to restaurants (OpenTable, Resy, Toast), healthcare, retail, and more.

---

## Protocols — What's Live vs. Coming

| Layer | Protocol | Status | Ship Today? |
|---|---|---|---|
| Claude booking | MCP | Live | Yes |
| Anthropic connectors directory | MCP | Live | Yes |
| Booking platform APIs (Jobber, HCP, etc.) | REST/OAuth | Live | Yes |
| ChatGPT booking | ACP (OpenAI + Stripe) | Beta | No |
| Broad AI interoperability | UCP (community) | Spec only | Build toward it |

### ACP — Agentic Commerce Protocol
- Maintained by **OpenAI + Stripe**
- Defines: Checkout API, delegate payment flows, capability negotiation, cart/feed/order management, MCP integration
- ChatGPT doesn't yet let arbitrary third parties plug in — implement the schema now, ship when it opens

### UCP — Universal Commerce Protocol
- Community open standard
- Transport-agnostic: works over MCP, REST, A2A
- Defines: Checkout, Identity Linking, Order webhooks, Payment Token Exchange
- Not a network — it's a schema. Value grows as more platforms adopt it.

**Strategic play:** Implement both. ACP schemas for ChatGPT/Stripe payment flows. UCP for open-standard interoperability. MCP transport for Claude today.

---

## The Onboarding Connection

Onboarding is the linchpin. The marketing site captures the lead — onboarding activates them.

Flow:
1. Business fills out the waitlist form on the marketing site
2. They select their booking platform
3. OAuth flow — they sign in once
4. They go live in the Compatible AI network
5. Their business appears in the widget map with a live card

This is what makes the connector hub real. Without onboarding, it's just a spec.

---

## Repo Structure (Planned)

```
compatibleai/
├── index.html              # Marketing site (current)
├── netlify.toml            # Netlify config (current)
├── VISION.md               # This file
├── widget/                 # MCP app widget (to be pushed from local)
│   └── ...
├── server/                 # MCP server (to be built)
│   └── ...
└── onboarding/             # OAuth onboarding flows (to be built)
    └── ...
```

---

## Build Sequence

### Phase 1 — Foundation (now)
- [ ] Push MCP widget code from local machine to GitHub
- [ ] Structure repo: `/widget`, `/server`, `/onboarding`
- [ ] Branch off widget for UCP/ACP work

### Phase 2 — MCP Server
- [ ] Scaffold MCP server
- [ ] Wire first booking platform API (Jobber recommended — fastest onboarding)
- [ ] Connect live merchant data to widget business card
- [ ] Submit to Anthropic connectors directory

### Phase 3 — Onboarding
- [ ] OAuth flow for booking platforms on marketing site
- [ ] Business selects platform → authenticates → goes live
- [ ] Token storage and connection management

### Phase 4 — Protocol Expansion
- [ ] Implement ACP schemas (ready for ChatGPT when it opens)
- [ ] Implement UCP capability profiles
- [ ] Expand verticals: restaurants, healthcare, fitness, etc.

---

## Tech Stack Notes

- **Marketing site**: Plain HTML/CSS, deployed on Netlify
- **MCP widget**: Exists locally — stack TBD once pushed
- **MCP server**: To be built — Node.js or Python most common for MCP servers
- **Hosting**: Netlify for marketing; server will need a persistent host (Railway, Render, Fly.io, etc.)

---

## Branch Strategy

- `main` — marketing site (current)
- `widget/mcp-app` — widget code once pushed from local
- `claude/ucp-github-implementation-ibyrgx` — active development branch

---

*Last updated: 2026-06-20*
