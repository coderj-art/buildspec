# BuildSpec Deployment Notes

**Live URL:** https://buildspec-eta.vercel.app
**Target custom domain:** buildspec.jamesmwild.com
**Vercel project:** coderj-arts-projects/buildspec
**GitHub:** https://github.com/coderj-art/buildspec

## Env vars (Vercel Production)

Already set:
- `ANTHROPIC_API_KEY` — pulled from james-2-brain/.env
- `OTP_JWT_SECRET` — auto-generated via `openssl rand -base64 32`
- `NEXT_PUBLIC_SITE_URL=https://buildspec-eta.vercel.app`
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` — auto-provisioned by Upstash Redis Marketplace integration

Still needs to be set (app runs in mock mode without these):
- `RESEND_API_KEY` — for sending verification codes via email (currently: codes log to Vercel logs)
- `RESEND_FROM_EMAIL` — e.g. `BuildSpec <james@jamesmwild.com>`
- `CONVERTKIT_API_KEY` — for Kit subscriber creation + tagging (no 22-day sequence trigger without it)

Set via CLI: `vercel env add RESEND_API_KEY production`

## Custom domain setup (when ready)

1. At your DNS provider for `jamesmwild.com`, add a CNAME record:
   - Name: `buildspec`
   - Type: `CNAME`
   - Value: `cname.vercel-dns.com`
   - TTL: default
2. Then: `cd buildspec && vercel domains add buildspec.jamesmwild.com`
3. Vercel will auto-verify once DNS propagates (usually 5-60 min).

## Kit sequence trigger

In the Kit dashboard:
1. Create tag `buildspec_completed` (or let the app auto-create it on first completion)
2. Create an Automation triggered by that tag
3. The automation starts the 22-day welcome sequence (TODO: sequence emails still to be written)

## Redeploy

Changes pushed to GitHub `main` don't auto-deploy (GitHub integration wasn't linked — that login connection needs to be added via Vercel dashboard).

Manual redeploy: `cd buildspec && vercel deploy --prod --yes`

## Smoke test

```bash
curl -s https://buildspec-eta.vercel.app  # 200
curl -s -X POST https://buildspec-eta.vercel.app/api/send-verification \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com"}'
# {"ok":true,"dev":true}  — dev:true means Resend not configured
```

Once Resend is set, the response will be `{"ok":true}` and the email lands in the inbox.
