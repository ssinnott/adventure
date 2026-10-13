// Hearth Isle's walkthrough. Its chapter, The Heart, is #760's, which plays it here; until then, the
// isle (H6, #753) walked at 28: the last crossing bought at Cinderport's quay and landed on the strand at
// 20,30, and its boatman selling it back; the light close at the cleft's foot and the hum on the strand;
// the cleft carved up through the rim and its pickets; the Bowl, the pilgrims' camp and its rest, its
// three tents and the shrine; the three pilgrims' questions, a token taken and the other two gone, and
// each token another way; the Hearth, the warm ground and the Grove's sliver humming for a company that
// carries it; the temple's door, a building until the temple is built (#755); the lookouts; the cache
// found from the draught; the moths by night; the Compact's runner or the Wardens' sergeant; and the
// box's groups won at 28.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { NORTH } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { take as ride } from '../../../game/passage.ts';
import { restRefused, useShrine } from '../../../game/wilds.ts';
import { questLog } from '../../../game/quests.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { LAST_CROSSING } from '../../crossings.ts';
import { COMPACT_OVER, COMPACT_WARDENS } from '../saltreach/maps/saltmouth.ts';
import { STRAND, PILGRIMS, TOKEN_COUSIN, TOKEN_HOLD, TOKEN_TALLIS } from './maps/hearthisle_h6.ts';

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
  ok(ISLE.maps?.length === 1 && ISLE.maps[0].map === 'hearthisle_h6' && !!ISLE.crossing?.harder && !!ISLE.crossing?.warning && H6.density === 'core' && H6.band?.join() === '28,29',
    'Hearth Isle holds H6, core, band 28-29, and has its crossing words');
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

  // The temple's door in the mound's south face, a building until the temple is built (#755), and its
  // preacher's group before it, the box's hardest.
  ok(ch(18, 14) === 'B' && !(H6.exits ?? []).length, 'Hearthfane\'s door at 18,14 stands shut to the walk until the temple is built');
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
};
