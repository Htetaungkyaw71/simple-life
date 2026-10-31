import {CONVERSATION_FLAGS,RESIDENT_DIALOGUES} from '../data/dialogues.js';
import {SILAS_STORY} from '../data/connections.js';
import {connectionFor,eventComplete} from './connections.js';
import {contextualResidentDialogue} from './residentDialogue.js';
import {personalRepeatDialogue,personalStoryDialogue} from './personalStories.js';
import {lastLanternReaction} from './lastLantern.js';
export function hasConversationFlag(s,flag){return !!s.story?.conversations?.includes(flag);}
export function recordConversationFlags(s,...flags){
 if(!s.story)return false;if(!Array.isArray(s.story.conversations))s.story.conversations=[];
 const before=s.story.conversations.length;
 for(const flag of flags.flat())if(CONVERSATION_FLAGS.includes(flag)&&!s.story.conversations.includes(flag))s.story.conversations.push(flag);
 s.story.conversations=CONVERSATION_FLAGS.filter(flag=>s.story.conversations.includes(flag));return s.story.conversations.length!==before;
}
function conditionMatches(s,when,first,id){
 if(when.first===true&&!first||when.repeat===true&&first)return false;
 if((when.area||when.location)&&(s.area!==(when.area||when.location)))return false;
 if(when.flag&&!hasConversationFlag(s,when.flag)||when.notFlag&&hasConversationFlag(s,when.notFlag))return false;
 if(when.time){const [start,end]=when.time;if(s.minute<start||s.minute>=end)return false;}
 const record=connectionFor(s,id);
 if(when.event&&!eventComplete(s,id,when.event)||when.notEvent&&eventComplete(s,id,when.notEvent))return false;
 if(when.connectionEvent&&!eventComplete(s,'city-silas',when.connectionEvent))return false;
 if(when.minPoints&&record.points<when.minPoints)return false;
 if(when.minLevel&&record.level<when.minLevel)return false;
 if(when.afterEventDay){const eventDay=record.flags[SILAS_STORY.eventDayFlags[when.afterEventDay]];if(!eventDay||s.day<=eventDay)return false;}
 if(when.choice){const [key,value]=when.choice;if(record.choices[key]!==value)return false;}
 if(when.invitation&&record.invitation?.status!==when.invitation)return false;
 if(when.invitationDue&&(!record.invitation||s.day<record.invitation.dueDay))return false;
 if(when.noInvitation&&record.invitation)return false;
 if(when.promise&&record.promise?.state!==when.promise)return false;
 if(when.near&&Math.hypot(s.position.x-when.near.x,s.position.y-when.near.y)>(when.near.radius||80))return false;
 return true;
}
export function dialogueFor(s,id){
 const data=RESIDENT_DIALOGUES[id];if(!data)return null;
 const first=!hasConversationFlag(s,'met:'+id),conditional=data.conditions?.find(row=>conditionMatches(s,row.when,first,id));
 const personal=personalStoryDialogue(s,id);
 if(personal&&id!=='city-silas')return personal;
 if(conditional)return {branch:conditional.branch,dialogue:data[conditional.branch]};
 if(personal)return personal;
 if(!first){const reaction=lastLanternReaction(s,id);if(reaction)return reaction;const repeat=personalRepeatDialogue(s,id);if(repeat)return repeat;const contextual=contextualResidentDialogue(s,id);if(contextual)return contextual;}
 return {branch:first?'first':'repeat',dialogue:first?data.first:data.repeat};
}
export function conversationObjective(s){
 if(hasConversationFlag(s,'clue:teo-lantern')&&!hasConversationFlag(s,'clue:silas-lamp'))return {title:'THE EAST-ROAD LAMP',text:'Speak to Silas near the old lamp on City’s east road.'};
 return null;
}
