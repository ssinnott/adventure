// Hearth Isle's walkthrough. Its chapter, The Heart, is #760's, which plays it here; until then, the
// isle (H6, #753) walked at 28: the last crossing bought at Cinderport's quay and landed on the strand at
// 20,30, and its boatman selling it back; the light close at the cleft's foot and the hum on the strand;
// the cleft carved up through the rim and its pickets; the Bowl, the pilgrims' camp and its rest, its
// three tents and the shrine; the three pilgrims' questions, a token taken and the other two gone, and
// each token another way; the Hearth, the warm ground and the Grove's sliver humming for a company that
// carries it; the temple's door; the lookouts; the cache found from the draught; the moths by night; the
// Compact's runner or the Wardens' sergeant; and the box's groups won at 28. Then the east rim (I6, #754):
// the rim's path from the Bowl with the pocket's fight, Anchorhold's yard and the cell, the east foot,
// the Hand's camp and its guard, the Steps, the grey door read, the takings found from the tally-house and
// the smell, the moths by night and the guard gone once Vask is gone from Helmstow. Then the temple,
// Hearthfane (#755): in at the door and out again, the nave's moths, the pillar read, the sacristan's lamps
// put out wrong and then in the pillar's order (56), the moths gone to the light, his key, the treasury
// that opens to it and to nothing else, the Hand's best won at 28 and the court's second gone with Vask.
// Then its crypt (#756), walked at 29: down the stair behind the altar and up again, the chamber's
// champions, the eleven niches and the eleven kept for a company that gave the log, the side vault's dead
// and rats, the keeper at the passage and her knot on the grey door's frame.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen, walkThrough, gone as left } from '../../../../tools/walk.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { take as ride } from '../../../game/passage.ts';
import { restRefused, useShrine } from '../../../game/wilds.ts';
import { questLog } from '../../../game/quests.ts';
import { readerOf } from '../../../game/inscriptions.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { LAST_CROSSING } from '../../crossings.ts';
import { COMPACT_OVER, COMPACT_WARDENS } from '../saltreach/maps/saltmouth.ts';
import { THRONE_REMOVED } from '../shelf/maps/keep.ts';
import { STRAND, PILGRIMS, TOKEN_COUSIN, TOKEN_HOLD, TOKEN_TALLIS } from './maps/hearthisle_h6.ts';
import { LAMPS, LAMPS_OUT, LAMPS_WRONG, LAMPS_KEY, FANE_KEY, LAMP_FLAGS, STAIR } from './maps/hearthfane.ts';
import { ELEVEN_KEPT, GREY_DOOR, LOG_GIVEN } from './maps/hearthfane2.ts';

const H6 = MAP_DEFS.find((d) => d.id === 'hearthisle_h6')!;
const person = (name: string): Person => H6.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const ISLE = ATLAS.zones.find((z) => z.id === 'hearthisle')!;
const at = (w: Walk, hour: number): void => { w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + hour * 60; };

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const h6 = out.zones.find((z) => z.id === 'hearthisle_h6')!;
  w.level = 28;
  for (const m of w.party.members) m.level = 28;

  // The last crossing, bought at Cinderport's quay from the harbourmaster: it leaves at 20:00 and grounds
  // on the strand at the cleft's foot, 20,30, facing north, the afternoon after (#547; §4.2).
  ok(ISLE.maps?.map((m) => m.map).join() === 'hearthisle_h6,hearthisle_i6' && !!ISLE.crossing?.harder && !!ISLE.crossing?.warning && H6.density === 'core' && H6.band?.join() === '28,29',
    'Hearth Isle holds H6 and I6, H6 core, band 28-29, and has its crossing words');
  const port = MAP_DEFS.find((d) => d.id === 'cinderport')!.features!.find((f): f is Person => f.kind === 'npc' && (f.passage ?? []).some((p) => p.to === 'hearthisle_h6'))!;
  const [over] = port?.passage?.filter((p) => p.to === 'hearthisle_h6') ?? [];
  const landing = LAST_CROSSING.ends.find((e) => e.at === 'hearthisle')!;
  ok(!!over && !landing.owed && over.x === 20 && over.y === 30 && over.facing === NORTH && over.fare === LAST_CROSSING.fare && H6.start.x === 20 && H6.start.y === 30,
    `Cinderport's harbourmaster sells the last crossing to the strand at 20,30, ${over?.fare} gold, its isle end landed`);
  w.world.travel('cinderport', port.x, port.y);
  at(w, 12);
  w.party.gold = LAST_CROSSING.fare;
  const day = w.world.day, gone = ride(over, w.world, w.party);
  ok(gone.taken && w.party.gold === 0 && w.world.zone?.id === 'hearthisle_h6' && w.world.state.x === h6.x + 20 && w.world.state.y === h6.y + 30 && w.world.day === day + 1 && w.world.hour === LAST_CROSSING.arrives,
    `the boat grounds on the strand the next afternoon (${gone.lines.join(' ')})`);
  listen(w);
  const boatman = person('The boatman'), [back] = boatman.passage ?? [];
  const steps = LAST_CROSSING.ends.find((e) => e.at === 'cinderport')!.landing!;
  ok(!!back && back.to === 'cinderport' && back.x === steps.x && back.y === steps.y && Math.abs(boatman.x - 20) + Math.abs(boatman.y - 30) === 1
    && meet(boatman, w.party, heard(w.world, boatman)).text.includes('I wait anyway'), 'the boatman in the stern beside the landing sells it back to Cinderport\'s steps, and waits');

  // The strand: the light close at the cleft's foot, the chapter's first step, and the hum by the boat.
  see(w, STRAND);
  see(w, 'hearthisle_h6:h6_shard');
  ok(w.world.used('h6_strand') && w.world.used('h6_shard'), 'on the strand the column seen close, and the hum of the carved lump under Ashcombe');

  // The cleft, carved one square wide through the rim from the strand to the Bowl's hills, its pickets in
  // it and at its head; the picket's chest with the Hand's knife.
  const ch = (x: number, y: number): string => out.at(h6.x + x, h6.y + y).ch;
  ok([24, 25, 26, 27, 28, 29].every((y) => ch(20, y) === ':' && ch(19, y) !== ':' && ch(21, y) !== ':') && ch(20, 23) === '^' && ch(20, 22) === ',',
    'the cleft is a path of dirt one square wide from the strand to the Bowl\'s hills, through the rim\'s rock');
  see(w, 'hearthisle_h6:h6_cleft');
  fight(w, 'hearthisle_h6:h6_picket1');
  fight(w, 'hearthisle_h6:h6_picket2');
  see(w, 'hearthisle_h6:h6_bowl');
  const chest = H6.features!.find((f) => f.kind === 'chest' && f.id === 'h6_picket_chest');
  ok(chest?.kind === 'chest' && chest.items.includes('grey_knife') && chest.gold === 300, 'in the picket\'s chest at the cleft\'s head, 300 gold and a Grey Knife');

  // The camp in the lee of the rim: its fires, the isle's rest; its three tents round a yard, each a door
  // into its room; and the pilgrims' shrine.
  const camp = H6.features!.find((f) => f.kind === 'camp')!;
  w.world.travel('hearthisle_h6', camp.x, camp.y);
  ok(restRefused(w.world) === '', 'a company may rest at the pilgrims\' fires, the isle\'s rest');
  const tents = H6.features!.filter((f) => f.kind === 'shop' || f.kind === 'trainer' || f.kind === 'temple');
  ok(tents.length === 3 && tents.every((f) => ch(f.x, f.y) === 'D' && Math.abs(f.x - 16) + Math.abs(f.y - 16) === 1) && tents.some((f) => f.kind === 'trainer' && f.maxLevel === 32),
    'the store, the sergeant\'s tent and the Lantern\'s open round the yard at 16,16, and the sergeant teaches to the cap');
  const shrine = H6.features!.find((f): f is Extract<typeof f, { kind: 'shrine' }> => f.kind === 'shrine' && f.id === 'h6_shrine')!;
  w.world.travel('hearthisle_h6', shrine.x, shrine.y);
  const here = w.world.featureHere();
  ok(here?.kind === 'shrine' && here.id === 'h6_shrine' && useShrine(w.world, w.party, here)[0] === shrine.text, 'kneeling at the pilgrims\' shrine, the hum settles in the chest');

  // The three pilgrims: each asks, and met begins the quest; one token taken, the other two keep theirs
  // and are gone, and the one who gave it speaks of it after.
  const [aelfric, talwyn, pasco] = ['Sergeant Aelfric', 'Talwyn', 'Pasco'].map(person);
  const asks = [aelfric, talwyn, pasco].map((p) => { w.world.travel('hearthisle_h6', p.x, p.y); return meet(p, w.party, heard(w.world, p)).choice?.ask ?? ''; });
  ok(asks.join('|') === 'Take the Wardens\' badge down?|Take the hold\'s seal down?|Take Tallis\'s tally down?' && !!w.party.flags[PILGRIMS] && !!questLog(w.world.state, w.party).find((v) => v.def.id === 'bowl_pilgrims' && !v.done),
    'Aelfric, Talwyn and Pasco each ask their token carried down, and the quest begins');
  const take = (p: Person, w: Walk): string => answer(p.choice!.answers.find((a) => a.label === 'Take it.')!, w.party);
  ok(take(aelfric, w).includes('pins it to your sleeve') && !!w.party.flags[TOKEN_COUSIN] && w.party.bag.includes('wardens_badge')
    && !w.world.present(talwyn) && !w.world.present(pasco) && w.world.present(aelfric) && !!questLog(w.world.state, w.party).find((v) => v.def.id === 'bowl_pilgrims' && v.done),
    'the Wardens\' badge taken, Talwyn and Pasco keep theirs and are gone, and the token carried does the quest');
  w.world.travel('hearthisle_h6', aelfric.x, aelfric.y);
  ok(meet(aelfric, w.party, heard(w.world, aelfric)).text.includes('Keep it on your sleeve'), 'Aelfric speaks of the badge after');
  for (const [p, flag, item] of [[talwyn, TOKEN_HOLD, 'treaty_seal'], [pasco, TOKEN_TALLIS, 'tallis_tally']] as const) {
    const r = newWalk(ok);
    r.world.travel('hearthisle_h6', p.x, p.y);
    meet(p, r.party, heard(r.world, p));
    take(p, r);
    ok(!!r.party.flags[flag] && r.party.bag.includes(item) && !r.world.present(aelfric), `${p.name}'s token taken another way: ${item}, and Aelfric gone`);
  }

  // The Hearth on the grass east of the mound, the warm ground between, and the Grove's sliver humming in
  // the pack of a company that carries it (#56's 18), and in no other's.
  const hearth = ATLAS.sites.find((s) => s.name === 'The Hearth')!;
  ok(!hearth.planned && hearth.at[0] === h6.x + 24 && hearth.at[1] === h6.y + 16 && H6.features!.some((f) => f.kind === 'sign' && f.x === 24 && f.y === 16), 'the Hearth\'s site, built, is the column\'s foot at 24,16');
  see(w, 'hearthisle_h6:h6_warm');
  w.world.travel('hearthisle_h6', 23, 16);
  w.world.eventsHere();
  const unheard = !w.world.used('h6_sliver');
  w.party.bag.push('grove_sliver');
  see(w, 'hearthisle_h6:h6_sliver');
  ok(unheard && w.world.used('h6_sliver'), 'at the column\'s foot the Grove\'s sliver hums, for a company that carries it');

  // The temple's door in the mound's south face, the way into Hearthfane (#755), and its preacher's group
  // before it, the box's hardest.
  fight(w, 'hearthisle_h6:h6_sermon');
  see(w, 'hearthisle_h6:h6_front');
  see(w, 'hearthisle_h6:h6_north');
  see(w, 'hearthisle_h6:h6_lookout');

  // The secret: the draught at the north rim's foot, the rock that opens on a search, and the cache.
  see(w, 'hearthisle_h6:h6_draught');
  const [door] = H6.secrets!;
  w.world.travel('hearthisle_h6', door.x, door.y + 1, NORTH);
  let opens = false;
  for (let i = 0; i < 20 && !opens; i++) opens = w.world.search();
  const inside = opens ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opens && inside.every((r) => r.kind === 'moved') && w.world.used('h6_cache'), 'searched at the draught, the rock opens, and the hollow behind it is walked into');
  listen(w);
  const lamp = H6.features!.find((f) => f.kind === 'chest' && f.id === 'h6_lamp');
  ok(lamp?.kind === 'chest' && lamp.gold === 400 && lamp.items.filter((i) => i === 'smelling_salts').length === 3 && lamp.x === door.x && lamp.y === door.y - 2,
    'in the cache, 400 gold and three Smelling Salts');

  // The moths by night: over the Bowl, and on the strand and the Bowl's north, gone by day.
  const moths = H6.encounters!.filter((g) => g.monsters.includes('hearth_moth'));
  ok(moths.length === 2 && moths.every((g) => JSON.stringify(g.when) === JSON.stringify({ hours: 'night' })), 'the moths come by night, on the strand and over the Bowl\'s north');
  at(w, 23);
  see(w, 'hearthisle_h6:h6_moths');
  ok(w.world.used('h6_moths'), 'by night the sky over the Bowl is moving');

  // The Compact as the company left it: its runner for a Partner, or a Warden sergeant.
  const runner = person('A Compact runner'), sergeant = person('A Warden sergeant');
  const none = !w.world.present(runner) && !w.world.present(sergeant);
  w.party.flags[COMPACT_OVER] = 1;
  ok(none && w.world.present(runner) && !w.world.present(sergeant) && runner.x === sergeant.x && runner.y === sergeant.y && runner.lines.join(' ').includes('tally-house'),
    'on the strand a Compact runner for a Partner, with the one spy\'s word, and no one for a company that did neither');
  delete w.party.flags[COMPACT_OVER];
  w.party.flags[COMPACT_WARDENS] = 1;
  ok(w.world.present(sergeant) && !w.world.present(runner), 'or a Warden sergeant, the Compact handed to the Wardens');

  // The box's groups, each won at 28: the moths, the champions on the west shelf and the rats.
  for (const id of ['h6_moths1', 'h6_moths2', 'h6_rim', 'h6_rats']) fight(w, `hearthisle_h6:${id}`);
  ok(H6.encounters!.find((g) => g.id === 'h6_rim')?.roams === true && H6.encounters!.filter((g) => g.id === 'h6_picket1' || g.id === 'h6_sermon').every((g) => g.roams === false),
    'the champions on the west shelf roam; the cleft\'s picket and the preacher\'s group stand');

  // The east rim (I6, #754), walked on from the Bowl by day: the champions in the Bowl's east pocket where
  // the rim's path begins, and the path carved through the rim's rock into Anchorhold's yard under the
  // cell and on out to the east foot, north under the rim to the Wyke.
  delete w.party.flags[COMPACT_WARDENS];
  at(w, 12);
  const I6 = MAP_DEFS.find((d) => d.id === 'hearthisle_i6')!, i6 = out.zones.find((z) => z.id === 'hearthisle_i6')!;
  const rim = (x: number, y: number): string => out.at(i6.x + x, i6.y + y).ch;
  ok(I6.density === 'core' && I6.band?.join() === '28,29' && i6.x === 264 && i6.y === 158 && ISLE.maps![1].at.join() === '264,158', 'I6 is laid at 264,158, core, band 28-29');
  fight(w, 'hearthisle_i6:i6_rim');
  const yard = [2, 3, 4, 5].flatMap((x) => [19, 20].map((y) => rim(x, y)));
  ok([[1, 18], [2, 18], [6, 19], [7, 19]].every(([x, y]) => rim(x, y) === ':') && yard.every((c) => c === ':') && rim(0, 18) === ',' && rim(8, 19) === ',' && rim(4, 18) === 'B',
    'the rim\'s path is carved from the Bowl\'s grass at 0,18 through the rock into Anchorhold\'s yard, 2-5,19-20, and out to the east foot at 8,19; the cell at 4,18 is built into the rim');
  const anchorhold = ATLAS.sites.find((s) => s.name === 'Anchorhold')!;
  ok(!anchorhold.planned && anchorhold.at[0] === i6.x + 4 && anchorhold.at[1] === i6.y + 18 && !I6.features!.some((f) => f.x === 4 && f.y === 19),
    'Anchorhold\'s site, built, is the cell at 4,18, and the square under its window, 4,19, is left for the anchoress (#763)');
  for (const id of ['i6_wall', 'i6_cell', 'i6_path', 'i6_keel', 'i6_wyke']) see(w, `hearthisle_i6:${id}`);
  ok(['i6_wall', 'i6_cell', 'i6_path', 'i6_keel', 'i6_wyke'].every((id) => w.world.used(id)), 'the hours scratched on the cell, its window, the causeway from the path, the keel and the Wyke');

  // The Hand's camp at the stair's head: its guard, gone once Vask is gone from Helmstow (#747) and back
  // where it stood if not, and the two at the stair's head; the camp, its crates and its chest; the Steps.
  const guard = I6.encounters!.find((g) => g.id === 'i6_guard')!;
  ok(guard.leaves === true && JSON.stringify(guard.until) === JSON.stringify({ flag: THRONE_REMOVED }) && guard.roams === false && guard.monsters.includes('ashen_preacher'), 'the camp\'s guard and its preacher stand, and leave once the Council has removed Vask');
  w.party.flags[THRONE_REMOVED] = 1;
  left(w, 'hearthisle_i6:i6_guard');
  delete w.party.flags[THRONE_REMOVED];
  fight(w, 'hearthisle_i6:i6_guard');
  fight(w, 'hearthisle_i6:i6_guard2');
  for (const id of ['i6_camp', 'i6_crates', 'i6_steps']) see(w, `hearthisle_i6:${id}`);
  const staff = I6.features!.find((f) => f.kind === 'chest' && f.id === 'i6_camp_chest');
  ok(staff?.kind === 'chest' && staff.gold === 500 && staff.items.join() === 'grey_staff' && w.world.used('i6_steps'), 'in the camp\'s chest, 500 gold and a Grey Staff; the causeway comes up out of the sea at the Steps');

  // The grey door at the camp's back, read from the grass below it: no exit, and no lock.
  see(w, 'hearthisle_i6:i6_door');
  see(w, 'hearthisle_i6:i6_knot');
  ok(rim(5, 22) === 'r' && !(I6.exits ?? []).length && w.world.used('i6_door') && w.world.used('i6_knot'), 'the grey door at 5,22 is the rim\'s rock, read and never opened');

  // The secret: the tally-house against the rim and the smell at its foot, the rock behind it that opens
  // on a search, and the Hand's takings in the pocket behind.
  see(w, 'hearthisle_i6:i6_tally');
  see(w, 'hearthisle_i6:i6_smell');
  const [pocket] = I6.secrets!;
  w.world.travel('hearthisle_i6', pocket.x + 1, pocket.y, WEST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('i6_takings'), 'searched behind the tally-house, the rock opens, and the pocket behind it is walked into');
  listen(w);
  const rimHoard = I6.features!.find((f) => f.kind === 'chest' && f.id === 'i6_hoard');
  ok(rimHoard?.kind === 'chest' && rimHoard.gold === 1200 && rimHoard.items.join() === 'grey_mail' && rimHoard.x === pocket.x - 2 && rimHoard.y === pocket.y, 'in the Hand\'s rimHoard, 1,200 gold and the Grey Mail');

  // The moths over Anchorhold's yard by night.
  ok(JSON.stringify(I6.encounters!.find((g) => g.id === 'i6_moths')?.when) === JSON.stringify({ hours: 'night' }), 'the moths come over the yard by night');
  at(w, 23);
  fight(w, 'hearthisle_i6:i6_moths');

  // Hearthfane (#755): in at the door in the mound, 18,14, onto the nave's foot facing up it, and out
  // again onto the Bowl before the door.
  const TEMPLE = MAP_DEFS.find((d) => d.id === 'hearthfane')!;
  const inFane = (name: string): Person => TEMPLE.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  ok(ch(18, 14) === 'D' && H6.exits?.length === 1 && H6.exits[0].to === 'hearthfane' && TEMPLE.kind === 'dungeon' && TEMPLE.band?.join() === '28,29',
    'Hearthfane\'s door at 18,14 opens on the temple, a dungeon of band 28-29');
  walkThrough(w, 'hearthisle_h6', 18, 15, NORTH, 'hearthfane', 1);
  ok(w.world.state.x === 8 && w.world.state.y === 14 && w.world.state.facing === NORTH, 'in at the door onto the nave\'s foot, 8,14, facing up it');
  walkThrough(w, 'hearthfane', 8, 14, SOUTH, 'hearthisle_h6', 1);
  ok(w.world.state.x === h6.x + 18 && w.world.state.y === h6.y + 15 && w.world.state.facing === SOUTH, 'and out again onto the Bowl before the door, facing away from it');

  // The nave and its moths while the lamps burn, won at 28; the pillar, whose carving a reader reads and
  // the log keeps, and no other company.
  see(w, 'hearthfane:hf_nave');
  fight(w, 'hearthfane:hf_moths');
  w.world.travel('hearthfane', 8, 10);
  const reader = !!readerOf(w.party), plain = w.world.eventsHere().join(' ');
  w.party.bag.push('copybook');
  const read = w.world.eventsHere().join(' ');
  w.party.bag.splice(w.party.bag.indexOf('copybook'), 1);
  ok((reader || (!plain.includes('FIRST THE SEA'))) && read.includes('THEN THE SHORE. THEN THE HOUSE.') && w.world.used('hf_pillars'),
    `the pillar's carving, its order read with a reader and kept read (${read})`);

  // The sacristan under the vestry's table: met, he wants the lamps out in the pillar's order (56).
  see(w, 'hearthfane:hf_vestry');
  const sacristan = inFane('The sacristan');
  const talk = (p: Person) => { w.world.travel('hearthfane', p.x, p.y); return meet(p, w.party, heard(w.world, p)); };
  const lamps = questLog(w.world.state, w.party);
  ok(!lamps.some((v) => v.def.id === 'lamps') && talk(sacristan).text.includes('the pillar says the way') && !!w.party.flags[LAMPS]
    && !!questLog(w.world.state, w.party).find((v) => v.def.id === 'lamps' && !v.done), 'the sacristan under the vestry table wants the lamps out in the pillar\'s order, and the quest begins');
  listen(w);

  // A lamp out of its turn, the Shore first: the others flare, the swarm comes and the lamp burns on; the
  // swarm won at 28. Then the pillar's order, which still works: each lamp out in its turn, and stays out.
  const [sea, shore, house, hearthLamp] = ['The Sea lamp', 'The Shore lamp', 'The House lamp', 'The Hearth lamp'].map(inFane);
  const swarm = (): boolean => w.world.liveGroups().some((g) => g.def.id === 'hf_swarm');
  const pinch = (p: Person): string => answer(talk(p).choice!.answers[0], w.party);
  const calm = !swarm();
  ok(calm && pinch(shore).includes('the rest flare') && !!w.party.flags[LAMPS_WRONG] && !w.party.flags.lamp_shore && w.world.present(shore) && swarm(),
    'the Shore lamp put out first is wrong: the others flare, the swarm comes, and the lamp burns on');
  ok(talk(sacristan).text.includes('Read the pillar'), 'and from under the table the sacristan says so');
  fight(w, 'hearthfane:hf_swarm');
  const order = [sea, shore, house, hearthLamp].map((p, i) => { const said = pinch(p); return !!w.party.flags[LAMP_FLAGS[i]] && !w.world.present(p) && said.length > 0; });
  listen(w);
  ok(order.every((x) => x) && !!w.party.flags[LAMPS_OUT], 'then the Sea, the Shore, the House and the Hearth, in the pillar\'s order, each out in its turn and staying out');
  left(w, 'hearthfane:hf_moths');
  left(w, 'hearthfane:hf_swarm');

  // The Sea and Shore lamps stand in the first room, so a company may put out lamps before it has met the
  // sacristan. After one out of its turn his own words still come first and the quest begins, and then he
  // says so; after all four in the pillar's order the key's offer begins it. Each on a walk of its own.
  const apart = (n: Walk) => {
    const say = (p: Person) => { n.world.travel('hearthfane', p.x, p.y); return meet(p, n.party, heard(n.world, p)); };
    const log = () => questLog(n.world.state, n.party).find((v) => v.def.id === 'lamps');
    return { n, say, pinch: (p: Person): string => answer(say(p).choice!.answers[0], n.party), log, asked: () => !!log()?.pages[0].entries.some((e) => e.id === 'asked') };
  };
  const first = apart(newWalk(ok));
  first.pinch(shore);
  const unmet = !first.log(), told = first.say(sacristan);
  ok(unmet && !!first.n.party.flags[LAMPS_WRONG] && told.text.includes('the pillar says the way') && !!first.n.party.flags[LAMPS] && first.asked()
    && first.log()?.goal?.startsWith('Put out the four lamps') === true, 'a lamp put out before he is met: his own words come first, and the quest, its entry and its goal begin');
  ok(first.say(sacristan).text.includes('Read the pillar'), 'and the next time he says so');
  const all = apart(newWalk(ok));
  const turns = [sea, shore, house, hearthLamp].map((p) => all.pinch(p).length > 0);
  const quiet = !all.log(), offer2 = all.say(sacristan);
  ok(turns.every((x) => x) && !!all.n.party.flags[LAMPS_OUT] && quiet && offer2.text.includes('Gone. Every one of them') && !!all.n.party.flags[LAMPS] && all.asked()
    && all.log()?.goal === 'Go back to the sacristan under the vestry table.', 'all four lamps out in the pillar\'s order before he is met: his offer begins the quest, with its entry and its goal');
  answer(offer2.choice!.answers.find((a) => a.label === 'Take the key.')!, all.n.party);
  ok(all.n.party.bag.includes(FANE_KEY) && all.log()?.done === true, 'and taking the key ends it');

  // The treasury's door: shut with no key and shut to an iron key, which it leaves whole; the sacristan's
  // key, 3,000 experience among the company and the quest done; and the door open to his key.
  const treasury = (): string => { w.world.travel('hearthfane', 10, 10, EAST); return w.world.move('forward').kind; };
  const keyless = treasury();
  w.party.bag.push('key_iron');
  const iron = treasury(), whole = w.party.bag.includes('key_iron');
  w.party.bag.splice(w.party.bag.indexOf('key_iron'), 1);
  ok(keyless === 'blocked' && iron === 'blocked' && whole, 'the treasury\'s door stays shut with no key, and to an iron key, which it leaves whole');
  const xp = w.party.members[0].xp;
  const offer = talk(sacristan);
  const took = answer(offer.choice!.answers.find((a) => a.label === 'Take the key.')!, w.party);
  ok(offer.text.includes('Gone. Every one of them') && took.includes('warm from his belt') && w.party.bag.includes(FANE_KEY) && !!w.party.flags[LAMPS_KEY]
    && w.party.members[0].xp - xp === 500 && !!questLog(w.world.state, w.party).find((v) => v.def.id === 'lamps' && v.done), 'the sacristan gives the treasury\'s key, the company 3,000 experience between them, and the quest is done');
  listen(w);
  ok(talk(sacristan).text.includes('Dark again'), 'after, he trims the wicks and lights none');
  ok(treasury() === 'moved' && w.world.state.x === 11 && w.world.state.y === 10, 'the treasury\'s door opens to the sacristan\'s key');
  see(w, 'hearthfane:hf_treasury');
  const hoard = TEMPLE.features!.find((f) => f.kind === 'chest' && f.id === 'hf_offerings');
  ok(hoard?.kind === 'chest' && hoard.gold === 2000 && hoard.items.join() === 'grey_blade,grey_bow' && hoard.x === 13 && hoard.y === 11,
    'in the treasury the pilgrims\' offerings, 2,000 gold, and the Hand\'s steel: a Grey Blade and a Grey Bow');

  // Up the nave past the Hand's best to the court and the altar, each group won at 28; the court's second
  // group gone once the Council has removed Vask from Helmstow, standing or not.
  see(w, 'hearthfane:hf_dead');
  fight(w, 'hearthfane:hf_champions');
  see(w, 'hearthfane:hf_court');
  fight(w, 'hearthfane:hf_sermon');
  fight(w, 'hearthfane:hf_second');
  see(w, 'hearthfane:hf_altar');
  const r = newWalk(ok);
  r.party.flags[THRONE_REMOVED] = 1;
  left(r, 'hearthfane:hf_second');

  // The crypt (#756): behind the altar the stair down onto its foot, 8,14, facing up the passage, and its
  // way back up onto the altar's square, 8,2, facing away from the stair.
  const CRYPT = MAP_DEFS.find((d) => d.id === 'hearthfane2')!;
  ok(TEMPLE.rows[STAIR.y][STAIR.x] === '.' && (TEMPLE.exits ?? []).includes(STAIR) && CRYPT.kind === 'dungeon' && CRYPT.band?.join() === '29,29',
    'behind the altar the stair goes down into the crypt, a dungeon of band 29');
  walkThrough(w, 'hearthfane', 8, 2, NORTH, 'hearthfane2', 1);
  ok(w.world.state.x === 8 && w.world.state.y === 14 && w.world.state.facing === NORTH, 'down the stair onto its foot, 8,14, facing up the passage');
  walkThrough(w, 'hearthfane2', 8, 14, SOUTH, 'hearthfane', 1);
  ok(w.world.state.x === 8 && w.world.state.y === 2 && w.world.state.facing === SOUTH, 'and up it again onto the altar\'s square, 8,2, facing away from the stair');

  // At the crypt's floor, 29: the vaulted passage, and the Hand's best in the round chamber; its eleven
  // niches, whose lamps only a company that gave Hereswith the keeper's log lights (#763); the cups.
  w.level = 29;
  for (const m of w.party.members) m.level = 29;
  see(w, 'hearthfane2:hf2_vault');
  fight(w, 'hearthfane2:hf2_champions');
  see(w, 'hearthfane2:hf2_niches');
  const eleven = CRYPT.features!.find((f) => f.kind === 'event' && f.id === 'hf2_eleven')!;
  w.world.travel('hearthfane2', eleven.x, eleven.y);
  w.world.eventsHere();
  ok(!w.world.present(eleven) && !w.party.flags[ELEVEN_KEPT], 'the eleven are not lit without the keeper\'s log given at Anchorhold');
  const c = newWalk(ok);
  c.party.flags[LOG_GIVEN] = 1;
  see(c, 'hearthfane2:hf2_eleven');
  ok(!!c.party.flags[ELEVEN_KEPT], 'with it given, the eleven lit as the log has them keep the hum');
  const find = (id: string) => CRYPT.features!.find((f) => f.kind === 'chest' && f.id === id);
  const cups = find('hf2_cups'), pack = find('hf2_pack');
  ok(cups?.kind === 'chest' && cups.gold === 600 && !cups.items.length && cups.x === 10 && cups.y === 10,
    'in the chamber the pilgrims\' cups, 600 gold');

  // The side vault off the chamber's west: the Hand's dead, the rats come up for them, and a dead
  // champion's pack with the Hand's robe in it.
  see(w, 'hearthfane2:hf2_dead');
  fight(w, 'hearthfane2:hf2_rats');
  ok(pack?.kind === 'chest' && pack.gold === 200 && pack.items.join() === 'grey_robe' && pack.x === 1 && pack.y === 8,
    'in the side vault the dead champion\'s pack, 200 gold and a Grey Robe');

  // Through the chamber's north door the keeper, the first machine on the isle, with the Hand's last man
  // beside it; her knot on the grey door's frame, the chapter's next step (#760); and the grey door,
  // standing open, whose way down into the Ways is #757's.
  see(w, 'hearthfane2:hf2_last');
  fight(w, 'hearthfane2:hf2_keeper');
  see(w, 'hearthfane2:hf2_knot');
  w.world.travel('hearthfane2', GREY_DOOR.x, GREY_DOOR.y);
  const grey = w.world.eventsHere().join(' ');
  ok(grey.includes('A door of grey with no handle') && w.world.used('hf2_knot') && CRYPT.rows[GREY_DOOR.y][GREY_DOOR.x] === 'D' && GREY_DOOR.to === 'underdeep'
    && !(CRYPT.exits ?? []).some((e) => e.to === GREY_DOOR.to), 'her knot on the grey door\'s frame, and the door standing open, its way down waiting on the Ways');
};
