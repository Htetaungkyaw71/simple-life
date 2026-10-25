import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {MAPS} from '../src/data/mapLayouts.js';
import {CITY_BUILDING_ART,CITY_BUILDING_PLACEMENTS,CITY_HOUSE_LAWNS} from '../src/data/cityBuildingArt.js';
import {cityMaskHits} from '../src/data/citySurfaceGeometry.js';

const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/city-buildings.json'));
const png=readFileSync('public/assets/pixel/processed/city-buildings.png');
const sha=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
test('twelve user Pixel Snapper files retain their native canvases in one local nearest-filtered atlas',()=>{
 assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[1024,512]);
 assert.equal(Object.keys(atlas.frames).length,12);
 const audit=JSON.parse(readFileSync('output/art/city-building-snapper-v2/art-audit.json'));
 for(const item of audit.assets){const frame=atlas.frames[item.id].frame,art=CITY_BUILDING_ART[item.id];assert.deepEqual([frame.w,frame.h],item.dimensions);assert.deepEqual([art.width,art.height],item.dimensions);assert.equal(art.scale,item.id==='cafe-terracotta-awning'?1:2);assert.equal(item.worldScale,art.scale);assert.equal(art.texture,'cityBuildings');assert.equal(sha(item.source),item.sha256);assert.equal(item.nativePixelsUnchanged,true);assert.equal(item.alpha.transparent,true);}
});
test('four reviewed facades match the reference height and the barber matches the clothing shop',()=>{
 const homes=Object.entries(CITY_BUILDING_PLACEMENTS);
 assert.equal(homes.length,9);assert.equal(new Set(homes.map(([,p])=>p.id)).size,9);
 for(const [index,p]of homes){const b=MAPS.city.buildings[Number(index)],a=CITY_BUILDING_ART[p.id];assert.equal(b.artTexture,'cityBuildings');assert.equal(b.artFrame,p.id);assert.equal(b.artScale,p.scale);assert.deepEqual([b.x,b.y],[Math.round(p.anchor[0]-a.width*p.scale/2),p.anchor[1]-a.height*p.scale]);assert.equal(b.artDepth,b.y+a.bounds[3]*p.scale);assert.ok(b.solidRows.length>=5);assert.deepEqual(b.porch,{x:p.porch[0],y:p.porch[1]});assert.equal(cityMaskHits('walk',CITY_HOUSE_LAWNS[index]),false);}
 for(const index of ['0']){const p=homes.find(([i])=>i===index)[1],a=CITY_BUILDING_ART[p.id];assert.ok(Math.abs((a.bounds[3]-a.bounds[1])*p.scale-190)<1e-9,index+' retains reference height');}
 for(const index of ['4','7']){const p=homes.find(([i])=>i===index)[1],a=CITY_BUILDING_ART[p.id];assert.ok(Math.abs((a.bounds[3]-a.bounds[1])*p.scale-225)<1e-9,index+' is modestly enlarged to lower-house scale');}
 assert.equal(MAPS.city.buildings[3].artDepth,MAPS.city.buildings[1].artDepth,'aligned north-east house foundations');
 assert.equal(MAPS.home.buildings[0].artFrame,'house-03-green-bay');
 assert.deepEqual(MAPS.home.buildings.slice(1).map(b=>b.artFrame),['house-05-plum-townhouse','house-08-grey-hipped']);
 assert.ok(MAPS.home.buildings.every(b=>b.artScale===2));
 assert.equal(MAPS.farm.buildings[0].artFrame,'house-02-blue-slate');
 assert.equal(cityMaskHits('walk',CITY_HOUSE_LAWNS[1]),false);
 const cafe=MAPS.city.buildings.find(b=>b.name==='city-cafe'),cafeArt=CITY_BUILDING_ART[cafe.artFrame];assert.equal(cafe.artFrame,'cafe-terracotta-awning');assert.equal(cafe.artTexture,'cityBuildings');assert.ok(Math.abs((cafeArt.bounds[3]-cafeArt.bounds[1])*cafe.artScale-190)<1e-9);assert.deepEqual(cafe.entry,{x:872,y:966});assert.deepEqual(cafe.porch,{x:872,y:996});
 assert.equal(MAPS.city.buildings.find(b=>b.name==='city-barber').artFrame,'shop-barber-blue-roof');
 assert.equal(MAPS.city.buildings.find(b=>b.name==='city-clothing').artFrame,'shop-clothing-sage-awning');
 const barber=MAPS.city.buildings.find(b=>b.name==='city-barber'),clothing=MAPS.city.buildings.find(b=>b.name==='city-clothing'),barberArt=CITY_BUILDING_ART[barber.artFrame],clothingArt=CITY_BUILDING_ART[clothing.artFrame];
 assert.ok(Math.abs((barberArt.bounds[3]-barberArt.bounds[1])*barber.artScale-(clothingArt.bounds[3]-clothingArt.bounds[1])*clothing.artScale)<1e-9);
 assert.ok(Math.abs(barberArt.width*barber.artScale-clothingArt.width*clothing.artScale)<10);
 assert.equal(MAPS.city.buildings[1].artFrame,'city-review-cottage-terracotta-snapper');
});
