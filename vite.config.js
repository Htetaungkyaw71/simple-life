import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
// Keep the untouched vendor archive in source control, never in a playable build.
const runtimeAssets=['world.png','world.json','font.png','font.xml','processed/town.png','processed/town.json','processed/boy.png','processed/girl.png'];
export default defineConfig({base:'./',plugins:[{name:'runtime-art-only',generateBundle(){for(const file of runtimeAssets)this.emitFile({type:'asset',fileName:'assets/pixel/'+file,source:readFileSync('public/assets/pixel/'+file)});}}],build:{copyPublicDir:false,target:'es2020',rollupOptions:{output:{manualChunks:{phaser:['phaser']}}},chunkSizeWarningLimit:1500}});
