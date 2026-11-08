import { contestMetrics, compareContest, expectedPriorYear, populationAt, regularNovemberBallot, ballotComparison, ballotsPerResident, contestVotesPerResident, votingMethodShares, isLargePartyChange, formatPartyChange } from './county-metrics.js';
import { loadElection, OFFICE_LABELS } from './election-data.js';
import { loadCountySupplement, mergeElectionData } from './county-data.js';
import { appUrl } from './paths.js';
import { appendPatternReview, getPatternReviewReport } from './pattern-review.js';
import { auditedHouseCounts, auditedSenateRoundCounts, auditedRegularSenateCounts } from './history-series.js';
import { relativeChange } from './county-metrics.js';
import {scopedHouseFacts} from './house-facts.js';

const previousCache = new Map();
let populationPromise, turnoutPromise;
function loadPopulation() {
  if (!populationPromise) populationPromise = fetch(appUrl('/data/population/counties.json')).then(r => {
    if (!r.ok || (r.headers.get('content-type') || '').includes('text/html')) throw new Error('Population unavailable');
    return r.json();
  }).catch(() => null);
  return populationPromise;
}
function loadTurnout() {
  if (!turnoutPromise) turnoutPromise = fetch(appUrl('/data/turnout/counties.json')).then(r => {
    if (!r.ok || (r.headers.get('content-type') || '').includes('text/html')) throw new Error('Turnout unavailable');
    return r.json();
  }).catch(() => null);
  return turnoutPromise;
}
function previousData(office, year) {
  const key = `${office}-${year}`;
  if (!previousCache.has(key)) previousCache.set(key, Promise.all([loadElection(office, year), loadCountySupplement(office, year)])
    .then(([base, extra]) => mergeElectionData(base, extra)).catch(error => { previousCache.delete(key); throw error; }));
  return previousCache.get(key);
}
const fmt = value => Number.isFinite(value) ? new Intl.NumberFormat('en-US').format(value) : 'N/A';
const change = value => Number.isFinite(value) ? `${value >= 0 ? '+' : ''}${value.toFixed(1)}%` : 'N/A';
const node = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; e.textContent = text; return e; };
function appendQuickResults(container, rows, office, year, id, contestFiltered = false) {
  if (office === 'geography' || !rows?.length) return;
  const sourceHold=rows.find(row=>row.sourceNeedsReview&&row.sourceQualityNote);
  if(sourceHold)container.append(node('p','county-tip-note source-quality-hold',sourceHold.sourceQualityNote));
  let aggregate = office==='house' && !contestFiltered && String(id).length===5 ? auditedHouseCounts(getPatternReviewReport(),id,year) : null;
  if(office==='house'&&!contestFiltered&&(!aggregate||aggregate.reason))aggregate=scopedHouseFacts(rows,getPatternReviewReport(),id,year,String(id).length===5?'county':'state');
  if (rows.length !== 1 && (!aggregate || aggregate.reason)) {
    container.append(node('p','county-tip-note',office==='house'?`${rows.length} actual district portions are listed separately. Qualified historical comparisons use complete countywide aggregates where the source scope has been independently verified.`:`${rows.length} separate contests are available below; they are not added into one county vote total.`));
    if(office==='house') {
      const table=node('table','quick-portions',''),head=node('tr','','');
      for(const text of ['District / stage','Republican','Democratic','Contest total'])head.append(node('th','',text));table.append(head);
      for(const row of rows) {const m=contestMetrics(row),tr=node('tr','','');for(const text of [`${row.district??'?'} · ${row.stage||'general'}${row.special?' · special':''}`,fmt(m?.republican),fmt(m?.democrat),fmt(m?.total)])tr.append(node('td','',text));table.append(tr);}
      const wrap=node('div','quick-portions-wrap','');wrap.append(table);container.append(wrap);
    }
    return;
  }
  const row=rows[0], metrics=aggregate && !aggregate.reason ? aggregate : contestMetrics(row);
  if (!metrics || row.contestType === 'recall-question' || row.contestType === 'replacement-election') return;
  const box=node('div','county-quick-results','');
  box.append(node('strong','',`${OFFICE_LABELS[office]} · ${year}${office==='house'?aggregate && !aggregate.reason?String(id).length===5?' · countywide total':' · published district totals':` · District ${row.district??'?'} portion`:''}`));
  const grid=node('div','county-quick-grid','');
  for(const [key,label] of [['total','Reported contest total'],['republican','Republican'],['democrat','Democratic']]) {const item=node('div','','');item.append(node('span','',label),node('b','',fmt(metrics[key])));grid.append(item);}
  box.append(grid,node('p','county-tip-note',`${metrics.provisional||row.provisional||row.unofficial||row.incomplete?'Provisional reported counts. ':''}Contest totals and candidate votes are separate from ballots cast. Comparisons and source notes appear below.`));container.append(box);
  if(aggregate?.basis)box.append(node('p','county-tip-note',String(id).length===2?'Sum of published candidate and classified write-in counts in distinct district reports. This does not resolve held county categories or establish complete ballots.':'These are verified totals for the selected year. Small counts or held historical sources can leave comparisons unavailable.'));
}
export async function renderCountyMetrics(container, { name, state, id, office, year, years, rows, population, contestFiltered }, isCurrent = () => true) {
  container.replaceChildren(node('strong', 'county-tip-title', `${name} · ${state}`));
  const quick=node('div','county-quick-area','');container.append(quick);
  appendQuickResults(quick,rows,office,year,id,contestFiltered);
  await appendPatternReview(container, { office, year, id, rows }, isCurrent);
  if (!isCurrent()) return;
  // The audit can arrive after the initial quick rows; refresh once it is qualified.
  quick.replaceChildren();appendQuickResults(quick,rows,office,year,id,contestFiltered);
  let populationData;
  try { populationData = await loadPopulation(); } catch { /* Other county facts remain available. */ }
  if (!isCurrent()) return;
  const records = populationData?.counties?.[id] || [];
  const pop = populationAt(records, office === 'geography' ? null : year);
  const popLine = node('div', 'county-tip-population', pop ? `Population: ${fmt(pop.value)} (${pop.referenceDate || pop.year} estimate)` : 'Population: unavailable');
  const source = populationData?.sources?.[pop?.sourceId];
  if (source?.url) { const a = node('a', 'county-tip-source', 'Source'); a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; popLine.append(' · ', a); }
  container.append(popLine);
  if (pop?.note) container.append(node('p', 'county-tip-note', pop.note));
  if (office === 'geography') return;
  let turnout;
  try { turnout = await loadTurnout(); } catch { /* No ballot-level source for this selection. */ }
  if (!isCurrent()) return;
  const ballotRecords = turnout?.counties?.[id] || [];
  const ballot = regularNovemberBallot(ballotRecords, year);
  const regular = Boolean(ballot);
  const ballotLine = node('div', 'county-tip-population', ballot ? `Reported ballots cast · ${ballot.electionDate} general election: ${fmt(ballot.ballotsCast)}${ballot.provisional || ballot.unofficial ? ' · unofficial' : ''}` : 'Ballots cast: unavailable');
  const ballotSource = turnout?.sources?.[ballot?.sourceId];
  if (ballotSource?.url) { const a = node('a', 'county-tip-source', 'Source'); a.href = ballotSource.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; ballotLine.append(' · ', a); }
  container.append(ballotLine);
  if (ballot?.sourceUpdatedAt) container.append(node('div', 'county-tip-note', `Source update: ${ballot.sourceUpdatedAt}`));
  appendResidentRatio(container, ballot, pop, year, office, rows);
  appendVotingMethods(container, ballot);
  if (ballot?.boundaryNote) container.append(node('p', 'county-tip-note', ballot.boundaryNote));
  if (regular) {
    const comparison = ballotComparison(ballotRecords, year, regular);
    const text = comparison.value == null
      ? `Voter change (reported ballots): N/A vs ${comparison.priorYear} · ${comparison.reason}`
      : `Voter change (reported ballots): ${change(comparison.value)} vs ${comparison.priorYear}${comparison.provisional ? ` · provisional compared with final ${comparison.priorYear}; counting continues` : ''}`;
    const line = node('p', 'county-tip-note', text);
    const priorSource = turnout?.sources?.[comparison.prior?.sourceId];
    if (priorSource?.url) { const a = node('a', 'county-tip-source', `${comparison.priorYear} source`); a.href = priorSource.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; line.append(' · ', a); }
    container.append(line);
  }
  if (!rows.length) { container.append(node('p', 'county-tip-note', 'No county returns available for this election.')); return; }
  const expectedYears = [...new Set(rows.map(row => expectedPriorYear(row, office, year)).filter(y => y != null))];
  const priorByYear = new Map();
  await Promise.all(expectedYears.map(async y => {
    if (!years.includes(y)) return;
    try { priorByYear.set(y, await previousData(office, y)); } catch { priorByYear.set(y, null); }
  }));
  if (!isCurrent()) return;
  for (const row of rows) {
    const card = node('div', 'county-tip-contest', '');
    const contestTitle = row.contestType === 'recall-question' ? 'Recall question · Yes / No' : row.contestType === 'replacement-election' ? 'Conditional replacement vote' : OFFICE_LABELS[office];
    const label = [contestTitle, office === 'house' ? `District ${row.district ?? '?'} · county portion` : '', row.seatId ? `Seat ${row.seatId}` : '', row.special ? 'Special' : '', row.stage || 'general', year].filter(Boolean).join(' · ');
    card.append(node('div', 'county-tip-label', label));
    if (row.sourceElectionOutcome) card.append(node('p', 'county-tip-note', row.sourceElectionOutcome));
    const metrics = contestMetrics(row);
    if (!metrics) { card.append(node('p', 'county-tip-note', 'Source needs review; counts withheld.')); container.append(card); continue; }
    let priorYear = expectedPriorYear(row, office, year);
    const prior = priorByYear.get(priorYear);
    const priorRows = (prior?.results || []).filter(r => r.geoLevel === 'county' && r.countyFips === id);
    let comparison = priorYear == null ? { reason: 'Comparable prior cycle cannot be established.' } : !prior ? { reason: 'Expected prior election returns unavailable.' } : compareContest(row, priorRows, office);
    const report=getPatternReviewReport(),stateFips=String(id).slice(0,2),special=report?.comparabilityContracts?.senateSpecials?.[stateFips],round=special||report?.comparabilityContracts?.senateRounds?.[stateFips];
    if(office==='senate'&&year===2026&&rows.length===1&&round?.verified&&Boolean(row.special)===Boolean(round.years[2026].special)&&row.stage===round.years[2026].stage&&row.sourceSeatId===round.seatId&&row.electionDate===round.years[2026].electionDate){
      const now=auditedSenateRoundCounts(report,id,2026),before=auditedSenateRoundCounts(report,id,round.baselineYear||2020);
      if(!now.reason&&!before.reason){priorYear=round.baselineYear||2020;comparison={...Object.fromEntries(['total','republican','democrat'].map(key=>[key,relativeChange(now[key],before[key])])),provisional:true};card.append(node('p','county-tip-note',special?'Changes below compare the same Senate seat: the 2022 regular election and 2026 special vacancy election. Candidates and election conditions may differ.':'Changes below compare the reviewed first November Senate ballots. Later runoffs are excluded; candidate fields and election conditions may differ.'));}
    }
    if(office==='senate'&&year===2026&&rows.length===1&&row.special===false&&row.stage==='general'){
      const now=auditedRegularSenateCounts(report,id,2026),before=auditedRegularSenateCounts(report,id,2020);
      if(!now.reason&&!before.reason&&['total','democrat','republican'].every(key=>metrics[key]===now[key])&&now.sourceIds.includes(row.sourceId)){
        priorYear=2020;comparison={...Object.fromEntries(['total','republican','democrat'].map(key=>[key,relativeChange(now[key],before[key])])),provisional:true};
        card.append(node('p','county-tip-note','Changes below use the assessed same-seat Class II Senate pair: 2020 and 2026. The presidential-year baseline and incomplete current reporting can affect these changes.'));
      }
    }
    const entries = row.contestType === 'recall-question'
      ? [['total', 'Reported votes on recall question'], ...row.candidates.filter(c => ['yes', 'no'].includes((c.name || '').toLowerCase())).map(c => [null, `${c.name} votes`, c.votes])]
      : [['total', metrics.totalBasis ? 'Candidate / write-in votes' : row.contestType === 'replacement-election' ? 'Reported replacement votes' : `Reported votes for ${OFFICE_LABELS[office]}`], ['republican', 'Republican votes'], ['democrat', 'Democratic votes']];
    for (const [key, title, choiceVotes] of entries) {
      const line = node('div', 'county-tip-line', '');
      line.append(node('span', '', title), node('b', '', fmt(key ? metrics[key] : choiceVotes)));
      card.append(line);
      if (!comparison.reason) {
        const notable = ['democrat', 'republican'].includes(key) && isLargePartyChange(comparison[key]);
        const changeLine = node('div', `county-tip-change${notable ? ' major-party-change' : ''}`, '');
        changeLine.append(node(notable ? 'strong' : 'span', '', `Change in reported votes: ${formatPartyChange(comparison[key])} vs ${priorYear}${notable ? ' · large party change (>15%)' : ''}${comparison[key] == null ? ' · not comparable' : ''}`));
        if (comparison.provisional) changeLine.append(node('span', 'change-caution', ' · provisional reported votes; counting continues'));
        card.append(changeLine);
      }
    }
    if (metrics.totalBasis) {
      card.append(node('p', 'county-tip-note', `Source-reported contest total: ${fmt(metrics.sourceReportedTotal)}. Includes unclassified reporting fields; these are excluded from candidate / write-in votes above.`));
    }
    if (comparison.reason) card.append(node('p', 'county-tip-note', `Change: N/A · ${comparison.reason}${priorYear ? ` (${priorYear})` : ''}`));
    if (row.provisional || row.unofficial || row.incomplete) card.append(node('p', 'county-tip-note', 'Partial or unofficial returns.'));
    if (row.sourceTotalConflict || row.voteTotalMismatch) card.append(node('p', 'county-tip-note', 'Reported total and candidate totals differ; source needs review.'));
    container.append(card);
  }
  container.append(node('p', 'county-tip-note', 'Contest votes are not a count of individual voters; totals can use different source bases. Other or unitemized votes are not assigned to a party.'));
}

function appendResidentRatio(container, ballot, pop, year, office, rows) {
  const ratio = ballotsPerResident(ballot?.ballotsCast, pop?.value);
  if (ratio == null) {
    const specialScope=getPatternReviewReport()?.comparabilityContracts?.senateSpecials?.[rows?.[0]?.stateFips];
    let contest = contestVotesPerResident(rows, office, pop?.value, specialScope);
    if(!contest&&office==='house'&&rows?.length){const row=rows[0],level=row.geoLevel==='county'?'county':'state',id=level==='county'?row.countyFips:row.stateFips,facts=scopedHouseFacts(rows,getPatternReviewReport(),id,year,level),value=ballotsPerResident(facts.total,pop?.value);if(!facts.reason&&value!=null)contest={value,votes:facts.total,provisional:facts.provisional,knownCandidateBasis:true};}
    if (contest) {
      container.append(node('p', 'county-tip-note contest-population-ratio', `Reported ${OFFICE_LABELS[office]} votes as % of population in ${year}: ${contest.value.toFixed(1)}% · ${fmt(contest.votes)} ${contest.knownCandidateBasis ? 'known candidate / write-in' : 'reported race'} votes ÷ ${fmt(pop.value)} residents (${pop.year} estimate)${contest.provisional ? ' · provisional' : ''}.`));
      container.append(node('p', 'county-tip-note', 'Race-vote measure: ballots that skipped this race are not included. Total residents include children. Actual ballots-cast participation remains unavailable; this figure is not used as a ballot total or turnout-anomaly input.'));
      return;
    }
    container.append(node('p', 'county-tip-note', `% of population that voted in ${year}: unavailable`));
    return;
  }
  container.append(node('p', 'county-tip-note', `% of population that voted in ${year}: ${ratio.toFixed(1)}% · reported ballots ÷ ${pop.year} resident population estimate${ballot.provisional || ballot.unofficial || ballot.incomplete ? ' · provisional; counting continues' : ''}. Total population includes children.`));
}

function appendVotingMethods(container, ballot) {
  const methods = votingMethodShares(ballot);
  if (!methods) {
    container.append(node('p', 'county-tip-note', 'Mail / polling-place shares: unavailable in this cycle’s data.'));
    return;
  }
  const line = node('p', 'county-tip-note', `Vote-by-mail ballots: ${methods.mail.toFixed(1)}% · Polling-place / vote-center ballots: ${methods.precinct.toFixed(1)}% of reported ballots.`);
  container.append(line, node('p', 'county-tip-note', 'Source categories, not physical return methods: mail ballots may be returned in person or at drop boxes.'));
  if (ballot.year === 2020) container.append(node('p', 'county-tip-note', 'Some 2020 counties also classified ballots issued at voting locations as vote-by-mail.'));
}

// State participation uses independently sourced statewide ballots, never sums of contests.
export async function renderStateMetrics(container, {name, state, id, office, year, years, rows = [], loading}, isCurrent = () => true) {
  container.replaceChildren(node('strong', 'county-tip-title', name || state));
  if (loading) { container.append(node('p', 'county-tip-note', 'Loading state returns…')); return; }
  const quick=node('div','county-quick-area','');container.append(quick);
  appendQuickResults(quick,rows,office,year,id);
  await appendPatternReview(container, { office, year, id, rows, level: 'state' }, isCurrent);
  if (!isCurrent()) return;
  quick.replaceChildren();appendQuickResults(quick,rows,office,year,id);
  const [populationData, turnout] = await Promise.all([loadPopulation(), loadTurnout()]);
  if (!isCurrent()) return;
  const pop = populationAt(populationData?.states?.[id] || [], office === 'geography' ? null : year);
  const popLine = node('div', 'county-tip-population', pop ? `Population: ${fmt(pop.value)} (${pop.referenceDate || pop.year} estimate)` : 'Population: unavailable');
  const popSource = populationData?.sources?.[pop?.sourceId];
  if (popSource?.url) { const a = node('a', 'county-tip-source', 'Source'); a.href = popSource.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; popLine.append(' · ', a); }
  container.append(popLine);
  if (pop?.note) container.append(node('p', 'county-tip-note', pop.note));
  if (office === 'geography') return;
  const ballotRecords = turnout?.states?.[id] || [];
  const ballot = regularNovemberBallot(ballotRecords, year);
  const regular = Boolean(ballot);
  const ballotLine = node('div', 'county-tip-population', ballot ? `Reported ballots cast · ${ballot.electionDate} general election: ${fmt(ballot.ballotsCast)}${ballot.provisional || ballot.unofficial ? ' · unofficial' : ''}` : 'Ballots cast: unavailable');
  const ballotSource = turnout?.sources?.[ballot?.sourceId];
  if (ballotSource?.url) { const a = node('a', 'county-tip-source', 'Source'); a.href = ballotSource.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; ballotLine.append(' · ', a); }
  container.append(ballotLine);
  if (ballot?.sourceUpdatedAt) container.append(node('div', 'county-tip-note', `Source update: ${ballot.sourceUpdatedAt}`));
  if (ballot?.boundaryNote) container.append(node('p', 'county-tip-note', ballot.boundaryNote));
  appendResidentRatio(container, ballot, pop, year, office, rows);
  appendVotingMethods(container, ballot);
  if (regular) {
    const comparison = ballotComparison(ballotRecords, year, regular);
    const text = comparison.value == null ? `Voter change (reported ballots): N/A vs ${comparison.priorYear} · ${comparison.reason}` : `Voter change (reported ballots): ${change(comparison.value)} vs ${comparison.priorYear}${comparison.provisional ? ` · provisional compared with final ${comparison.priorYear}; counting continues` : ''}`;
    const line = node('p', 'county-tip-note', text);
    const source = turnout?.sources?.[comparison.prior?.sourceId];
    if (source?.url) { const a = node('a', 'county-tip-source', `${comparison.priorYear} source`); a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; line.append(' · ', a); }
    container.append(line);
  }
}
