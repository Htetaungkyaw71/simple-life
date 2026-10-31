const entry=(fresh,again,close='See you around.')=>({fresh,again,close});

export const SCHEDULE_DIALOGUE={
 'city-silas':{
  lamp:entry(['A lamp tells you what the road needed overnight. This one held steady.','I inspect the glass first, then the wick. Small neglect becomes a dark road.'],['This lamp can manage until evening.']),
  garden:entry(['The garden is good work between lamp rounds. Nothing here minds a quiet helper.'],['I am finishing this row, then checking the east road.']),
  bench:entry(['I hear more from this bench than I do during a whole lamp round.'],['Quiet company is enough.']),
  social:entry(['Walter remembers the old nights differently than I do. That is why we still compare them.'],['Walter and I are nearly finished.']),
 },
 clara:{
  'seed-work':entry(['Customers ask which seed grows fastest. I ask which one they will still enjoy tending.','The packets are ready. A careful beginning matters more than a crowded field.'],['I kept the good starter seeds near the front.'],'Browse seeds'),
  'seed-work-rest':entry(['The stall is still open. I am only giving my hands a quiet minute between customers.'],['A short pause, then back to sorting.'],'Browse seeds'),
 },
 niko:{
  'market-work':entry(['Prices moved again this morning. I can be fair without pretending the market is simple.','Bring ripe produce, not rushed produce. Families notice the difference.'],['The board is current. I am ready when you are.'],'Open market'),
  'market-work-rest':entry(['I am eating beside the ledger so the market stays open. Bruno would call that only half a rest.'],['Still open—just chewing.'],'Open market'),
  social:entry(['Bruno brought food and an opinion about my lunch. He is generous with both.'],['We are settling the important question: soup or rice.'],'Open market'),
  'reconciled-table':entry(['Bruno and I are planning the shared table together. We can disagree without leaving the other person alone with the worry.'],['We are checking the table plan together.'],'Open market'),
 },
 'city-nell':{
  'clothes-work':entry(['A practical seam can still be beautiful. The trick is making it survive a real day.','I am changing one small line. Sometimes that is all a design needs.'],['I have one last stitch to finish.'],'See Nell’s clothes'),
  'clothes-work-rest':entry(['The shop stays open while I sketch. Looking is part of the work.'],['This idea is almost ready.'],'See Nell’s clothes'),
 },
 'city-sol':{
  'barber-work':entry(['People tell the truth in the pause before they choose a new look.','A barber meets every version of a person: hurried, hopeful, and not quite awake.'],['I am listening. That is most of the work.'],'Visit the barber'),
  'barber-work-rest':entry(['The chair is open. I am only sweeping between visitors.'],['One more sweep.'],'Visit the barber'),
 },
 'city-walter':{
  garden:entry(['Your grandfather liked this part of the garden. He said patient hands could hear it grow.'],['The memory is still here.']),
  cafe:entry(['A warm cup gives an old memory somewhere to sit.'],['I am in no hurry.']),
  bench:entry(['This bench faces the path your grandfather used most. I remember his careful steps.'],['Sit if you like.']),
  social:entry(['Old friends remember different corners of the same day. Elena and Silas keep mine honest.'],['We are only comparing memories.']),
 },
 'city-elena':{
  'garden-work':entry(['Shared ground needs care without becoming anyone’s private garden.','I leave a little space untended so someone else can choose what belongs there.'],['This bed only needs a little more care.']),
  bench:entry(['Resting here is part of tending the garden. You notice what people actually use.'],['I am watching the paths for a while.']),
  cafe:entry(['The café lets me see the garden from far enough away to stop fussing over it.'],['The garden can manage without me for one cup.']),
  social:entry(['Walter remembers the people who planted before us. I remember which beds they left behind.'],['Walter and I are enjoying the quiet.']),
 },
 'city-bruno':{
  food:entry(['A café table is useful even before the meal arrives. It gives people a reason to sit together.'],['I am deciding what everyone forgot to eat.']),
  market:entry(['Good meals begin with whatever the market has too much of, not a perfect recipe.'],['I have almost chosen supper.']),
  social:entry(['Niko watches prices; I watch whether Niko has eaten. Both jobs matter.'],['I am making sure Niko takes a real break.']),
  'reconciled-table':entry(['Niko brought the ledger, and I brought lunch. The Lantern Night table needs both of us.'],['We are planning enough for today and tomorrow.']),
 },
 'city-teo':{
  play:entry(['Luca says I change the race rules. I only improve them while we run.'],['Next race starts after I catch my breath.']),
  bird:entry(['I am checking the safe paths for another wooden bird. Grandfather hid them where children would notice.'],['No bird yet. I am still looking.']),
  social:entry(['Luca chose the route. I chose the shortcuts. That makes it fair.'],['We are still deciding who won.']),
 },
 'city-luca':{
  picnic:entry(['A picnic needs one familiar path and one path that feels new. This lawn has both.'],['I am saving the best spot.']),
  play:entry(['Teo runs first and explains the rules later. I bring the snacks, so I still win.'],['The next game needs a better finish line.']),
  social:entry(['Teo found a shortcut that stays inside the garden. We are testing it twice.'],['We are between races.']),
 },
};
