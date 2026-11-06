# Static deployment

Production target: `https://cas-tx.com/vmap/`. V-Map is a static site: it needs no application service, database, credentials, or paid API. Dated source snapshots are shipped as static data; deployments do not automatically refresh election returns.

```sh
npm ci
npm run build:hosted
npm run verify:packaged
```

Serve the resulting `dist/` directory under `/vmap/`. For a domain-root deployment, use `npm run build` instead. Vite's build base and `src/paths.js` keep assets, manifests, county data, population, and participation requests within the app's mount point.

Example Caddy route inside the existing domain block:

```caddyfile
@vmapRoot path /vmap
redir @vmapRoot /vmap/ 308
handle /vmap/data/research-status.json {
    root * /var/www/vmap-status
    rewrite * /research-status.json
    header Cache-Control "no-store"
    file_server
}
handle_path /vmap/* {
    root * /var/www/vmap
    encode zstd gzip
    header Cache-Control "no-cache"
    file_server
}
```

The example has no SPA fallback for missing JSON or assets: a missing source must remain an actual 404 rather than returning HTML. `/vmap/` serves `index.html`. Retain other domain routes when adding this block. Validate the complete Caddy configuration before reloading.

For releases, upload `dist/` to a new release directory, verify it, then atomically switch `/var/www/vmap` to that directory. Keep the previous release path for rollback. Public source-code SHA and deployed file hashes should be recorded with the release. The existing CAS-TX marketing application is deployed separately; its project listing links to this app and the GitHub repository.


The live status receipt is kept separately in `/var/www/vmap-status/research-status.json`, so heartbeat checks do not mutate an immutable release. The existing scoped Caddy include serves it before the static app route. `scripts/research-status.mjs` publishes this receipt using ignored local SSH configuration; it contains timestamps and the verified release SHA, never credentials. Mark a check complete only after actual verification, and pass `--release <sha>` only after deployed hashes match. The status banner becomes delayed after six minutes without a successful receipt. Codex owns the five-minute local research schedule; Caddy only serves the status and files.

Compression is important for the detailed audit JSON. Preserve `encode zstd gzip`, exact 404 behavior and the shared site's other routes. Static SEO pages and `/vmap/sitemap.xml` are generated during the build. Google Analytics uses public measurement ID `G-7K67FPGPPG`; secret API configuration stays local and is excluded from the static build and Git.
