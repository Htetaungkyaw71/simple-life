import {recordStory} from './story.js';
import {forestStones} from '../data/forestResources.js';
import {lineClear} from './forest.js';
export const stoneAvailable=(s,n)=>!s.forest.stones.includes(n.id);
export function stoneContext(s,target=null){
 if(s.area!=='forest')return null;
 const node=forestStones().filter(n=>stoneAvailable(s,n)&&Math.hypot(n.x-s.position.x,n.y-s.position.y)<64&&(!target||Math.hypot(n.x-target.x,n.y-target.y)<32)&&lineClear('forest',s.position,n,0,s)).sort((a,b)=>Math.hypot(a.x-s.position.x,a.y-s.position.y)-Math.hypot(b.x-s.position.x,b.y-s.position.y))[0];
 return node?{...node,type:'stone',label:'Pick up stone'}:null;
}
export function collectStone(s,id){
 const node=forestStones().find(n=>n.id===id);
 if(!node||s.area!=='forest'||Math.hypot(node.x-s.position.x,node.y-s.position.y)>=64||!lineClear('forest',s.position,node,0,s))return 'Walk closer to the stone.';
 if(!stoneAvailable(s,node))return 'Already gathered.';
 if(s.inventory.stone+2>9999)return 'Bag full.';
 if(s.energy<1)return 'Too tired / eat or sleep.';
 s.energy--;s.inventory.stone+=2;recordStory(s,'stone');s.forest.stones.push(id);return '+2 Stone';
}
