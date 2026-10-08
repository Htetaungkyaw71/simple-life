// Canvas BitmapText ignores tint. Cache actual coloured glyph pixels instead.
// Both renderers use the same local font metrics and alpha, with no remote art.
export function coloredFont(scene,color){
 const key='pixel-color-'+color.toString(16).padStart(6,'0'),cache=scene.cache.bitmapFont;
 if(cache.exists(key))return key;
 // Phaser's XML loader adds glyph frames: null then resolves to SPACE, not the sheet.
 const source=cache.get('pixel'),frame=scene.textures.getFrame(source.texture,source.frame??'__BASE'),texture=scene.textures.createCanvas(key,frame.cutWidth,frame.cutHeight),ctx=texture.context;
 ctx.imageSmoothingEnabled=false;ctx.drawImage(frame.source.image,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,0,0,frame.cutWidth,frame.cutHeight);
 ctx.globalCompositeOperation='source-in';ctx.fillStyle='#'+color.toString(16).padStart(6,'0');ctx.fillRect(0,0,frame.cutWidth,frame.cutHeight);ctx.globalCompositeOperation='source-over';
 texture.setFilter(1);texture.refresh();cache.add(key,{...source,texture:key,frame:undefined,fromAtlas:false});return key;
}
