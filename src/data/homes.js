import {CITY_BUILDING_ART} from './cityBuildingArt.js';
// The active Home catalogue deliberately reuses two approved City residences.
// Retired IDs stay listed separately so Continue can preserve prior purchases.
export const LEGACY_HOME_IDS=['rose','orchard','coastal','bamboo','brick','glass','alpine','manor'];
export const HOMES={
 starter:{name:'Green Bay cottage',price:0,artFrame:'house-03-green-bay',roof:0x7d844d,wall:0xe6d4b0,trim:0x76533b,floor:0xb99b72,accent:0x84915a,detail:'Olive roof, warm cream walls and a matching green interior.',style:'green-bay'},
 slate:{name:'Blue Slate cottage',price:2000,artFrame:'house-02-blue-slate',roof:0x52678d,wall:0xd7dce3,trim:0x5c6f87,floor:0x9ca8b6,accent:0x71849e,detail:'Blue slate roof, pale walls and a matching cool-blue interior.',style:'blue-slate'},
};
export const HOME_IDS=['slate'];
export const freshHome=()=>({design:'starter',owned:['starter']});
export const homeDefinition=s=>HOMES[s?.home?.design]||HOMES.starter;
export const homeArtDefinition=id=>CITY_BUILDING_ART[(HOMES[id]||HOMES.starter).artFrame];
export function homeWorldPlacement(id,building){
 const source=CITY_BUILDING_ART[building.artFrame],target=homeArtDefinition(id),sourceScale=building.artScale||source.scale,scale=target.scale;
 const center=building.x+source.width*sourceScale/2,visibleBottom=building.y+source.bounds[3]*sourceScale;
 return {x:Math.round(center-target.width*scale/2),y:visibleBottom-target.bounds[3]*scale,scale,depth:visibleBottom,art:target};
}
export const homeWorldSolids=(id,building)=>{const p=homeWorldPlacement(id,building);return p.art.foundationRows.map(([x,y,w,h])=>[p.x+x*p.scale,p.y+y*p.scale,w*p.scale,h*p.scale]);};
export const CUSTOMIZE_AREAS=['home','farm','interior'];
