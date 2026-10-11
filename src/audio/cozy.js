// Selected user-supplied assets only. Provenance and hashes: docs/assets/licenses/cozy-audio.
// Farming, landed hits, successful pickups and trades make action sounds.
// UI, jumping, doors and travel remain silent. The same allowlist gates
// playback, preloading and production assets, including synthesized fallbacks.
const fx={
 'farming:dig':'hoe-dig','farming:plant':'seed-plant','farming:water':'watering',
 'farming:empty':'ui-error','farming:growth':'notification','farming:harvest':'harvest-pop','farming:clear':'bush-rustle',
 'tree:hit':'axe-chop',
 'wood:pickup':'pickup-item','furniture:place':'place-item',
 'combat:hit':'axe-chop','animal:defeat':'pickup-item',
 'forest:collect':'pickup-item','stone:collect':'rock-break','item:pickup':'pickup-item',
 'cache:open':'chest-open','stash:recover':'pickup-rare','keepsake:collect':'pickup-rare','furniture:recover':'pickup-item',
 'shop:buy':'buy','shop:sell':'sell-coins',
 'sleep:begin':'sleep','morning:wake':'rooster','evening:wake':'bush-rustle',
};
export const SAMPLE_EFFECTS=Object.fromEntries(Object.entries(fx).map(([event,file])=>[event,'sfx-'+file]));
export const COZY_FILES={
 ...Object.fromEntries([...new Set(Object.values(fx))].map(file=>['sfx-'+file,'assets/audio/cozy/sfx-'+file+'.wav'])),
 cozyMusic:'assets/audio/cozy/music.wav',
 forestDay:'assets/audio/cozy/forest-day.wav',
 night:'assets/audio/cozy/night.wav',water:'assets/audio/cozy/river.wav',
 fountain:'assets/audio/cozy/fountain.wav',
};
