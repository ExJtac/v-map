import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2), phase=args[0]||'complete';
if(!['checking','complete','error'].includes(phase))throw new Error('Use checking, complete or error.');
const stateFile=path.join(root,'.vmap-research-state.local.json');
let previous={};try{previous=JSON.parse(fs.readFileSync(stateFile,'utf8'));}catch{}
const now=new Date().toISOString(),release=args.includes('--release')?args[args.indexOf('--release')+1]:null;
const status={schemaVersion:1,schedulerConfigured:true,cadenceMinutes:5,phase,worker:'Codex local scheduled research',lastVerifiedCheckAt:phase==='complete'?now:previous.lastVerifiedCheckAt||null,lastStartedAt:phase==='checking'?now:previous.lastStartedAt||null,lastPublishedAt:release?now:previous.lastPublishedAt||null,lastPublishedRelease:release||previous.lastPublishedRelease||null,updatedAt:now};
fs.writeFileSync(stateFile,JSON.stringify(status,null,2)+'\n',{mode:0o600});
if(args.includes('--bundle'))fs.writeFileSync(path.join(root,'public/data/research-status.json'),JSON.stringify(status)+'\n');
if(args.includes('--publish')) {
  const config=JSON.parse(fs.readFileSync(path.join(root,'.vmap-deploy.local.json'),'utf8'));
  if(!config.host||!config.identityFile)throw new Error('Local deployment configuration missing.');
  const program="import json,os,sys,tempfile; data=json.load(sys.stdin); folder='/var/www/vmap-status'; f=tempfile.NamedTemporaryFile(mode='w',dir=folder,delete=False); json.dump(data,f); f.write('\\n'); f.close(); os.chmod(f.name,0o644); os.replace(f.name,folder+'/research-status.json')";
  const quote=value=>"'"+value.replaceAll("'","'\"'\"'")+"'";
  execFileSync('ssh',['-i',config.identityFile,'-o','BatchMode=yes','-o','StrictHostKeyChecking=yes',config.host,'python3 -c '+quote(program)],{input:JSON.stringify(status),stdio:['pipe','pipe','pipe']});
}
console.log(JSON.stringify({phase,checkedAt:status.lastVerifiedCheckAt,published:Boolean(args.includes('--publish')),release:status.lastPublishedRelease}));
