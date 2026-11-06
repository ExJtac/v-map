# Static deployment

Production target: `https://cas-tx.com/vmap/`. V-Map is a static site: it needs no application service, database, credentials, or paid API. Dated source snapshots are shipped as static data; deployments do not automatically refresh election returns.

```sh
npm ci
npm run verify:packaged
npm run build:hosted
```

Serve the resulting `dist/` directory under `/vmap/`. For a domain-root deployment, use `npm run build` instead. Vite's build base and `src/paths.js` keep assets, manifests, county data, population, and participation requests within the app's mount point.

Example Caddy route inside the existing domain block:

```caddyfile
@vmapRoot path /vmap
redir @vmapRoot /vmap/ 308
handle_path /vmap/* {
    root * /var/www/vmap
    header Cache-Control "no-cache"
    file_server
}
```

The example has no SPA fallback for missing JSON or assets: a missing source must remain an actual 404 rather than returning HTML. `/vmap/` serves `index.html`. Retain other domain routes when adding this block. Validate the complete Caddy configuration before reloading.

For releases, upload `dist/` to a new release directory, verify it, then atomically switch `/var/www/vmap` to that directory. Keep the previous release path for rollback. Public source-code SHA and deployed file hashes should be recorded with the release. The existing CAS-TX marketing application is deployed separately; its project listing links to this app and the GitHub repository.
