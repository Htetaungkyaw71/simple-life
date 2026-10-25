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
 {title:'NEW ROOTS',steps:[['starter','Claim starter seeds','Home crate / beside the front steps to the southeast.'],['plant','Plant a crop','Follow the south road. Bag / Seeds / Tomato; use a bed.'],['water','Water a crop','Select Water. Once daily; three watered midnights for Tomato.'],['city','Visit City while crops grow','Follow the east road from Home. Shops open at 7 am.'],['resident','Speak to a resident','Put tools away. Talk to a neighbour near the City square.']]},
 {title:'WHILE SEEDS GROW',steps:[['wood','Collect Wood','Axe / three hits per tree. Gather 12 Wood along Farm edges.'],['stone','Collect Stone','Home north gate / Forest entrance. Hand / gather 6 Stone.'],['board','Read the town board','City / board beside the market square. Save materials for Commons seating.'],['fruit','Forage one Forest fruit','Home north gate / fruit trees near the Forest entrance. Hand / Use.'],['eatFruit','Try your gathered fruit','Bag / Food shows exact recovery. Eat after work, then tend crops tomorrow.']]},
 {title:'MARKET DAY',steps:[['harvest','Harvest the first crop','Water each morning. After your errands, use the Home bed to rest. After three watered midnights, select Harvest.'],['sell','Sell produce','City / Niko beside the fountain / 7 am to 7 pm. Check today\'s market price.'],['help','Build Commons seating','City town board / Town projects / Seats. 12 Wood + 6 Stone; earns 240c. Copper Can unlocks at Farm board.']]},
 {title:'THE WILD FOREST',steps:[['forest','Enter Forest','Home / north gate. Daylight and food make the journey safer.'],['boar','Defeat a Wild Boar','Axe / strike, step aside at the ! warning, strike after its charge. 25% coins drop on defeat; a second fall replaces the bag.'],['keepsake','Recover Grandfather\'s Keepsake','Open Forest Map / gold sun west of the entrance, in Snake Thicket. Approach the chest from the south; defeat its guard.']]},
 {title:'HOME AGAIN',steps:[['home','Return home with the Keepsake','Follow the southern HOME exit. The Keepsake stays safe through death.'],['placed','Place the Keepsake','Inside Home / pottery shelf on the right.'],['complete','Complete the last request','Read Grandfather\'s final letter. Keep tending your farm afterward.']]},
];
export const STORY_FLAGS=CHAPTERS.flatMap(c=>c.steps.map(([id])=>id));
