# Contributing to V-Map

The full `public/data/anomalies-2026.json` is generated and ignored; normalized sources, source qualifications and the expected SHA in `public/data/research-progress-2026.json` remain tracked. npm dev and verification commands generate the audit only if missing. After changing inputs, run `npm run coverage`, inspect generated report/progress/SEO changes and commit them with the source changes. Verification checks an existing artifact without silently replacing it. A build must reproduce the committed progress hash and leave tracked files unchanged. The complete current audit remains downloadable from [the live site](https://voteranomaly.com/data/anomalies-2026.json).

V-Map welcomes code improvements, accessibility fixes, and carefully sourced election-data corrections. Open an issue or submit a pull request at [ExJtac/v-map](https://github.com/ExJtac/v-map).

Use Node.js 22 or newer and Python 3. Clone the repository, run `npm ci`, then `npm run dev`. The included normalized data is enough to run the site without API keys. Run `npm run verify:packaged` and `npm run build:hosted` before submitting a change. The hosted build targets `/vmap/`; ordinary `npm run build` targets the domain root.

For data changes:

1. Cite the election authority or a documented research dataset, with its exact URL, election date, office, geography, stage, and special-election status.
2. Preserve the source retrieval time, any source update time, original party labels, and a SHA-256 hash. Describe the transformation and source license.
3. Reconcile candidate counts to an independent source control. Use exact FIPS or explicit official geographic identifiers. House county records must retain district portions.
4. Keep missing counts as missing. Do not invent zeros, allocate district totals to counties, combine concurrent Senate seats, or treat precinct reporting as ballot completion.
5. Preserve review flags and distinguish unofficial returns from certified results. Keep candidate votes, reporting categories, and ballots cast separate.
6. Add a focused regression check for a substantive correction and update the relevant source guide and coverage report.

Large original research downloads are kept outside Git in ignored `scripts/source-data/`. Published manifests and source guides retain provenance, URLs, and hashes. Full source replays (`npm run verify:data` and import scripts) require those original snapshots; they are separate from the packaged-data checks used by CI. Follow the relevant importer and source guide when obtaining source files. Do not commit credentials, local environment files, or unrelated project data.

Code contributions use the MIT license. Third-party election data, Census data, and map geometry retain their own source terms and attribution; see [DATA-LICENSES.md](DATA-LICENSES.md). A pull request does not make an election result official.
