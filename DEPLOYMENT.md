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


## Dedicated V-Map domain

The primary V-Map hostname is `https://voteranomaly.com/`. Build its root-mounted variant with `npm run build:domain`; output is `dist-domain/`. The dedicated build rewrites only generated HTML canonical/navigation metadata, the sitemap and llms navigation to the new origin, adds a root robots.txt, and retains Google Analytics. It does not change `dist/` or the CAS-TX route. For a layout-only release with already-verified generated source data, `node scripts/build-domain.mjs` builds and checks the same variant without reimporting data.

Upload the dedicated artifact into a new `/home/deploy/voteranomaly-releases/<release>` directory, verify every file hash, copy into `/var/www/voteranomaly-releases/<release>`, and atomically update `/var/www/voteranomaly`. The existing `/var/www/vmap` pointer belongs to the CAS-TX-mounted variant and must not be used for the root build. Both variants must come from the same source revision when publishing app or research updates. Verify both public hosts after every subsequent release.

`deploy/voteranomaly.caddy` defines only the apex and www hostnames, with automatic HTTPS and www-to-apex redirection. Import it once at top level in `/etc/caddy/Caddyfile`, outside all existing site blocks. Append the import after asserting the exact current config; preserve every existing byte and validate the combined config before a graceful Caddy reload. The live research-status receipt is shared via its exact endpoint. Existing CAS-TX and Bidlark DNS, hostname blocks, site roots, services, database and mail records remain untouched.

Namecheap BasicDNS records for voteranomaly.com: A `@` → `64.177.126.42`; CNAME `www` → `voteranomaly.com.`. Replace only conflicting parking/redirect records at those two hosts. Preserve all MX, SPF, mail and verification records. No Vultr nameserver transfer or additional server is required. Public HTTPS depends on the authoritative records pointing to Vultr and certificate issuance succeeding.


## Publish every future map/research update

Use `node scripts/deploy-release.mjs` from a clean, committed checkout. The helper builds hosted and root variants from one revision, runs packaged validation, checks every packaged data hash agrees between variants, uploads to separate new release directories, verifies complete remote trees, and promotes both pointers under a remote publication lock. Durable local and remote receipts record the previous pointers before public checks. It verifies the public index, generated sitemap, logo preview and JavaScript/CSS on both origins. It never restarts shared services or edits Caddy. If public verification fails after promotion, the helper attempts to restore both previous pointers under the same lock, but refuses to overwrite a newer deployment if either pointer changed. Inspect the recovery receipt and active state before retrying; do not overwrite an immutable release directory.

Only after the deployment output and live checks succeed, notify James and run `node scripts/research-status.mjs complete --publish --release <sha>` for a release that also completed an actual research verification. For a UI-only release, update only publication fields and preserve the last research-check timestamp. The saved five-minute automation prompt targets voteranomaly.com and this same helper. James requested manual updates only on November 6; leave the automation PAUSED until he explicitly changes that instruction.
