// Native-source tiles stay below common 4096-pixel WebGL texture limits.
export function terrainTiles(size,limit=2048){
 const tiles=[];for(let y=0;y<size.height/2;y+=limit)for(let x=0;x<size.width/2;x+=limit)tiles.push({key:`ground-forest-${x}-${y}`,x,y,w:Math.min(limit,size.width/2-x),h:Math.min(limit,size.height/2-y)});return tiles;
}
