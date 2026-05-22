# TODO: Fix Vercel 404 on deployment

- [x] Update `vercel.json` routing so SSR/worker handles app routes (remove blanket rewrite to `/index.html`).

- [x] Ensure static assets still resolve correctly.

- [ ] Redeploy to Vercel.
- [ ] Verify routes: `/`, `/settings`, and any other client routes.
- [ ] If still 404, inspect Vercel routing/entry configuration and generated outputs under `dist/server`.

