import { COUNTY_SOURCES } from "./coverage-sources.js";
import { SOURCE_HOLDS } from "./source-holds.js";
import { appUrl } from './paths.js';
const cache = new Map();
async function read(url, optional = false) {
  if (!cache.has(url))
    cache.set(
      url,
      fetch(appUrl(url))
        .then(async (response) => {
          if (response.status === 404) {
            if (optional) return null;
            throw new Error(`An imported election file is missing: ${url}`);
          }
          if (!response.ok)
            throw new Error(`County election data failed (${response.status})`);
          if (
            optional &&
            (response.headers.get("content-type") || "").includes("text/html")
          )
            return null;
          return response.json();
        })
        .catch((error) => {
          cache.delete(url);
          throw error;
        }),
    );
  const data = await cache.get(url);
  if (data === null) cache.delete(url);
  return data;
}
export async function loadSupplementManifests() {
  return Promise.all(
    COUNTY_SOURCES.map(async (source) => ({
      ...source,
      manifest: await read(`/data/${source.name}/manifest.json`),
    })),
  );
}
export async function loadCountySupplement(office, year) {
  const manifests = await loadSupplementManifests();
  const bundles = [],
    holds = [];
  await Promise.all(
    manifests.map(async (source) => {
      if (!source.manifest) return;
      const entries = source.manifest.coverage.filter(
        (row) => row.office === office && row.year === Number(year),
      );
      holds.push(
        ...(source.manifest.sourceHolds || []).filter(
          (hold) => hold.office === office && hold.year === Number(year),
        ),
      );
      for (const url of new Set(entries.map((entry) => entry.url))) {
        const data = await read(url);
        if (!data)
          throw new Error("An imported county election file is missing.");
        if (data.office !== office || data.year !== Number(year))
          throw new Error("Imported file has the wrong office or year.");
        bundles.push({
          name: source.name,
          priority: source.priority,
          url,
          data,
        });
      }
    }),
  );
  if (!bundles.length && !holds.length) return null;
  return {
    office,
    year: Number(year),
    supplementBundles: bundles,
    sourceHolds: holds,
  };
}
export function normalizedStage(stage) {
  const value = String(stage || "general")
    .toLowerCase()
    .trim();
  if (["gen", "g", "general election"].includes(value)) return "general";
  if (["jungle primary", "first-round", "first round", "pre"].includes(value))
    return "first round";
  if (["gen runoff", "general runoff"].includes(value)) return "runoff";
  return value;
}
export function geographicContestKey(row) {
  return [row.geoLevel, row.countyFips || "", contestIdentityKey(row)].join(
    "|",
  );
}
export function contestIdentityKey(row) {
  const parts = String(row.contestId || "").split("-");
  const office = row.office || parts[0],
    year = Number(row.year || parts[1]);
  let stage = normalizedStage(row.stage);
  // MEDSL labels Georgia's November ballots general; county sources distinguish
  // the first round from the later runoff. Keep the raw stage in source records.
  if (
    office === "senate" &&
    row.stateFips === "13" &&
    [2020, 2022].includes(year) &&
    stage === "general"
  )
    stage = "first round";
  return [
    row.stateFips,
    row.district == null ? "" : String(Number(row.district)),
    stage,
    Boolean(row.special),
    row.contestType || "candidate",
    row.seatId || "",
  ].join("|");
}
export function resolveElectionSources(base, compound) {
  const office = base?.office || compound.office,
    year = base?.year || compound.year;
  const selected = new Map(),
    sources = {},
    resolutions = [];
  const bundles = [
    ...(base
      ? [
          {
            name: "base",
            priority: 10,
            url: `/data/elections/${office}-${year}.json`,
            data: base,
          },
        ]
      : []),
    ...compound.supplementBundles,
  ].sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
  for (const bundle of bundles) {
    if (bundle.data.office !== office || bundle.data.year !== year)
      throw new Error(
        "Election sources do not describe the same office and year.",
      );
    Object.assign(sources, bundle.data.sources);
    const bundleKeys = new Set();
    for (const raw of bundle.data.results) {
      const key = geographicContestKey(raw);
      if (bundleKeys.has(key))
        throw new Error(
          `Source contains ambiguous duplicate contests: ${bundle.name} ${key}`,
        );
      bundleKeys.add(key);
      const priority =
        bundle.name === "base" && raw.geoLevel !== "county"
          ? 95
          : bundle.priority;
      const previous = selected.get(key);
      const selection = { bundle: bundle.name, url: bundle.url, priority };
      const row = { ...raw, sourceSelection: selection };
      if (previous) {
        const preferNew = priority > previous.sourceSelection.priority;
        const retained = preferNew ? row : previous,
          alternate = preferNew ? previous : row;
        retained.alternateSources = [
          ...(retained.alternateSources || []),
          ...(alternate.alternateSources || []),
          {
            sourceId: alternate.sourceId,
            contestId: alternate.contestId,
            ...alternate.sourceSelection,
          },
        ];
        selected.set(key, retained);
        resolutions.push({
          key,
          selected: retained.sourceId,
          alternate: alternate.sourceId,
        });
      } else selected.set(key, row);
    }
  }
  const results = [...selected.values()].map((row) => {
    const holds = [
      ...(compound.sourceHolds || []),
      ...SOURCE_HOLDS.filter(
        (hold) => hold.office === office && hold.year === year,
      ),
    ].filter(
      (hold) =>
        row.geoLevel === (hold.geoLevel || "state") &&
        row.stateFips === hold.stateFips &&
        (!hold.contestId || row.contestId === hold.contestId),
    );
    if (!holds.length) return row;
    return {
      ...row,
      sourceNeedsReview: true,
      reviewReasons: [
        ...(row.reviewReasons || []),
        ...holds.map((hold) => hold.reason),
      ],
      sourceHolds: holds,
    };
  });
  return {
    schemaVersion: 1,
    office,
    year,
    snapshotDate:
      base?.snapshotDate ||
      bundles.find((b) => b.data.snapshotDate)?.data.snapshotDate,
    sources,
    results,
    sourceResolutions: resolutions,
  };
}
export function mergeElectionData(base, extra) {
  if (!extra) return base;
  if (extra.supplementBundles) return resolveElectionSources(base, extra);
  if (!base) return extra;
  if (base.office !== extra.office || base.year !== extra.year)
    throw new Error(
      "Election sources do not describe the same office and year.",
    );
  const keys = new Set();
  const results = [...base.results, ...extra.results].filter((row) => {
    const key = [
      row.geoLevel,
      row.stateFips,
      row.countyFips || "",
      row.district || "",
      row.contestId,
    ].join("|");
    if (keys.has(key))
      throw new Error("Duplicate geographic contest in election sources.");
    keys.add(key);
    return true;
  });
  return { ...base, sources: { ...base.sources, ...extra.sources }, results };
}
