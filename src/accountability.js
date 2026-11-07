import './style.css';
import './accountability.css';
import {appUrl} from './paths.js';
import {renderAccountability,renderAccountabilityJumpLinks,accountabilitySummary,filteredAccountabilitySubjects} from './accountability-render.js';
import {validateAccountability} from './accountability-data.js';

const $=selector=>document.querySelector(selector);
const controls=$('#accountability-controls'),results=$('#accountability-results');
let data;
function render() {
  if(!data)return;
  const filters={search:$('#accountability-search').value,office:$('#accountability-office').value,party:$('#accountability-party').value};
  results.innerHTML=renderAccountability(data,{filters});
  $('#accountability-jump-links').innerHTML=renderAccountabilityJumpLinks(data,{filters});
  $('#accountability-summary').textContent=accountabilitySummary(data,filteredAccountabilitySubjects(data,filters).length);
}
controls.addEventListener('submit',event=>event.preventDefault());
controls.addEventListener('input',render);
controls.addEventListener('change',render);
controls.addEventListener('reset',()=>queueMicrotask(render));
async function init() {
  try {
    const response=await fetch(appUrl('data/candidates/pilot-2026.json'));
    if(!response.ok)throw Error('Pilot records unavailable');
    const next=await response.json();
    validateAccountability(next);
    data=next;
    controls.querySelectorAll('input,select,button').forEach(control=>control.disabled=false);
    // The source-qualified initial HTML remains visible until this enhancement succeeds.
    // Keeping it in place also preserves a candidate hash opened from a shared URL.
    $('#accountability-summary').textContent=accountabilitySummary(data);
  } catch {
    $('#accountability-error').textContent='Interactive filters could not load. The dated pilot records and full-source links below remain available. Reload the page to retry.';
    $('#accountability-error').hidden=false;
  }
}
init();
