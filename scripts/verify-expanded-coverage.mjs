import assert from "node:assert/strict";
import fs from "node:fs";
import { COUNTY_SOURCES } from "../src/coverage-sources.js";
import {
  contestIdentityKey,
  mergeElectionData,
  resolveElectionSources,
} from "../src/county-data.js";
import { summarizeRace } from "../src/election-data.js";
const read = (p) =>
  JSON.parse(fs.readFileSync(new URL(`../${p}`, import.meta.url)));
const manifests = COUNTY_SOURCES.map((s) => ({
  ...s,
  manifest: read(`public/data/${s.name}/manifest.json`),
}));
const countyLabels = read("src/county-labels.json").labels;
assert.equal(countyLabels["51059"], "Fairfax County");
assert.equal(countyLabels["51600"], "Fairfax city");
let files = 0,
  rows = 0,
  held = 0,
  provisional = 0;
for (const source of manifests)
  for (const url of new Set(source.manifest.coverage.map((e) => e.url))) {
    const data = read(`public${url}`);
    files++;
    for (const r of data.results) {
      rows++;
      assert.ok(data.sources[r.sourceId], `Missing source ${r.sourceId}`);
      assert.ok(["state", "county", "district"].includes(r.geoLevel));
      assert.ok(/^\d{2}$/.test(r.stateFips));
      if (r.geoLevel === "county")
        assert.ok(
          /^\d{5}$/.test(r.countyFips) && r.countyFips.startsWith(r.stateFips),
        );
      if (data.office === "house")
        assert.ok(
          /^\d+$/.test(String(r.district)),
          "House records need a district",
        );
      assert.ok(Array.isArray(r.candidates));
      assert.ok(!r.reportingCategories || Array.isArray(r.reportingCategories));
      for (const c of [...r.candidates, ...(r.reportingCategories || [])])
        assert.ok(
          c.votes === null || (Number.isInteger(c.votes) && c.votes >= 0),
          `Invalid votes ${url}`,
        );
      const summary = summarizeRace(r);
      if (
        r.sourceNeedsReview ||
        r.suppressElectionWinner ||
        r.winnerEligible === false
      ) {
        assert.equal(summary.winner, null);
        assert.equal(summary.margin, null);
        held++;
      }
      if (r.provisional) {
        provisional++;
        assert.equal(r.unofficial, true);
        const sourceInfo=data.sources[r.sourceId];
        const approvedUnknownTime=r.sourceId==='ky-house-current-state-controls'&&r.geoLevel==='district'&&r.stateFips==='21'&&data.office==='house'&&data.year===2026&&r.sourceReviewDate==='2026-11-07'&&r.retrievedAt===null&&r.sourceUpdatedAt===null&&sourceInfo.retrievedAt===null&&sourceInfo.sourceReviewDate===r.sourceReviewDate&&sourceInfo.evidenceSha256==='2b9107869a6bfaf28b009a300b9defeef08570a70f7ba01096f48b4f85385464'&&sourceInfo.sourceFormat==='saved primary web-reader extraction, not downloaded HTML/PDF bytes'&&/Exact control-page request timestamp unavailable/.test(sourceInfo.retrievedAtBasis||'');
        assert.ok(r.sourceUpdatedAt || r.asOf || r.fetchedAt || r.retrievedAt || approvedUnknownTime,'Provisional source must retain a known time or the narrowly approved unknown-time receipt');
      }
    }
  }
const party = (name, party, votes) => ({ name, party, votes });
const unitemized = {
  candidates: [
    party("Leader", "Republican", 100),
    party("Named runner", "Democrat", 80),
  ],
  reportingCategories: [
    { name: "Other candidates", category: "unitemizedCandidates", votes: 90 },
  ],
  totalVotes: 270,
};
assert.equal(summarizeRace(unitemized).winner.name, "Leader");
assert.equal(summarizeRace(unitemized).margin, null);
assert.equal(
  summarizeRace({
    ...unitemized,
    reportingCategories: [{ category: "unitemizedCandidates", votes: 101 }],
  }).winner,
  null,
);
assert.equal(
  summarizeRace({
    ...unitemized,
    candidates: [...unitemized.candidates, party("OTHER", "Other", 90)],
    reportingCategories: [],
  }).margin,
  null,
);
assert.equal(
  summarizeRace({ ...unitemized, winnerEligible: false }).winner,
  null,
);
const parent = {
  geoLevel: "state",
  stateFips: "22",
  stage: "jungle primary",
  special: false,
  contestId: "archive-numeric-id",
};
const county = {
  ...parent,
  geoLevel: "county",
  countyFips: "22001",
  stage: "first round",
  contestId: "canonical-id",
};
assert.equal(
  contestIdentityKey(parent),
  contestIdentityKey(county),
  "Cross-source contest selection must not depend on source IDs",
);
assert.equal(
  contestIdentityKey({
    stateFips: "13",
    stage: "general",
    special: false,
    contestId: "senate-2020-13-state-general-False",
  }),
  contestIdentityKey({
    stateFips: "13",
    stage: "first round",
    special: false,
    contestId: "senate-2020-13-state-first-round",
  }),
  "Georgia's November first round must match across source naming conventions",
);
const base = read("public/data/elections/senate-2016.json");
const resolved = resolveElectionSources(base, {
  office: "senate",
  year: 2016,
  supplementBundles: [],
  sourceHolds: [],
});
assert.equal(
  resolved.results.find((r) => r.stateFips === "22").sourceNeedsReview,
  true,
  "Verified mixed-round state record must stay held",
);
const man = manifests.find((m) => m.name === "presidential-counties");
for (const entry of man.manifest.coverage) {
  const original = read(`public/data/elections/president-${entry.year}.json`),
    extra = read(`public${entry.url}`);
  const merged = mergeElectionData(original, {
    office: "president",
    year: entry.year,
    supplementBundles: [{ ...man, url: entry.url, data: extra }],
    sourceHolds: [],
  });
  const oldMaui = original.results.find(
    (r) => r.countyFips === "15009",
  ).totalVotes;
  assert.equal(
    merged.results.find((r) => r.countyFips === "15009").totalVotes +
      merged.results.find((r) => r.countyFips === "15005").totalVotes,
    oldMaui,
    "Maui and Kalawao correction must be applied together",
  );
}
// Known2026Louisiana House primary rows must not become general-election leaders.
const laSources=manifests.flatMap(source=>source.manifest.coverage.filter(e=>e.office==='house'&&e.year===2026).map(e=>({...source,url:e.url,data:read('public'+e.url)})));
const la=mergeElectionData(null,{office:'house',year:2026,supplementBundles:laSources,sourceHolds:[]}).results.filter(r=>r.stateFips==='22');
assert.ok(la.length>=85);assert.ok(la.every(r=>r.sourceNeedsReview&&summarizeRace(r).winner===null),'Louisiana primary/general source hold must cover county and district records');
console.log(
  JSON.stringify({
    status: "passed",
    supplementFiles: files,
    supplementRows: rows,
    heldOrConditionalRows: held,
    provisionalRows: provisional,
    checks: [
      "schema/counts/source links",
      "held and conditional outcome suppression",
      "unitemized runner-up margins",
      "logical cross-source contest identities",
      "known state defect hold",
      "Maui/Kalawao conservation",
    ],
  }),
);
