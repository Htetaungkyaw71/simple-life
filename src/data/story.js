export const STORY_CACHE='snake-cache';
export const STORY_GUARD='boar-snake';
export const STORY_PROJECT='commons';
export const INTRO=[
 {title:'Too much noise',art:'city',text:'City noise and pressure filled every day. You longed for a quieter life.'},
 {title:'Grandfather\'s letter',art:'letter',text:'You inherit his old house and farm. His final letter asks you to restore the land and help the nearby town.'},
 {title:'A place to begin',art:'farm',text:'Three Tomato seeds wait in the crate. Plant, water each day and harvest. The JOURNAL holds his last request.'},
 {title:'Beyond the trees',art:'forest',text:'A family keepsake lies in a guarded Wild Forest cache. Bring it home, when you are ready.'},
];
export const CHAPTERS=[
 {title:'NEW ROOTS',steps:[['starter','Claim starter seeds','Home crate / just southeast of your front door.'],['plant','Plant a crop','Farm / follow the south road. Select Seeds then E or tap a bed.'],['water','Water a crop','Water once each day. Tomatoes need three watered midnights.'],['harvest','Harvest the first crop','Select Harvest when ripe. Sleep at your bed to advance day/night.']]},
 {title:'MARKET DAY',steps:[['city','Visit City','Home / follow the east road.'],['sell','Sell produce','Niko / market square / 7 am to 8 pm. Farm board also sells Tomatoes.'],['resident','Speak to a resident','Select Seeds, then E near a City neighbour; or tap the person.']]},
 {title:'HELPING HANDS',steps:[['wood','Collect Wood','Axe / three hits per tree / 3 Wood. Collect 24 for Commons seating.'],['stone','Collect Stone','Hand / Forest stone piles / 2 Stone each. Collect 12 for Commons seating.'],['help','Build Commons seating','City town board / Town projects / Seats. Fixed cost: 24 Wood and 12 Stone.']]},
 {title:'THE WILD FOREST',steps:[['forest','Enter Forest','Home / north gate. You arrive at the centre of the southern edge.'],['fruit','Collect Forest fruit','Select Seeds, then E or tap fruit near the entrance.'],['eatFruit','Eat Forest fruit','BAG / Food / Eat. Work or combat makes room for health or energy.'],['boar','Defeat a nearby Wild Boar','Axe / three hits. Face it, attack, then step away from the warning.'],['keepsake','Recover Grandfather\'s Keepsake','From the entrance, go west about 1000 steps, then north 470. Search the cache at 4122 / 4376 after defeating its guard.']]},
 {title:'HOME AGAIN',steps:[['home','Return home with the Keepsake','Follow the southern HOME exit. The Keepsake stays safe through death.'],['placed','Place the Keepsake','Inside Home / approach the pottery shelf on the right.'],['complete','Complete the last request','Read Grandfather\'s final letter. Your life here continues.']]},
];
export const STORY_FLAGS=CHAPTERS.flatMap(c=>c.steps.map(([id])=>id));
