// Canvas BitmapText ignores tint. Cache actual coloured glyph pixels instead.
// Both renderers use the same local font metrics and alpha, with no remote art.
import {readingGlyphs} from './readingGlyphs.js';
export function coloredFont(scene,color,bold=false){
 const key='pixel-color-'+color.toString(16).padStart(6,'0')+(bold?'-bold':''),cache=scene.cache.bitmapFont;
 if(cache.exists(key))return key;
 // Phaser's XML loader adds glyph frames: null then resolves to SPACE, not the sheet.
 const source=cache.get('pixel'),frame=scene.textures.getFrame(source.texture,source.frame??'__BASE'),texture=scene.textures.createCanvas(key,frame.cutWidth,frame.cutHeight),ctx=texture.context;
 ctx.imageSmoothingEnabled=false;ctx.drawImage(frame.source.image,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,0,0,frame.cutWidth,frame.cutHeight);
 ctx.fillStyle='#ffffff';for(const [char,rows]of Object.entries(readingGlyphs)){const code=char.charCodeAt(0)-32,x=code%16*8,y=Math.floor(code/16)*10;ctx.clearRect(x,y,7,7);for(let yy=0;yy<7;yy++)for(let xx=0;xx<rows[yy].length;xx++)if(rows[yy][xx]==='1')ctx.fillRect(x+xx,y+yy,1,1);}
 if(bold){
  // Widen each glyph independently. Overprinting a shifted sheet closes the
  // small counters in m/e/a; nearest-neighbour widening keeps them readable.
  const ink=ctx.getImageData(0,0,frame.cutWidth,frame.cutHeight),wide=ctx.createImageData(frame.cutWidth,frame.cutHeight);
  for(const [id,c]of Object.entries(source.data.chars||{})){const width=c.width+(+id===32?0:1);for(let yy=0;yy<c.height;yy++)for(let xx=0;xx<width;xx++){const from=((c.y+yy)*frame.cutWidth+c.x+Math.floor(xx*c.width/width))*4,to=((c.y+yy)*frame.cutWidth+c.x+xx)*4;wide.data.set(ink.data.subarray(from,from+4),to);}}
  ctx.putImageData(wide,0,0);
 }
 ctx.globalCompositeOperation='source-in';ctx.fillStyle='#'+color.toString(16).padStart(6,'0');ctx.fillRect(0,0,frame.cutWidth,frame.cutHeight);ctx.globalCompositeOperation='source-over';
 const data=bold?{...source.data,chars:Object.fromEntries(Object.entries(source.data.chars||{}).map(([id,c])=>[id,{...c,width:c.width+(+id===32?0:1),xAdvance:c.xAdvance+1}]))}:source.data;
 texture.setFilter(1);texture.refresh();cache.add(key,{...source,data,texture:key,frame:undefined,fromAtlas:false});return key;
}
