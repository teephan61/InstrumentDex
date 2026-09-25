import test from 'node:test';
import assert from 'node:assert/strict';
import {instruments,facilityProfiles,knowledgeRepresentations,search,resolveIdentity,knowledgeState,getApplicableRepresentation,getSource,getProducts,getVariants,addLocalReference,getInstrumentDraft,getSpecialties,specialtyTerms,instrumentSpecialties} from './domain.js';
const mayo=instruments.find(i=>i.id==='mayo'),mask=instruments.find(i=>i.id==='mask'),scope=instruments.find(i=>i.id==='scope');

test('search supports common names, aliases, identifiers, features, manufacturers and tray context',()=>{
 for(const [q,id] of [['Big Pean','pean'],['heavy Mayo','mayo'],['EX-M170','mayo'],['Example Surgical','mayo'],['Mayo curved','mayo'],['fenestrated','babcock'],['Tonsil Set','suction-single']])assert.ok(search(q).some(i=>i.id===id));
 assert.equal(search('not a known instrument').length,0);
 assert.ok(search('','Tonsil Set').length>=2);
 assert.equal(search('','', 'Clamps & scissors').length,5);
});
test('specialty is a many-to-many clinical context distinct from family and tray placement',()=>{
 const pean=instruments.find(i=>i.id==='pean');
 assert.equal('specialty' in pean,false);
 assert.equal(pean.family,'Forceps / Hemostats');
 assert.deepEqual(getSpecialties(pean).map(term=>term.name),['General Surgery','Gynecology']);
 assert.ok(search('General Surgery').some(item=>item.id==='pean'));
 assert.ok(search('','','','Forceps / Hemostats').some(item=>item.id==='pean'));
 assert.ok(search('','','','','ent').some(item=>item.id==='suction-reusable'));
 assert.equal(specialtyTerms.length,8);
 assert.ok(instrumentSpecialties.some(link=>link.instrument_concept_id==='pean'&&link.specialty_term_id==='general-surgery'));
});
test('realistic concept seeds expose recognition, aliases, specialty, and tray context without fabricated products',()=>{
 const required=['halsted-mosquito','kelly','crile','pean','kocher','mixter','schnidt','allis','babcock','adson-brown','mayo','mayo-straight','mayo-hegar','weitlaner','gelpi','yankauer','poole','frazier','luer-rongeur','kerrison-rongeur','molt-9','cryer-left','lap-atraumatic-grasper','maryland-dissector','monopolar-hook'];
 for(const id of required){const item=instruments.find(candidate=>candidate.id===id);assert.ok(item,`missing ${id}`);assert.ok(item.features[0],`${id} needs a recognition cue`);assert.ok(item.family,`${id} needs a family`);assert.ok(getSpecialties(item).length,`${id} needs a specialty`);}
 for(const [query,id] of [['right angle','mixter'],['mosquito','halsted-mosquito'],['tonsil','schnidt'],['ENT','frazier'],['Major Set','kelly']])assert.ok(search(query).some(item=>item.id===id),`${query} should find ${id}`);
 assert.ok(search('Kelly clamp').some(item=>item.id==='kelly'));
 assert.ok(search('Ochsner forceps').some(item=>item.id==='kocher'));
 assert.ok(search('','', '', '', 'dental-oral').some(item=>item.id==='adson-brown'));
 assert.equal(getProducts(instruments.find(item=>item.id==='kelly')).length,1);
 assert.equal(getProducts(instruments.find(item=>item.id==='kelly'))[0].trustedLocalProductMapping,true);
 assert.deepEqual(instruments.find(item=>item.id==='kelly').confused,['crile']);
});
test('only a seeded trusted local mapping or trusted identifier can unlock product representations',()=>{
 assert.equal(knowledgeState(mayo,resolveIdentity(mayo)),'available');
 for(const basis of ['none','visual_comparison','tray_context','local_term','local_operational_note','engraving_unverified','user_selection','other'])assert.equal(knowledgeState(mayo,{resolved_level:'manufacturer_product',status:'confirmed',confirmation_basis:basis}),'identity_insufficient');
});
test('the demo balances confirmed source-grounded pathways with unresolved examples',()=>{
 const available=instruments.filter(item=>knowledgeState(item,resolveIdentity(item))==='available');
 assert.ok(available.length/instruments.length>=.7&&available.length/instruments.length<=.8);
 assert.equal(knowledgeState(instruments.find(item=>item.id==='babcock'),resolveIdentity(instruments.find(item=>item.id==='babcock'))),'identity_insufficient');
 const kelly=getApplicableRepresentation(instruments.find(item=>item.id==='kelly'),resolveIdentity(instruments.find(item=>item.id==='kelly')));
 const frazier=getApplicableRepresentation(instruments.find(item=>item.id==='frazier'),resolveIdentity(instruments.find(item=>item.id==='frazier')));
 const dental=getApplicableRepresentation(instruments.find(item=>item.id==='molt-9'),resolveIdentity(instruments.find(item=>item.id==='molt-9')));
 assert.ok(kelly.stages[0].items.some(item=>item.label==='Washer-disinfector'&&item.status==='Required'));
 assert.ok(frazier.stages[0].items.some(item=>item.label==='Flushing / lumen cleaning'&&item.status==='Required'));
 assert.ok(dental.stages[0].items.some(item=>item.label==='Route'&&item.status==='Handwash only'));
});
test('only matching physical identifiers confirm an associated product',()=>{
 assert.equal(knowledgeState(mayo,resolveIdentity(mayo,' EX-m170 ')),'available');
 assert.equal(knowledgeState(mayo,resolveIdentity(mayo,'DM-T100')),'identity_insufficient');
 assert.equal(knowledgeState(mayo,{...resolveIdentity(mayo,'EX-M170'),status:'candidate'}),'identity_insufficient');
});
test('a product confirmation does not satisfy a variant-specific representation',()=>{
 assert.equal(knowledgeState(mask,resolveIdentity(mask,'FA-M20')),'identity_insufficient');
 assert.equal(knowledgeState(mask,resolveIdentity(mask,'FA-M20-B')),'available');
 assert.equal(knowledgeState(mask,resolveIdentity(mask,'FA-M20-A')),'available');
});
test('unresolved source remains a valid exact-product outcome',()=>{
 assert.equal(knowledgeState(scope,resolveIdentity(scope,'FO-B80')),'source_unresolved');
});
test('source-grounded knowledge and facility context are not fields on concepts',()=>{
 assert.equal('workflow' in mayo,false);
 assert.equal('source' in mayo,false);
 assert.equal('tray' in mayo,false);
 assert.deepEqual(getProducts(mayo).map(x=>x.catalog),['EX-M170']);
 assert.deepEqual(getVariants(mask).map(x=>x.catalog),['FA-M20-B','FA-M20-A']);
 const representation=getApplicableRepresentation(mayo,resolveIdentity(mayo,'EX-M170'));
 assert.equal(representation.required,'manufacturer_product');
 assert.equal(getSource(representation).revision,'4 (fictional prototype)');
 assert.equal(facilityProfiles.mayo.trays[0].quantity,2);
 assert.equal(knowledgeRepresentations[0].publication.facilityId,'harbour');
 assert.ok(knowledgeRepresentations[0].stages.some(stage=>stage.items.some(item=>item.label==='Ultrasonic cleaning'&&item.status==='Required')));
});
test('distinct confirmed products expose distinct structured processing pathways',()=>{
 const suction=instruments.find(i=>i.id==='suction-reusable');
 const flex=instruments.find(i=>i.id==='flex-scope');
 const camera=instruments.find(i=>i.id==='camera-head');
 const suctionRepresentation=getApplicableRepresentation(suction,resolveIdentity(suction,'DM-T100'));
 const flexRepresentation=getApplicableRepresentation(flex,resolveIdentity(flex,'DS-F40'));
 const cameraRepresentation=getApplicableRepresentation(camera,resolveIdentity(camera,'TV-C20'));
 assert.equal(knowledgeState(suction,resolveIdentity(suction,'DM-T100')),'available');
 assert.ok(suctionRepresentation.stages[0].items.some(item=>item.label==='Flushing / lumen cleaning'&&item.status==='Required'));
 assert.ok(flexRepresentation.stages[2].items.some(item=>item.status==='HLD'));
 assert.ok(cameraRepresentation.stages[2].items.some(item=>item.status==='Low-temperature'));
 for(const representation of [suctionRepresentation,flexRepresentation,cameraRepresentation])assert.deepEqual(representation.stages.map(stage=>stage.title),['Decontamination','Packaging','Sterilization / HLD process','Warnings / Notes']);
});
test('instrument drafts retain MDR intake details without product-specific knowledge',()=>{
 const created=addLocalReference({name:'Demo dressing forceps',preferredName:'Long dressings',aliases:'dressings, long forceps',tray:'Minor Set',quantity:'2',note:'Draft local note',manufacturer:'Demo Instruments',catalog:'DI-42',ifuRevision:'Rev. 1',sourceLocator:'§ 4.2',manualCleaning:'Required',distinguishingFeatures:'Fine serrations\nLong shank'});
 assert.equal(knowledgeState(created,resolveIdentity(created)),'identity_insufficient');
 assert.ok(search('long forceps').some(i=>i.id===created.id));
 assert.deepEqual(created.features,['Fine serrations','Long shank']);
 assert.equal(getInstrumentDraft(created).catalog,'DI-42');
 assert.equal(getProducts(created).length,0);
});
