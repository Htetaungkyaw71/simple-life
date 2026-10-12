// Explicit local testing gift requested by the user. Normal games never grant it.
export const TESTING_COIN_GRANT='custom-home-playtest-2026-10-11';
export const PLAYTEST_BUILD=import.meta.env?.VITE_PLAYTEST==='true';
export function testingCreditEnabled(url,development=import.meta.env?.DEV===true,playtest=PLAYTEST_BUILD){
 return playtest===true;
}
export function testingCredit(raw,enabled=PLAYTEST_BUILD){
 if(!enabled)return {state:raw,added:0};
 if(raw.testingCoinGrant===TESTING_COIN_GRANT)return {state:raw,added:0};
 const money=Math.min(9999999,raw.money+100000);
 return {state:{...raw,money,testingCoinGrant:TESTING_COIN_GRANT},added:money-raw.money};
}
