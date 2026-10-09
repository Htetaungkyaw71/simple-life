// Offline canvas-command adapter. No Phaser/browser or user storage is started.
import {readFileSync} from 'node:fs';
const atlasFrames={town:JSON.parse(readFileSync('public/assets/pixel/processed/town.json','utf8')).frames,world:JSON.parse(readFileSync('public/assets/pixel/world.json','utf8')).frames};
const xml=readFileSync('public/assets/pixel/font.xml','utf8');
export const glyphs=Object.fromEntries([...xml.matchAll(/<char ([^>]+)\/>/g)].map(m=>{const d=Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]+)"/g)].map(p=>[p[1],Number(p[2])]));return [String.fromCharCode(d.id),d];}));
export function linesOf(value,size,maxWidth){const lines=[];for(const line of String(value).split('\n')){let row='';for(const word of line.split(' ')){const test=row?row+' '+word:word;if(maxWidth&&advance(test,size)>maxWidth&&row){lines.push(row);row=word;}else row=test;}lines.push(row);}return lines;}
function advance(value,size){return [...value].reduce((n,c)=>n+(glyphs[c]?.xadvance||0)*size/8,0);}
class Node {
 constructor(scene,type,x=0,y=0){this.scene=scene;this.type=type;this.x=x;this.y=y;this.scaleX=1;this.scaleY=1;this.alpha=1;this.visible=true;this.originX=0;this.originY=0;this.events={};this.list=[];this.commands=[];}
 add(n){for(const o of Array.isArray(n)?n:[n]){o.parent=this;this.list.push(o);}return this;}
 setOrigin(x,y=x){this.originX=x;this.originY=y;return this;}setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this;}setPosition(x,y){this.x=x;this.y=y;return this;}setX(x){this.x=x;return this;}
 setAlpha(v){this.alpha=v;return this;}setVisible(v){this.visible=v;return this;}setDepth(v){this.depth=v;return this;}setRotation(v){this.rotation=v;return this;}setFlipX(v){this.flipX=v;return this;}setFlipY(v){this.flipY=v;return this;}setTint(v){this.tint=v;return this;}setCenterAlign(){this.align='center';return this;}
 setText(v){this.text=String(v);return this;}setFontSize(v){this.size=v;return this;}setMaxWidth(v){this.maxWidth=v;return this;}
 setTexture(key,frame){this.texture=key;this.frame=frame;return this;}setSize(w,h){this.w=w;this.h=h;return this;}
 get width(){return this.type==='text'?Math.max(...linesOf(this.text,this.size,this.maxWidth).map(l=>advance(l,this.size))):this.w||16;}
 get height(){return this.type==='text'?linesOf(this.text,this.size,this.maxWidth).length*this.size/8*10:this.h||16;}
 fillStyle(color,alpha=1){this.fill=color;this.fillAlpha=alpha;return this;}fillRect(x,y,w,h){this.commands.push({type:'rect',x,y,w,h,color:this.fill,alpha:this.fillAlpha});return this;}
 lineStyle(width,color,alpha=1){this.stroke={width,color,alpha};return this;}strokeRect(x,y,w,h){this.commands.push({type:'stroke',x,y,w,h,...this.stroke});return this;}clear(){this.commands=[];if(this.type==='container')this.list=[];return this;}
 setFillStyle(c){this.color=c;return this;}setStrokeStyle(){return this;}setInteractive(config){this.input={enabled:true,config};return this;}
 on(name,fn){this.events[name]=fn;return this;}destroy(){this.visible=false;return this;}sendToBack(n){this.list=this.list.filter(i=>i!==n);this.list.unshift(n);return this;}
}
export function recorder(width=1280,height=720){
 const fontCache=new Map([['pixel',{texture:'pixel',data:{size:8,lineHeight:10},frame:null}]]);
 const u={cache:{bitmapFont:{exists:k=>fontCache.has(k),get:k=>fontCache.get(k),add:(k,v)=>fontCache.set(k,v)}},w:width/2,h:height/2,safe:{left:0,right:0,top:0,bottom:0},touch:width<1000,controls:[],focus:0,time:{now:1000},tweens:{addCounter(){}},textures:{cache:new Map(),exists(k){return this.cache.has(k);},getFrame(k,name){if(k==='pixel'){const g=glyphs[' '],base=name==='__BASE';return {name:base?'__BASE':' ',cutX:base?0:g.x,cutY:base?0:g.y,cutWidth:base?128:g.width,cutHeight:base?64:g.height,source:{image:{key:'pixel'},scaleMode:1}};}const t=this.cache.get(k);return {cutX:0,cutY:0,cutWidth:t.w,cutHeight:t.h,source:{image:t,scaleMode:t.filter}};},get(k){if(k==='town'||k==='world')return {has:frame=>Object.hasOwn(atlasFrames[k],frame)};return this.cache.get(k);},createCanvas(k,w,h){const t={w,h,context:{drawImage(image,x,y,w,h){t.sourceImage=image;t.sourceRect={x,y,w,h};t.fontHasInk=image.key!=='pixel'||w>3;},fillRect(){if(this.globalCompositeOperation==='source-in')t.fontColor=parseInt(this.fillStyle.slice(1),16);},createImageData:()=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(d){t.pixels=Array.from(d.data);}},refresh(){},setFilter(mode){this.filter=mode;return this;}};this.cache.set(k,t);return t;}},highlight(){},close(){this.closed=true;},layout(){this.root=this.add.container();this.controls=[];this.menu?.draw();}};
 const make=(type,x,y)=>new Node(u,type,x,y);
 u.add={container:(x=0,y=0)=>make('container',x,y),graphics:()=>make('graphics',0,0),bitmapText:(x,y,key,v,size)=>Object.assign(make('text',x,y),{text:String(v),size,font:key,fontColor:u.textures.cache.get(key)?.fontColor??0xffffff,fontHasInk:u.textures.cache.get(key)?.fontHasInk??true,tint:0xffffff}),image:(x,y,key,frame)=>Object.assign(make('image',x,y),{texture:key,frame}),sprite:(x,y,key,frame)=>Object.assign(make('image',x,y),{texture:key,frame}),rectangle:(x,y,w,h,color,alpha=1)=>Object.assign(make('rectangle',x,y),{w,h,color,alpha})};u.root=u.add.container();return u;
}
export function recording(u){
 const walk=n=>({type:n.type,depth:n.depth,rotation:n.rotation,flipX:n.flipX,x:n.x,y:n.y,sx:n.scaleX,sy:n.scaleY,alpha:n.alpha,visible:n.visible,ox:n.originX,oy:n.originY,text:n.text,size:n.size,maxWidth:n.maxWidth,tint:n.tint,fontColor:n.fontColor,fontHasInk:n.fontHasInk,align:n.align,texture:n.texture,frame:n.frame,w:n.w,h:n.h,color:n.color,commands:n.commands,children:n.list.map(walk)});
 return {width:u.w*2,height:u.h*2,root:walk(u.root),textures:[...u.textures.cache.entries()].filter(([,t])=>t.pixels).map(([key,t])=>({key,w:t.w,h:t.h,pixels:t.pixels}))};
}
