# Data and dependency attribution

The MIT license covers V-Map's original application code, importer code, tests, and original documentation. It does not relicense third-party datasets, government source documents, upstream code, or map geometry.

Each normalized election bundle and source manifest retains its source title, URL, version or retrieval date, hash when available, and license information supplied by the publisher. Read the `*-SOURCES.md` guides and `DATA-SOURCES.md` before reusing a dataset. Preserve attribution and the original source's terms. Missing license information is not a grant of CC0 or MIT rights.

- U.S. Census Bureau population estimates and county reference files: retain Census attribution, vintage/reference dates, and the published methodology.
- US Atlas geometry: ISC license, derived from U.S. Census Bureau 2017 cartographic boundaries. See the installed `us-atlas` license and [upstream project](https://github.com/topojson/us-atlas).
- D3 modules and TopoJSON client: retain the licenses distributed with those dependencies. `package-lock.json` pins the versions.
- Heideman county results: CC BY 4.0 for the cited release; retain release attribution, corrections, and upstream source information.
- MEDSL / Harvard Dataverse and other research datasets: follow the license for the specific cited dataset/version rather than assuming a common license across all files.
- FiveThirtyEight Governor archive: the cited repository does not state a standalone data license; V-Map retains original attribution and does not assert CC0 for it.
- State election authority records and current feeds: source-specific terms and limitations apply. An unofficial snapshot is not certification.

Raw downloaded archives are not included in this Git repository. Their original URLs and evidence references remain in source guides and the published source metadata. Report attribution or licensing corrections through a repository issue.


## Candidate portrait assets

The source-linked portrait manifest is `data/candidates/portraits-2026.json` (repository path `public/data/candidates/portraits-2026.json`). Each image retains its source URL, identity-match evidence, attribution, rights basis, original image URL and SHA-256. GPO portraits and licensed Commons photographs keep the rights described in that manifest; the application MIT license does not replace those rights. Commons author and license links appear on each dedicated profile, reachable from the directory's Photo credits link. Downloaded provider-thumbnail bytes are unchanged; older portraits identify a sourced person and do not establish a 2026 election outcome or current office. Unverified/ambiguous photos are not substituted with generated faces.


November7congressional supplements retain publisher URLs, exact source/reader hashes and upstream attribution. They use factual official county returns and independently reviewed derived controls from state election offices, FEC and Census records. Original PDFs, workbooks and reader bodies remain in the ignored research cache; no blanket license for underlying state documents is asserted. Oregon2020original-document mirror provenance and the distinction from a current official-host download are retained. All new2026returns remain provisional; source scope is not count certification.

The November 7 second-pass congressional sources retain California’s original 2022 Statement of Vote workbooks and dated unofficial current feed, Utah’s scanned signed 2022 canvass and current official election/breakdown responses, and the existing registered Georgia/Louisiana vectors with independently reviewed FEC/SOS seat and November-round context. Normalized manifests retain original URLs, hashes, attribution, access format and review pins. Official election facts do not make every publisher document or image public domain. The full derived audit is built and published rather than tracked in new Git revisions; normalized facts and historical snapshots remain preserved.
