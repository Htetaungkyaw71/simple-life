import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash}from'node:crypto';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),record=JSON.parse(fs.readFileSync('output/art/cedar-props-v1/export.json'));
for(const [id,source]of Object.entries(record.sources))assert.equal(hash(source.file),source.sha256,id);
const protectedAssets={};for(const [file,expected]of Object.entries({'processed/boy.png':'4e0bed0e70c3e155ea6b458ca41a3524f44023f5b1eefacbe39ec5ca8250fd5c','processed/girl.png':'1f85f41fdc9c9d1a3a937a774e32b31747700eb559bbc0c1f45bf3cb8db9b33a','world.png':'384db79690a9f99ef1825db1367a0784f4c46aabc5baf806993a1721b7da2721'})){const h=hash('public/assets/pixel/'+file);assert.equal(h,expected);protectedAssets[file]=h;}
const files=fs.readdirSync('dist',{recursive:true}).filter(p=>fs.statSync('dist/'+p).isFile());assert.equal(files.length,46);assert.ok(files.every(p=>!/(sources|vendor|output|tests|backup|review)/.test(p)));
console.log(JSON.stringify({result:'PASS',sourceHashes:Object.keys(record.sources).length,protectedAssets,runtimeFiles:files.length,runtimeFileList:files}));
