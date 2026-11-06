import { loadManifest } from "./election-data.js";
import { COUNTY_SOURCES } from "./coverage-sources.js";
import { appUrl } from './paths.js';

// This is an inventory of imported returns, not a complete election calendar.
export function yearsForOffice(manifests, office) {
  return [
    ...new Set(
      manifests.flatMap((manifest) =>
        (manifest?.coverage || [])
          .filter(
            (entry) =>
              entry.office === office &&
              Number.isInteger(entry.year) &&
              (entry.rows === undefined || entry.rows > 0) &&
              (entry.contests === undefined || entry.contests > 0),
          )
          .map((entry) => entry.year),
      ),
    ),
  ].sort((a, b) => a - b);
}
export function yearIndex(years, requested) {
  if (!years.length) return -1;
  let index = years.findLastIndex((value) => value <= requested);
  return index < 0 ? 0 : index;
}
export function stepYearIndex(years, index, delta) {
  return years.length
    ? Math.max(0, Math.min(years.length - 1, index + delta))
    : -1;
}
let pending;
export function loadYearCoverage() {
  if (!pending)
    pending = Promise.all([
      loadManifest(),
      ...COUNTY_SOURCES.map(async ({ name }) => {
        const response = await fetch(appUrl(`/data/${name}/manifest.json`));
        if (!response.ok)
          throw new Error(`Coverage request failed (${response.status})`);
        if ((response.headers.get("content-type") || "").includes("text/html"))
          throw new Error("An imported coverage manifest is missing.");
        const manifest = await response.json();
        if (!Array.isArray(manifest?.coverage))
          throw new Error("Invalid election coverage manifest.");
        return manifest;
      }),
    ]).catch((error) => {
      pending = null;
      throw error;
    });
  return pending;
}
