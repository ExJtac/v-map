/** Source-linked, escaped HTML shared by the static pilot and its filters. */
import {appUrl} from './paths.js';

export const escapeAccountabilityHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const esc = escapeAccountabilityHtml;
const entries = value => Array.isArray(value) ? value : [];
const texts = value => (Array.isArray(value) ? value : [value]).filter(item => typeof item === 'string' && item.trim());
const text = value => texts(value).join(' ');
const human = value => String(value ?? '').replaceAll('_',' ').replace(/\b\w/g, letter => letter.toUpperCase());
const offices = {senate:'U.S. Senate',house:'U.S. House',governor:'Governor'};
const phases = {campaign:'Campaign statement',after_election:'After election day',prior_record:'Prior public record',unknown:'Statement date / phase not established'};

export function safeAccountabilityUrl(value) {
  try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
function sourceLink(url, label, className='') {
  const safe = safeAccountabilityUrl(url);
  return safe ? `<a${className ? ` class="${esc(className)}"` : ''} href="${esc(safe)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>` : '';
}
function paragraphs(value, className='accountability-note') {
  return texts(value).map(item => `<p class="${esc(className)}">${esc(item)}</p>`).join('');
}
function sourceList(urls, label) {
  return [...new Set(entries(urls))].map((url,index) => sourceLink(url,`${label}${index ? ` ${index+1}` : ''}`)).filter(Boolean).join(' ');
}
export function accountabilityDate(value, fallback='Date not established') {
  if (!value || typeof value !== 'string') return fallback;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|$)/);
  if (!match) return value;
  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00Z`);
  return Number.isFinite(date.valueOf()) ? date.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}) : value;
}
export function accountabilitySubjectId(subject) {
  return 'person-'+String(subject.id || '').replace(/[^a-zA-Z0-9_-]/g,'-');
}
export function accountabilityStatementId(statement) {
  // Encoding every code point avoids collisions when source IDs contain punctuation.
  return 'statement-'+Array.from(String(statement.id || '')).map(character=>character.codePointAt(0).toString(16)).join('-');
}
function officeLabel(subject) {
  const district = subject.office==='house' && subject.district !== null && subject.district !== undefined ? ` · ${Number(subject.district)===0 ? 'At-large' : `District ${subject.district}`}` : '';
  return (offices[subject.office] || human(subject.office)) + district;
}
function partyLabel(party) { return party==='Democrat' ? 'Democratic' : party || 'Party not established'; }

export function filteredAccountabilitySubjects(data, filters={}) {
  const query=String(filters.search || '').trim().toLowerCase();
  return entries(data.subjects).filter(subject => (!filters.party || subject.party===filters.party)
    && (!filters.office || subject.office===filters.office)
    && (!query || `${subject.name} ${subject.state} ${officeLabel(subject)} ${text(subject.publicationNotes)} ${entries(subject.statements).map(statement => `${statement.quote || ''} ${statement.context || ''}`).join(' ')} ${entries(subject.actions).map(action => `${action.title || ''} ${action.description || ''} ${action.recordId || ''}`).join(' ')}`.toLowerCase().includes(query)));
}

function statementHtml(statement) {
  const fullSource = sourceLink(statement.fullSourceUrl || statement.sourceUrl,'Read the full original source','accountability-source-link');
  const differentSource = statement.sourceUrl && statement.sourceUrl!==statement.fullSourceUrl ? sourceLink(statement.sourceUrl,'Statement location') : '';
  return `<article id="${esc(accountabilityStatementId(statement))}" class="accountability-evidence accountability-statement" data-statement-id="${esc(statement.id)}"><div class="accountability-evidence-meta"><span>${esc(phases[statement.phase] || human(statement.phase))}</span><span>${esc(accountabilityDate(statement.date))}</span></div>${statement.attribution ? `<p class="accountability-attribution">${esc(statement.attribution)}</p>` : ''}${statement.quote ? `<blockquote><p>“${esc(statement.quote)}”</p></blockquote>` : '<p>Exact excerpt not verified in this review.</p>'}${paragraphs(statement.context,'accountability-context')}${statement.dateBasis ? `<p class="accountability-note"><strong>Date basis:</strong> ${esc(statement.dateBasis)}</p>` : ''}${statement.locator ? `<p class="accountability-note"><strong>Where to look:</strong> ${esc(statement.locator)}</p>` : ''}<div class="accountability-source-links">${fullSource}${differentSource}</div>${paragraphs(statement.limits)}</article>`;
}
function actionHtml(action, statements) {
  const relationship = {related:'Related official record',supports_narrow_claim:'Record supports the specific step described',not_yet_assessable:'Prospective commitment not yet assessable'}[action.relationship] || 'Official record';
  const related = entries(action.relatedStatementIds).map(id=>statements.find(statement=>statement.id===id)).filter(Boolean);
  const linkedStatements=related.map(statement=>`<a href="#${esc(accountabilityStatementId(statement))}">${esc(phases[statement.phase] || human(statement.phase))} · ${esc(accountabilityDate(statement.date))}</a>`).join('; ');
  return `<article class="accountability-evidence accountability-action" data-action-id="${esc(action.id)}"><div class="accountability-evidence-meta"><span>${esc(human(action.type) || 'Official action')}</span><span>${esc(accountabilityDate(action.date))}</span></div><h4>${esc(action.title || action.recordId || 'Official record')}</h4>${action.recordId ? `<p class="accountability-record-id">${esc(action.recordId)}</p>` : ''}${paragraphs(action.description,'accountability-context')}<p class="accountability-relationship">${esc(relationship)}</p>${related.length ? `<p class="accountability-note accountability-matched-statements"><strong>Related source ${related.length===1 ? 'statement' : 'statements'}:</strong> ${linkedStatements}. Chronology and authority limits below still apply.</p>` : ''}<div class="accountability-source-links">${sourceLink(action.sourceUrl,'Read the full official record','accountability-source-link')}</div>${paragraphs(action.limits)}</article>`;
}
function statementLanes(statements) {
  const campaign=statements.filter(statement=>statement.phase==='campaign');
  const afterElection=statements.filter(statement=>statement.phase==='after_election');
  const other=statements.filter(statement=>!['campaign','after_election'].includes(statement.phase));
  return `<h4 class="accountability-subheading">Campaign-source statements</h4>${campaign.length ? campaign.map(statementHtml).join('') : '<p class="accountability-gap">No campaign statement verified in this review. This does not establish that none were made.</p>'}<h4 class="accountability-subheading accountability-after-election">Statements after election day</h4>${afterElection.length ? afterElection.map(statementHtml).join('') : '<p class="accountability-gap">No statement after the election has been verified in this review. This does not establish that none were made.</p>'}${other.length ? `<h4 class="accountability-subheading accountability-after-election">Other source statements</h4>${other.map(statementHtml).join('')}` : ''}`;
}
function recordLinksHtml(subject) {
  const links=entries(subject.recordLinks).map(record=>{
    const link=sourceLink(record.url,record.label || 'Official record directory');
    return link ? `<li>${link}${paragraphs(record.scope)}</li>` : '';
  }).filter(Boolean);
  return links.length ? `<div class="accountability-record-directories"><h4>Official record directories</h4><p class="accountability-note">These directories support further inspection. A link does not mean that every record was reviewed or matched to a campaign commitment.</p><ul>${links.join('')}</ul></div>` : '';
}
function accountsHtml(subject) {
  const accounts=entries(subject.accounts),archives=entries(subject.archives),coverage=subject.coverage || {};
  const accountItems=accounts.map(account => `<li><div class="accountability-record-heading"><strong>${esc(account.platform || 'Public account')}</strong>${sourceLink(account.url,'Open public account')}</div><p class="accountability-note">${esc(human(account.type) || 'Account type not established')} · Account linkage: ${esc(human(account.ownershipStatus) || 'Not established')} · Access: ${esc(human(account.accessStatus) || 'Not established')}</p>${paragraphs(account.notes)}<div class="accountability-small-links">${sourceList(account.ownershipEvidenceUrls,'Ownership / linkage source')}</div></li>`).join('');
  const archiveItems=archives.map(archive => `<li><div class="accountability-record-heading"><strong>${archive.contentReviewed ? 'Archive content reviewed' : 'Archive content not verified'}</strong>${sourceLink(archive.archiveUrl,'Open archive capture')}</div><p class="accountability-note">Capture: ${esc(accountabilityDate(archive.captureDate,'Capture date not established'))} · Removal / deletion status: ${esc(human(archive.deletionStatus) || 'Not established')}</p><div class="accountability-small-links">${sourceLink(archive.originalUrl,'Original URL')}</div>${paragraphs(archive.notes)}</li>`).join('');
  return `<details class="accountability-coverage"><summary>Public accounts, archives & review coverage <span>${accounts.length} account ${accounts.length===1?'link':'links'} · ${archives.length} archive ${archives.length===1?'check':'checks'}</span></summary><div class="accountability-coverage-content"><h4>Known public account links</h4><p class="accountability-note">Account linkage and access to its post history are separate checks. This list is not a complete social-media history.</p>${accountItems ? `<ul class="accountability-record-list">${accountItems}</ul>` : '<p class="accountability-gap">Not verified in this review.</p>'}<h4>Archive and removal checks</h4><p class="accountability-note">A capture date is not a post date. An unavailable URL or missing capture does not establish deletion by its author.</p>${archiveItems ? `<ul class="accountability-record-list">${archiveItems}</ul>` : '<p class="accountability-gap">Not verified in this review.</p>'}<h4>What this pass covered</h4>${coverage.cutoff ? `<p class="accountability-note">Research cutoff: ${esc(coverage.cutoff)}</p>` : ''}${entries(coverage.checkedPlatforms).length ? `<p class="accountability-note">Platforms inventoried or checked: ${esc(entries(coverage.checkedPlatforms).join(', '))}.</p>` : ''}${paragraphs(coverage.postElectionSearch)}${paragraphs(coverage.archiveSearch)}${paragraphs(coverage.limits)}</div></details>`;
}
export function renderAccountabilitySubject(subject) {
  const statements=entries(subject.statements).filter(statement=>statement.verified===true),actions=entries(subject.actions);
  const identity=subject.identity || {},outcome=subject.outcome || {};
  return `<article id="${esc(accountabilitySubjectId(subject))}" class="accountability-person" data-subject-id="${esc(subject.id)}"><header class="accountability-person-header"><div><p class="accountability-place">${esc(subject.state)} · ${esc(officeLabel(subject))}</p><h2><a href="#${esc(accountabilitySubjectId(subject))}">${esc(subject.name)}</a></h2><div class="accountability-tags"><span>${esc(partyLabel(subject.party))}</span><span>${esc(human(outcome.status) || 'Outcome not independently established')}</span></div></div><a class="accountability-permalink" href="#${esc(accountabilitySubjectId(subject))}" aria-label="Link to ${esc(subject.name)}">Link to this candidate <span aria-hidden="true">#</span></a></header><div class="accountability-person-scope">${identity.status ? `<p>Identity: <strong>${esc(human(identity.status))}</strong>.</p>` : ''}${paragraphs(identity.notes)}${paragraphs(outcome.note)}<div class="accountability-small-links">${sourceList(identity.evidenceUrls,'Identity source')}${sourceList(outcome.sourceUrls,'Election-status source')}</div></div><div class="accountability-comparison"><section class="accountability-lane" aria-label="Statements from ${esc(subject.name)}"><div class="accountability-lane-heading"><span aria-hidden="true">01</span><h3>What the sources say</h3></div>${statementLanes(statements)}</section><section class="accountability-lane" aria-label="Official records relating to ${esc(subject.name)}"><div class="accountability-lane-heading"><span aria-hidden="true">02</span><h3>What the official record shows</h3></div>${actions.length ? actions.map(action=>actionHtml(action,statements)).join('') : '<p class="accountability-gap">No official action verified in this review. This does not establish that no relevant action occurred.</p>'}${recordLinksHtml(subject)}</section></div>${paragraphs(subject.publicationNotes,'accountability-publication-note')}${accountsHtml(subject)}</article>`;
}
export function renderAccountability(data,{base,filters={}}={}) {
  // Keep mount handling explicit in the shared contract, even though card sources are external.
  const subjects=filteredAccountabilitySubjects(data,filters);
  return subjects.length ? subjects.map(renderAccountabilitySubject).join('\n') : `<div class="accountability-empty"><h2>No matching candidates</h2><p>Try a different name, office, party or source topic.</p><a href="${esc(appUrl('accountability/',base))}">Reset the pilot view</a></div>`;
}
export function renderAccountabilityJumpLinks(data,{filters={}}={}) {
  return filteredAccountabilitySubjects(data,filters).map(subject=>`<a href="#${esc(accountabilitySubjectId(subject))}">${esc(subject.name)}</a>`).join('');
}
export function accountabilitySummary(data,count=entries(data.subjects).length) {
  const reviewed=new Date(data.reviewedAt);
  const date=Number.isFinite(reviewed.valueOf()) ? reviewed.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'America/Denver'})+' MT' : 'date not established';
  return `${count} of ${entries(data.subjects).length} pilot candidates shown · Manual review ${date} · Source coverage varies by candidate.`;
}
export function renderAccountabilityIntroduction(data) {
  return paragraphs(data.scope,'accountability-scope')+paragraphs(data.methodology,'accountability-methodology');
}

// Reuse the approved complete evidence and limits on dedicated person profiles.
export function renderAccountabilityStatements(subject){return statementLanes(entries(subject.statements).filter(s=>s.verified===true));}
export function renderAccountabilityActions(subject){const statements=entries(subject.statements).filter(s=>s.verified===true);return entries(subject.actions).map(a=>actionHtml(a,statements)).join('')+recordLinksHtml(subject);}
export function renderAccountabilityAccounts(subject){return accountsHtml(subject);}
