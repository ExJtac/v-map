import './style.css';
import './accountability.css';
import './person-profile.css';
import {appUrl} from './paths.js';
import {profileFromElection} from './candidate-profile-data.js';
import {renderPersonProfile,profileMetadata} from './person-profile-render.js';

const content=document.querySelector('#profile-content');
async function loadHistoricalRecord(){
  // Dedicated record pages keep their full static evidence and exact source identity.
  if(content.querySelector('[data-profile-id]'))return;
  const parameters=new URLSearchParams(location.search);
  if(!parameters.has('year')&&!parameters.has('contest')&&!parameters.has('candidate'))return;
  const year=Number(parameters.get('year')),contest=parameters.get('contest'),candidate=parameters.get('candidate');
  const message=document.createElement('p');message.className='profile-loading';message.setAttribute('role','status');message.textContent='Loading the selected election source record…';content.append(message);
  try{
    if(!Number.isInteger(year)||!contest||!candidate)throw Error('Use a complete candidate link from the election directory.');
    const manifestResponse=await fetch(appUrl('data/winners/manifest.json'));
    if(!manifestResponse.ok)throw Error('The election-year inventory could not load.');
    const manifest=await manifestResponse.json(),entry=manifest.years?.find(item=>item.year===year);
    if(!entry||typeof entry.url!=='string')throw Error('The selected election year is not available in this source inventory.');
    const response=await fetch(appUrl(entry.url));if(!response.ok)throw Error('The selected election records could not load.');
    const data=await response.json();if(data.year!==year||!Array.isArray(data.results))throw Error('The selected source returned an unexpected election year.');
    const matches=data.results.filter(row=>row.key===contest&&row.leader?.name===candidate);
    if(matches.length!==1)throw Error('No unique qualified record matches this exact year, contest and reported candidate. Return to the directory to choose a current source link.');
    const profile=profileFromElection(matches[0],year);
    if(profile.accountability)throw Error('Historical source records must not inherit a 2026 accountability profile.');
    content.innerHTML=renderPersonProfile(profile,{snapshotDate:data.snapshotDate});
    const metadata=profileMetadata(profile,{route:'people/?'+new URLSearchParams({year:String(year),contest,candidate})});
    document.title=metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content',metadata.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',metadata.canonical);
    for(const [property,value] of [['og:title',metadata.title],['og:description',metadata.description],['og:url',metadata.canonical]])document.querySelector(`meta[property="${property}"]`)?.setAttribute('content',value);
    const schema=document.querySelector('#person-profile-schema');
    if(schema)schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:metadata.title,description:metadata.description,url:metadata.canonical});
  }catch(error){
    message.setAttribute('role','alert');message.className='profile-error';message.textContent=error instanceof Error?error.message:'The selected election source record could not load.';
  }
}
loadHistoricalRecord();
