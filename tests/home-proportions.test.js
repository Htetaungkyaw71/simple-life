import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SaveService,validate} from '../src/systems/save.js';
import {newState} from '../src/systems/state.js';
import {SAVE_KEY} from '../src/config.js';
import {testingCreditEnabled,TESTING_COIN_GRANT} from '../src/systems/testingCredit.js';
import {screenAttackAllowed} from '../src/systems/screenAttack.js';

test('mobile world taps cannot perform actions; desktop pointer interactions remain',()=>{
 for(const type of ['attack','hunt','chop']){assert.equal(screenAttackAllowed(true,type),false);assert.equal(screenAttackAllowed(false,type),true);}
 for(const type of ['travel','dialog','waterGround','dig','plot','forage','stone']){assert.equal(screenAttackAllowed(true,type),false);assert.equal(screenAttackAllowed(false,type),true);};
});
test('explicit testing gift adds 100000 once, saves atomically, and preserves all other progress',()=>{
 const state=newState();state.money=3;state.inventory.mango=4;state.day=7;state.health=71;
 const entries=new Map([[SAVE_KEY,JSON.stringify(state)]]),storage={getItem:k=>entries.get(k),setItem:(k,v)=>entries.set(k,v)},saves=new SaveService(storage);
 assert.deepEqual(saves.grantTestingCoins(true),{added:100000,balance:100003});
 const raw=JSON.parse(entries.get(SAVE_KEY)),{money,testingCoinGrant,...rest}=raw,{money:before,...old}=state;
 assert.deepEqual(rest,old);assert.equal(testingCoinGrant,TESTING_COIN_GRANT);
 saves.write(saves.load());assert.deepEqual(saves.grantTestingCoins(true),{added:0,balance:100003});assert.equal(validate(raw).money,100003);
 storage.setItem=()=>{throw Error('quota');};entries.set(SAVE_KEY,JSON.stringify(state));assert.equal(saves.grantTestingCoins(true),null);assert.deepEqual(JSON.parse(entries.get(SAVE_KEY)),state);
});
test('testing gift is hidden on normal URLs and all remote hosts; new-game balance stays 60',()=>{
 assert.equal(newState().money,60);
 for(const url of ['https://example.com/?testingCoins=100000','http://127.0.0.1:4175/','http://localhost/?testingCoins=100001'])assert.equal(testingCreditEnabled(url),false);
 assert.equal(testingCreditEnabled('http://127.0.0.1:4175/?testingCoins=100000',true),false);
});
