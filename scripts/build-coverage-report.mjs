import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTY_SOURCES } from "../src/coverage-sources.js";
import { mergeElectionData } from "../src/county-data.js";
import { summarizeRace } from "../src/election-data.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p)));
const atlas = read("node_modules/us-atlas/counties-albers-10m.json");
const mapFips = new Set(atlas.objects.counties.geometries.map((c) => c.id));
const sourceManifests = COUNTY_SOURCES.filter((s) =>
  fs.existsSync(path.join(root, `public/data/${s.name}/manifest.json`)),
).map((s) => ({ ...s, manifest: read(`public/data/${s.name}/manifest.json`) }));
const rows = [],
  current = [];
let total = 0;
for (const office of ["president", "senate", "house", "governor"])
  for (let year = 2006; year <= 2026; year++) {
    const basePath = `public/data/elections/${office}-${year}.json`,
      base = fs.existsSync(path.join(root, basePath)) ? read(basePath) : null;
    const supplementBundles = [],
      sourceHolds = [];
    for (const source of sourceManifests) {
      sourceHolds.push(
        ...(source.manifest.sourceHolds || []).filter(
          (h) => h.office === office && h.year === year,
        ),
      );
      for (const url of new Set(
        source.manifest.coverage
          .filter((e) => e.office === office && e.year === year)
          .map((e) => e.url),
      ))
        supplementBundles.push({ ...source, url, data: read(`public${url}`) });
    }
    if (!base && !supplementBundles.length) continue;
    const data = mergeElectionData(base, {
      office,
      year,
      supplementBundles,
      sourceHolds,
    });
    const county = data.results.filter((r) => r.geoLevel === "county");
    const countyFips = new Set(county.map((r) => r.countyFips));
    const summary = {
      office,
      year,
      records: data.results.length,
      countyContestRecords: county.length,
      uniqueCounties: countyFips.size,
      mappableCounties: [...countyFips].filter((f) => mapFips.has(f)).length,
      statesWithCountyReturns: new Set(county.map((r) => r.stateFips)).size,
      statesWithReturns: new Set(data.results.map((r) => r.stateFips)).size,
      heldRecords: data.results.filter((r) => r.sourceNeedsReview).length,
      unitemizedRunnerUpRecords: data.results.filter(
        (r) => summarizeRace(r).runnerUpUncertain,
      ).length,
      provisionalRecords: data.results.filter((r) => r.provisional).length,
      unmatchedCountyFips: [...countyFips]
        .filter((f) => !mapFips.has(f))
        .sort(),
      resolvedSourceOverlaps: data.sourceResolutions?.length || 0,
    };
    rows.push(summary);
    total += data.results.length;
    if (year === 2026) {
      const dates = data.results
        .map((r) => r.retrievedAt || r.fetchedAt || r.snapshotAsOf)
        .filter((s) => s && Number.isFinite(Date.parse(s)))
        .sort((a, b) => Date.parse(a) - Date.parse(b));
      current.push({
        office,
        statesWithReturns: summary.statesWithReturns,
        statesWithCountyReturns: summary.statesWithCountyReturns,
        uniqueCounties: summary.uniqueCounties,
        countyContestRecords: summary.countyContestRecords,
        records: summary.records,
        provisionalRecords: summary.provisionalRecords,
        retrievedAt: dates.at(-1) || null,
      });
    }
  }
const report = {
  schemaVersion: 1,
  snapshotDate: "2026-11-07",
  mapCountyGeometries: mapFips.size,
  sourcePriority: COUNTY_SOURCES,
  coverage: rows,
  limits: [
    "Counts describe imported records, not an assertion every election or county is covered.",
    "Alaska reports by election district; no unsupported county allocation is made.",
    "County and district boundaries change over time; 2017 map geometry is a reference.",
    "Unopposed races with no recorded vote totals remain distinct from missing sources.",
    "2026 records are dated provisional snapshots; no certified outcome or race call is inferred.",
  ],
};
fs.writeFileSync(
  path.join(root, "public/data/coverage-audit.json"),
  JSON.stringify(report, null, 2) + "\n",
);
const dates = current
  .map((r) => r.retrievedAt)
  .filter(Boolean)
  .sort((a, b) => Date.parse(a) - Date.parse(b));
fs.writeFileSync(
  path.join(root, "public/data/current-status.json"),
  JSON.stringify(
    {
      schemaVersion: 1,
      electionYear: 2026,
      retrievedAt: dates.at(-1),
      status: "unofficial-snapshot",
      offices: current,
      refreshMode: "local imported snapshot",
      certificationNote:
        "Provisional reported totals; source update times and reporting status are shown with each contest.",
    },
    null,
    2,
  ) + "\n",
);
let md =
  "# V-Map county coverage\n\nSnapshot: November 6, 2026. Counts below are source-backed imported coverage after source reconciliation. They do not assert every historical contest is present.\n\n| Office | Year | States with county returns | Counties on 2017 map | County contest / district portions | Review-held records |\n|---|---:|---:|---:|---:|---:|\n";
for (const r of rows)
  md += `| ${r.office} | ${r.year} | ${r.statesWithCountyReturns} | ${r.mappableCounties} | ${r.countyContestRecords} | ${r.heldRecords} |\n`;
md +=
  "\n" +
  report.limits.map((s) => `- ${s}`).join("\n") +
  "\n\nRaw snapshots are preserved. Runtime overlap resolution is explicit: curated baseline state/district records have priority 95; supplemental priorities appear in `src/coverage-sources.js`. Known baseline defects receive review holds. Higher-priority sources replace a matching geographic contest in the displayed view and retain alternate source references; raw files are unchanged.\n";
fs.writeFileSync(path.join(root, "COVERAGE-REPORT.md"), md);
fs.writeFileSync(path.join(root, "public/COVERAGE-REPORT.md"), md);
for (const name of fs
  .readdirSync(root)
  .filter(
    (name) =>
      name.endsWith("SOURCES.md") || name === "HOUSE-COUNTY-RESEARCH.md",
  ))
  fs.copyFileSync(path.join(root, name), path.join(root, "public", name));
console.log(
  JSON.stringify(
    {
      officeYearCombinations: rows.length,
      resolvedGeographicRecords: total,
      current2026: current,
    },
    null,
    2,
  ),
);
