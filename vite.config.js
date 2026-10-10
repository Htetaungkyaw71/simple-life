import {AUDIO_FILES} from './src/audio/score.js';
import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
// Keep the untouched vendor archive in source control, never in a playable build.
const runtimeNotices={phaser:['docs/licenses/phaser-LICENSE.md','docs/licenses/eventemitter3-LICENSE'].map(file=>readFileSync(file,'utf8')).join('\n\n'),app:readFileSync('docs/licenses/vite-LICENSE.md','utf8').split('# Licenses of bundled dependencies')[0]};
const runtimeAssets=['world.png','world.json','font.png','font.xml','processed/town.png','processed/town.json','processed/boy.png','processed/girl.png'];
export default defineConfig({base:'./',plugins:[{name:'runtime-art-only',generateBundle(){for(const file of Object.values(AUDIO_FILES))this.emitFile({type:'asset',fileName:file,source:readFileSync('public/'+file)});for(const file of runtimeAssets)this.emitFile({type:'asset',fileName:'assets/pixel/'+file,source:readFileSync('public/assets/pixel/'+file)});}}],build:{copyPublicDir:false,target:'es2020',rollupOptions:{output:{manualChunks:{phaser:['phaser']},banner:chunk=>'/*!\n'+runtimeNotices[chunk.name==='phaser'?'phaser':'app']+'\n*/'}},chunkSizeWarningLimit:1500}});
