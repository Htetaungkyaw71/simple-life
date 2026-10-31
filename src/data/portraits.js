// Portraits deliberately reuse the resident sheets. Crop values frame the head
// and upper body so a future portrait pack can replace this registry only.
export const PORTRAITS={
 player:{dynamic:true,crop:[8,2,32,45]},
 'city-silas':{texture:'lamplighter',frame:0,crop:[0,0,64,64]},
 'city-nell':{texture:'town',frame:'npc-nell-idle-down-0',crop:[16,8,32,48],fit:[64,64]},
 'city-sol':{texture:'barber-npc',frame:0,crop:[0,0,64,64]},
 'city-luca':{texture:'girl-child',frame:0,crop:[0,0,64,64]},
 'city-elena':{texture:'purple-woman',frame:0,crop:[0,0,64,64]},
 'city-walter':{texture:'elder-man',frame:0,crop:[0,0,64,64]},
 'city-teo':{texture:'boy-child',frame:0,crop:[0,0,64,64]},
 'city-bruno':{texture:'produce-seller-new',frame:0,crop:[0,0,64,64]},
 clara:{texture:'seed-seller',frame:0,crop:[0,0,64,64]},
 niko:{texture:'produce-seller',frame:0,crop:[0,0,64,64]},
};
export function portraitFor(id,state){const p=PORTRAITS[id]||PORTRAITS.player;return p.dynamic?{...p,texture:state.character,frame:0}:p;}
