import "./style.css";
import { geoPath } from "d3-geo";
import { select } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity } from "d3-zoom";
import { feature } from "topojson-client";
import topology from "us-atlas/states-albers-10m.json";
import countyLabels from "./county-labels.json";
import { createElectionView } from "./election-view.js";
import { renderCountyMetrics, renderStateMetrics } from "./county-hover.js";
import { initSupport } from "./support.js";
import { initResearchStatus } from './research-status.js';
import { initPatternReview, hasPatternFlag, countyPatternDirection, updatePatternSummary, updatePatternCountyList, getPatternReviewReport } from './pattern-review.js';

initSupport();
initResearchStatus();

const regions = {
  West: "AK AZ CA CO HI ID MT NM NV OR UT WA WY",
  Midwest: "IA IL IN KS MI MN MO ND NE OH SD WI",
  South: "AL AR DE FL GA KY LA MD MS NC OK SC TN TX VA WV",
  Northeast: "CT MA ME NH NJ NY PA RI VT",
};
const abbreviations = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  10: "DE",
  12: "FL",
  13: "GA",
  15: "HI",
  16: "ID",
  17: "IL",
  18: "IN",
  19: "IA",
  20: "KS",
  21: "KY",
  22: "LA",
  23: "ME",
  24: "MD",
  25: "MA",
  26: "MI",
  27: "MN",
  28: "MS",
  29: "MO",
  30: "MT",
  31: "NE",
  32: "NV",
  33: "NH",
  34: "NJ",
  35: "NM",
  36: "NY",
  37: "NC",
  38: "ND",
  39: "OH",
  40: "OK",
  41: "OR",
  42: "PA",
  44: "RI",
  45: "SC",
  46: "SD",
  47: "TN",
  48: "TX",
  49: "UT",
  50: "VT",
  51: "VA",
  53: "WA",
  54: "WV",
  55: "WI",
  56: "WY",
};
const states = feature(topology, topology.objects.states)
  .features.filter((s) => abbreviations[s.id])
  .map((s) => ({
    ...s,
    abbreviation: abbreviations[s.id],
    region: Object.keys(regions).find((r) =>
      regions[r].split(" ").includes(abbreviations[s.id]),
    ),
  }))
  .sort((a, b) => a.properties.name.localeCompare(b.properties.name));
const $ = (s) => document.querySelector(s),
  path = geoPath(),
  svg = select("#us-map"),
  content = select("#map-content");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let selectedState = null,
  selectedCounty = null,
  stateCounties = [],
  countyPromise,
  activeRegion = "all",
  currentZoom = zoomIdentity,
  navigationToken = 0,
  countiesLoading = false,
  countyError = "",
  elections;
let mapGestures = false, pageScrollIntent = 0;
document.addEventListener('wheel', event => { if (!event.ctrlKey && !event.metaKey) pageScrollIntent++; }, {passive:true});
document.addEventListener('touchmove', () => { if (!mapGestures) pageScrollIntent++; }, {passive:true});
const mapZoom = zoom()
  .filter(event => event.type === 'wheel' ? (event.ctrlKey || event.metaKey) : event.type.startsWith('touch') ? mapGestures : !event.button)
  .wheelDelta(event => -event.deltaY * (event.deltaMode === 1 ? .05 : event.deltaMode ? .5 : .002))
  .scaleExtent([1, 450])
  .extent([
    [-32, -24],
    [1007, 651],
  ])
  .translateExtent([
    [-100, -100],
    [1075, 750],
  ])
  .on("zoom", (event) => {
    currentZoom = event.transform;
    content.attr("transform", currentZoom);
    $("#zoom-in").disabled = currentZoom.k >= 450;
    $("#zoom-out").disabled = currentZoom.k <= 1;
    select("#county-labels")
      .selectAll("text")
      .attr("font-size", 10 / currentZoom.k);
  });
svg.call(mapZoom).on("dblclick.zoom", null);
svg.node().addEventListener('wheel',event=>{if(event.ctrlKey || event.metaKey)event.preventDefault();},{passive:false});
function moveTo(t) {
  svg.interrupt();
  if (reducedMotion) { svg.call(mapZoom.transform, t); return Promise.resolve(true); }
  return svg.transition().duration(600).call(mapZoom.transform, t).end().then(() => true, () => false);
}
function fitFeature(geometry) {
  const [[x0, y0], [x1, y1]] = path.bounds(geometry);
  if (![x0, y0, x1, y1].every(Number.isFinite)) return;
  const k = Math.max(
    1,
    Math.min(400, 0.78 / Math.max((x1 - x0) / 1039, (y1 - y0) / 675)),
  );
  return moveTo(
    zoomIdentity
      .translate(487.5, 313.5)
      .scale(k)
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
  );
}
let detailToken = 0, historyModule, statisticsModule;
async function countyCard(container, geometry, tokenValid) {
  const context = elections.countyContext(geometry.id);
  if (context.loading) { container.textContent = "Loading county returns…"; return; }
  await renderCountyMetrics(container, { ...context, name: geometry.properties.name,
    state: selectedState.abbreviation, id: geometry.id, population: null }, tokenValid);
  if (tokenValid() && container.id === 'map-tooltip-content') container.querySelectorAll('details').forEach(details => { details.open = true; });
}
async function stateCard(container, geometry, tokenValid) {
  const context = elections.stateContext(geometry.id);
  if (context.loading) { container.textContent = "Loading state returns…"; return; }
  await renderStateMetrics(container, { ...context, name: geometry.properties.name,
    state: geometry.abbreviation, id: geometry.id }, tokenValid);
}
function updateCountyDetail() {
  const panel = $('#map-tooltip'), detail = $('#map-tooltip-content'), charts = $('#history-charts'), statistics = $('#statistical-review');
  const token = ++detailToken;
  panel.hidden = !selectedState;
  charts.hidden = !selectedState || !elections?.isHistorical();
  statistics.hidden = charts.hidden || !selectedCounty;
  $('#jump-statistics').hidden = statistics.hidden;
  $('#jump-history').hidden = charts.hidden;
  if (!selectedState) { detail.replaceChildren(); charts.replaceChildren(); statistics.replaceChildren(); return Promise.resolve(); }
  const geometry = selectedCounty || selectedState;
  const context = selectedCounty ? elections.countyContext(geometry.id) : elections.stateContext(geometry.id);
  const detailsWork = selectedCounty ? countyCard(detail, geometry, () => token === detailToken) : stateCard(detail, geometry, () => token === detailToken);
  if(context.loading) {charts.textContent='Loading the selected election…';statistics.textContent='Loading the selected election…';return Promise.resolve(detailsWork);}
  const chartWork = charts.hidden ? Promise.resolve() : (historyModule ||= import('./history-charts.js'))
    .then(module => module.renderHistoryCharts(charts, { ...context, report:getPatternReviewReport(), id: geometry.id, name: geometry.properties.name,
      state: selectedState.abbreviation, level: selectedCounty ? 'county' : 'state' }, () => token === detailToken))
    .catch(() => { historyModule = null; if (token === detailToken) charts.textContent = 'History graphs could not load. Select the place again to retry.'; });
  const statisticsWork = statistics.hidden ? Promise.resolve() : (statisticsModule ||= import('./statistical-review.js'))
    .then(module => module.renderSelectedStatistics(statistics, {...context, id:geometry.id, name:geometry.properties.name, state:selectedState.abbreviation, level:'county', report:getPatternReviewReport()}, () => token === detailToken))
    .catch(() => { statisticsModule = null; if (token === detailToken) statistics.textContent = 'Statistical review could not load. Select the county again to retry.'; });
  return Promise.all([detailsWork, chartWork, statisticsWork]);
}
async function openSelectedDetails(geometry, kind) {
  if (kind === 'county' ? selectedCounty?.id !== geometry.id : selectedState?.id !== geometry.id || selectedCounty) return;
  if (kind === 'county') {
    const panel = $('#map-tooltip');
    panel.focus({preventScroll:true});
    window.scrollTo({top:Math.max(0,window.scrollY + panel.getBoundingClientRect().top - 90),behavior:reducedMotion?'auto':'smooth'});
  }
}
function keyboard(event, callback) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}
const paths = select("#states")
  .selectAll("path")
  .data(states)
  .join("path")
  .attr("d", path)
  .attr("class", "state")
  .attr("tabindex", 0)
  .attr("role", "button")
  .attr("aria-label", (s) => s.properties.name)
  .attr("aria-pressed", "false")
  .on("click", (e, s) => {
    if (!e.defaultPrevented) selectState(s);
  })
  .on("keydown", (e, s) => keyboard(e, () => selectState(s)));
const labelPositions = {
  AK: [128, 524],
  HI: [308, 569],
  FL: [796, 527],
  MI: [663, 198],
  LA: [582, 480],
  MA: [961, 170],
  RI: [966, 189],
  CT: [940, 198],
  NJ: [915, 250],
  DE: [917, 273],
  MD: [882, 291],
  NH: [945, 135],
  VT: [915, 126],
};
const labels = select("#state-labels")
  .selectAll("text")
  .data(states)
  .join("text")
  .attr("class", "state-label")
  .attr("x", (s) => (labelPositions[s.abbreviation] || path.centroid(s))[0])
  .attr("y", (s) => (labelPositions[s.abbreviation] || path.centroid(s))[1])
  .text((s) => s.abbreviation);
function updateMap() {
  const historical = elections?.isHistorical() || false;
  svg
    .classed("state-view", !!selectedState)
    .classed("county-view", !!selectedCounty)
    .classed("historical", historical);
  paths
    .classed("selected", (s) => s.id === selectedState?.id)
    .classed("dimmed", (s) =>
      selectedState
        ? s.id !== selectedState.id
        : activeRegion !== "all" && s.region !== activeRegion,
    )
    .attr("aria-pressed", (s) => String(s.id === selectedState?.id))
    .attr("tabindex", selectedState ? -1 : 0)
    .style("fill", (s) => (historical ? elections.color("state", s.id) : null));
  labels
    .classed("selected", (s) => s.id === selectedState?.id)
    .classed(
      "dimmed",
      (s) => activeRegion !== "all" && s.region !== activeRegion,
    );
  select("#counties")
    .selectAll("path")
    .classed("selected", (c) => c.id === selectedCounty?.id)
    .classed(
      "county-dimmed",
      (c) => !!selectedCounty && c.id !== selectedCounty.id,
    )
    .attr("aria-pressed", (c) => String(c.id === selectedCounty?.id))
    .style("fill", (c) =>
      historical ? elections.color("county", c.id) : null,
    );
  select("#county-labels")
    .selectAll("text")
    .classed("selected", (c) => c.id === selectedCounty?.id);
  const context = elections?.countyContext('') || {};
  const outlines = stateCounties.filter(c => hasPatternFlag(context.office, context.year, c.id)).flatMap(geometry => {
    const direction = countyPatternDirection(context.office, context.year, geometry.id);
    return (direction === 'mixed' ? ['democrat', 'republican'] : [direction]).map(party => ({ geometry, party, mixed: direction === 'mixed' }));
  });
  select('#pattern-outlines').selectAll('path')
    .data(outlines, c => `${c.geometry.id}:${c.party}`)
    .join('path').attr('class', c => `pattern-outline pattern-${c.party}${c.mixed ? ' pattern-alternating' : ''}`).attr('d', c => path(c.geometry));
  updatePatternSummary(context, selectedState?.id);
  updatePatternCountyList(context, states, selectedCounty, zoomToPatternCounty);
  const reviewReport = getPatternReviewReport();
  document.querySelectorAll('[data-review-office]').forEach(button => {
    const summary = reviewReport?.summary?.offices?.[button.dataset.reviewOffice];
    button.setAttribute('aria-pressed',String(context.office === button.dataset.reviewOffice && context.year === 2026));
    button.querySelector('small').textContent = summary ? `${summary.flagged.toLocaleString()} office flags · ${summary.assessed.toLocaleString()} counties assessed` : 'Loading review coverage…';
  });
  $("#map-status").textContent =
    countyError ||
    (countiesLoading
      ? "Loading county boundaries…"
      : selectedCounty
        ? `${selectedCounty.properties.name} · ${selectedState.properties.name} · FIPS ${selectedCounty.id}`
        : selectedState
          ? `${selectedState.properties.name} · ${stateCounties.length} counties & equivalents`
          : activeRegion === "all"
            ? "50 states · Select one to explore counties"
            : `${regions[activeRegion].split(" ").length} states in the ${activeRegion}`);
  $("#map-view-label").textContent = selectedCounty
    ? `${selectedCounty.properties.name.toUpperCase()} · ${selectedState.abbreviation}`
    : selectedState
      ? `${selectedState.properties.name.toUpperCase()} · COUNTY VIEW`
      : activeRegion === "all"
        ? "NATIONAL VIEW"
        : `${activeRegion.toUpperCase()} REGION`;
  $("#national-view").setAttribute(
    "aria-current",
    selectedState ? "false" : "page",
  );
  ["state-crumb", "state-crumb-separator"].forEach(
    (id) => ($(`#${id}`).hidden = !selectedState),
  );
  $("#state-crumb").textContent = selectedState?.properties.name || "";
  $("#state-crumb").setAttribute(
    "aria-current",
    selectedState && !selectedCounty ? "page" : "false",
  );
  ["county-crumb", "county-crumb-separator", "back-to-state"].forEach(
    (id) => ($(`#${id}`).hidden = !selectedCounty),
  );
  $("#county-crumb").textContent = selectedCounty?.properties.name || "";
  $("#region-heading").hidden = !!selectedState;
  $("#region-list").hidden = !!selectedState;
  $("#county-browser").hidden = !selectedState;
  $("#county-count").textContent = countiesLoading
    ? "…"
    : String(stateCounties.length);
  $("#state-search").placeholder = selectedState
    ? "Find a county or state…"
    : "Find a state…";
  $("#state-search").setAttribute(
    "aria-label",
    selectedState ? "Search counties or states" : "Search states",
  );
  $(".inset-note").hidden = !!selectedState;
  document
    .querySelectorAll("#county-list button")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(b.dataset.fips === selectedCounty?.id),
      ),
    );
}
function updateSelection() {
  $("#selection-symbol").textContent = selectedState?.abbreviation || "US";
  $("#selection-label").textContent = selectedCounty
    ? `COUNTY EQUIVALENT · ${selectedCounty.id}`
    : selectedState
      ? "STATE VIEW"
      : "A PLACE TO BEGIN";
  $("#selection-title").textContent =
    selectedCounty?.properties.name ||
    selectedState?.properties.name ||
    "Pick a state.";
  $("#selection-description").textContent = selectedCounty
    ? `${selectedState.properties.name} · Historical returns below.`
    : selectedState
      ? `${selectedState.region} region · Select a county to go deeper.`
      : "Choose a state to zoom in and explore its counties.";
  $("#clear-selection").hidden = !selectedState;
  $('#show-selected-results').hidden = !selectedState;
  elections?.setSelection({ state: selectedState, county: selectedCounty });
  updateMap();
  return updateCountyDetail();
}
async function loadCounties() {
  countyPromise ||= import("us-atlas/counties-albers-10m.json")
    .then((m) =>
      feature(m.default, m.default.objects.counties).features.map((county) => ({
        ...county,
        properties: {
          ...county.properties,
          originalName: county.properties.name,
          name: countyLabels.labels[county.id] || county.properties.name,
        },
      })),
    )
    .catch((e) => {
      countyPromise = null;
      throw e;
    });
  return countyPromise;
}
async function selectState(state, { showDetails = true } = {}) {
  const token = ++navigationToken;
  selectedState = state;
  selectedCounty = null;
  stateCounties = [];
  countyError = "";
  countiesLoading = true;
  if (activeRegion !== "all" && state.region !== activeRegion)
    setRegionButtons("all");
  select("#counties").selectAll("*").remove();
  select("#county-labels").selectAll("*").remove();
  $("#county-list").replaceChildren();
  closeSearch();
  $("#state-search").value = "";
  const viewReady = fitFeature(state);
  updateSelection();
  try {
    const counties = await loadCounties();
    if (token !== navigationToken) return;
    stateCounties = counties
      .filter((c) => c.id.slice(0, 2) === state.id)
      .sort((a, b) => a.properties.name.localeCompare(b.properties.name));
    select("#counties")
      .selectAll("path")
      .data(stateCounties)
      .join("path")
      .attr("d", path)
      .attr("class", "county")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr(
        "aria-label",
        (c) => `${c.properties.name}, ${state.abbreviation}, county`,
      )
      .attr("aria-pressed", "false")
      .on("click", (e, c) => {
        e.stopPropagation();
        if (!e.defaultPrevented) selectCounty(c);
      })
      .on("keydown", (e, c) => keyboard(e, () => selectCounty(c)));
    select("#county-labels")
      .selectAll("text")
      .data(stateCounties)
      .join("text")
      .attr("class", "county-label")
      .attr("x", (c) => path.centroid(c)[0])
      .attr("y", (c) => path.centroid(c)[1])
      .attr("font-size", 10 / currentZoom.k)
      .text((c) => c.properties.name);
    stateCounties.forEach((c) => {
      const b = document.createElement("button");
      b.className = "county-list-button";
      b.dataset.fips = c.id;
      b.textContent = c.properties.name;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => selectCounty(c));
      $("#county-list").append(b);
    });
  } catch (e) {
    if (token !== navigationToken) return;
    countyError =
      "County boundaries could not load. Select the state again to retry.";
  } finally {
    if (token === navigationToken) {
      countiesLoading = false;
      updateMap();
    }
  }
  const completed = await viewReady;
  if (completed && showDetails && token === navigationToken && selectedState?.id === state.id && !selectedCounty) await openSelectedDetails(state, 'state');
}
async function zoomToPatternCounty(fips) {
  const context = elections.countyContext('');
  if (!hasPatternFlag(context.office, context.year, fips)) return;
  const state = states.find(state => state.id === fips.slice(0, 2));
  if (!state) return;
  const status = $('#pattern-navigation-status');
  status.hidden = false;
  status.textContent = `Loading county in ${state.properties.name}…`;
  let token = navigationToken;
  if (selectedState?.id !== state.id || countiesLoading || !stateCounties.length) {
    const navigation = selectState(state, { showDetails: false });
    token = navigationToken;
    await navigation;
  }
  const current = elections.countyContext('');
  if (token !== navigationToken || current.office !== context.office || current.year !== context.year || selectedState?.id !== state.id) return;
  const county = stateCounties.find(county => county.id === fips);
  if (!county) { status.textContent = 'County boundaries could not load. Select the county again to retry.'; return; }
  await selectCounty(county);
  const afterDetails = elections.countyContext('');
  if (token !== navigationToken || selectedCounty?.id !== fips || afterDetails.office !== context.office || afterDetails.year !== context.year) return;
  status.textContent = `${county.properties.name}, ${state.properties.name} selected.`;
}
async function selectCounty(county, { showDetails = true } = {}) {
  if (!selectedState || county.id.slice(0, 2) !== selectedState.id) return;
  selectedCounty = county;
  const scrollIntent = pageScrollIntent;
  closeSearch();
  $("#state-search").value = "";
  const viewReady = fitFeature(county);
  updateSelection();
  const completed = await viewReady;
  if (completed && showDetails && selectedCounty?.id === county.id && scrollIntent === pageScrollIntent) await openSelectedDetails(county, 'county');
}
function returnToState() {
  if (selectedState) {
    selectedCounty = null;
    fitFeature(selectedState);
    updateSelection();
  }
}
function clearSelection() {
  navigationToken++;
  selectedState = null;
  selectedCounty = null;
  stateCounties = [];
  countiesLoading = false;
  countyError = "";
  select("#counties").selectAll("*").remove();
  select("#county-labels").selectAll("*").remove();
  $("#county-list").replaceChildren();
  closeSearch();
  $("#state-search").value = "";
  moveTo(zoomIdentity);
  updateSelection();
}
function setRegionButtons(region) {
  activeRegion = region;
  document.querySelectorAll(".region-button").forEach((b) => {
    const active = b.dataset.region === region;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", String(active));
  });
}
for (const b of document.querySelectorAll(".region-button"))
  b.addEventListener("click", () => {
    setRegionButtons(b.dataset.region);
    updateMap();
  });
$("#clear-selection").addEventListener("click", clearSelection);
$("#national-view").addEventListener("click", clearSelection);
$("#state-crumb").addEventListener("click", returnToState);
$("#back-to-state").addEventListener("click", returnToState);
$("#zoom-in").addEventListener("click", () => {
  svg.interrupt();
  svg.call(mapZoom.scaleBy, 1.6);
});
$("#zoom-out").addEventListener("click", () => {
  svg.interrupt();
  svg.call(mapZoom.scaleBy, 1 / 1.6);
});
$("#reset-view").addEventListener("click", () =>
  selectedCounty
    ? fitFeature(selectedCounty)
    : selectedState
      ? fitFeature(selectedState)
      : moveTo(zoomIdentity),
);
$("#labels-toggle").addEventListener("click", (e) => {
  const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
  e.currentTarget.setAttribute("aria-pressed", String(on));
  svg.classed("hide-labels", !on);
});
const search = $("#state-search"),
  results = $("#search-results");
function closeSearch() {
  results.hidden = true;
  search.setAttribute("aria-expanded", "false");
}
function searchPlaces() {
  const q = search.value.trim().toLowerCase();
  const matches = [
    ...stateCounties
      .filter((c) => c.properties.name.toLowerCase().includes(q) || c.id === q)
      .map((g) => ({ g, kind: "county" })),
    ...states
      .filter(
        (s) =>
          s.properties.name.toLowerCase().includes(q) ||
          s.abbreviation.toLowerCase() === q,
      )
      .map((g) => ({ g, kind: "state" })),
  ];
  results.replaceChildren();
  matches.forEach(({ g, kind }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = g.properties.name;
    const code = document.createElement("span");
    code.textContent = kind === "county" ? "County" : g.abbreviation;
    b.append(code);
    b.addEventListener("click", async () => {
      if (kind === "county") {
        selectCounty(g);
        select("#counties")
          .selectAll("path")
          .filter((d) => d.id === g.id)
          .node()
          ?.focus({ preventScroll: true });
      } else {
        await selectState(g);
        $("#state-crumb").focus({ preventScroll: true });
      }
    });
    results.append(b);
  });
  if (!matches.length) {
    const p = document.createElement("div");
    p.className = "no-results";
    p.textContent = "No places found. Try a name, state code, or county FIPS.";
    results.append(p);
  }
  results.hidden = false;
  search.setAttribute("aria-expanded", "true");
}
search.addEventListener("input", searchPlaces);
search.addEventListener("focus", searchPlaces);
search.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSearch();
    search.blur();
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    results.querySelector("button")?.focus();
  }
  if (e.key === "Enter") {
    e.preventDefault();
    results.querySelector("button")?.click();
  }
});
results.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSearch();
    search.focus();
    closeSearch();
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const next =
      e.key === "ArrowDown"
        ? document.activeElement.nextElementSibling
        : document.activeElement.previousElementSibling;
    if (next?.tagName === "BUTTON") next.focus();
    else search.focus();
  }
});
document.addEventListener("pointerdown", (e) => {
  if (!e.target.closest(".search-wrap")) closeSearch();
});
document.addEventListener("focusin", (e) => {
  if (!e.target.closest(".search-wrap")) closeSearch();
});
document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
  ) {
    e.preventDefault();
    search.focus();
  }
  if (e.key === "Escape" && e.target.closest("#us-map"))
    selectedCounty ? returnToState() : clearSelection();
});
$('#map-gestures').addEventListener('click', event => {
  mapGestures = !mapGestures;
  event.currentTarget.setAttribute('aria-pressed',String(mapGestures));
  event.currentTarget.textContent = mapGestures ? 'Return to page scrolling' : 'Enable touch map gestures';
  svg.classed('map-gestures-enabled',mapGestures);
  $('#map-scroll-help').textContent = mapGestures ? 'Touch gestures move the map. Turn gestures off to scroll the page.' : 'Scroll to move the page. Ctrl/⌘ + scroll or + / − zooms the map.';
});
$('#back-to-map').addEventListener('click', () => $('.map-topline').scrollIntoView({block:'start',behavior:reducedMotion?'auto':'smooth'}));
$('#jump-statistics').addEventListener('click', () => $('#statistical-review').scrollIntoView({block:'start',behavior:reducedMotion?'auto':'smooth'}));
$('#jump-history').addEventListener('click', () => $('#history-charts').scrollIntoView({block:'start',behavior:reducedMotion?'auto':'smooth'}));
$('#show-selected-results').addEventListener('click', () => {if(selectedCounty)openSelectedDetails(selectedCounty,'county');else $('#map-tooltip').scrollIntoView({block:'start',behavior:reducedMotion?'auto':'smooth'});});
document.querySelectorAll('[data-review-office]').forEach(button => button.addEventListener('click', () => elections.selectElection(button.dataset.reviewOffice,2026)));
$('#share-map').addEventListener('click', async () => {
  const context = elections.countyContext('');
  const url = new URL('https://voteranomaly.com/');
  url.searchParams.set('office',context.office);
  if(context.office !== 'geography') url.searchParams.set('year',String(context.year));
  if(selectedCounty)url.searchParams.set('county',selectedCounty.id);else if(selectedState)url.searchParams.set('state',selectedState.id);
  const status = $('#share-map-status');status.hidden=false;
  const title = `V-Map${selectedCounty?` · ${selectedCounty.properties.name}, ${selectedState.abbreviation}`:selectedState?` · ${selectedState.properties.name}`:''}`;
  try {
    if(navigator.share) {await navigator.share({title,text:'Explore source-backed U.S. election history, county by county.',url:url.href});status.textContent='Map shared.';}
    else {await navigator.clipboard.writeText(url.href);status.textContent='Map link copied. It includes the selected office, year and place.';}
    window.gtag?.('event','share',{method:navigator.share?'native':'copy_link',content_type:'election_map',office:context.office,election_year:context.year});
  } catch(error) {status.textContent=error.name==='AbortError'?'Sharing cancelled.':`Copy this map link: ${url.href}`;}
});
document.querySelectorAll('#header-support-qr,#support-open-wallet,#support-copy-invoice').forEach(link=>link.addEventListener('click',()=>window.gtag?.('event','support_engagement',{method:link.id})));
const sharedParams = new URL(location.href).searchParams;
const sharedOffice = ['president','senate','house','governor','geography'].includes(sharedParams.get('office')) ? sharedParams.get('office') : null;
if(sharedOffice)$('#election-office').value=sharedOffice;
let sharedPlaceStarted = false;
async function restoreSharedPlace() {
  if(sharedPlaceStarted || !elections || elections.countyContext('').loading)return;
  sharedPlaceStarted=true;
  if(navigationToken || selectedState)return;
  const county=sharedParams.get('county'), stateId=/^\d{5}$/.test(county||'')?county.slice(0,2):sharedParams.get('state');
  const state=states.find(state=>state.id===stateId);if(!state)return;
  await selectState(state,{showDetails:false});
  if(selectedState?.id!==state.id)return;
  const place=stateCounties.find(place=>place.id===county);if(place)await selectCounty(place);
}
elections = createElectionView({ initialYear:Number(sharedParams.get('year')) || 2026, onChange: () => { updateMap(); updateCountyDetail(); restoreSharedPlace(); } });
initPatternReview(() => { updateMap(); updateCountyDetail(); });
updateSelection();
$("#zoom-out").disabled = true;
