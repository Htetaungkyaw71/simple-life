// The mobile action button owns combat; ordinary world interactions remain available.
export function screenAttackAllowed(mobile,type){return !mobile||!['attack','hunt','chop'].includes(type);}
