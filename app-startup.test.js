import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const appSource=readFileSync(new URL('./app.js',import.meta.url),'utf8');
const playgroundSource=readFileSync(new URL('./shared-drafts.js',import.meta.url),'utf8');

test('core reference startup does not statically depend on playground services',()=>{
 assert.doesNotMatch(appSource,/from\s+['"]\.\/shared-drafts\.js['"]/);
 const startup=appSource.slice(appSource.indexOf('async function start()'),appSource.indexOf('\nstart();'));
 assert.ok(startup.indexOf('renderWelcome();')>=0);
 assert.ok(startup.indexOf('await getPlaygroundApi()')>startup.indexOf('renderWelcome();'));
 assert.match(appSource,/Tester sign-in temporarily unavailable\./);
});

test('tester sign-in authenticates before checking tester authorization',()=>{
 assert.match(playgroundSource,/tester:'tester@instrumentdex\.demo'/);
 assert.match(playgroundSource,/supabase\.auth\.signInWithPassword\(\{email,password\}\)/);
 assert.match(playgroundSource,/return data\.session;/);
 assert.match(playgroundSource,/callback\(event,session\)/);
 assert.match(appSource,/session=await \(await getPlaygroundApi\(\)\)\.signInTester/);
 assert.match(appSource,/await activateTesterSession\(session\);/);
 assert.match(appSource,/hydrateSharedDrafts\(records\);renderTesterUi\(\);instrumentHome\(\);window\.scrollTo\(0,0\);return true;/);
 assert.match(appSource,/function isTesterAuthorizationError\(error\)\{return error\?\.code==='42501'\|\|error\?\.status===403;\}/);
 assert.match(appSource,/isTesterAuthorizationError\(error\)\?'Tester access is not enabled for this account\.'\s*:\s*'Tester sign-in temporarily unavailable\.'/);
 assert.doesNotMatch(appSource,/InstrumentDex (tester|draft) diagnostic|console\.info\(/);
});

test('successful sign-out clears local state and renders the welcome board immediately',()=>{
 assert.match(playgroundSource,/supabase\.auth\.signOut\(\{scope:'local'\}\)/);
 assert.match(appSource,/await \(await getPlaygroundApi\(\)\)\.signOut\(\);\s*testerSession=null;\s*renderTesterUi\(\);\s*renderWelcome\(\);/);
 assert.match(appSource,/catch\(error\)\{\s*button\.disabled=false;\s*renderTesterUi\('Tester sign-out is temporarily unavailable\.'\);/);
 assert.match(appSource,/if\(event==='SIGNED_OUT'\|\|!session\)\{testerSession=null;renderTesterUi\(\);renderWelcome\(\);\}/);
});

test('an invalid restored refresh session is cleared locally before startup continues',()=>{
 assert.match(playgroundSource,/const isInvalidRefreshSession=/);
 assert.match(playgroundSource,/if\(isInvalidRefreshSession\(error\)\)\{\s*await clearLocalSession\(\)\.catch\(\(\)=>\{\}\);\s*return null;/);
 assert.match(playgroundSource,/export async function clearLocalSession\(\)\{\s*const \{error\}=await supabase\.auth\.signOut\(\{scope:'local'\}\)/);
 assert.match(appSource,/testerSession=await api\.getTesterSession\(\);/);
 assert.match(appSource,/if\(testerSession\)\{\s*await activateTesterSession\(testerSession\);/);
});

test('tester-facing entry text avoids internal playground terminology',()=>{
 assert.match(appSource,/Sign in below to access the InstrumentDex demo environment\./);
 assert.doesNotMatch(appSource,/enter the shared InstrumentDex playground/);
 assert.doesNotMatch(appSource,/Approved tester playground|Playground status|lightweight playground note/);
});

test('shared-draft saves verify durable list hydration before rendering',()=>{
 assert.match(appSource,/const createdRecord=await \(await getPlaygroundApi\(\)\)\.saveSharedDraft\(payload\)/);
 assert.match(appSource,/const records=await loadSharedDraftRecords\(\)/);
 assert.match(appSource,/records\.find\(record=>record\.id===createdRecord\?\.id\)/);
 assert.match(appSource,/The saved draft was not returned by the shared reference\./);
 assert.match(appSource,/query='';tray='';family='';specialty='';identifier='';instrumentDetail\(item\.id\)/);
});

test('family cards use the normalized family query and clear conflicting browse filters',()=>{
 assert.match(appSource,/getInstrumentsForFamily\(name\)\.length/);
 assert.doesNotMatch(appSource,/instruments\.filter\(item=>\(item\.family\|\|item\.category\)===name\)\.length/);
 assert.match(appSource,/family=normalizeInstrumentFamily\(button\.dataset\.family\)\|\|'';query='';tray='';specialty='';instrumentHome\(\)/);
 assert.match(appSource,/family=family\?normalizeInstrumentFamily\(family\)\|\|'':'';/);
});

test('specialty and tray controls update visible browse state before rerendering',()=>{
 assert.match(appSource,/data-specialty[^]*selectSpecialty\(button\.dataset\.specialty\)/);
 assert.match(appSource,/data-tray[^]*selectTray\(button\.dataset\.tray\)/);
 assert.match(appSource,/function selectSpecialty\(value\)\{\s*specialty=value\|\|'';[^]*if\(specialty\)\{query='';family='';\}[^]*instrumentHome\(\);/);
 assert.match(appSource,/function selectTray\(value\)\{\s*tray=value\|\|'';[^]*if\(tray\)\{query='';family='';\}[^]*instrumentHome\(\);/);
 assert.match(appSource,/id===specialty\?'active':''/);
 assert.match(appSource,/name===tray\?'active':''/);
});
