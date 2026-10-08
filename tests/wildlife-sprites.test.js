import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SPECIES} from '../src/data/wildlife.js';
import {combatAnimalVisual,wildlifeFrame,WOODLAND_WILDLIFE} from '../src/data/wildlifeArt.js';
const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
const manifest=JSON.parse(readFileSync('public/assets/pixel/processed/manifest.json'));
test('the five supplied animal identities resolve native local directional animations',()=>{
 assert.deepEqual(Object.keys(SPECIES),['boar']);assert.deepEqual([...new Set(WOODLAND_WILDLIFE.map(a=>a.species))].sort(),['deer','fox','grouse','hare']);
 for(const species of ['boar','deer','hare','fox','grouse'])for(const direction of ['up','down','left','right'])for(const action of species==='boar'?['idle','walk','run','attack']:['idle','walk'])for(let now=0;now<2300;now+=85){const frame=wildlifeFrame(species,action,direction,now);assert.ok(atlas.frames[frame],frame);assert.ok(manifest.craftpixFrames[frame],frame);}
});
test('retained boar poses use four real directions with stable feet and no mirroring',()=>{
 for(const direction of ['up','down','left','right'])for(const action of ['idle','walk','run','attack']){const pose=combatAnimalVisual('boar',action,direction,140);assert.ok(pose.frame.startsWith('cp-boar-'+action+'-'+direction));assert.equal(pose.flipX,false);assert.equal(pose.originY,.9);}
});
test('the production atlas excludes all removed animal packs and geometric placeholders',()=>{
 assert.deepEqual(manifest.wildlifeFrames,{});assert.ok(!Object.keys(atlas.frames).some(id=>id.startsWith('wa-')));
 for(const name of ['boar','lion','tiger','cheetah','leopard','jaguar','wolf','hyena','elephant','giraffe','hippopotamus','zebra','rhinoceros','kangaroo','panda','polarBear','chimpanzee','gorilla','monkey','crocodile','komodo','snake'])for(let n=0;n<4;n++)assert.ok(!atlas.frames[name+n],name+n);
});
test('selected animal frames retain the existing Craftpix provenance',()=>{
 for(const [id,p] of Object.entries(manifest.craftpixFrames).filter(([id])=>/^cp-(boar|deer|hare|fox|grouse)-/.test(id))){assert.ok(atlas.frames[id]);assert.ok(p.file&&p.rectangle,JSON.stringify(p));assert.ok(!manifest.originalAdditions.includes(id));}
});
