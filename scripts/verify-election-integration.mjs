import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mergeElectionData } from "../src/county-data.js";
import { summarizeRace } from "../src/election-data.js";

const read = (path) =>
  JSON.parse(readFileSync(new URL(`../public/data/${path}`, import.meta.url)));
for (const office of ["senate", "house", "governor"]) {
  const base = read(`elections/${office}-2018.json`);
  const extra = read(`county-elections/${office}-2018.json`);
  const merged = mergeElectionData(base, extra);
  assert.equal(
    merged.results.length,
    base.results.length + extra.results.length,
  );
  assert.deepEqual(
    merged.results.filter((r) => r.geoLevel !== "county"),
    base.results,
  );
  for (const row of extra.results) {
    assert.equal(row.geoLevel, "county");
    assert.equal(row.countyFips.slice(0, 2), row.stateFips);
    assert.notEqual(
      row.stateFips,
      "02",
      "Alaska election districts must not become county returns",
    );
    if (office === "house")
      assert.ok(
        /^\d+$/.test(row.district),
        "House county portions need a real district",
      );
    if (row.sourceNeedsReview) {
      const summary = summarizeRace(row);
      assert.equal(summary.winner, null);
      assert.equal(summary.share, null);
      assert.equal(summary.margin, null);
    }
  }
  assert.throws(
    () => mergeElectionData(base, { ...extra, year: 2022 }),
    /same office and year/,
  );
  assert.throws(
    () => mergeElectionData(base, base),
    /Duplicate geographic contest/,
  );
}
const house = read("county-elections/house-2018.json");
const cook = house.results.filter((r) => r.countyFips === "17031");
assert.ok(
  cook.length > 1,
  "A county spanning districts must retain separate district contests",
);
assert.equal(new Set(cook.map((r) => r.contestId)).size, cook.length);
const senate = read("county-elections/senate-2018.json");
const mississippi = senate.results.filter((r) => r.countyFips === "28049");
assert.ok(mississippi.some((r) => r.special && r.stage === "first round"));
assert.ok(mississippi.some((r) => !r.special));
assert.equal(mergeElectionData(null, null), null);
// An advertised-but-missing file is an error; a genuinely unimported year is null.
const originalFetch = globalThis.fetch;
try {
  let missing = true;
  globalThis.fetch = async (url) => {
    if (url.endsWith("/manifest.json"))
      return new Response(
        JSON.stringify({
          coverage: [
            { office: "senate", year: 2018, url: "/missing-county.json" },
            { office: "president", year: 2024, url: "/missing-president.json" },
          ],
        }),
        { status: 200 },
      );
    return missing
      ? new Response("", { status: 404 })
      : new Response(
          JSON.stringify({ office: "senate", year: 2018, results: [] }),
          { status: 200 },
        );
  };
  const countyLoader = await import(
    "../src/county-data.js?missing-source-test"
  );
  const baseLoader = await import(
    "../src/election-data.js?missing-source-test"
  );
  await assert.rejects(
    countyLoader.loadCountySupplement("senate", 2018),
    /file is missing/,
  );
  await assert.rejects(
    baseLoader.loadElection("president", 2024),
    /file is missing/,
  );
  assert.equal(await countyLoader.loadCountySupplement("senate", 2026), null);
  assert.equal(await baseLoader.loadElection("president", 2026), null);
  missing = false;
  assert.equal(
    (await countyLoader.loadCountySupplement("senate", 2018)).year,
    2018,
    "A repaired source file can be retried",
  );
} finally {
  globalThis.fetch = originalFetch;
}
console.log(
  "Passed: county supplements preserve original state/district records, split-county House contests, Senate stages, review holds, geography, and duplicate guards.",
);
