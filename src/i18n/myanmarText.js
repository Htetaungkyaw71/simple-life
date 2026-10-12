import {translate} from './language.js';
export const MYANMAR_FONT='SimpleLifeMyanmar';
export async function loadMyanmarFont(){
 let timer;
 try{const face=new FontFace(MYANMAR_FONT,'url('+import.meta.env.BASE_URL+'assets/pixel/fonts/noto-myanmar.ttf)');await Promise.race([face.load(),new Promise((resolve,reject)=>{timer=setTimeout(()=>reject(new Error('Myanmar font timeout')),8000);})]);document.fonts.add(face);return true;}catch{return false;}finally{clearTimeout(timer);}
}
// Shape complete Unicode runs with the browser's OpenType engine. Bitmap glyph-by-
// glyph drawing loses Myanmar ligatures and mark placement. All texture scales stay integer.
export function wrapMyanmar(value,maxWidth,measure){
 if(!maxWidth)return value;
 const segmenter=typeof Intl?.Segmenter==='function'?new Intl.Segmenter('my',{granularity:'word'}):null;
 return value.split('\n').map(line=>{const tokens=segmenter?[...segmenter.segment(line)].map(s=>s.segment):line.split(/(?<=[၊။\s])/u);const graphemes=typeof Intl?.Segmenter==='function'?new Intl.Segmenter('my',{granularity:'grapheme'}):null;const parts=tokens.flatMap(token=>measure(token)>maxWidth&&graphemes?[...graphemes.segment(token)].map(s=>s.segment):[token]);const rows=[];let row='';for(const token of parts){if(row&&measure(row+token)>maxWidth){rows.push(row.trimEnd());row=token.trimStart();}else row+=token;}rows.push(row);return rows.join('\n');}).join('\n');
}
export function myanmarText(scene,x,y,value,size,tint,width){
 const fontSize=size,language=()=>scene.app?.language?.current||'en';
 const t=scene.add.text(Math.round(x),Math.round(y),'',{fontFamily:MYANMAR_FONT,fontSize,fontStyle:'normal',color:'#'+tint.toString(16).padStart(6,'0'),padding:{top:2,bottom:2,left:2,right:2},metrics:{ascent:Math.ceil(fontSize*.85),descent:Math.ceil(fontSize*.35),fontSize:Math.ceil(fontSize*1.2)},resolution:2});
 t.font='noto-myanmar';t.fontSize=fontSize;t.fontData={size:fontSize};t.uiText=true;t.maxWidth=width||0;t.setLineSpacing(3);const set=t.setText.bind(t);
 t.setText=v=>{const copy=translate(v,language());t.sourceText=String(v??'');t.wrappedText=wrapMyanmar(copy,t.maxWidth?Math.max(1,t.maxWidth-4):0,line=>{t.context.font=fontSize+'px '+MYANMAR_FONT;return t.context.measureText(line).width;});set(t.wrappedText);t.texture?.setFilter(1);return t;};
 t.setMaxWidth=w=>{t.maxWidth=Math.floor(w);return t.setText(t.sourceText);};
 t.setDropShadow=(x,y,color,alpha)=>t.setShadow(x,y,'#'+color.toString(16).padStart(6,'0'),0,false,true);
 t.setCenterAlign=()=>t.setAlign('center');t.setRightAlign=()=>t.setAlign('right');t.getTextBounds=()=>({wrappedText:t.wrappedText});
 return t.setText(value);
}
export function worldText(scene,x,y,value,size=6,tint=0xffedcc){
 if(scene.app.language?.current==='mm')return myanmarText(scene,x,y,value,size<=6?7:8,tint).setScale(2);
 return scene.add.bitmapText(x,y,'pixel',value,size).setScale(2).setTint(tint);
}
