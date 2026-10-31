// Social facts stay separate from movement schedules. They describe established
// ties and supply small ambient meetings; they do not unlock personal episodes.
export const RESIDENT_RELATIONSHIPS={
 'city-silas':{friends:['city-walter'],workAcquaintances:['city-elena'],household:[],tensions:[],preferredMeetings:['quiet-bench','east-lamp']},
 clara:{friends:['city-elena'],workAcquaintances:['niko','city-bruno'],household:[],tensions:[{with:'niko',note:'They disagree mildly about cautious pricing.'}],preferredMeetings:['fountain-terrace','seed-stall']},
 niko:{friends:['city-bruno'],workAcquaintances:['clara'],household:[],tensions:[{with:'clara',note:'They disagree mildly about cautious pricing.'}],preferredMeetings:['produce-stall','cafe']},
 'city-nell':{friends:['city-sol'],workAcquaintances:['clara'],household:[],tensions:[],preferredMeetings:['fountain-terrace','shop-fronts']},
 'city-sol':{friends:['city-nell'],workAcquaintances:['niko'],household:[],tensions:[],preferredMeetings:['fountain-terrace','shop-fronts']},
 'city-walter':{friends:['city-silas','city-elena'],workAcquaintances:[],household:[],tensions:[],preferredMeetings:['public-garden','quiet-bench']},
 'city-elena':{friends:['city-walter','clara'],workAcquaintances:['city-silas'],household:[],tensions:[],preferredMeetings:['public-garden','garden-bench']},
 'city-bruno':{friends:['niko'],workAcquaintances:['clara'],household:[],tensions:[],preferredMeetings:['produce-stall','cafe']},
 'city-teo':{friends:['city-luca'],workAcquaintances:[],household:['city-luca'],tensions:[],preferredMeetings:['public-garden','picnic-lawn']},
 'city-luca':{friends:['city-teo'],workAcquaintances:[],household:['city-teo'],tensions:[],preferredMeetings:['public-garden','picnic-lawn']},
};

export const SOCIAL_MEETINGS={
 'teo-luca-game':{residents:['city-teo','city-luca'],location:'garden-games',mood:'play'},
 'walter-elena-garden':{residents:['city-walter','city-elena'],location:'garden-pair',mood:'quiet'},
 'silas-walter-memory':{residents:['city-silas','city-walter'],location:'quiet-bench-pair',mood:'thoughtful'},
 'bruno-niko-market':{residents:['city-bruno','niko'],location:'produce-pair',mood:'meal'},
 'bruno-niko-reconciled':{residents:['city-bruno','niko'],location:'produce-pair',mood:'reconciled'},
 'nell-sol-closing':{residents:['city-nell','city-sol'],location:'fountain-pair',mood:'chat'},
};

export function relationshipsFor(id){return RESIDENT_RELATIONSHIPS[id]||null;}
