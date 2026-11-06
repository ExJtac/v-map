import {appUrl} from './paths.js';

export function researchIsRecent(status, now=Date.now()) {
  const checked=Date.parse(status?.lastVerifiedCheckAt || '');
  return status?.phase!=='error' && Number.isFinite(checked) && now>=checked && now-checked<=6*60*1000;
}

export function initResearchStatus() {
  const banner=document.querySelector('#research-activity'), title=document.querySelector('#research-activity-title'), detail=document.querySelector('#research-activity-detail');
  let status;
  const date=value=>new Date(value).toLocaleString('en-US',{timeZone:'America/Denver',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
  function render() {
    banner.hidden=false;
    if (!status?.schedulerConfigured) {title.textContent='V-MAP AI-assisted election research';detail.textContent='Verified county data and review signals are published as they become available.';return;}
    const stale=!researchIsRecent(status);
    title.textContent=stale?'V-MAP Research update is delayed':'V-MAP Research is being updated every 5 minutes';
    banner.classList.toggle('research-delayed',stale);
    detail.textContent=`Five-minute AI-assisted research checks are scheduled. Verified changes are published when available. ${status.lastVerifiedCheckAt?`Latest successful check: ${date(status.lastVerifiedCheckAt)} MT.`:'Waiting for the first completed check.'}${status.lastPublishedAt?` Latest publication: ${date(status.lastPublishedAt)} MT.`:''}${stale?' The scheduled worker has not reported a recent successful check.':''}`;
  }
  async function refresh() {
    try {const response=await fetch(appUrl('/data/research-status.json'),{cache:'no-store'});if(response.ok)status=await response.json();} catch { /* Age-based delayed state still applies. */ }
    render();
  }
  refresh();setInterval(refresh,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
}
