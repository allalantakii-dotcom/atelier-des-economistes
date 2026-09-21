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

## Live classroom preview

The classroom foundation is available at `/classroom/economie-groupe-a`. It uses LiveKit Cloud for browser audio/video, participant tiles, and raise-hand messages.

LiveKit's current Build plan is $0/month and includes 5,000 WebRTC participant minutes, 100 concurrent connections, and 50 GB of transfer. It is usage-limited, not unlimited. Copy `.env.example` to `.env.local` and add the LiveKit project URL, API key, and secret before joining a room.

Teacher preview: `/classroom/economie-groupe-a?role=teacher&identity=teacher-demo`

The current login page is still a visual placeholder. Before production, connect the token route to Supabase Auth and enforce the `classroom_sessions` one-device lock server-side. Do not expose LiveKit secrets in browser code.

## Important before production
- Replace placeholder payment information with real bank/Cash Plus details.
- Configure Supabase Auth and proper role-based access.
- Hash and expire parent access tokens.
- Move quiz answers/scoring to the server.
- Add rate limiting/CAPTCHA to the public registration endpoint.
- Verify Zoom webhook signatures according to the current Zoom documentation before accepting attendance events.
- Connect n8n/WhatsApp only after choosing a compliant WhatsApp provider.
