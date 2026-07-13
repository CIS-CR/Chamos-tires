# Cloudflare Resources

This project must use isolated Cloudflare resources.

## Official resource names

- Pages project: `chamos-tires`
- Worker/API name reserved: `chamos-tires-api`
- KV namespace: `chamos-tires-kv`
- KV binding: `CHAMOS_TIRES_KV`
- Future R2 bucket: `chamos-tires-uploads`
- Future R2 binding: `CHAMOS_TIRES_UPLOADS`

## Commands to create resources

Run only after confirming the active Cloudflare account:

```bash
npx wrangler whoami
npx wrangler pages project list
npx wrangler kv namespace list
npx wrangler kv namespace create chamos-tires-kv
npx wrangler kv namespace create chamos-tires-kv --preview
```

After creating KV namespaces, replace the placeholder IDs in `wrangler.toml`.

## Deployment commands

```bash
npm run build
npx wrangler pages deploy ./dist --project-name=chamos-tires
```

Production deployment requires explicit approval.
