// Landscape phones need more world around their shorter, touch-covered viewport.
export function displayZoom(width,height,coarse=false) {
 if(width>height&&(width<1000||coarse&&height<600))return .75;
 return width>=1000&&height>=640?1.5:1;
}
