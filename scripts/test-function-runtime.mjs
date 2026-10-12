import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Test only the deployable artifact, away from the repo's native/build dependencies.
const source=path.resolve('.vercel/output/functions/_render.func');
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-function-check-'));
fs.cpSync(source,directory,{recursive:true,dereference:true});
const config=JSON.parse(fs.readFileSync(path.join(directory,'.vc-config.json'),'utf8'));
const serverRoot=path.dirname(path.join(directory,config.handler));
for(const file of fs.readdirSync(serverRoot,{recursive:true}).filter(p=>p.endsWith('.mjs'))) {
  const code=fs.readFileSync(path.join(serverRoot,file),'utf8');
  assert.ok(!/(?:import\s*|from\s*)["'](?:rolldown|@vercel\/routing-utils)["']/.test(code),`Build-only import in ${file}`);
}
const checks=`
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const app=(await import(pathToFileURL(process.argv[1]))).default;
const url='https://hamzaalikhurram.com/api/contact';
const cases=[
 ['GET',undefined,{},405],
 ['POST','{}',{'origin':'https://outside.example','content-type':'application/json'},403],
 ['POST','{}',{'origin':'https://hamzaalikhurram.com','content-type':'text/plain'},415],
 ['POST','{',{'origin':'https://hamzaalikhurram.com','content-type':'application/json'},400],
 ['POST','{}',{'origin':'https://hamzaalikhurram.com','content-type':'application/json'},422],
 ['POST',JSON.stringify({name:'Runtime Check',email:'test@example.com',inquiry:'other',message:'A safe runtime startup verification message.',submissionId:'11111111-1111-4111-8111-111111111111',companyWebsite:''}),{'origin':'https://hamzaalikhurram.com','content-type':'application/json'},503]
];
for(const [method,body,headers,expected] of cases){
 const r=await app.fetch(new Request(url,{method,headers,...(body?{body}: {})}));
 assert.equal(r.status,expected,method+' expected '+expected);console.log('Isolated function HTTP '+r.status);
}
`;
const env={...process.env,NODE_ENV:'production'};
for(const key of ['RESEND_API_KEY','CONTACT_TO_EMAIL','CONTACT_FROM_EMAIL','PUBLIC_TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY','CONTACT_ALLOW_INSECURE_LOCAL'])delete env[key];
const result=spawnSync(process.execPath,['--input-type=module','-e',checks,path.join(directory,config.handler)],{env,encoding:'utf8',timeout:30000,cwd:directory});
process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');
assert.equal(result.status,0,'Packaged production function startup/request checks failed');
console.log('PASS: isolated Node production startup; no repository dependency fallback or real mail.');
