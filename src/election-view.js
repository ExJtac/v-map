import { appUrl } from './paths.js';
import { countingStatus, countingColor } from './counting-status.js';
import {
  loadElection,
  loadManifest,
  OFFICE_LABELS,
  summarizeRace,
} from "./election-data.js";
import {
  loadCountySupplement,
  mergeElectionData,
  contestIdentityKey,
} from "./county-data.js";
import {
  loadYearCoverage,
  yearsForOffice,
  yearIndex,
  stepYearIndex,
} from "./election-years.js";

const $ = (selector) => document.querySelector(selector);
const number = new Intl.NumberFormat("en-US");
const colors = {
  Democrat: "#729cce",
  Republican: "#d98a83",
  Other: "#a496b7",
  missing: "#dce3de",
};
const partyClass = (party) =>
  party === "Democrat"
    ? "democrat"
    : party === "Republican"
      ? "republican"
      : "other";
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

export function createElectionView({ onChange }) {
  let office = $("#election-office").value;
  let year = 2026;
  let years = [],
    yearOffice = "";
  let data = null,
    manifest = null,
    loading = false,
    error = "",
    supplementWarning = false,
    request = 0;
  let selection = { state: null, county: null };
  let contest = "";
  let stateIndex = new Map(),
    countyIndex = new Map();

  function indexData() {
    stateIndex = new Map();
    countyIndex = new Map();
    for (const row of data?.results || []) {
      const index =
        row.geoLevel === "state"
          ? stateIndex
          : row.geoLevel === "county"
            ? countyIndex
            : null;
      if (!index) continue;
      const key = row.geoLevel === "county" ? row.countyFips : row.stateFips;
      if (!index.has(key)) index.set(key, []);
      index.get(key).push(row);
    }
  }
  function matchingRows(level, id) {
    let rows = (level === "county" ? countyIndex : stateIndex).get(id) || [];
    if (
      contest &&
      selection.state?.id === (level === "county" ? id.slice(0, 2) : id)
    ) {
      const selected = locationRows().find((row) => row.contestId === contest);
      rows = selected
        ? rows.filter(
            (row) => contestIdentityKey(row) === contestIdentityKey(selected),
          )
        : [];
    }
    return rows;
  }
  function leadingParty(level, id) {
    const races = matchingRows(level, id);
    if (!races.length) return null;
    if (races.length > 1) return null;
    const summaries = races.map(summarizeRace);
    // Quality flags and ties stay neutral; no incomplete result is asserted as a winner.
    if (
      summaries.some(
        (s, index) =>
          s.qualityNeedsReview ||
          (s.incomplete && !races[index].provisional) ||
          !s.winner ||
          !s.totalVotes,
      )
    )
      return null;
    if (summaries.some((s) => s.tied)) return "Other";
    const parties = new Set(summaries.map((s) => s.party));
    return parties.size === 1 ? summaries[0].party : "Other";
  }
  function refresh() {
    render();
    onChange();
  }
  function updateYearControl() {
    const slider = $("#election-year");
    const index = yearIndex(years, year);
    slider.min = 0;
    slider.max = Math.max(0, years.length - 1);
    slider.value = Math.max(0, index);
    slider.disabled = !years.length || office === "geography";
    slider.setAttribute(
      "aria-valuetext",
      years.length ? String(year) : "No imported years",
    );
    $("#year-output").value = years.length ? year : "—";
    $(".year-help").textContent = office === "president"
      ? "Presidential election years · 2026 results: Senate, House or Governor"
      : "Years with imported returns";
    $("#previous-year").disabled = index <= 0 || office === "geography";
    $("#next-year").disabled =
      index < 0 || index >= years.length - 1 || office === "geography";
    const ticks = $("#year-ticks");
    ticks.replaceChildren();
    // Evenly spaced indexes match the range positions, including irregular year gaps.
    const indices = new Set();
    for (let i = 0; i < Math.min(6, years.length); i++)
      indices.add(
        Math.round(
          (i * (years.length - 1)) / Math.max(1, Math.min(6, years.length) - 1),
        ),
      );
    for (const i of indices) {
      const tick = el("span", "", String(years[i]));
      tick.style.left = `${years.length > 1 ? (100 * i) / (years.length - 1) : 0}%`;
      ticks.append(tick);
    }
  }
  async function changeElection() {
    const token = ++request;
    office = $("#election-office").value;
    data = null;
    error = "";
    supplementWarning = false;
    contest = "";
    loading = office !== "geography";
    indexData();
    if (!loading) {
      updateYearControl();
      refresh();
      return;
    }
    refresh();
    try {
      const manifests = await loadYearCoverage();
      if (token !== request) return;
      if (yearOffice !== office) {
        years = yearsForOffice(manifests, office);
        yearOffice = office;
        const index = yearIndex(years, year);
        if (index >= 0) year = years[index];
      }
      updateYearControl();
      if (!years.length) return;
      const [nextManifest, base, extra] = await Promise.all([
        loadManifest(),
        loadElection(office, year),
        loadCountySupplement(office, year),
      ]);
      if (token !== request) return;
      manifest = nextManifest;
      data = mergeElectionData(base, extra);
      indexData();
    } catch (cause) {
      if (token !== request) return;
      error =
        "Election data could not load. Change the year or office to retry.";
    } finally {
      if (token === request) {
        loading = false;
        refresh();
      }
    }
  }
  function locationRows() {
    if (selection.county)
      return (data?.results || []).filter(
        (row) =>
          row.geoLevel === "county" && row.countyFips === selection.county.id,
      );
    if (selection.state)
      return (data?.results || []).filter(
        (row) =>
          row.stateFips === selection.state.id &&
          row.geoLevel === (office === "house" ? "district" : "state"),
      );
    return [];
  }
  function contestName(row) {
    const parts = [
      row.contestType === "recall-question"
        ? "Recall question · Yes / No"
        : row.contestType === "replacement-election"
          ? "Conditional replacement vote"
          : office === "house"
            ? ["0", "00"].includes(row.district)
              ? "At-large district"
              : `District ${row.district}`
            : OFFICE_LABELS[office],
    ];
    if (office === "house" && row.geoLevel === "county")
      parts.push("County portion");
    if (row.special) parts.push("Special election");
    parts.push(
      row.stage === "runoff"
        ? "Runoff"
        : row.stage === "gen" || row.stage === "general"
          ? "General election"
          : row.stage || "Election",
    );
    return parts.join(" · ");
  }
  function addEmpty(title, text) {
    const box = el("div", "results-empty");
    box.append(el("h3", "", title), el("p", "", text));
    $("#race-grid").append(box);
  }
  function renderRace(row) {
    const card = el("article", "race-card");
    card.append(el("h3", "", contestName(row)));
    const summary = summarizeRace(row);
    if (row.provisional || row.unofficial) {
      card.append(
        el("span", "result-status provisional", "Unofficial reported returns"),
      );
    } else if (
      row.electionStatus === "certified" ||
      row.resultStatus === "certified" ||
      row.certified === true
    ) {
      card.append(
        el("span", "result-status", "Source labels report certified"),
      );
    }
    const sourceTime = row.sourceUpdatedAt || row.asOf;
    if (sourceTime)
      card.append(el("p", "source-update", `Source update: ${sourceTime}`));
    if (row.precinctsReporting != null && row.precinctsTotal != null)
      card.append(
        el(
          "p",
          "source-update",
          `${number.format(row.precinctsReporting)} of ${number.format(row.precinctsTotal)} precincts reporting${row.precinctReportingPercent != null ? ` · ${row.precinctReportingPercent}%` : ""}. Precinct reporting is separate from certification.`,
        ),
      );
    if (row.sourceReportingStatus?.reportingUnits != null)
      card.append(
        el(
          "p",
          "source-update",
          `Source reporting units: ${number.format(row.sourceReportingStatus.reportingUnits)} of ${number.format(row.sourceReportingStatus.totalUnits)}. This is separate from ballot completion and certification.`,
        ),
      );
    if (row.sourceElectionOutcome)
      card.append(el("p", "outcome-note", row.sourceElectionOutcome));
    if (row.geographicCoverageNote)
      card.append(el("p", "race-warning", row.geographicCoverageNote));
    if (
      row.candidateDetailIncomplete ||
      row.otherCandidatesAggregated ||
      summary.unitemizedVotes
    )
      card.append(
        el(
          "p",
          "source-update",
          "Some candidates are grouped in a separately reported total. Individual vote counts are not itemized for that group.",
        ),
      );
    if (summary.runnerUpUncertain)
      card.append(
        el(
          "p",
          "source-update",
          "A candidate vote margin cannot be established from the unitemized totals.",
        ),
      );
    const candidates = [...row.candidates].sort(
      (a, b) => (b.votes ?? -1) - (a.votes ?? -1),
    );
    const quality = [];
    if (row.unofficial) quality.push("Source marked unofficial");
    if (row.voteTotalMismatch)
      quality.push("Reported total differs from source entry sum");
    if (row.sourceTotalConflict)
      quality.push("Source reports conflicting totals");
    if (row.candidates.some((c) => c.votes === null))
      quality.push("Some vote counts not reported");
    if (row.sourceNeedsReview)
      quality.push(...(row.reviewReasons || ["Source record needs review"]));
    if (row.incomplete && !quality.length)
      quality.push("Source record needs review");
    if (quality.length)
      card.append(el("p", "race-warning", quality.join(" · ")));
    const list = el("div", "candidate-list");
    candidates.forEach((candidate) => {
      const item = el("div", `candidate-row ${partyClass(candidate.party)}`);
      const name = el("div", "candidate-name");
      name.append(el("i", "party-dot"), el("span", "", candidate.name));
      const share =
        !summary.qualityNeedsReview &&
        Number.isFinite(candidate.votes) &&
        row.totalVotes > 0
          ? (candidate.votes / row.totalVotes) * 100
          : null;
      const votes = el(
        "div",
        "candidate-votes",
        candidate.votes === null
          ? "Not reported"
          : number.format(candidate.votes),
      );
      votes.append(
        el("span", "", share === null ? "—" : `${share.toFixed(1)}%`),
      );
      item.append(
        name,
        votes,
        el(
          "span",
          "candidate-party",
          candidate.partyOriginal || candidate.party,
        ),
      );
      const track = el("div", "vote-track"),
        fill = el("span");
      fill.style.width = `${Math.min(100, share || 0)}%`;
      track.append(fill);
      item.append(track);
      list.append(item);
    });
    card.append(list);
    if (row.reportingCategories?.length) {
      const categories = el("details", "reporting-categories");
      categories.append(el("summary", "", "Other reported ballot categories"));
      for (const item of row.reportingCategories)
        categories.append(
          el(
            "p",
            "",
            `${item.name}: ${item.votes === null ? "Not reported" : number.format(item.votes)}`,
          ),
        );
      card.append(categories);
    }
    const footer = el(
      "p",
      "race-total",
      `${number.format(row.totalVotes)} reported votes`,
    );
    if (summary.tied) footer.append(el("span", "", "Tied for most votes"));
    if (summary.margin !== null && !summary.incomplete && !summary.tied)
      footer.append(
        el("span", "", `${summary.margin.toFixed(1)} pt vote margin`),
      );
    card.append(footer);
    if (row.totalVotesBasis)
      card.append(el("p", "race-basis", `Total: ${row.totalVotesBasis}.`));
    if (row.sourceLinks?.length) {
      const link = el("a", "official-source", "Original results source ↗");
      link.href = row.sourceLinks[0];
      link.target = "_blank";
      link.rel = "noreferrer";
      card.append(link);
    }
    $("#race-grid").append(card);
  }
  function render() {
    const panel = $(".election-panel");
    panel.setAttribute("aria-busy", String(loading));
    const location = selection.county
      ? `${selection.county.properties.name}, ${selection.state.abbreviation}`
      : selection.state?.properties.name || "United States";
    $("#results-title").textContent =
      `${location} · ${OFFICE_LABELS[office] || "Geography"}${office === "geography" ? "" : ` · ${year}`}`;
    $("#results-level").textContent = selection.county
      ? office === "house"
        ? "County portions of districts"
        : "County returns"
      : selection.state
        ? office === "house"
          ? "Congressional district returns"
          : "Statewide returns"
        : "National overview";
    $("#election-legend").hidden = office === "geography";
    $(".legend-note").textContent =
      year === 2026
        ? "Reported vote leader · unofficial"
        : "Color = most votes in one contest";
    $("#race-grid").replaceChildren();
    $("#results-sources").replaceChildren();
    $("#race-picker-wrap").hidden = true;
    const pill = $("#coverage-pill");
    pill.classList.remove("coverage-warning");
    if (office === "geography") {
      pill.textContent = "Geography view";
      $("#coverage-note").textContent =
        "Select a state, then a county. Choose an election above to explore its history.";
      return;
    }
    if (loading) {
      pill.textContent = "Loading returns…";
      $("#coverage-note").textContent =
        "Loading locally stored election returns…";
      return;
    }
    if (error) {
      pill.textContent = "Could not load";
      pill.classList.add("coverage-warning");
      $("#coverage-note").textContent = error;
      return;
    }
    if (!data) {
      pill.textContent = "Not imported";
      pill.classList.add("coverage-warning");
      $("#coverage-note").textContent =
        `No ${OFFICE_LABELS[office]} returns are imported for ${year}. This does not establish whether an election occurred.`;
      addEmpty(
        "No data for this year",
        "Try a different year or election. Presidential results are available for 2008, 2012, 2016, 2020, and 2024.",
      );
      return;
    }
    const countyRecords = data.results.filter(
      (row) => row.geoLevel === "county",
    );
    const districtRecords = data.results.filter(
      (row) => row.geoLevel === "district",
    );
    const stateRecords = data.results.filter((row) => row.geoLevel === "state");
    pill.textContent = countyRecords.length
      ? districtRecords.length
        ? "County + district returns"
        : "State + county returns"
      : districtRecords.length
        ? "District returns"
        : "Statewide returns";
    const rows = locationRows();
    const countyMissing = selection.county && !rows.length;
    if (countyMissing) {
      pill.textContent = "No county returns";
      pill.classList.add("coverage-warning");
      $("#coverage-note").textContent =
        `${selection.county.properties.name} county-level ${OFFICE_LABELS[office]} returns are not in this import. ${office === "house" ? "District results cannot be assigned to counties." : "Statewide totals are not county vote counts."} Use “Back to state” to see the available ${office === "house" ? "district" : "statewide"} results.`;
      addEmpty(
        "County data not imported",
        "The map stays neutral here. No statewide or district votes are presented as county results.",
      );
    } else if (!selection.state) {
      $("#coverage-note").textContent =
        office === "house"
          ? "Select a state to see its House districts and contests. District totals are not painted onto counties or combined into a statewide race."
          : "Select a state for candidate vote totals, then a county where county returns are available. Colors show the candidate with the most votes in each source record; gray means no match or a source quality flag.";
      const overview = el("div", "coverage-overview");
      for (const [value, label] of [
        [
          new Set(data.results.map((row) => row.stateFips)).size,
          "states / D.C. in source",
        ],
        [
          countyRecords.length || districtRecords.length || stateRecords.length,
          countyRecords.length
            ? "county records"
            : districtRecords.length
              ? "district contests"
              : "state contests",
        ],
        [year, "election year"],
      ]) {
        const stat = el("div");
        stat.append(
          el(
            "strong",
            "",
            label === "election year" ? String(value) : number.format(value),
          ),
          el("span", "", label),
        );
        overview.append(stat);
      }
      $("#race-grid").append(overview);
    } else if (!rows.length) {
      $("#coverage-note").textContent =
        `No matching ${OFFICE_LABELS[office]} contest is imported for ${selection.state.properties.name} in ${year}. Not every office is on the ballot every year; import coverage also varies.`;
      addEmpty(
        "No matching contest",
        "Choose another office or year to keep exploring.",
      );
    } else {
      $("#coverage-note").textContent =
        `${rows.length} ${rows.length === 1 ? "contest" : "contests"} · ${selection.county ? (office === "house" ? "County–district intersection" : "County") : office === "house" ? "District" : "Statewide"} vote totals. ${selection.county && office === "house" ? "Each card shows only this county's portion of that district. " : ""}General elections, special elections, and runoffs remain separate. These are popular-vote returns; ranked-choice rounds and certification should be checked in the original source.`;
      let visible = rows;
      if ((office !== "house" || selection.county) && rows.length > 1) {
        $("#race-picker-wrap").hidden = false;
        const picker = $("#race-picker");
        picker.replaceChildren();
        picker.append(new Option("All imported contests", ""));
        rows.forEach((row) =>
          picker.append(new Option(contestName(row), row.contestId)),
        );
        picker.value = contest;
        if (contest) visible = rows.filter((row) => row.contestId === contest);
      }
      visible.forEach(renderRace);
    }
    const sourceKeys = new Set(
      (rows.length ? rows : data.results).map((row) => row.sourceId),
    );
    const sources = data.sources || manifest?.sources || {};
    const line = el("span", "", "Sources: ");
    $("#results-sources").append(line);
    const displayedSourceLinks = new Set();
    for (const key of sourceKeys) {
      const source = sources[key];
      if (!source) continue;
      const href = source.sourceUrl || source.url;
      if (displayedSourceLinks.has(href)) continue;
      displayedSourceLinks.add(href);
      const link = el("a", "", `${source.title} ↗`);
      link.href = href;
      link.target = "_blank";
      link.rel = "noreferrer";
      $("#results-sources").append(link);
    }
    $("#results-sources").append(
      el(
        "span",
        "snapshot-note",
        `Data snapshot · ${data.snapshotDate} · Source flags retained`,
      ),
    );
    if (countyRecords.length)
      $("#results-sources").append(
        el(
          "span",
          "snapshot-note",
          "County coverage can differ from 2017 map boundaries, particularly in Alaska.",
        ),
      );
    if (supplementWarning)
      $("#coverage-note").textContent +=
        " Additional county returns could not load; the available primary-source records are shown. Change office or year to retry.";
    if (year === 2026)
      $("#coverage-note").textContent +=
        " These are dated, unofficial snapshots. Vote leads and precinct reporting do not establish a certified election outcome.";
  }
  $("#election-office").addEventListener("change", changeElection);
  $("#election-year").addEventListener("input", (event) => {
    year = years[Number(event.target.value)] ?? year;
    changeElection();
  });
  function stepYear(delta) {
    const index = stepYearIndex(years, yearIndex(years, year), delta);
    if (index >= 0) year = years[index];
    changeElection();
  }
  $("#previous-year").addEventListener("click", () => stepYear(-1));
  $("#next-year").addEventListener("click", () => stepYear(1));
  $("#race-picker").addEventListener("change", (event) => {
    contest = event.target.value;
    refresh();
  });
  $("#view-current-results").addEventListener("click", () => {
    if (["president", "geography"].includes($("#election-office").value))
      $("#election-office").value = "governor";
    year = 2026;
    yearOffice = "";
    changeElection();
  });
  fetch(appUrl("/data/current-status.json"))
    .then(async (response) => {
      if (
        !response.ok ||
        (response.headers.get("content-type") || "").includes("text/html")
      )
        return;
      const status = await response.json();
      if (!status.offices?.length) return;
      $("#current-election-summary").textContent = status.offices
        .map(
          (item) =>
            `${OFFICE_LABELS[item.office]}: ${item.statesWithReturns} states with reported returns`,
        )
        .join(" · ");
      $("#current-election-timestamp").textContent =
        `Latest recorded source retrieval ${new Date(status.retrievedAt).toLocaleString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })} MT. Individual source update times appear below.`;
      $("#current-election-banner").hidden = false;
    })
    .catch(() => {
      /* The election data loader retains per-contest errors separately. */
    });
  // Defer until the owner has installed this controller and completed map initialization.
  queueMicrotask(changeElection);
  return {
    isHistorical: () => office !== "geography",
    countyContext(id) { return { office, year, years: [...years], rows: matchingRows("county", id), loading }; },
    stateContext(id) { return { office, year, years: [...years], rows: (data?.results || []).filter(row => row.stateFips === id && ['state', 'district'].includes(row.geoLevel)), loading }; },
    setSelection(value) {
      selection = value;
      contest = "";
      render();
    },
    color(level, id) {
      const party = leadingParty(level, id);
      const base = party ? colors[party] || colors.Other : colors.missing;
      return year === 2026 ? countingColor(party, countingStatus(matchingRows(level, id)).status, base) : base;
    },
    describe(level, id) {
      if (office === "geography") return "";
      const rows = matchingRows(level, id);
      if (!rows.length) return " · No matched returns";
      if (rows.length > 1) return ` · ${rows.length} contests`;
      const summary = summarizeRace(rows[0]);
      if (summary.outcomeSuppressed)
        return " · Conditional or ballot-question result";
      if (rows[0].provisional && !summary.qualityNeedsReview && summary.winner)
        return ` · Reported leader: ${summary.winner.name} · Unofficial`;
      return summary.incomplete
        ? " · Source needs review"
        : summary.tied
          ? " · Tied"
          : summary.winner
            ? ` · ${summary.winner.name}`
            : " · No reported count";
    },
  };
}
