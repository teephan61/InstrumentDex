export const facility={id:'harbour',name:'Harbour Demo Hospital'};

export const instrumentFamilies=Object.freeze([
 'Forceps / Hemostats',
 'Scissors',
 'Needle Holders',
 'Retractors',
 'Suction / Cannulas',
 'Bone / Orthopedic Instruments',
 'Dental / Oral Surgery',
 'Laparoscopic',
 'Endoscopic / Specialty Devices',
 'Tissue / Grasping Forceps'
]);
const familySynonyms=new Map([
 ['laparoscopic instruments','Laparoscopic'],
 ['laparoscopic instrument','Laparoscopic'],
 ['laparoscopy','Laparoscopic']
]);
const normalizeFamilyKey=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
export function normalizeInstrumentFamily(value){
 const key=normalizeFamilyKey(value);
 return instrumentFamilies.find(family=>normalizeFamilyKey(family)===key)||familySynonyms.get(key)||null;
}

// Identity, facility context, and source-grounded knowledge are intentionally separate.
// A concept can have candidate products; only a trusted identifier confirms one.
export const products=[
 {id:'ex-m170',conceptId:'mayo',manufacturer:'Example Surgical',model:'Mayo curved',catalog:'EX-M170',reuse:'Reusable'},
 {id:'dm-t100',conceptId:'suction-reusable',manufacturer:'DemoMed',model:'Reusable tonsil suction',catalog:'DM-T100',reuse:'Reusable'},
 {id:'dm-t101',conceptId:'suction-single',manufacturer:'DemoMed',model:'Single-use tonsil suction',catalog:'DM-T101',reuse:'Single-use'},
 {id:'fa-m20',conceptId:'mask',manufacturer:'Fictional Airway',model:'Flex mask',catalog:'FA-M20',reuse:'Reusable'},
 {id:'fo-b80',conceptId:'scope',manufacturer:'Fictional Optics',model:'Rigid bronchoscope',catalog:'FO-B80',reuse:'Reusable'},
 {id:'dm-f40',conceptId:'flex-scope',manufacturer:'DemoScope',model:'FlexiView 40',catalog:'DS-F40',reuse:'Reusable'},
 {id:'tv-c20',conceptId:'camera-head',manufacturer:'ThermaView',model:'Camera head C20',catalog:'TV-C20',reuse:'Reusable'}
];

export const variants=[
 {id:'fa-m20-blue',productId:'fa-m20',name:'Blue reusable variant',catalog:'FA-M20-B',difference:'Blue identification ring',processingDifference:'Fictional representation FA-M20-B uses the blue-variant handling pathway.'},
 {id:'fa-m20-amber',productId:'fa-m20',name:'Amber reusable variant',catalog:'FA-M20-A',difference:'Amber identification ring',processingDifference:'Fictional representation FA-M20-A has a distinct handling pathway. Colour is a candidate clue, not confirmation.'}
];

export const instruments=[
 {id:'mayo',name:'Mayo Curved Scissors',category:'Clamps & scissors',features:['Heavy curved blades for dense tissue or suture material','Shorter, robust shanks distinguish it from fine Metzenbaum scissors'],kind:'scissors',productIds:['ex-m170'],confused:['metz','mayo-straight'],warning:'Do not use the heavy, shorter Mayo profile as a substitute for a fine Metzenbaum.'},
 {id:'metz',name:'Metzenbaum dissecting scissors',category:'Clamps & scissors',features:['Long, slim shank','Fine delicate tips'],kind:'scissors',confused:['mayo'],warning:'Fine tips can be damaged when mistaken for heavier Mayo scissors.'},
 {id:'pean',name:'Rochester-Pean forceps',category:'Clamps & scissors',features:['Transverse serrations along the full jaw','No interlocking tooth at the tip'],kind:'forceps',confused:['kocher'],warning:'A local nickname or tray location supports a candidate; it does not confirm a manufacturer product.'},
 {id:'kocher',name:'Rochester-Ochsner / Kocher Forceps',category:'Clamps & scissors',features:['Heavy clamp with a 1×2 tooth at the tip','Transverse serrations along the jaws'],kind:'toothed',confused:['pean'],warning:'A 1×2 tooth at the tip distinguishes this concept from the toothless Rochester-Pean forceps.'},
 {id:'babcock',name:'Babcock forceps',category:'Clamps & scissors',features:['Rounded, fenestrated jaws','Broad loop-shaped tips'],kind:'loop',warning:'No specific product source is established in this demonstration.'},
 {id:'suction-reusable',name:'Tonsil suction tube',category:'Suction & airway',features:['Curved narrow tube','Reusable and disposable examples can look similar'],kind:'tube',productIds:['dm-t100'],confused:['suction-single'],warning:'Recognition of the general tube does not establish eligibility for reuse.'},
 {id:'suction-single',name:'Tonsil suction tube — single-use example',category:'Suction & airway',features:['Similar curved tube profile','Single-use status requires exact product confirmation'],kind:'tube',productIds:['dm-t101'],confused:['suction-reusable'],warning:'Do not process based on appearance or tray membership; establish the exact product first.'},
 {id:'mask',name:'Anaesthesia mask',category:'Suction & airway',features:['Cushioned face seal','Colour ring may indicate a variant'],kind:'mask',productIds:['fa-m20'],warning:'Colour narrows candidates but does not confirm a variant or its applicable representation.'},
 {id:'scope',name:'Legacy bronchoscope',category:'Suction & airway',features:['Long rigid shaft','Older eyepiece assembly'],kind:'scope',productIds:['fo-b80'],warning:'Exact product recognition does not mean an authoritative source has been established.'},
 {id:'flex-scope',name:'Flexible endoscope — demo reference',category:'Suction & airway',features:['Flexible insertion tube','Control body and distal tip'],kind:'scope',productIds:['dm-f40'],warning:'This fictional semi-critical example follows an HLD pathway, not a terminal steam pathway.'},
 {id:'camera-head',name:'Camera head — demo reference',category:'Suction & airway',features:['Optical cable connection','Thermolabile camera housing'],kind:'scope',productIds:['tv-c20'],warning:'Do not infer steam compatibility from a similar-looking metal component.'}
];

// Specialty is a broad clinical-use context. It is deliberately many-to-many and
// independent from both instrument identity and facility tray placement.
export const specialtyTerms=[
 {id:'general-surgery',name:'General Surgery',lifecycle_status:'active'},
 {id:'ent',name:'ENT',lifecycle_status:'active'},
 {id:'orthopedics',name:'Orthopedics',lifecycle_status:'active'},
 {id:'gynecology',name:'Gynecology',lifecycle_status:'active'},
 {id:'urology',name:'Urology',lifecycle_status:'active'},
 {id:'dental-oral',name:'Dental / Oral Surgery',lifecycle_status:'active'},
 {id:'endoscopy',name:'Endoscopy',lifecycle_status:'active'},
 {id:'laparoscopic',name:'Laparoscopic Surgery',lifecycle_status:'active'}
];
export const instrumentSpecialties=[];
const linkSpecialties=(conceptId,...specialtyIds)=>specialtyIds.forEach(specialtyTermId=>{
 if(!instrumentSpecialties.some(link=>link.instrument_concept_id===conceptId&&link.specialty_term_id===specialtyTermId))instrumentSpecialties.push({instrument_concept_id:conceptId,specialty_term_id:specialtyTermId});
});
const setFamily=(id,family,...specialties)=>{const item=instruments.find(x=>x.id===id);if(item){item.family=normalizeInstrumentFamily(family)||family;linkSpecialties(id,...specialties);}};

setFamily('mayo','Scissors','general-surgery','gynecology');
setFamily('metz','Scissors','general-surgery','gynecology');
setFamily('pean','Forceps / Hemostats','general-surgery','gynecology');
setFamily('kocher','Forceps / Hemostats','general-surgery','gynecology');
setFamily('babcock','Tissue / Grasping Forceps','general-surgery','gynecology');
setFamily('suction-reusable','Suction / Cannulas','ent');
setFamily('suction-single','Suction / Cannulas','ent');
setFamily('mask','Endoscopic / Specialty Devices','endoscopy');
setFamily('scope','Endoscopic / Specialty Devices','endoscopy');
setFamily('flex-scope','Endoscopic / Specialty Devices','endoscopy');
setFamily('camera-head','Endoscopic / Specialty Devices','endoscopy','laparoscopic');

const seedConcepts=(family,kind,specialties,entries)=>entries.forEach(([id,name,cue])=>{
 if(instruments.some(item=>item.id===id))return;
 const normalizedFamily=normalizeInstrumentFamily(family)||family;
 instruments.push({id,name,category:normalizedFamily,family:normalizedFamily,features:[cue],kind,warning:'Concept recognition supports comparison only. Confirm the exact manufacturer product before relying on product-specific processing guidance.'});
 linkSpecialties(id,...specialties);
});

seedConcepts('Forceps / Hemostats','forceps',['general-surgery','gynecology'],[
 ['halsted-mosquito','Halsted Mosquito Forceps','Small, fine hemostat with short serrated jaws'],['kelly','Kelly Forceps','Medium curved hemostat with serrations on the distal jaw'],['crile','Crile Forceps','Hemostat with full-length transverse serrations'],['carmalt','Carmalt Forceps','Longitudinal serrations with cross-serrations at the tip'],['mixter','Mixter Right-Angle Forceps','Angled tip designed to pass around structures'],['schnidt','Schnidt Tonsil Forceps','Long forceps with oval fenestrated tips'],['lahey','Lahey Forceps','Toothed grasping forceps for firm tissue purchase'],['mayo-guyon','Mayo-Guyon Forceps','Heavy, long hemostatic clamp with broad jaws']
]);
seedConcepts('Tissue / Grasping Forceps','loop',['general-surgery','gynecology'],[
 ['allis','Allis Tissue Forceps','Ring handles with toothed grasping tips'],['adson','Adson Tissue Forceps','Short thumb forceps with a broad grip platform'],['adson-brown','Adson-Brown Forceps','Thumb forceps with multiple fine teeth at the tip'],['debakey','DeBakey Tissue Forceps','Atraumatic thumb forceps with fine longitudinal ridges'],['russian','Russian Tissue Forceps','Rounded serrated tip with a broad thumb-forceps profile'],['ferris-smith','Ferris-Smith Tissue Forceps','Heavy tissue forceps with robust grasping jaws'],['foerster','Foerster Sponge Forceps','Ring forceps with oval serrated sponge-holding tips'],['dressing','Dressing Forceps','Plain thumb forceps with narrow dressing tips'],['duval','Duval Lung Forceps','Triangular fenestrated jaws for atraumatic tissue grasping']
]);
seedConcepts('Scissors','scissors',['general-surgery','gynecology'],[
 ['mayo-straight','Mayo Straight Scissors','Heavy straight blades for sutures and dense material'],['metzenbaum-nelson','Metzenbaum-Nelson Scissors','Long delicate shanks with fine curved blades'],['iris','Iris Scissors','Small, fine scissors with short sharp blades'],['stevens','Stevens Tenotomy Scissors','Fine pointed blades for delicate dissection'],['potts','Potts-Smith Scissors','Angled fine blades used around vessels'],['lister','Lister Bandage Scissors','Blunt foot on one blade for safe dressing removal'],['suture','Suture Scissors','Short blades intended for cutting suture'],['dissecting-scissors','Dissecting Scissors','Fine scissors with slender blades for tissue dissection']
]);
seedConcepts('Needle Holders','forceps',['general-surgery','gynecology'],[
 ['mayo-hegar','Mayo-Hegar Needle Holder','Medium-heavy needle holder with short serrated jaws'],['crile-wood','Crile-Wood Needle Holder','Fine tapered jaws for smaller needles'],['ryder','Ryder Needle Holder','Delicate needle holder with narrow jaws'],['debakey-needle','DeBakey Needle Holder','Fine needle holder with atraumatic jaw profile'],['olsen-hegar','Olsen-Hegar Needle Holder','Needle holder with integrated suture-cutting scissors'],['webster','Webster Needle Holder','Small needle holder for fine suturing'],['castroviejo','Castroviejo Needle Holder','Spring-handled holder for microsurgical needles'],['halsey','Halsey Needle Holder','Small, short-jawed needle holder'],['baumgartner','Baumgartner Needle Holder','Fine long-jawed needle holder'],['collier','Collier Needle Holder','Long needle holder with a sturdy ratchet']
]);
seedConcepts('Retractors','forceps',['general-surgery','gynecology'],[
 ['army-navy','Army-Navy Retractor','Double-ended handheld retractor with broad blades'],['richardson','Richardson Retractor','Deep handheld retractor with a right-angle blade'],['richardson-eastman','Richardson-Eastman Retractor','Longer deep retractor with a broad blade'],['deaver','Deaver Retractor','Large curved blade for deep abdominal retraction'],['harrington','Harrington Retractor','Heart-shaped blade used for deep retraction'],['weitlaner','Weitlaner Retractor','Self-retaining retractor with pronged tips'],['gelpi','Gelpi Retractor','Self-retaining retractor with sharp curved tips'],['senn','Senn Retractor','Small double-ended retractor with rake tip'],['volkmann','Volkmann Retractor','Handheld retractor with multiple rake prongs'],['balfour','Balfour Retractor','Self-retaining abdominal retractor frame']
]);
seedConcepts('Suction / Cannulas','tube',['general-surgery','ent'],[
 ['yankauer','Yankauer Suction','Bulbous handle with a broad open suction tip'],['poole','Poole Suction','Large perforated outer sheath for abdominal suction'],['frazier','Frazier Suction','Fine angled suction with finger-control vent'],['baron','Baron Suction','Fine reusable suction with a narrow distal tip'],['house','House Suction','Fine ENT suction with a small angled tip'],['rosen','Rosen Suction','Delicate ENT suction with a fine cannula'],['andrews-pynchon','Andrews-Pynchon Suction','Angled suction with a bulbous handle'],['laparoscopic-suction','Laparoscopic Suction/Irrigation Cannula','Long cannula with irrigation and suction control'],['orthopedic-suction','Orthopedic Suction Tube','Long rigid suction tube for orthopedic field clearance']
]);
seedConcepts('Bone / Orthopedic Instruments','forceps',['orthopedics'],[
 ['luer-rongeur','Luer Rongeur','Double-action bone-biting jaws with a spring handle'],['stille-luer','Stille-Luer Rongeur','Heavy double-action rongeur with broad cutting jaws'],['ruskin-rongeur','Ruskin Rongeur','Cup-shaped bone-biting jaws on a double-action handle'],['kerrison-rongeur','Kerrison Rongeur','Up-biting or down-biting footplate with a narrow shaft'],['lambotte-osteotome','Lambotte Osteotome','Straight chisel-like blade with a broad striking end'],['hoke-osteotome','Hoke Osteotome','Narrow angled osteotome for controlled bone cutting'],['cobb-elevator','Cobb Elevator','Broad curved elevator blade on a long handle'],['bone-curette','Bone Curette','Small cup-shaped curette on a slender shaft'],['bone-mallet','Bone Mallet','Weighted striking head with a short surgical handle'],['bone-holding-forceps','Bone Holding Forceps','Heavy locking jaws designed to secure bone fragments']
]);
seedConcepts('Dental / Oral Surgery','forceps',['dental-oral'],[
 ['molt-9','No. 9 Molt Periosteal Elevator','Double-ended elevator with a broad rounded periosteal tip'],['seldin-23','No. 23 Seldin Periosteal Retractor','Broad curved blade for reflecting oral soft tissue'],['lucas-curette','Lucas Surgical Curette','Small spoon-shaped curette with an angled shank'],['cryer-left','Cryer Elevator Left','Triangular left-oriented elevator tip for root elevation'],['cryer-right','Cryer Elevator Right','Triangular right-oriented elevator tip for root elevation'],['seldin-straight','Seldin Straight Elevator','Straight wedge-shaped elevator blade'],['miller-colburn','Miller-Colburn Bone File','Double-ended bone file with cross-cut surfaces'],['heidbrink','Heidbrink Root Tip Pick','Fine hooked tip for engaging root fragments'],['friedman-rongeur','Friedman Rongeur','Small cup-shaped rongeur for alveolar bone']
]);
seedConcepts('Laparoscopic','scope',['laparoscopic'],[
 ['lap-atraumatic-grasper','Laparoscopic Atraumatic Grasper','Long insulated shaft with broad atraumatic jaws'],['maryland-dissector','Maryland Dissector','Curved fine laparoscopic jaws on an insulated shaft'],['lap-scissors','Laparoscopic Scissors','Long insulated shaft with short articulating scissor blades'],['lap-needle-holder','Laparoscopic Needle Holder','Long shaft with serrated needle-holding jaws'],['lap-babcock','Laparoscopic Babcock Grasper','Fenestrated atraumatic jaws on a laparoscopic shaft'],['lap-bowel-grasper','Laparoscopic Bowel Grasper','Long shaft with broad atraumatic bowel-grasping jaws'],['trocar-cannula','Trocar / Cannula','Port sleeve with a valve housing for laparoscopic access'],['lap-retractor','Laparoscopic Retractor','Long shaft with a fan or paddle-style retraction tip'],['monopolar-hook','Monopolar Hook Electrode','Insulated shaft ending in a small curved hook electrode']
]);
// Distinct common variants are kept as separate concepts only where the form is
// useful for recognition. They do not imply a manufacturer product mapping.

const linkMore=(id,...specialties)=>linkSpecialties(id,...specialties);
linkMore('mayo-hegar','dental-oral');linkMore('crile-wood','dental-oral');linkMore('frazier','ent');linkMore('mixter','ent');linkMore('schnidt','ent');linkMore('kerrison-rongeur','ent');linkMore('orthopedic-suction','orthopedics');linkMore('laparoscopic-suction','laparoscopic');linkMore('lap-babcock','general-surgery');linkMore('lap-bowel-grasper','general-surgery');linkMore('trocar-cannula','general-surgery');linkMore('duval','general-surgery');linkMore('adson-brown','dental-oral');

// Facility-scoped context, deliberately separate from manufacturer information.
export const facilityProfiles={
 mayo:{preferredName:'Heavy scissors',aliases:['Mayo curved','heavy Mayo'],trays:[{name:'Major Abdominal Set',quantity:2}],note:'The local tray book lists this as “heavy scissors”. The nickname supports identification only.'},
 metz:{preferredName:'Metz',aliases:['tissue scissors'],trays:[{name:'Major Abdominal Set',quantity:1}],note:'Often stored near Mayo scissors. Fine tips should be protected during assembly.'},
 pean:{preferredName:'Big Pean',aliases:['Pean','big clamp'],trays:[{name:'Major Abdominal Set',quantity:4}],note:'Agency staff may call this “Big Pean”. Tray position and nickname do not establish manufacturer identity.'},
 kocher:{preferredName:'Toothed clamp',aliases:['Kocher forceps','Ochsner forceps','tooth clamp'],trays:[{name:'Major Abdominal Set',quantity:2}],note:'The tooth is an identification feature; a name alone is not product confirmation.'},
 babcock:{preferredName:'Babcock',aliases:['atraumatic clamp'],trays:[{name:'Laparotomy Set',quantity:2}],note:'Find this concept in the Laparotomy Set reference list. Manufacturer and model are not established.'},
 'suction-reusable':{preferredName:'Tonsil sucker',aliases:['reusable sucker'],trays:[{name:'Tonsil Set',quantity:1}],note:'The reusable item is recorded in the set book; the physical catalog marking is still needed for product confirmation.'},
 'suction-single':{preferredName:'Tonsil sucker',aliases:['agency sucker','disposable sucker'],trays:[{name:'Tonsil Set',quantity:'substitution'}],note:'Supply substitutions occur. An agency-provided item may share the local nickname and tray context.'},
 mask:{preferredName:'Blue mask',aliases:['Flex mask','airway mask'],trays:[{name:'Airway Reference Set',quantity:2}],note:'Blue and amber variants are kept as reference examples. Colour supports comparison only.'},
 scope:{preferredName:'Legacy scope',aliases:['old bronchoscope'],trays:[{name:'Airway Reference Set',quantity:1}],note:'A legacy reference case. Experienced staff may not recognize it even when it is still present locally.'},
 'flex-scope':{preferredName:'Flex scope',aliases:['flexible scope'],trays:[{name:'Endoscopy Reference Set',quantity:1}],note:'A teaching reference used to distinguish an HLD pathway from steam-processed instruments.'},
 'camera-head':{preferredName:'Camera head',aliases:['camera cable head'],trays:[{name:'Video Tower Reference Set',quantity:1}],note:'The local cable is stored with the camera head; confirm the product label before processing.'}
};

// Seeded tray names are intentionally generic prototype context. They make the
// browse experience useful without asserting a universal tray composition.
const addFacilityContext=(id,{aliases=[],trays=[]}={})=>{
 const current=facilityProfiles[id]||{preferredName:'',aliases:[],trays:[],note:''};
 facilityProfiles[id]={...current,aliases:[...new Set([...current.aliases,...aliases])],trays:[...current.trays,...trays.filter(next=>!current.trays.some(existing=>existing.name===next.name))]};
};
const addContexts=(ids,context)=>ids.forEach(id=>addFacilityContext(id,context));

addFacilityContext('halsted-mosquito',{aliases:['Mosquito clamp','Mosquito hemostat'],trays:[{name:'Minor Set',quantity:'varies'},{name:'Basic General Set',quantity:'varies'}]});
addFacilityContext('kelly',{aliases:['Kelly clamp','Kelly hemostat'],trays:[{name:'Major Set',quantity:'varies'},{name:'Basic General Set',quantity:'varies'}]});
addFacilityContext('crile',{aliases:['Crile clamp','Crile hemostat'],trays:[{name:'Major Set',quantity:'varies'}]});
addFacilityContext('pean',{aliases:['Rochester-Pean Forceps'],trays:[{name:'Major Set',quantity:'varies'}]});
addFacilityContext('kocher',{trays:[{name:'Major Set',quantity:'varies'}]});
addFacilityContext('mixter',{aliases:['Right-angle clamp','Mixter clamp'],trays:[{name:'Major Set',quantity:'varies'},{name:'ENT Set',quantity:'varies'}]});
addFacilityContext('schnidt',{aliases:['Tonsil clamp'],trays:[{name:'Tonsil Set',quantity:'varies'}]});
addContexts(['carmalt','lahey','mayo-guyon','mayo','metz','mayo-straight','metzenbaum-nelson','suture','dissecting-scissors'],{trays:[{name:'Major Set',quantity:'varies'}]});
addContexts(['allis','babcock','adson','adson-brown','debakey','russian','ferris-smith','foerster','dressing','duval'],{trays:[{name:'Basic General Set',quantity:'varies'}]});
addContexts(['mayo-hegar','crile-wood','ryder','debakey-needle','olsen-hegar','webster','halsey','baumgartner','collier'],{trays:[{name:'Major Set',quantity:'varies'}]});
addFacilityContext('castroviejo',{trays:[{name:'ENT Set',quantity:'varies'}]});
addContexts(['army-navy','richardson','richardson-eastman','deaver','harrington','weitlaner','gelpi','senn','volkmann','balfour'],{trays:[{name:'Major Set',quantity:'varies'}]});
addFacilityContext('yankauer',{trays:[{name:'Basic General Set',quantity:'varies'}]});
addFacilityContext('poole',{trays:[{name:'Major Set',quantity:'varies'}]});
addContexts(['frazier','baron','house','rosen','andrews-pynchon','suction-reusable','suction-single'],{trays:[{name:'ENT Set',quantity:'varies'}]});
addContexts(['luer-rongeur','stille-luer','ruskin-rongeur','kerrison-rongeur','lambotte-osteotome','hoke-osteotome','cobb-elevator','bone-curette','bone-mallet','bone-holding-forceps','orthopedic-suction'],{trays:[{name:'Orthopedic Set',quantity:'varies'}]});
addContexts(['molt-9','seldin-23','lucas-curette','cryer-left','cryer-right','seldin-straight','miller-colburn','heidbrink','friedman-rongeur','adson-brown'],{trays:[{name:'Oral Surgery Set',quantity:'varies'},{name:'Dental Extraction Set',quantity:'varies'}]});
addContexts(['lap-atraumatic-grasper','maryland-dissector','lap-scissors','lap-needle-holder','lap-babcock','lap-bowel-grasper','laparoscopic-suction','trocar-cannula','lap-retractor','monopolar-hook'],{trays:[{name:'Laparoscopic Set',quantity:'varies'}]});

const connectConfusables=(id,...otherIds)=>{const item=instruments.find(candidate=>candidate.id===id);if(item)item.confused=[...new Set([...(item.confused||[]),...otherIds])];};
connectConfusables('kelly','crile');connectConfusables('crile','kelly');
connectConfusables('allis','babcock');connectConfusables('babcock','allis');
connectConfusables('mayo','metz','mayo-straight');connectConfusables('metz','mayo','metzenbaum-nelson');
connectConfusables('mayo-straight','mayo','metz');
connectConfusables('weitlaner','gelpi');connectConfusables('gelpi','weitlaner');connectConfusables('yankauer','poole');connectConfusables('poole','yankauer');

// Intake drafts are deliberately separate from products and published knowledge.
// Recording a manufacturer/catalog or processing note here never confirms identity
// and never creates an applicable processing representation.
export const instrumentDrafts={};

// These are representations derived from fictional sources, never fields on an instrument.
export const authoritativeSources=[
 {id:'ifu-example-surgical-r4',title:'Example Surgical reusable instrument IFU',revision:'4 (fictional)',locator:'§ 5.2 / p. 8',manufacturer:'Example Surgical'},
 {id:'ifu-airway-r2',title:'Fictional Airway Flex mask IFU',revision:'2 (fictional)',locator:'§ 3 / p. 4',manufacturer:'Fictional Airway'},
 {id:'ifu-demomed-r3',title:'DemoMed reusable suction tube IFU',revision:'3 (fictional)',locator:'§ 4 / pp. 6–8',manufacturer:'DemoMed'},
 {id:'ifu-demoscope-r1',title:'DemoScope FlexiView 40 IFU',revision:'1 (fictional)',locator:'§ 6 / pp. 12–16',manufacturer:'DemoScope'},
 {id:'ifu-thermaview-r2',title:'ThermaView camera head C20 IFU',revision:'2 (fictional)',locator:'§ 7 / pp. 9–11',manufacturer:'ThermaView'}
];
const method=(label,status,detail,locator)=>({label,status,detail,locator});
const stages=(...items)=>items;
export const knowledgeRepresentations=[
 {id:'kr-mayo-r4',productId:'ex-m170',required:'manufacturer_product',sourceId:'ifu-example-surgical-r4',summary:'Manufacturer-grounded demonstration representation for the confirmed EX-M170 reusable product.',stages:stages({title:'Decontamination',items:[method('Point-of-use pre-cleaning','Required','Keep the box lock open and prevent soil from drying before transfer.','§ 5.2'),method('Manual cleaning','Required','Brush the hinge and jaws using the source-described manual-cleaning method.','§ 5.2'),method('Ultrasonic cleaning','Do not ultrasonic','This fictional product representation excludes ultrasonic cleaning.','§ 5.2'),method('Washer-disinfector','Applicable','Use the source-specified mechanical processing method after manual cleaning.','§ 5.2')]},{title:'Assembly / preparation',items:[method('Inspection','Required','Inspect blade alignment and smooth action.','§ 5.2'),method('Lubrication','As specified','Apply only the manufacturer-specified lubricant where applicable.','§ 5.2'),method('Position','Open / unlocked','Keep the box lock open for the represented process.','§ 5.2')]},{title:'Terminal processing',items:[method('Packaging','Applicable','Use the packaging configuration specified by the source.','§ 5.2'),method('Method','Steam sterilization','Use the source-specified steam method; this demo deliberately omits clinical parameters.','§ 5.2')]}),grounding:{reviewedBy:'MDR educator (simulated)',reviewedOn:'2026-09-18'},publication:{facilityId:'harbour',status:'published',publishedBy:'Harbour MDR lead (simulated)',publishedOn:'2026-09-20'}},
 {id:'kr-suction-r3',productId:'dm-t100',required:'manufacturer_product',sourceId:'ifu-demomed-r3',summary:'Manufacturer-grounded demonstration representation for the confirmed reusable DM-T100 lumened suction tube.',stages:stages({title:'Decontamination',items:[method('Point-of-use pre-cleaning','Required','Flush the lumen before soil dries.','§ 4.1'),method('Lumen flushing','Required','Irrigate the lumen before mechanical cleaning.','§ 4.2'),method('Brushing','Required','Brush the lumen with the specified brush before mechanical cleaning.','§ 4.2'),method('Ultrasonic cleaning','Do not ultrasonic','This fictional lumened tube representation excludes ultrasonic cleaning.','§ 4.3'),method('Washer-disinfector','Applicable after flushing','Secure the source-specified lumen irrigation accessory and orient the lumen for flow.','§ 4.4'),method('Drying','Required','Dry the lumen using the source-specified method.','§ 4.5')]},{title:'Assembly / preparation',items:[method('Inspection','Required','Confirm lumen patency and inspect the distal opening.','§ 4.6'),method('Position / accessory','Required','Use the specified lumen connector during mechanical processing.','§ 4.4')]},{title:'Terminal processing',items:[method('Packaging','Applicable','Use the source-specified protective configuration.','§ 4.7'),method('Method','Steam sterilization','Use the cited source for the authoritative terminal method.','§ 4.8')]}),grounding:{reviewedBy:'MDR educator (simulated)',reviewedOn:'2026-09-19'},publication:{facilityId:'harbour',status:'published',publishedBy:'Harbour MDR lead (simulated)',publishedOn:'2026-09-20'}},
 {id:'kr-mask-blue-r2',variantId:'fa-m20-blue',required:'variant',sourceId:'ifu-airway-r2',summary:'Manufacturer-grounded demonstration representation for the confirmed blue FA-M20-B variant.',stages:stages({title:'Decontamination',items:[method('Manual cleaning','Required','Use the blue-variant preparation route in the cited source.','§ 3.1'),method('Washer-disinfector','Blue-variant method','Use only the fictional blue-variant method identified in the source.','§ 3.2'),method('Drying','Required','Dry the seal using the source-specified method.','§ 3.3')]},{title:'Assembly / preparation',items:[method('Inspection','Required','Inspect the blue identification ring and face seal.','§ 3.4')]},{title:'Terminal processing',items:[method('Packaging','Applicable','Use the source-specified protective packaging arrangement.','§ 3.5'),method('Method','Source-specified terminal pathway','Consult § 3 for the blue-variant pathway.','§ 3.6')]}),grounding:{reviewedBy:'MDR educator (simulated)',reviewedOn:'2026-09-17'},publication:{facilityId:'harbour',status:'published',publishedBy:'Harbour MDR lead (simulated)',publishedOn:'2026-09-20'}},
 {id:'kr-mask-amber-r2',variantId:'fa-m20-amber',required:'variant',sourceId:'ifu-airway-r2',summary:'Manufacturer-grounded demonstration representation for the confirmed amber FA-M20-A variant.',stages:stages({title:'Decontamination',items:[method('Manual cleaning','Required','Use the amber-variant preparation route in the cited source.','§ 3.1'),method('Washer-disinfector','Amber-variant method','The fictional amber method is distinct from the blue-variant method.','§ 3.2'),method('Drying','Required','Dry the seal using the source-specified method.','§ 3.3')]},{title:'Assembly / preparation',items:[method('Inspection','Required','Inspect the amber identification ring and face seal.','§ 3.4')]},{title:'Terminal processing',items:[method('Packaging','Applicable','Use the source-specified protective packaging arrangement.','§ 3.5'),method('Method','Source-specified terminal pathway','Consult § 3 for the amber-variant pathway.','§ 3.6')]}),grounding:{reviewedBy:'MDR educator (simulated)',reviewedOn:'2026-09-17'},publication:{facilityId:'harbour',status:'published',publishedBy:'Harbour MDR lead (simulated)',publishedOn:'2026-09-20'}},
 {id:'kr-flex-r1',productId:'dm-f40',required:'manufacturer_product',sourceId:'ifu-demoscope-r1',summary:'Manufacturer-grounded demonstration representation for the confirmed DS-F40 flexible semi-critical device.',stages:stages({title:'Decontamination',items:[method('Point-of-use pre-cleaning','Required','Use the source-described pre-cleaning method immediately after use.','§ 6.1'),method('Leak testing','Required before immersion','Perform the source-specified leak test before immersion.','§ 6.2'),method('Manual cleaning','Required','Brush and flush all accessible channels using the source-described method.','§ 6.3'),method('Washer-disinfector','Not applicable','This fictional flexible device representation does not use a washer-disinfector pathway.','§ 6.4')]},{title:'High-level disinfection',items:[method('HLD pathway','Applicable','Use the source-specified high-level disinfection pathway after manual cleaning.','§ 6.5'),method('Rinsing','Required','Use the source-specified rinse sequence following HLD.','§ 6.6'),method('Drying','Required','Dry channels and exterior before storage.','§ 6.7')]},{title:'Special handling',items:[method('Sterilization','Not the represented pathway','Do not substitute a steam cycle for the source-specified HLD pathway.','§ 6.5')]}),grounding:{reviewedBy:'MDR educator (simulated)',reviewedOn:'2026-09-19'},publication:{facilityId:'harbour',status:'published',publishedBy:'Harbour MDR lead (simulated)',publishedOn:'2026-09-20'}},
 {id:'kr-camera-r2',productId:'tv-c20',required:'manufacturer_product',sourceId:'ifu-thermaview-r2',summary:'Manufacturer-grounded demonstration representation for the confirmed TV-C20 thermolabile camera head.',stages:stages({title:'Decontamination',items:[method('Manual cleaning','Required','Use the source-specified wipe-down method.','§ 7.1'),method('Immersion','Do not immerse','This fictional camera-head representation excludes immersion.','§ 7.1'),method('Ultrasonic cleaning','Do not ultrasonic','This fictional camera-head representation excludes ultrasonic cleaning.','§ 7.1')]},{title:'Assembly / preparation',items:[method('Inspection','Required','Inspect the cable connection and housing seal.','§ 7.2'),method('Protection','Required','Use the specified protective accessory before terminal processing.','§ 7.2')]},{title:'Terminal processing',items:[method('Packaging','Applicable','Use the source-specified low-temperature packaging arrangement.','§ 7.3'),method('Method','Low-temperature processing','Use the cited source for the applicable low-temperature method; do not use steam.','§ 7.3')]}),grounding:{reviewedBy:'MDR educator (simulated)',reviewedOn:'2026-09-19'},publication:{facilityId:'harbour',status:'published',publishedBy:'Harbour MDR lead (simulated)',publishedOn:'2026-09-20'}}
];

// Fictional prototype product mappings deliberately demonstrate the complete V4
// chain. A trusted local mapping is seeded evidence, never a result of a click,
// visual comparison, tray context, or a user-entered nickname.
const demoSources=[
 {id:'ifu-demo-standard-r4',title:'Example Surgical reusable instruments IFU',revision:'4 (fictional prototype)',locator:'§ 5 / pp. 8–10',manufacturer:'Example Surgical'},
 {id:'ifu-demo-handwash-r2',title:'Harbour Precision handwash-only IFU',revision:'2 (fictional prototype)',locator:'§ 4 / pp. 6–8',manufacturer:'Harbour Precision'},
 {id:'ifu-demo-lumen-r3',title:'DemoFlow lumened instruments IFU',revision:'3 (fictional prototype)',locator:'§ 6 / pp. 11–14',manufacturer:'DemoFlow'}
];
authoritativeSources.push(...demoSources);

const standardDemoStages=()=>stages(
 {title:'Decontamination',items:[method('Route','Standard','Follow the fictional standard reusable-instrument route in the cited IFU.','§ 5.1'),method('Manual cleaning','Required','Brush articulated areas and accessible surfaces while submerged.','§ 5.2'),method('Ultrasonic cleaning','Required','Use the validated ultrasonic cycle described by this fictional demo source.','§ 5.3'),method('Washer-disinfector','Required','Process through the applicable instrument cycle with joints open.','§ 5.4'),method('Flushing / lumen cleaning','Not required','No lumen requirement is represented for this demo product.','§ 5.4')]},
 {title:'Packaging',items:[method('Packaging','Wrap','Place the instrument open or unlocked in the represented tray configuration before wrapping.','§ 5.5')]},
 {title:'Sterilization / HLD process',items:[method('Method','Steam','Use the fictional source-specified steam method; parameters are intentionally not shown in this prototype.','§ 5.6')]},
 {title:'Warnings / Notes',items:[method('Articulated instruments','Keep open / unlocked','Keep joints and ratchets open during the represented processing route.','§ 5.2')]}
);
const handwashDemoStages=()=>stages(
 {title:'Decontamination',items:[method('Route','Handwash only','Manual cleaning → pass-through window → skip ultrasonic → skip washer-disinfector.','§ 4.1'),method('Manual cleaning','Required','Use the fictional source-described handwash method for all accessible surfaces.','§ 4.2'),method('Ultrasonic cleaning','Not required','This represented handwash-only product does not use ultrasonic cleaning.','§ 4.2'),method('Washer-disinfector','Not required','Do not place this represented product in a washer-disinfector.','§ 4.3'),method('Pass-through window','Yes','Transfer through the designated pass-through after manual cleaning.','§ 4.4')]},
 {title:'Packaging',items:[method('Packaging','Peel pouch','Position the item to protect the working end in the fictional source-specified pouch configuration.','§ 4.5')]},
 {title:'Sterilization / HLD process',items:[method('Method','Low-temperature','Use the fictional source-specified low-temperature system; do not substitute steam.','§ 4.6')]},
 {title:'Warnings / Notes',items:[method('Washer-disinfector','Do not use','Handwash-only route: do not place in a washer-disinfector.','§ 4.3'),method('Steam','Do not use','This represented product is not on a steam pathway.','§ 4.6')]}
);
const lumenDemoStages=()=>stages(
 {title:'Decontamination',items:[method('Route','Standard','Follow the fictional lumened-instrument route in the cited IFU.','§ 6.1'),method('Manual cleaning','Required','Manually clean accessible surfaces before mechanical processing.','§ 6.2'),method('Brushing','Required','Brush the lumen with the represented source-specified brush.','§ 6.2'),method('Flushing / lumen cleaning','Required','Flush the lumen before mechanical processing.','§ 6.3'),method('Ultrasonic cleaning','Required','Use the represented validated ultrasonic cycle after manual cleaning.','§ 6.4'),method('Washer-disinfector','Required','Use the required lumen connection and orient the channel for flow.','§ 6.5')]},
 {title:'Packaging',items:[method('Packaging','Peel pouch','Protect the distal working end in the represented pouch configuration.','§ 6.6')]},
 {title:'Sterilization / HLD process',items:[method('Method','Steam','Use the fictional source-specified steam method; parameters are intentionally not shown in this prototype.','§ 6.7')]},
 {title:'Warnings / Notes',items:[method('Lumen accessory','Required','Use the required washer connection/accessory for mechanical processing.','§ 6.5'),method('Lumen flushing','Required before washer-disinfector','Flush and brush the lumen before mechanical processing.','§ 6.3')]}
);
const demoProfiles={
 standard:{sourceId:'ifu-demo-standard-r4',summary:'Fictional source-grounded standard reusable-instrument demonstration pathway.',stages:standardDemoStages},
 handwash:{sourceId:'ifu-demo-handwash-r2',summary:'Fictional source-grounded handwash-only, low-temperature demonstration pathway.',stages:handwashDemoStages},
 lumen:{sourceId:'ifu-demo-lumen-r3',summary:'Fictional source-grounded lumened-instrument demonstration pathway.',stages:lumenDemoStages}
};
const hldDemoStages=()=>stages(
 {title:'Decontamination',items:[method('Route','HLD pathway','Follow the fictional HLD preparation route in the cited IFU.','§ 6.1'),method('Manual cleaning','Required','Brush and flush all accessible channels using the source-described method.','§ 6.2'),method('Flushing / lumen cleaning','Required','Flush accessible channels before HLD.','§ 6.2'),method('Ultrasonic cleaning','Not required','This represented HLD pathway does not use ultrasonic cleaning.','§ 6.3'),method('Washer-disinfector','Not required','This represented HLD pathway does not use a washer-disinfector.','§ 6.3')]},
 {title:'Packaging',items:[method('Packaging','None','No terminal-sterilization packaging is represented for this HLD pathway.','§ 6.4')]},
 {title:'Sterilization / HLD process',items:[method('Method','HLD','Use the fictional source-specified HLD method after manual cleaning.','§ 6.5')]},
 {title:'Warnings / Notes',items:[method('Steam','Do not use','Do not substitute steam for the represented HLD pathway.','§ 6.5')]}
);
const lowTemperatureDemoStages=()=>stages(
 {title:'Decontamination',items:[method('Route','Handwash only','Manual cleaning → pass-through window → skip ultrasonic → skip washer-disinfector.','§ 7.1'),method('Manual cleaning','Required','Use the source-specified wipe-down method for the represented camera head.','§ 7.1'),method('Ultrasonic cleaning','Not required','This represented product does not use ultrasonic cleaning.','§ 7.1'),method('Washer-disinfector','Not required','This represented product does not use a washer-disinfector.','§ 7.1'),method('Pass-through window','Yes','Transfer through the designated pass-through after manual cleaning.','§ 7.2')]},
 {title:'Packaging',items:[method('Packaging','Peel pouch','Use the represented protective pouch configuration.','§ 7.3')]},
 {title:'Sterilization / HLD process',items:[method('Method','Low-temperature','Use the fictional source-specified low-temperature method.','§ 7.3')]},
 {title:'Warnings / Notes',items:[method('Steam','Do not use','Do not steam the represented thermolabile camera head.','§ 7.3'),method('Immersion','Do not use','Do not immerse the represented camera head.','§ 7.1')]}
);
const variantDemoStages=variant=>stages(
 {title:'Decontamination',items:[method('Route','Standard','Follow the fictional reusable-mask route for the confirmed variant.','§ 3.1'),method('Manual cleaning','Required',`Use the ${variant} variant preparation method in the cited source.`,'§ 3.1'),method('Ultrasonic cleaning','Not required','This represented variant does not use ultrasonic cleaning.','§ 3.2'),method('Washer-disinfector','Required','Use only the fictional variant-specific method identified in the source.','§ 3.2')]},
 {title:'Packaging',items:[method('Packaging','Peel pouch','Use the source-specified protective pouch configuration.','§ 3.3')]},
 {title:'Sterilization / HLD process',items:[method('Method','Low-temperature','Use the fictional source-specified low-temperature pathway.','§ 3.4')]},
 {title:'Warnings / Notes',items:[method('Variant confirmation','Required','The colour ring is a clue; confirm the exact variant before relying on this pathway.','§ 3.1')]}
);
const refreshDemoRepresentation=(id,sourceId,summary,stages)=>{
 const representation=knowledgeRepresentations.find(item=>item.id===id);
 if(representation)Object.assign(representation,{sourceId,summary,stages:stages()});
};
// Keep legacy demonstration records in the same concise frontline sequence as
// newly seeded records. Details such as inspection or an accessory remain notes,
// rather than becoming standalone workflow stages.
refreshDemoRepresentation('kr-mayo-r4','ifu-demo-standard-r4','Fictional source-grounded standard reusable-instrument demonstration pathway.',standardDemoStages);
refreshDemoRepresentation('kr-suction-r3','ifu-demo-lumen-r3','Fictional source-grounded lumened-instrument demonstration pathway.',lumenDemoStages);
refreshDemoRepresentation('kr-mask-blue-r2','ifu-airway-r2','Fictional source-grounded blue-variant demonstration pathway.',()=>variantDemoStages('blue'));
refreshDemoRepresentation('kr-mask-amber-r2','ifu-airway-r2','Fictional source-grounded amber-variant demonstration pathway.',()=>variantDemoStages('amber'));
refreshDemoRepresentation('kr-flex-r1','ifu-demoscope-r1','Fictional source-grounded flexible-device HLD demonstration pathway.',hldDemoStages);
refreshDemoRepresentation('kr-camera-r2','ifu-thermaview-r2','Fictional source-grounded low-temperature demonstration pathway.',lowTemperatureDemoStages);
const unresolvedDemoConcepts=new Set(['suction-single','mask','scope','babcock','carmalt','lahey','mayo-guyon','russian','ferris-smith','dressing','iris','stevens','potts','lister','halsey','baumgartner','collier','richardson-eastman','harrington','senn','volkmann','baron','house','rosen','andrews-pynchon','bone-mallet']);
const handwashDemoConcepts=new Set(['lap-atraumatic-grasper','maryland-dissector','lap-scissors','lap-needle-holder','lap-babcock','lap-bowel-grasper','lap-retractor','monopolar-hook','molt-9','seldin-23','lucas-curette','cryer-left','cryer-right','seldin-straight','miller-colburn','heidbrink','friedman-rongeur']);
const lumenDemoConcepts=new Set(['yankauer','poole','frazier','laparoscopic-suction','orthopedic-suction']);
const profileForDemoConcept=id=>lumenDemoConcepts.has(id)?'lumen':handwashDemoConcepts.has(id)?'handwash':'standard';
const seededMappings=[];
instruments.filter(item=>!item.productIds?.length&&!unresolvedDemoConcepts.has(item.id)).forEach((item,index)=>{
 const profileName=profileForDemoConcept(item.id),profile=demoProfiles[profileName],productId=`demo-${item.id}`;
 products.push({id:productId,conceptId:item.id,manufacturer:profileName==='handwash'?'Harbour Precision':profileName==='lumen'?'DemoFlow':'Example Surgical',model:`${item.name} demo reference`,catalog:`HD-${String(index+101).padStart(3,'0')}`,reuse:'Reusable',trustedLocalProductMapping:true});
 item.productIds=[...(item.productIds||[]),productId];
 seededMappings.push({id:`kr-${item.id}-demo-r1`,productId,required:'manufacturer_product',sourceId:profile.sourceId,summary:profile.summary,stages:profile.stages(),grounding:{reviewedBy:'MDR educator (simulated)',reviewedOn:'2026-09-24'},publication:{facilityId:'harbour',status:'published',publishedBy:'Harbour MDR lead (simulated)',publishedOn:'2026-09-25'}});
});
knowledgeRepresentations.push(...seededMappings);
['ex-m170','dm-t100','dm-f40','tv-c20'].forEach(id=>{const product=products.find(candidate=>candidate.id===id);if(product)product.trustedLocalProductMapping=true;});

export const getProfile=item=>facilityProfiles[item.id]||{preferredName:'',aliases:[],trays:[],note:'No facility context has been recorded yet.'};
export const getSpecialties=item=>instrumentSpecialties.filter(link=>link.instrument_concept_id===item.id).map(link=>specialtyTerms.find(term=>term.id===link.specialty_term_id)).filter(Boolean);
export const getProducts=item=>products.filter(p=>item.productIds?.includes(p.id));
export const getVariants=item=>variants.filter(v=>getProducts(item).some(p=>p.id===v.productId));
export const getSource=representation=>authoritativeSources.find(s=>s.id===representation?.sourceId);
const rank={concept:0,manufacturer_product:1,variant:2};

export function resolveIdentity(item,identifier=''){
 const value=identifier.trim().toUpperCase();
 const candidateProducts=getProducts(item),candidateVariants=getVariants(item);
 const variant=candidateVariants.find(v=>v.catalog===value);
 if(variant)return {resolved_level:'variant',status:'confirmed',confirmation_basis:'trusted_identifier',candidate_evidence:['user_selection'],product:candidateProducts.find(p=>p.id===variant.productId),variant};
 const product=candidateProducts.find(p=>p.catalog===value);
 if(product)return {resolved_level:'manufacturer_product',status:'confirmed',confirmation_basis:'trusted_identifier',candidate_evidence:['user_selection'],product};
 if(!value){const mappedProduct=candidateProducts.find(p=>p.trustedLocalProductMapping);if(mappedProduct)return {resolved_level:'manufacturer_product',status:'confirmed',confirmation_basis:'trusted_local_product_mapping',candidate_evidence:['trusted_local_product_mapping'],product:mappedProduct};}
 return {resolved_level:'concept',status:'confirmed',confirmation_basis:'none',candidate_evidence:['visual_comparison','user_selection']};
}
export function getApplicableRepresentation(item,resolution){
 if(resolution.resolved_level==='variant')return knowledgeRepresentations.find(r=>r.variantId===resolution.variant?.id);
 if(resolution.resolved_level==='manufacturer_product')return knowledgeRepresentations.find(r=>r.productId===resolution.product?.id);
 return undefined;
}
export function knowledgeState(item,resolution){
 const product=getProducts(item)[0];
 const related=knowledgeRepresentations.filter(r=>r.productId===resolution.product?.id||r.variantId&&variants.find(v=>v.id===r.variantId)?.productId===resolution.product?.id||r.productId===product?.id||r.variantId&&variants.find(v=>v.id===r.variantId)?.productId===product?.id);
 const representation=getApplicableRepresentation(item,resolution);
 if(!product||resolution.status!=='confirmed'||(resolution.resolved_level!=='concept'&&!['trusted_identifier','trusted_local_product_mapping'].includes(resolution.confirmation_basis)))return 'identity_insufficient';
 if(!representation){if(related.length&&resolution.resolved_level!=='variant')return 'identity_insufficient';return 'source_unresolved';}
 if(rank[resolution.resolved_level]<rank[representation.required])return 'identity_insufficient';
 if(representation.publication.facilityId!==facility.id||representation.publication.status!=='published')return 'unpublished';
 return 'available';
}
export function search(query='',tray='',category='',family='',specialty=''){
 const normalize=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const q=normalize(query);
 const selectedFamily=family?normalizeInstrumentFamily(family):null;
 if(family&&!selectedFamily)return [];
 return instruments.flatMap(item=>{
  const profile=getProfile(item), itemProducts=getProducts(item), itemVariants=getVariants(item),itemSpecialties=getSpecialties(item);
  if(tray&&!profile.trays.some(t=>t.name===tray))return [];
  if(category&&item.category!==category)return [];
  if(selectedFamily&&normalizeInstrumentFamily(item.family||item.category)!==selectedFamily)return [];
  if(specialty&&!itemSpecialties.some(term=>term.id===specialty))return [];
  const fields=[['Matched common name',item.name],['Matched instrument family',item.family],['Matched specialty',itemSpecialties.map(term=>term.name).join(' ')],['Matched local name',profile.preferredName],['Matched local alias',profile.aliases.join(' ')],['Matched catalog number',itemProducts.map(p=>p.catalog).join(' ')],['Matched variant catalog number',itemVariants.map(v=>v.catalog).join(' ')],['Matched manufacturer',itemProducts.map(p=>p.manufacturer).join(' ')],['Matched model',itemProducts.map(p=>p.model).join(' ')],['Feature match',item.features.join(' ')],['Tray-context match',profile.trays.map(t=>t.name).join(' ')]];
  const reasons=fields.filter(([,value])=>q&&normalize(value).includes(q)).map(([reason])=>reason);
  if(q&&!reasons.length)return [];
  return [{...item,reasons:tray?[`Found in ${tray}`,...reasons]:reasons.length?reasons:['Browse instrument reference']}];
 });
}
// Keep family-card counts and family browsing on the same normalized collection.
export const getInstrumentsForFamily=family=>search('','','',family,'');
export function addLocalReference({name,preferredName,aliases='',tray,quantity,note,category='Local reference',distinguishingFeatures='',manufacturer='',catalog='',reuse='',variant='',whereFound='',sourceLink='',ifuRevision='',sourceLocator='',sourceNote='',reviewStatus='Draft',...processingDraft}){
 const id=`local-${Date.now().toString(36)}`;
 const features=distinguishingFeatures.split('\n').map(feature=>feature.trim()).filter(Boolean);
 const item={id,name,category,features:features.length?features:['Locally entered reference — features pending review'],kind:'forceps',warning:'This is a draft instrument record. Manufacturer product and applicable processing methods are not confirmed yet.'};
 instruments.unshift(item);
 facilityProfiles[id]={preferredName:preferredName||name,aliases:aliases.split(',').map(x=>x.trim()).filter(Boolean),trays:tray?[{name:tray,quantity:quantity||'not recorded'}]:[],note:[whereFound,note].filter(Boolean).join(' · ')||'Local MDR note pending review.'};
 instrumentDrafts[id]={manufacturer,catalog,reuse,variant,sourceLink,ifuRevision,sourceLocator,sourceNote,reviewStatus,processingDraft};
 return item;
}
const normalizedText=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function findLikelyConceptMatches({name='',aliases=[]}={}){
 const names=[name,...(Array.isArray(aliases)?aliases:String(aliases).split(','))].map(normalizedText).filter(Boolean);
 if(!names.length)return [];
 return instruments.filter(item=>{
  const profile=getProfile(item);
  const candidates=[item.name,profile.preferredName,...profile.aliases].map(normalizedText).filter(Boolean);
  return names.some(value=>candidates.some(candidate=>candidate===value||candidate.includes(value)||value.includes(candidate)));
 });
}
// Shared playground drafts hydrate into the same in-memory read model as seeded
// concepts. Their draft/source state remains separate from product and V4 knowledge.
export function upsertSharedDraft(record){
 const id=`shared-${record.id}`;
 const normalizedFamily=normalizeInstrumentFamily(record.family);
 const aliases=Array.isArray(record.aliases)?record.aliases:[];
 const cue=record.recognition_cue||'Recognition cue pending review';
 const features=[cue,...(record.distinguishing_features||[])].filter((value,index,all)=>value&&all.indexOf(value)===index);
 const item={id,name:record.common_name,category:normalizedFamily||record.family||'Local reference',family:normalizedFamily||record.family||'Local reference',features,kind:'forceps',confusableNames:record.confusables||[],warning:'Shared tester draft. Exact manufacturer product and applicable processing guidance are not confirmed.'};
 const existing=instruments.findIndex(candidate=>candidate.id===id);
 if(existing>=0)instruments.splice(existing,1,item);else instruments.unshift(item);
 const specialtyIds=(record.specialty_ids||[]).filter(specialtyId=>specialtyTerms.some(term=>term.id===specialtyId));
 for(let index=instrumentSpecialties.length-1;index>=0;index--)if(instrumentSpecialties[index].instrument_concept_id===id)instrumentSpecialties.splice(index,1);
 linkSpecialties(id,...specialtyIds);
 const context=record.facility_context||{};
 facilityProfiles[id]={preferredName:context.local_name||record.common_name,aliases,trays:(context.trays||[]).map(tray=>({name:tray.name,quantity:tray.quantity||'not recorded'})),note:context.note||'Shared tester draft — facility context pending review.'};
 const product=record.product_candidate||{};
 instrumentDrafts[id]={manufacturer:product.manufacturer||'',catalog:product.catalog||'',reuse:product.reuse||'',variant:product.variant||'',reviewStatus:'Draft',sourceGroundingState:'not_source_grounded',isShared:true,submittedBy:record.submitted_by||'',processingDraft:record.processing_draft||{},sourceNote:record.source_note||''};
 return item;
}
export const getInstrumentDraft=item=>instrumentDrafts[item.id];
