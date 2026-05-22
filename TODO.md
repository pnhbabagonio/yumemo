# TODO: Fix Vercel 404 on deployment

- [x] Update routing so SSR handles app routes by integrating the dynamic `nitro` plugin in `vite.config.ts` (configured with `cloudflare: false`).
- [x] Ensure static assets still resolve correctly (now handled automatically by Nitro under `.vercel/output/static`).
- [x] Delete conflicting static-only `vercel.json` that was forcing Vercel to bypass SSR and serve a non-existent static index.html.
- [ ] Redeploy to Vercel.
- [ ] Verify routes: `/`, `/settings`, and any other client routes.

### 404 Resolution Details:
1. **Disabled Cloudflare override**: Configured `cloudflare: false` in `vite.config.ts` to prevent the build process from compile-targeting Wrangler/Cloudflare.
2. **Added Nitro integration**: Installed the standard `nitro` package and configured the `nitro()` plugin in `vite.config.ts` using dynamic imports to avoid circular dependency import errors.
3. **Removed vercel.json**: Deleted the root-level `vercel.json` which was hardcoding `"outputDirectory": "dist/client"` and routing requests to a missing `index.html`. Now, Vercel will auto-detect the `.vercel/output` directory compiled by Nitro and deploy the serverless rendering functions and static assets natively.

