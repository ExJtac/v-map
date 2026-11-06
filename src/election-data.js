import { appUrl } from './paths.js';
/** Historical, locally served returns. Missing coverage resolves to null. */
export const OFFICE_LABELS = Object.freeze({
  president: "President",
  senate: "U.S. Senate",
  house: "U.S. House",
  governor: "Governor",
});
const cache = new Map();
async function json(url) {
  if (!cache.has(url))
    cache.set(
      url,
      fetch(appUrl(url))
        .then(async (response) => {
          if (response.status === 404) return null;
          if (!response.ok)
            throw new Error(
              `Election data request failed (${response.status})`,
            );
          return response.json();
        })
        .catch((error) => {
          cache.delete(url);
          throw error;
        }),
    );
  return cache.get(url);
}
export async function loadManifest() {
  const manifest = await json("/data/elections/manifest.json");
  if (!manifest) {
    cache.delete("/data/elections/manifest.json");
    throw new Error("Election manifest is missing.");
  }
  return manifest;
}
export async function loadElection(office, year) {
  const manifest = await loadManifest();
  const entry = manifest?.coverage.find(
    (row) => row.office === office && row.year === Number(year),
  );
  if (!entry) return null;
  const data = await json(entry.url);
  if (!data) {
    cache.delete(entry.url);
    throw new Error("An imported election file is missing.");
  }
  return data;
}
/** No missing/null count participates in winner or margin calculations. */
export function summarizeRace(result) {
  if (!result) return null;
  const groupedCandidateRows = result.candidates.filter((candidate) =>
    /^(OTHER|ALL OTHER CANDIDATES.*|OTHER CANDIDATES)$/i.test(
      candidate.name || "",
    ),
  );
  const candidates = [...result.candidates]
    .filter((candidate) => !groupedCandidateRows.includes(candidate))
    .filter((c) => Number.isFinite(c.votes))
    .sort((a, b) => b.votes - a.votes);
  const aggregateCategories = (
    Array.isArray(result.reportingCategories) ? result.reportingCategories : []
  ).filter((category) =>
    /unitemized|other.*candidates|candidates.*aggregat/i.test(
      category.category || "",
    ),
  );
  const aggregateUnknown = aggregateCategories.some(
    (category) => !Number.isFinite(category.votes),
  );
  const aggregateVotes = [
    ...aggregateCategories,
    ...groupedCandidateRows,
  ].reduce((sum, category) => sum + (category.votes || 0), 0);
  const unknownLeader =
    aggregateUnknown || (aggregateVotes > 0 && aggregateVotes >= (candidates[0]?.votes ?? Infinity));
  const outcomeSuppressed =
    result.suppressElectionWinner || result.winnerEligible === false;
  const winner =
    result.sourceNeedsReview || unknownLeader || outcomeSuppressed || !(candidates[0]?.votes > 0)
      ? null
      : candidates[0] || null;
  const total = result.totalVotes;
  const second = candidates[1];
  return {
    winner,
    party: winner?.party ?? null,
    totalVotes: total,
    margin:
      winner &&
      second &&
      total > 0 &&
      !aggregateUnknown &&
      aggregateVotes <= second.votes
        ? ((winner.votes - second.votes) / total) * 100
        : null,
    share: winner && total > 0 ? (winner.votes / total) * 100 : null,
    incomplete: Boolean(
      result.sourceNeedsReview ||
        unknownLeader ||
        result.incomplete ||
        result.unofficial ||
        result.sourceTotalConflict ||
        result.voteTotalMismatch,
    ),
    sourceNeedsReview: Boolean(result.sourceNeedsReview),
    qualityNeedsReview: Boolean(
      result.sourceNeedsReview ||
        result.incomplete ||
        result.sourceTotalConflict ||
        result.voteTotalMismatch ||
        unknownLeader,
    ),
    outcomeSuppressed: Boolean(outcomeSuppressed),
    unitemizedVotes: aggregateVotes,
    runnerUpUncertain:
      aggregateUnknown || aggregateVotes > (second?.votes ?? Infinity),
    tied: Boolean(winner && second && winner.votes === second.votes),
  };
}
/** Each geographic result is a separate contest; never merge seats/rounds. */
export function selectResults(
  data,
  { geoLevel, stateFips, countyFips, stage, special } = {},
) {
  return (data?.results || []).filter(
    (row) =>
      (!geoLevel || row.geoLevel === geoLevel) &&
      (!stateFips || row.stateFips === String(stateFips).padStart(2, "0")) &&
      (!countyFips || row.countyFips === String(countyFips).padStart(5, "0")) &&
      (!stage || row.stage === stage) &&
      (special === undefined || row.special === special),
  );
}
