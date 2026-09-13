# L’Atelier des Économistes

Production-oriented Next.js starter for a Moroccan EdTech academy.

## Stack
- Next.js 14 / App Router
- TypeScript
- Tailwind CSS
- Supabase
- Optional n8n webhook
- Zoom-ready architecture

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Free hosting
Recommended MVP:
1. Push this repository to GitHub.
2. Deploy the Next.js app to Vercel Hobby.
3. Create a Supabase Free project and run `supabase/schema.sql`.
4. Add environment variables in Vercel.
5. Add a custom domain later if desired.

The platform itself can start at $0/month, excluding optional domain, WhatsApp provider fees, Zoom paid features, and payment-provider fees.

## Important before production
- Replace placeholder payment information with real bank/Cash Plus details.
- Configure Supabase Auth and proper role-based access.
- Hash and expire parent access tokens.
- Move quiz answers/scoring to the server.
- Add rate limiting/CAPTCHA to the public registration endpoint.
- Verify Zoom webhook signatures according to the current Zoom documentation before accepting attendance events.
- Connect n8n/WhatsApp only after choosing a compliant WhatsApp provider.
