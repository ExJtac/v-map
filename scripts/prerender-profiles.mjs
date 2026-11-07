import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {renderPersonProfile,renderProfileLanding,profileMetadata,escapeProfileHtml} from '../src/person-profile-render.js';

const projectRoot=fileURLToPath(new URL('../',import.meta.url));
const profileSource=path.join(projectRoot,'public/data/candidates/profiles-2026.json');
const bodyPattern=/<!--vmap:profile-start-->[\s\S]*?<!--vmap:profile-end-->/;
function replaceBody(html,body){
  if(!bodyPattern.test(html))throw Error('Profile template markers are missing.');
  return html.replace(bodyPattern,()=>`<!--vmap:profile-start-->${body}<!--vmap:profile-end-->`);
}
function replaceMeta(html,metadata){
  const esc=escapeProfileHtml;
  let result=html.replace(/<title>[\s\S]*?<\/title>/i,()=>`<title>${esc(metadata.title)}</title>`);
  result=result.replace(/<meta\b[^>]*>/gi,tag=>{
    const attributes=Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(([,key,value])=>[key.toLowerCase(),value]));
    const value=attributes.name==='description'?metadata.description:attributes.property==='og:title'?metadata.title:attributes.property==='og:description'?metadata.description:attributes.property==='og:url'?metadata.canonical:null;
    return value===null?tag:tag.replace(/content\s*=\s*["'][^"']*["']/i,()=>`content="${esc(value)}"`);
  });
  result=result.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/i,()=>`<link rel="canonical" href="${esc(metadata.canonical)}" />`);
  const schema=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:metadata.title,description:metadata.description,url:metadata.canonical,isPartOf:{'@type':'WebSite',name:'V-Map',url:'https://voteranomaly.com/'}}).replace(/</g,'\\u003c');
  return result.replace(/(<script\b[^>]*id=["']person-profile-schema["'][^>]*>)[\s\S]*?(<\/script>)/i,(_,open,close)=>open+schema+close);
}
export function renderProfileDocument(template,profile,options={}){
  return replaceMeta(replaceBody(template,renderPersonProfile(profile,options)),profileMetadata(profile));
}
export function profilesPrerenderPlugin(){
  let outputDirectory,base='/',command;
  return {name:'vmap-dedicated-profile-pages',configResolved(config){base=config.base;outputDirectory=path.resolve(config.root,config.build.outDir);command=config.command;},transformIndexHtml:{order:'pre',handler(html){return html.includes('<!--vmap:profile-body-->')?html.replace('<!--vmap:profile-body-->',()=>renderProfileLanding({base})):html;}},closeBundle(){
    if(command!=='build')return;
    const bytes=fs.readFileSync(profileSource),data=JSON.parse(bytes);
    if(data.schemaVersion!==1||data.year!==2026||!Array.isArray(data.profiles))throw Error('Invalid 2026 profile source inventory.');
    const winners=JSON.parse(fs.readFileSync(path.join(projectRoot,'public/data/winners/2026.json'),'utf8'));
    const qualified=new Map(winners.results.filter(row=>row.leader).map(row=>[row.key,row]));
    if(data.profiles.length!==qualified.size)throw Error('Profile count does not match qualified election records.');
    const ids=new Set(),paths=new Set(),keys=new Set();
    const template=fs.readFileSync(path.join(outputDirectory,'people/index.html'),'utf8');
    const sourceHash=crypto.createHash('sha256').update(bytes).digest('hex');
    for(const profile of data.profiles){
      if(typeof profile.path!=='string'||!/^people\/2026\/[a-zA-Z0-9_-]+\/$/.test(profile.path))throw Error('Unsafe dedicated profile path.');
      const election=profile.election,expected=qualified.get(election?.key);
      if(!expected||election.year!==2026||expected.leader.name!==election.leader?.name||ids.has(profile.id)||paths.has(profile.path)||keys.has(election.key))throw Error('Duplicate or unmatched election profile.');
      ids.add(profile.id);paths.add(profile.path);keys.add(election.key);
      const html=renderProfileDocument(template,profile,{base,snapshotDate:data.snapshotDate,updatedAt:data.updatedAt,sourceHash});
      const directory=path.join(outputDirectory,profile.path);fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'index.html'),html);
    }
    console.log(JSON.stringify({profilesRendered:data.profiles.length,profileSourceHash:sourceHash,profileBase:base}));
  }};
}
