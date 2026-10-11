// Original homestead catalogue. All designs share the established door and bed.
export const HOMES={
 starter:{name:'Grandfather cottage',price:0,roof:0xb89c74,wall:0xe8d4ae,trim:0x76533b,floor:0xc8b38c,accent:0x8d9b62,detail:'The familiar cottage and dining room.',style:'cottage'},
 rose:{name:'Rose cottage',price:2000,roof:0xb86f57,wall:0xf2ddba,trim:0x825c43,floor:0xd4bd94,accent:0xcf887d,detail:'Rose boxes, a tiled roof and floral rugs.',style:'rose'},
 orchard:{name:'Orchard lodge',price:5000,roof:0x79845e,wall:0xd5c99e,trim:0x775742,floor:0xb99b72,accent:0x8d9d59,detail:'Timber beams, orchard shutters and a reading nook.',style:'orchard'},
 coastal:{name:'Seabreeze villa',price:10000,roof:0x849a99,wall:0xf5e8ca,trim:0x688581,floor:0xd7ceb2,accent:0x82b0ad,detail:'Seafoam windows, airy curtains and shell mosaics.',style:'coastal'},
 bamboo:{name:'Bamboo retreat',price:18000,roof:0xa99462,wall:0xcbaf76,trim:0x6c6845,floor:0xbca270,accent:0x729466,detail:'Woven panels, bamboo screens and a tea room.',style:'bamboo'},
 brick:{name:'Lantern townhouse',price:30000,roof:0x777c82,wall:0xb47759,trim:0x5d4c44,floor:0xb79b80,accent:0xe0aa62,detail:'Brickwork, dark trim and a warm study.',style:'brick'},
 glass:{name:'Garden conservatory',price:45000,roof:0x91aaa1,wall:0xe5deb7,trim:0x738e74,floor:0xcbd0ae,accent:0x77a075,detail:'Glass roof panels, climbing vines and indoor greenery.',style:'glass'},
 alpine:{name:'Moonwood chalet',price:65000,roof:0x696c85,wall:0xc3ac8d,trim:0x66594d,floor:0xa68b71,accent:0x9696b8,detail:'Carved timber, moonlit trim and a cozy library.',style:'alpine'},
 manor:{name:'Suncrest manor',price:90000,roof:0x9a7554,wall:0xf4e7c7,trim:0xa38958,floor:0xe0d4b1,accent:0xd4b363,detail:'Ivory columns, golden trim and a mosaic salon.',style:'manor'},
};
export const HOME_IDS=Object.keys(HOMES).filter(id=>id!=='starter');
export const freshHome=()=>({design:'starter',owned:['starter']});
export const homeDefinition=s=>HOMES[s?.home?.design]||HOMES.starter;
export const CUSTOMIZE_AREAS=['home','farm','interior'];
