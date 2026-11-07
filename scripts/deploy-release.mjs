/** One validated source revision, both V-Map production mounts. No shared-service changes. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import https from 'node:https';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(root);
const run=(command,args,options={})=>execFileSync(command,args,{cwd:root,encoding:'utf8',...options});
const clean=()=>{if(run('git',['status','--porcelain']).trim())throw new Error('Commit and freeze source before publishing.');};
clean();
const commit=run('git',['rev-parse','HEAD']).trim();
if(!/^[a-f0-9]{40}$/.test(commit))throw new Error('Invalid source revision.');
run('npm',['run','build:hosted'],{stdio:'inherit'});
run('node',['scripts/build-domain.mjs'],{stdio:'inherit'});
run('npm',['run','verify:packaged'],{stdio:'inherit'});
run('node',['scripts/verify-seo-canonicals.mjs','--require-artifacts'],{stdio:'inherit'});
run('node',['scripts/verify-winners-prerender.mjs','--require-artifacts'],{stdio:'inherit'});
run('node',['scripts/verify-accountability.mjs','--require-artifacts'],{stdio:'inherit'});
clean();
if(run('git',['rev-parse','HEAD']).trim()!==commit)throw new Error('Source changed during build.');
const configuration=JSON.parse(fs.readFileSync('.vmap-deploy.local.json','utf8'));
if(!/^[\w.-]+@[\w.-]+$/.test(configuration.host)||!path.isAbsolute(configuration.identityFile))throw new Error('Invalid local SSH configuration.');
const sshArgs=['-i',configuration.identityFile,'-o','BatchMode=yes','-o','StrictHostKeyChecking=yes'];
const ssh=(program)=>run('ssh',[...sshArgs,configuration.host,'python3 -'],{input:program});
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function files(directory,prefix='') {
  return Object.fromEntries(fs.readdirSync(path.join(directory,prefix),{withFileTypes:true}).flatMap(entry=>{
    const relative=path.join(prefix,entry.name);
    if(entry.isSymbolicLink())throw new Error(`Artifact symlink is not allowed: ${relative}`);
    return entry.isDirectory()?Object.entries(files(directory,relative)):[[relative,digest(fs.readFileSync(path.join(directory,relative)))]];
  }));
}
const cas=files('dist'),domain=files('dist-domain');
const casData=Object.keys(cas).filter(file=>file.startsWith('data/')).sort();
const domainData=Object.keys(domain).filter(file=>file.startsWith('data/')).sort();
if(JSON.stringify(casData)!==JSON.stringify(domainData))throw new Error('The two data releases have different file sets.');
for(const file of casData)if(cas[file]!==domain[file])throw new Error(`The two data releases disagree: ${file}`);
const date=new Date().toISOString().slice(0,10).replaceAll('-','');
const release=`${date}-${commit.slice(0,7)}`;
const receipt=fs.mkdtempSync(path.join(os.tmpdir(),'vmap-release-'));
fs.writeFileSync(path.join(receipt,'cas-manifest.json'),JSON.stringify(cas));
fs.writeFileSync(path.join(receipt,'domain-manifest.json'),JSON.stringify(domain));
const previous=JSON.parse(ssh("import json,pathlib; print(json.dumps({key:str(pathlib.Path('/var/www/'+key).resolve()) for key in ['vmap','voteranomaly']}))"));
for(const key of ['vmap','voteranomaly'])if(!previous[key].startsWith(`/var/www/${key}-releases/`))throw new Error(`Unexpected active ${key} root.`);
const spec={release,commit,previous};
const payload=Buffer.from(JSON.stringify(spec)).toString('base64');
const prelude=`import base64,json,pathlib,subprocess,hashlib,os,fcntl\nspec=json.loads(base64.b64decode('${payload}'))\n`;
const receiptPrelude=`
receipt_path=pathlib.Path('/home/deploy/vmap-release-receipts')/spec['release']/'release.json'
def save_receipt(record):
 temporary=receipt_path.with_suffix('.json.next'); temporary.write_text(json.dumps(record)); os.replace(temporary,receipt_path)
def active_targets():
 return {key:str(pathlib.Path('/var/www/'+key).resolve()) for key in ['vmap','voteranomaly']}
record={'release':spec['release'],'commit':spec['commit'],'previous':spec['previous'],'bothArtifactTreesVerified':True}
`;
ssh(prelude+`
for key in ['vmap','voteranomaly']:
 base=pathlib.Path('/home/deploy/'+key+'-releases'); stage=base/spec['release']; assert not stage.exists()
 assert str(pathlib.Path('/var/www/'+key).resolve())==spec['previous'][key]
 previous_upload=base/pathlib.Path(spec['previous'][key]).name
 if previous_upload.is_dir(): subprocess.run(['cp','-a',str(previous_upload),str(stage)],check=True)
 else: stage.mkdir(parents=True)
pathlib.Path('/home/deploy/vmap-release-receipts/'+spec['release']).mkdir(parents=True,exist_ok=False)
`);
const quote=value=>"'"+value.replaceAll("'","'\"'\"'")+"'";
const transport=['ssh',...sshArgs].map(quote).join(' ');
for(const [key,directory] of [['vmap','dist'],['voteranomaly','dist-domain']])run('rsync',['-az','--delete','-e',transport,`${directory}/`,`${configuration.host}:/home/deploy/${key}-releases/${release}/`],{stdio:'inherit'});
run('scp',[...sshArgs,path.join(receipt,'cas-manifest.json'),path.join(receipt,'domain-manifest.json'),`${configuration.host}:/home/deploy/vmap-release-receipts/${release}/`],{stdio:'inherit'});
const promotion=ssh(prelude+receiptPrelude+`
lock=open('/home/deploy/.vmap-release.lock','a'); fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
for key,manifest in [('vmap','cas-manifest.json'),('voteranomaly','domain-manifest.json')]:
 stage=pathlib.Path('/home/deploy/'+key+'-releases')/spec['release']
 expected=json.loads((pathlib.Path('/home/deploy/vmap-release-receipts')/spec['release']/manifest).read_text())
 actual={str(p.relative_to(stage)):hashlib.sha256(p.read_bytes()).hexdigest() for p in stage.rglob('*') if p.is_file()}
 assert expected==actual, key+' artifact mismatch'
 assert str(pathlib.Path('/var/www/'+key).resolve())==spec['previous'][key], key+' changed during upload'
 target=pathlib.Path('/var/www/'+key+'-releases')/spec['release']; assert not target.exists()
 subprocess.run(['sudo','cp','-a',str(stage),str(target)],check=True);subprocess.run(['sudo','chown','-R','caddy:caddy',str(target)],check=True)
promoted=[]
try:
 for key in ['vmap','voteranomaly']:
  target='/var/www/'+key+'-releases/'+spec['release']; link='/var/www/'+key+'.next-'+spec['release']; assert not pathlib.Path(link).exists()
  subprocess.run(['sudo','ln','-s',target,link],check=True);subprocess.run(['sudo','mv','-Tf',link,'/var/www/'+key],check=True);promoted.append(key)
 record.update(status='promoted',activeTargets=active_targets()); save_receipt(record)
except Exception as error:
 recovery_errors=[]
 for key in promoted:
  try:
   assert str(pathlib.Path('/var/www/'+key).resolve())=='/var/www/'+key+'-releases/'+spec['release'], key+' changed before rollback'
   link='/var/www/'+key+'.rollback-'+spec['release'];subprocess.run(['sudo','ln','-s',spec['previous'][key],link],check=True);subprocess.run(['sudo','mv','-Tf',link,'/var/www/'+key],check=True)
  except Exception as recovery_error: recovery_errors.append(key+': '+str(recovery_error))
 record.update(status='promotion_failed',error=str(error),recoveryErrors=recovery_errors,activeTargets=active_targets()); save_receipt(record)
 raise
print(json.dumps(record))
`);
function verifyOnce(origin,file,expected) {
  return new Promise((resolve,reject)=>{
    // Check the configured origin with normal TLS hostname/certificate validation.
    const request=https.get(new URL(file==='index.html'?'':file,origin),response=>{
      const chunks=[];response.on('data',chunk=>chunks.push(chunk));response.on('end',()=>response.statusCode===200 && digest(Buffer.concat(chunks))===expected?resolve():reject(new Error(`Live release mismatch: ${origin}${file}`)));
    });request.setTimeout(30000,()=>request.destroy(new Error('Live origin verification timed out.')));request.on('error',reject);
  });
}
async function verify(origin,file,expected) {
  // Retry only transient resolver failures; retain normal TLS and exact hash checks.
  for(let attempt=0;attempt<3;attempt++){
    try{return await verifyOnce(origin,file,expected);}
    catch(error){
      if(attempt===2||!['ENOTFOUND','EAI_AGAIN'].includes(error.code))throw error;
      await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));
    }
  }
}
let outcome=JSON.parse(promotion);
const localReceipt=path.join(receipt,'release.json');
try {
  // Persist the successful pointer swap before making any public requests.
  fs.writeFileSync(localReceipt,JSON.stringify(outcome));
  for(const [origin,manifest] of [['https://cas-tx.com/vmap/',cas],['https://voteranomaly.com/',domain]]) {
    const checks=['index.html','winners/index.html','accountability/index.html','data/candidates/pilot-2026.json','sitemap.xml','share/v-map-logo-v2.png',...Object.keys(manifest).filter(file=>file.startsWith('data/winners/')),...Object.keys(manifest).filter(file=>file.startsWith('assets/') && (file.endsWith('.js')||file.endsWith('.css')))];
    await Promise.all(checks.map(file=>verify(origin,file,manifest[file])));
  }
  outcome=JSON.parse(ssh(prelude+receiptPrelude+`
record=json.loads(receipt_path.read_text()); record.update(status='public_verified',verifiedPublicOrigins=['https://voteranomaly.com/','https://cas-tx.com/vmap/']); save_receipt(record); print(json.dumps(record))
`));
  fs.writeFileSync(localReceipt,JSON.stringify(outcome));
} catch(error) {
  const failure=Buffer.from(JSON.stringify(String(error.message??error))).toString('base64');
  try {
    outcome=JSON.parse(ssh(prelude+receiptPrelude+`
lock=open('/home/deploy/.vmap-release.lock','a'); fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
record=json.loads(receipt_path.read_text()); record.update(status='public_verification_failed',error=json.loads(base64.b64decode('${failure}')))
active=active_targets(); expected={key:'/var/www/'+key+'-releases/'+spec['release'] for key in ['vmap','voteranomaly']}
if active!=expected:
 record.update(status='rollback_skipped_pointer_changed',activeTargets=active,expectedTargets=expected)
else:
 recovery_errors=[]
 for key in ['vmap','voteranomaly']:
  try:
   assert str(pathlib.Path('/var/www/'+key).resolve())==expected[key], key+' changed before rollback'
   link='/var/www/'+key+'.recovery-'+spec['release']; subprocess.run(['sudo','ln','-s',spec['previous'][key],link],check=True); subprocess.run(['sudo','mv','-Tf',link,'/var/www/'+key],check=True)
  except Exception as recovery_error: recovery_errors.append(key+': '+str(recovery_error))
 record.update(status='rollback_failed' if recovery_errors else 'rolled_back',recoveryErrors=recovery_errors,activeTargets=active_targets())
save_receipt(record); print(json.dumps(record))
`));
  } catch(recoveryError) {
    outcome={...outcome,status:'recovery_unconfirmed',error:String(error.message??error),recoveryError:String(recoveryError.message??recoveryError)};
  }
  fs.writeFileSync(localReceipt,JSON.stringify(outcome));
  throw new Error(`Public release verification failed; recovery status: ${outcome.status}. Receipt: ${localReceipt}`,{cause:error});
}
console.log(JSON.stringify({...outcome,localReceipt:receipt}));
