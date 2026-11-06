# V-Map working instructions

Use the shared RTK policy at `/Users/jamesai/.codex/RTK.md`: summarize routine output with RTK, preserve exact source evidence and machine-readable verification output unfiltered.

The user wants every completed change or repair published after appropriate checks. Do not stop at local implementation or wait for a separate deployment request within the authorized task. Production is `https://cas-tx.com/vmap/`, hosted as a static site on the existing Vultr server. Use the existing deployment and atomic release-pointer process; preserve unrelated sites and production services. See `DEPLOYMENT.md` and the local operations release records.

After every production deployment, immediately notify the user in this chat with the live URL and a short description of the deployed change. Verify the live release before saying it is published. A GitHub source push alone is not a production deployment; distinguish them clearly. Keep this notification even when more research or later repairs remain in progress.

The public repository is `https://github.com/ExJtac/v-map`. Keep it synchronized with shipped source. Never include credentials, local environment files, or large raw research downloads. Raw snapshots remain in ignored `scripts/source-data/`; normalized data retains provenance and upstream licensing.

Never substitute candidate votes for ballots cast or eligible voters. Label reference years, comparison years, incomplete coverage, and provisional results. Preserve all source holds, county/district/seat identities, and original evidence. The supplied Bitcoin QR is a combined BIP21 on-chain address and optional expiring Lightning invoice; preserve its decoded request, replace image/request/expiry together, and do not send a test payment. Keep the on-chain address available after the Lightning option expires.
