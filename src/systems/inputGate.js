// Transient monotonic input state; never serialized as gameplay progress.
export function inputGate(interval=240){
 let last=-Infinity;
 return {accept(now){if(!Number.isFinite(now)||now-last<interval)return false;last=now;return true;}};
}
