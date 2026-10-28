// The Foreland's walkthrough: its chapter of the one quest, The Quiet Farm, played from a new game by
// the game's own moves and checked a step at a time (tools/kit/walk.ts); Thornmark's plays the chain.
// Then a new company walks out of Helmstow to the Lodestone, and Gytha gives it the lesson, and
// her later words as Thornhold's news reaches her. Then its side quests, each choice both ways: the
// log reads true and the people stand where it says. Then Helmstow before and after Act II (#157).
// Last, the bounds (#837), the Downs' last shore, in a walk of its own (`theBounds`).
import type { Walkthrough } from '../../area.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import type { Feature } from '../../../game/mapdef.ts';
import { DOWNS_E4 } from './maps/downs_e4.ts';
import { CHAPTER } from './chapter.ts';
import { newWalk, meetWho, walkThrough, see, fight, playChapter, quest, listen, pilotPlays, said, hear, page, reads, there, open, search, clock, hired, ledgerGiven, mapOf, who, stock, taught } from '../../../../tools/kit/walk.ts';
import { zone, square, ALL, reach, each, row, col } from '../../../../tools/kit/grid.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { wrap } from '../../../ui/draw.ts';
import { SAY_W, SAY_LINES, logLines } from '../../../ui/frame.ts';
import { ITEMS, MAP_DEFS, MONSTERS, TABLES } from '../../index.ts';
import { HARDER_IN, WARNING_IN } from '../../../game/world.ts';
import { xpForLevel, prestigeOf, takePrestige, createCharacter, PRESTIGES, countItem } from '../../../game/party.ts';
import type { Party } from '../../../game/party.ts';
import { teach } from '../../../game/prestige.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { priceIn } from '../../../game/items.ts';
import { meet, answer, heard, readText, barred } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import { GameMap } from '../../../game/map.ts';
import { ENDINGS } from '../../endings.ts';
import { WENNA_HOME, VOICE_WHOLE } from '../hearth/public.ts';
import type { Flag } from '../../index.ts';


/** At Crowness Light: the keeper met, and his log opened and read from the pack. */
function crowness(w: Walk): void {
  meetWho(w, 'q_keeper');
  open(w, 'downs_e3:e3_log');
  w.ok(w.party.bag.includes('keepers_log') && (readText(TABLES.items, 'keepers_log') ?? []).length === 5, "the keeper's log is on the cottage table, and reads from the pack");
}

/**
 * The wand taken to Vask at his door: found by his hire and never by the wand, which his steward and
 * Wiglaf at the door take as well, once he is gone (#795; `keepHandIns` plays them).
 */
function toVask(w: Walk): void {
  const vask = MAP_DEFS.find((d) => d.id === 'keep')?.features?.find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes('q_ashcombe'));
  w.ok(!!vask, 'Vask keeps the door of the keep');
  if (!vask) return;
  w.world.travel('keep', vask.x, vask.y);
  w.ok(w.world.present(vask), 'Vask is there to meet');
  const bag = w.party.bag.length;
  meet(vask, w.party, heard(w.world, vask));
  if (w.party.bag.length < bag) w.handedIn = 'keep';
  listen(w);
}

/** The chapter once hired: Gullwick, the farm and its cellar, Crowness on along the road, and the wand taken back. */
export const STEPS: readonly Step[] = [
  { name: 'to Gullwick', play: (w) => meetWho(w, 'q_wenna') },
  { name: 'to Ashcombe', play: (w) => walkThrough(w, 'downs_e3', 20, 4, EAST, 'mill') },
  { name: 'the cellar', play: (w) => {
    // Walked at its floor, 2, where the gate tunes its Warden to about half (#87), before Crowness at 3.
    w.ok(w.level === 2, `the cellar is walked at level 2, its floor (${w.level})`);
    see(w, 'mill:mill_lantern'); fight(w, 'mill:m_warden'); see(w, 'mill:mill_core');
  } },
  { name: 'to Crowness', play: crowness },
  { name: 'the wand', play: toVask },
];

/**
 * The farm first and the wand straight back from the cellar, Gullwick and Crowness last: against
 * the goal, which asks for Crowness before Helmstow, so the wand is handed over in the cellar's step
 * and not as a step of its own. Then the chapter's goals send the company to Hild, then the keeper.
 */
export const FARM_FIRST: readonly Step[] = [STEPS[1], {
  name: 'the cellar, and the wand straight back',
  play: (w) => {
    STEPS[2].play(w);
    const vask = MAP_DEFS.find((d) => d.id === 'keep')?.features?.find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes('q_ashcombe'));
    if (vask) { w.world.travel('keep', vask.x, vask.y); meet(vask, w.party, heard(w.world, vask)); listen(w); }
    w.ok(!!w.party.flags.q_ashcombe_done, 'the wand taken straight back to Vask, before Crowness');
  },
}, {
  name: 'to Gullwick, the farm done',
  play: (w) => {
    const goal = quest(w)?.goal ?? '';
    w.ok(goal.startsWith('Gullwick'), `the farm done first, the goal is Gullwick (${goal})`);
    meetWho(w, 'q_wenna');
  },
}, {
  name: 'to Crowness, the farm done',
  play: (w) => {
    const goal = quest(w)?.goal ?? '';
    w.ok(goal.startsWith('Crowness Light'), `the farm and Gullwick done first, the goal is Crowness Light (${goal})`);
    crowness(w);
  },
}];


export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  hired(w);
  playChapter(w, CHAPTER, STEPS, 'in order');
  ok(quest(w)?.pages.find((p) => p.def === CHAPTER)?.done === true && w.news.includes('Chapter complete: The Quiet Farm.'), 'in order, the wand back to Vask finishes The Quiet Farm');
  berth(w);

  lodestone(newWalk(ok), 'a new company');
  // A company Sylvane has spoken to before it comes by still gets the lesson first.
  const late = newWalk(ok);
  meetWho(late, 'q_grove');
  const g = gytha();
  ok(g !== undefined && meet(g, late.party, heard(late.world, g)).text.includes("That's a Stone, whole.") && /Cut\. With tools\./.test(meet(g, late.party, heard(late.world, g)).text),
    'Sylvane met first: Gytha gives the lesson, and then the cut\'s words');

  sideQuests(ok);
  haleGone(ok);
  walkWorth(ok);
  homecoming(ok);
  walkHome(ok);
  underVask(ok);
  council(ok);
  roadBehind(ok);
  keepHandIns(ok);
  trainers(ok);
  // The pilot from a new game, every key its own (#720, #721, #723): the chapter to its end, Vask's
  // hire, Hild's ask, the cellar, the keeper's log and the wand handed in.
  pilotPlays(ok, CHAPTER);
  // And the bounds (#837), the Downs' last shore and the lair behind its cliff, in a walk of its own, last.
  theBounds(ok);
};

/**
 * The bounds (#837, docs/areas/shelf.md §12): E4, the Downs' last shore, which holds no group. South
 * from Crowness's down and east from the top of Kestrel Edge onto it, walked, the land not named
 * again; the post of holed stones on the last rise and the cairn of flints at the strand's end; the
 * crab shells at the stack's foot and the crabber's store behind it, shut but through its door; the
 * mouth in the low cliff's face at 3,6, E4's one way out but its edges. The box's edges as built.
 * Then Hag Hole, the lair (#845, #847): north from the strand at 3,7 in at the mouth, its door saying
 * its band and how it feels at 4, 28 and 30 and its sign its band; the Hag, its one group, in the
 * narrows that are the one way to the cave, won at 30; the Hagstone in the box in the wrack, one in
 * the world; the ledge found from the lamp smoke over the pool and shut to the four ways but through
 * its fall of rock; out onto the strand at 3,7 again; and the old man mending nets at Gullwick, who
 * speaks of his gran's holed stone at every meeting after his first and not before.
 */
function theBounds(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok);
  w.level = 4;
  const out = buildMaps()[OUTDOORS];
  const E4 = DOWNS_E4, e4 = zone(out, E4.id), e3 = zone(out, 'downs_e3'), d4 = zone(out, 'downs_d4'), e5 = zone(out, 'wrackholm_e5');
  ok(!(E4.encounters ?? []).length, 'E4 holds no group');

  // South from Crowness's down at E3's 6,31 onto E4's 6,0, walked, in the Downs still.
  w.world.travel(e3.id, 6, 31, SOUTH);
  const south = w.world.move('forward');
  ok(south.kind === 'moved' && w.world.zone?.id === E4.id && w.world.state.x === e4.x + 6 && w.world.state.y === e4.y && e3.y + e3.h === e4.y && !said(south).includes('Callow Downs'),
    `south from E3's 6,31 onto E4's 6,0, walked, and the land not named again, a company under the floor warned as at every rise of the Downs' band (${said(south)})`);
  listen(w);
  ok(E4.start.x === 6 && E4.start.y === 0 && E4.start.facing === SOUTH, 'E4 starts at its north edge, in from Crowness\'s down, facing the land');
  // And east from the top of Kestrel Edge, D4's 31,4, onto E4's 0,4.
  w.world.travel(d4.id, 31, 4, EAST);
  const east = w.world.move('forward');
  ok(east.kind === 'moved' && w.world.zone?.id === E4.id && w.world.state.x === e4.x && w.world.state.y === e4.y + 4 && d4.x + d4.w === e4.x && !said(east).includes('Callow Downs'),
    `east from D4's 31,4 onto E4's 0,4, walked (${said(east)})`);
  listen(w);
  const shore = reach(out, e4, [E4.start.x, E4.start.y], {}, [10, 2]);
  ok(shore.size === 66 && [[2, 2], [6, 4], [0, 6], [5, 6], [3, 7], [0, 9], [0, 10], [9, 2], [10, 0]].every(([x, y]) => shore.has(square(out, e4, x, y))),
    `E4's down and strand (${shore.size} squares, the mouth's with them): the cairn, the ways down either end of the cliff, the strand under its face, the post, the strand's end and the stack's foot are walked to from the way in`);
  see(w, `${E4.id}:e4_strand`);
  const cairn = E4.features!.find((f) => f.kind === 'cairn' && f.id === 'e4_cairn');
  ok(cairn?.kind === 'cairn' && cairn.gold === 30 && cairn.items.join() === 'potion_sp' && cairn.x === 0 && cairn.y === 9, 'at the strand\'s end, a cairn of flints with 30 gold and a Blue Vial');
  const post = E4.features!.find((f) => f.kind === 'shrine' && f.id === 'e4_post');
  ok(post?.kind === 'shrine' && post.stat === 'personality' && post.x === 2 && post.y === 2, 'on the down\'s last rise, the post of holed stones, a shrine that gives personality');
  // The secret: the crab shells at the stack's foot, the search there and the crabber's store behind it.
  const pots = reach(out, e4, [E4.start.x, E4.start.y], ALL, [10, 2]);
  ok(pots.size > 60 && !pots.has(square(out, e4, 11, 2)), `the store is shut but for its door in the stack: none of E4's ${pots.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${E4.id}:e4_shells`);
  ok(search(w, E4.id, 9, 2, EAST, 'e4_store'), 'searched where the crab shells are heaped, the rock gives, and the store behind it can be walked into');
  ok(stock(E4, 'e4_crock') === '80 elixir', `under the pots, a crock with 80 gold and an Elixir (${stock(E4, 'e4_crock')})`);
  // The lair's door (docs §12.3): the mouth in the low cliff's face at 3,6, drawn as stone, the cliff's
  // rock either side of it and behind it, walked onto from the strand at 3,7 alone, with nothing within
  // four squares: E4's one way out but its edges, into Hag Hole.
  const near = [...(E4.features ?? []), ...(E4.encounters ?? []), ...(E4.secrets ?? [])].filter((f) => Math.abs(f.x - 3) + Math.abs(f.y - 6) <= 4);
  ok(E4.exits?.length === 1 && E4.exits[0].x === 3 && E4.exits[0].y === 6 && E4.exits[0].to === 'hag_hole' && E4.rows[6][3] === '"'
    && [E4.rows[5][3], E4.rows[6][2], E4.rows[6][4]].join() === 'r,r,r' && E4.rows[7][3] === '_' && shore.has(square(out, e4, 3, 7)) && !near.length,
    `the mouth in the cliff's face at 3,6 is E4's one way out but its edges, into Hag Hole, walked onto from the strand at 3,7 alone, nothing within four squares${near.length ? ' (not ' + near.map((f) => `${f.x},${f.y}`).join(' ') + ')' : ''}`);

  // The edges: E4's north meets E3's south and its west D4's east, open at 0 to 10 on both, its sand at
  // 9,0 and 10,0 as E3's is; south against Wrackholm's E5 and east the sea, shut to every company.
  ok(row(out, e4, 0) === each(32, (i) => i <= 10) && row(out, e4, 0) === row(out, e3, 31) && col(out, e4, 0) === each(32, (i) => i <= 10) && col(out, e4, 0) === col(out, d4, 31),
    'E4 meets E3 at 0 to 10 and D4 at 0 to 10, square for square');
  const none = each(32, () => false);
  ok(row(out, e4, 31, ALL) === none && col(out, e4, 31, ALL) === none && row(out, e5, 0, ALL) === none && e4.y + e4.h === e5.y,
    'south against Wrackholm\'s E5 and east the sea, shut to every company');

  // Hag Hole, the lair (#845, #847): north from the strand at 3,7 in at the mouth. Its door says its band
  // and how it feels, as a border's line: the warning at E4's 4, harder at 28 and its band alone at 30.
  {
    const HH = MAP_DEFS.find((d) => d.id === 'hag_hole')!, mouth = E4.exits!.find((e) => e.to === HH.id)!;
    const levels = w.party.members.map((m) => m.level);
    const enter = (level: number): string => {
      for (const m of w.party.members) m.level = level;
      w.world.travel(E4.id, 3, 7, NORTH);
      const r = w.world.move('forward');
      return r.kind === 'moved' && w.world.state.mapId === HH.id && w.world.state.x === HH.start.x && w.world.state.y === HH.start.y && w.world.state.facing === NORTH ? r.messages.join(' | ') : r.kind;
    };
    const band = 'Hag Hole: levels 30-32.', low = enter(4), close = enter(28), at30 = enter(30);
    ok(low === `${mouth.label} | ${band} ${WARNING_IN}` && close === `${mouth.label} | ${band} ${HARDER_IN}` && at30 === `${mouth.label} | ${band}`,
      `north from the strand at 3,7 in at the mouth and Hag Hole, the way's own line and then its band, with the warning at 4, harder at 28 and nothing more at 30 (${low}; ${close}; ${at30})`);
    ok(!!HH.enclave && w.world.here.name === 'Hag Hole' && w.world.here.band?.join('-') === '30-32', `inside, its sign gives the cap's band, over E4's 4-5 (${w.world.here.name}, ${w.world.here.band?.join('-')})`);
    listen(w);
    w.level = 30;
    for (const id of ['hh_mouth', 'hh_tide', 'hh_narrows']) see(w, `${HH.id}:${id}`);
    // The guardian: the Hag, a boss that never comes back, in the narrows that are the one way to the
    // cave, so no company steps round it: with its square and those a step from it shut, nothing past it
    // is reached, walked, waded, climbed or floated. Won at the lair's floor.
    const hold = new GameMap(HH);
    const flood = (...shut: (readonly [number, number])[]): Set<string> => {
      const seen = new Set<string>(), todo: [number, number][] = [[HH.start.x, HH.start.y]];
      while (todo.length) {
        const [x, y] = todo.pop()!;
        if (seen.has(`${x},${y}`) || shut.some(([sx, sy]) => sx === x && sy === y) || hold.passable(x, y, ALL) !== 'ok') continue;
        seen.add(`${x},${y}`);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
      }
      return seen;
    };
    const hag = HH.encounters!.find((g) => g.id === 'hh_hag')!;
    const shut = flood([hag.x, hag.y], [hag.x - 1, hag.y], [hag.x + 1, hag.y], [hag.x, hag.y - 1], [hag.x, hag.y + 1]);
    ok(HH.encounters!.length === 1 && hag.monsters.join() === 'hag' && !!hag.boss && !hag.respawn && hag.roams === false && !!hag.slainText
      && shut.has('7,9') && !['7,6', '8,5', '9,5', '3,4', '3,2', '2,2'].some((k) => shut.has(k)),
      `the Hag, the one group of the lair, stands in the narrows: with it standing, none of Hag Hole's ${shut.size} squares walked, waded, climbed or floated reaches the cave, the wrack, the box, the lamp smoke or the ledge`);
    fight(w, `${HH.id}:hh_hag`);
    for (const id of ['hh_cave', 'hh_wrack']) see(w, `${HH.id}:${id}`);
    // The Hagstone in the box in the wrack, one in the world: no other chest, cairn or statue holds it, no
    // shop sells it and no monster drops it.
    const box = HH.features!.find((f) => f.kind === 'chest' && f.id === 'hh_box')!;
    const holds = (f: Feature): boolean => (f.kind === 'shop' && f.stock.includes('hagstone')) || ((f.kind === 'chest' || f.kind === 'cairn') && f !== box && f.items.includes('hagstone')) || (f.kind === 'statue' && !!f.gift?.items?.includes('hagstone'));
    ok(box.kind === 'chest' && box.gold === 0 && box.items.join() === 'hagstone' && !!ITEMS.hagstone.artifact
      && !MAP_DEFS.some((d) => (d.features ?? []).some(holds)) && !Object.values(MONSTERS).some((m) => m.drops?.some((x) => x.item === 'hagstone')),
      'in the wrack, the box of black wood with the Hagstone in it; no other chest, cairn or statue holds it, no shop sells it and no monster drops it');
    // The secret: the lamp smoke on the roof over the pool, the search at the fall of rock and the ledge
    // behind it. Walked, waded, climbed or floated, it is never reached but through the rock.
    const closed = flood([3, 3]);
    ok(closed.size > 20 && !['2,2', '3,2'].some((k) => closed.has(k)), `the ledge is shut but for its fall of rock: none of Hag Hole's ${closed.size} squares walked, waded, climbed or floated reaches it`);
    see(w, `${HH.id}:hh_smoke`);
    ok(search(w, HH.id, 3, 4, NORTH, 'hh_ledge'), 'searched under the lamp smoke, the fallen rock gives, and the ledge behind it can be walked onto');
    ok(stock(HH, 'hh_purse') === '500 ', `on the ledge, by the lamp burnt dry, a purse with 500 gold (${stock(HH, 'hh_purse')})`);
    // And out at the mouth onto the strand at 3,7, facing the sea, with the way's own line and no other.
    w.world.travel(HH.id, HH.start.x, HH.start.y - 1, SOUTH);
    const back = w.world.move('forward');
    ok(back.kind === 'moved' && w.world.zone?.id === E4.id && w.world.state.x === e4.x + 3 && w.world.state.y === e4.y + 7 && w.world.state.facing === SOUTH && back.messages.join(' | ') === HH.exits![0].label,
      `out at the mouth onto the strand at 3,7, facing the sea, the way's own line alone (${back.kind === 'moved' ? back.messages.join(' | ') : back.kind})`);
    listen(w);
    // The rumour (#846): the old man mending nets at Gullwick, met once, speaks at every meeting after it,
    // after his song, of his gran's holed stone, words only: no flag or question comes with them, no quest
    // names it, each line is two of the log's at most and it fits his box.
    const mender = MAP_DEFS.find((d) => d.id === 'downs_f3')!.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'An old man mending nets')!;
    const words = mender.says!.find((s) => s.lines.some((l) => l.includes('My gran')))!, own = mender.lines.join('\n\n'), lines = wrap(words.lines.join('\n\n'), SAY_W).length;
    const gran = ['"My gran had a stone with a hole worn through it. Nothing sat on her chest of a night, she said, and nothing held her."', '"She was buried without it, and nobody would say where it went."'];
    delete w.party.flags.netmender_met;
    w.world.travel('downs_f3', mender.x, mender.y);
    const first = meet(mender, w.party, heard(w.world, mender)).text, then = meet(mender, w.party, heard(w.world, mender)).text;
    ok(first === own && then === [own, ...gran].join('\n\n') && words.lines.slice(-2).join() === gran.join() && gran.every((l) => logLines(l).length <= 2)
      && !words.sets && !words.choice && lines <= SAY_LINES && !JSON.stringify(questLog(TABLES, w.world.state, w.party)).includes('hole worn'),
      `the old man says nothing of the stone at his first meeting, his song, and at the next sings it and speaks of his gran's stone: words only, in no quest, ${lines} of his box's ${SAY_LINES} lines`);
    listen(w);
    delete w.party.flags.netmender_met;
    w.party.members.forEach((m, i) => { m.level = levels[i]; });
    w.level = 4;
  }
}

/**
 * Down into the Berth from the chalk of D2 at its floor, past the guard two by two to the bier: the
 * Queen seen writes the chapter's step (#70), and the captain behind her is won there.
 */
function berth(w: Walk): void {
  walkThrough(w, 'downs_d2', 13, 12, WEST, 'berth');
  w.level = MAP_DEFS.find((d) => d.id === 'berth')!.band![0];
  for (const g of ['berth_guard1', 'berth_guard2', 'berth_guard3', 'berth_guard4']) fight(w, `berth:${g}`);
  see(w, 'berth:berth_bier');
  fight(w, 'berth:berth_captain');
  const ids = quest(w)?.pages.find((p) => p.def === CHAPTER)?.entries.map((e) => e.id) ?? [];
  w.ok(ids.includes('berth'), `the Queen on her bier in the Berth writes the chapter's step (${ids.join(', ')})`);
  // None of them comes back (EXPANSION §5.1): two days on, the captain and his guard are still dead.
  w.world.advance(2 * 1440);
  const back = w.world.liveGroups().map((g) => g.def.id).filter((id) => id.startsWith('berth_'));
  w.ok(back.length === 0, `two days on, the Berth's captain and its four pairs of guards stay dead${back.length ? ' -> ' + back.join(', ') : ''}`);
}

/**
 * The walk to Ashcombe (#87), once, and what it pays a member of six: the Foreland map's groups,
 * F2's and F3's by day and the farm's rats. It is worth level 2 and not 3, where the Foreland map
 * alone was not worth 2: the first job is earned on the road to it.
 */
function walkWorth(ok: (cond: boolean, msg: string) => void): void {
  const xp = (map: string, keep: (e: { id: string; when?: unknown }) => boolean = () => true): number =>
    (MAP_DEFS.find((d) => d.id === map)?.encounters ?? []).filter(keep).flatMap((e) => e.monsters).reduce((t, m) => t + MONSTERS[m].xp, 0);
  const foreland = Math.floor(xp('shelf') / 6);
  const walk = Math.floor((xp('shelf') + xp('downs_f2', (e) => !e.when) + xp('downs_f3', (e) => !e.when) + xp('downs_e3', (e) => e.id === 'farm_rats')) / 6);
  ok(walk >= xpForLevel(2) && walk < xpForLevel(3) && foreland < xpForLevel(2),
    `the walk to Ashcombe is worth level 2: ${walk} xp a member (level 2 at ${xpForLevel(2)}, 3 at ${xpForLevel(3)}), where the Foreland map alone is ${foreland}`);
  // On the way out of the Foreland, the one place outside Helmstow that sells food.
  const shop = (map: string) => MAP_DEFS.find((d) => d.id === map)?.features?.find((f) => f.kind === 'shop');
  const farm = shop('shelf'), mottram = shop('harrow');
  ok(farm?.kind === 'shop' && farm.name === 'Ellerby Farm' && farm.interior === 'farm_kitchen' && priceIn(TABLES.items, farm, 'rations') === 3 && mottram?.kind === 'shop' && priceIn(TABLES.items, mottram, 'rations') === 4,
    `Ellerby's farm store sells rations at 3 gold, in the farm kitchen, and Mottram's still at 4 (${farm?.kind === 'shop' ? priceIn(TABLES.items, farm, 'rations') : 'no store'}, ${mottram?.kind === 'shop' ? priceIn(TABLES.items, mottram, 'rations') : 'no shop'})`);
}

/** Gytha, found by the flag she sets. */
function gytha(): Person | undefined {
  return MAP_DEFS.flatMap((d) => d.features ?? []).find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes('q_lodestone'));
}

/**
 * Out of Helmstow's south gate, east along the track to the Lodestone: the stone said once, in two
 * lines of the log at most, and Gytha at its foot. Her lesson first, then every later visit's
 * words, the cut's once Sylvane has spoken and the chisel's once she has it.
 */
function lodestone(w: Walk, how: string): void {
  const ok = w.ok;
  walkThrough(w, 'harrow', 7, 14, SOUTH, 'shelf');
  w.world.turn('left');
  const said: string[] = [];
  for (let i = 0; i < 4; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
  const stone = said.find((m) => m.startsWith('The Lodestone.'));
  ok(!!stone && logLines(stone).length <= 2, `${how}: four steps east of the south gate the Lodestone is said, in ${stone ? logLines(stone).length : 0} lines of the log`);
  w.world.move('forward');
  // Stepping onto her square is meeting her, as it is in the game.
  const g = gytha(), here = w.world.map.featuresAt(w.world.state.x, w.world.state.y).find((f) => f.kind === 'npc');
  ok(!!g && here?.kind === 'npc' && here.name === g.name, `${how}: at the track's end, at the stone's foot, is Gytha (${here && 'name' in here ? here.name : 'nobody'})`);
  if (!g) return;
  const talk = (): string => meet(g, w.party, heard(w.world, g)).text;
  const lines = (t: string): number => wrap(t, SAY_W).length;
  const first = talk();
  ok(first.includes("That's a Stone, whole.") && !!w.party.flags.q_lodestone && lines(first) <= SAY_LINES, `${how}: Gytha gives the lesson, in ${lines(first)} of the box's ${SAY_LINES} lines, and a company that has heard it is known`);
  const again = talk();
  ok(again.includes('Still whole.'), `${how}: met again, she says it is still whole (${lines(again)} lines)`);
  meetWho(w, 'q_grove');
  const cut = talk();
  ok(cut.includes('Cut. With tools.'), `${how}: once Sylvane has spoken, Gytha has heard the Stone is cut (${lines(cut)} lines)`);
  w.party.bag.push('ashen_chisel');
  meetWho(w, 'ashen_chisel');
  const mended = talk();
  ok(mended.includes('second stool') && !mended.includes('Cut. With tools.'), `${how}: once Sylvane has the chisel, its words take the cut's place (${lines(mended)} lines)`);
}

// ---- the side quests (#77) ----


const MAUD = (): Person => who('harrow', 12, 13, 'Maud');
const EBBA_EEL = (): Person => who('harrow', 12, 13, 'Ebba'), EBBA_CHAPEL = (): Person => who('harrow', 11, 4, 'Ebba');
const FISHERMAN = (): Person => who('harrow', 12, 13, 'the fisherman'), WALL = (): Person => who('harrow', 14, 3, 'a Warden on the wall');
const HOB = (): Person => who('harrow', 4, 4, 'Hob'), HOB_GULLWICK = (): Person => who('downs_f3', 7, 14, 'Hob');
const MOTTRAM = (): Person => who('harrow', 4, 10, 'Mottram'), ALWIN = (): Person => who('harrow', 9, 1, 'Alwin');
const OSMUND = (): Person => who('harrow', 11, 4, 'Osmund'), AILITH_WOOD = (): Person => who('shelf', 2, 14, 'Ailith'), AILITH_HOLD = (): Person => who('thornhold', 11, 4, 'Ailith');

const WAT = (): Person => who('downs_f3', 11, 14, 'Wat'), HAMO = (): Person => who('downs_f3', 0, 9, 'Hamo');
const ALDRED = (): Person => who('downs_e3', 18, 28, 'Aldred'), VASK = (): Person => who('keep', 7, 4, 'Lord Aumery Vask');

/** Whether a four-way walk from `from` reaches `to` on `map` without stepping on `shut`. */
function around(map: string, shut: Person, from: readonly [number, number], to: Person): boolean {
  const m = new GameMap(MAP_DEFS.find((d) => d.id === map)!), seen = new Set([from.join()]), q: [number, number][] = [[from[0], from[1]]];
  while (q.length) {
    const [x, y] = q.shift()!;
    if (x === to.x && y === to.y) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
      if (seen.has(k) || (nx === shut.x && ny === shut.y) || m.passable(nx, ny) !== 'ok') continue;
      seen.add(k); q.push([nx, ny]);
    }
  }
  return false;
}


/** Meet the person `meetWho` finds by `what`, and answer the question they put with `label`. */
function answerWho(w: Walk, what: Flag, label: string): string {
  const d = MAP_DEFS.find((m) => m.features?.some((f) => f.kind === 'npc' && [f.flag ?? []].flat().includes(what)))!;
  const p = d.features!.find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes(what))!;
  w.world.travel(d.id, p.x, p.y);
  const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => x.label === label);
  w.ok(!!a, `${p.name.split(',')[0]} asks, and '${label}' is an answer (${m.choice?.ask ?? 'no question'})`);
  const said = a ? answer(TABLES.items, a, w.party) : '';
  listen(w);
  return said;
}


/** The Clerk's Seal to the seal in hand: the coat among the drowned, the strongbox and its chest. */
function sealFound(w: Walk): void {
  see(w, 'greywater1:gw1_coat');
  see(w, 'greywater1:gw1_strongbox');
  w.ok(w.world.used('gw1_strongbox'), 'the strongbox is opened and its words said');
  open(w, 'greywater1:gw1_seal');
  w.ok(w.party.bag.includes('clerks_seal'), "the strongbox holds the clerk's seal");
}



/** The Bell That Rang Twice to its choice: Osmund hires, the boats and the wall, Ebba confesses. */
function bellAsked(w: Walk): void {
  w.ok(!there(w, 'harrow', FISHERMAN()) && !there(w, 'harrow', WALL()), 'before the bell is asked after, neither the fisherman nor the Warden on the wall is there');
  meetWho(w, 'q_bell');
  w.ok(w.news.at(-1) === 'New quest: The Bell That Rang Twice.' && !!page(w, 'bell')?.goal, `Osmund's first meeting begins The Bell That Rang Twice, with a goal (${w.news.at(-1)})`);
  meetWho(w, 'q_bell_boats');
  meetWho(w, 'q_bell_wall');
  const confession = hear(w, 'harrow', EBBA_EEL());
  w.ok(confession.startsWith('The Lantern adjunct at the corner table') && !!w.party.flags.q_bell_ebba && !w.party.flags.q_survey, 'with the boats and the wall heard, Ebba at the Eel confesses, and does not ask after the survey');
}


/** Whether an event of Helmstow's is there to be seen now. */
const inHarrow = (w: Walk, id: string): boolean => { const e = MAP_DEFS.find((d) => d.id === 'harrow')!.features!.find((f) => f.kind === 'event' && f.id === id)!; return w.world.present(e); };

/** The Well Tastes of Iron to its question: Mottram hires, and by night the cart and Alwin at the gatehouse. */
function wellAsked(w: Walk, alwinFirst: boolean): void {
  clock(w, 12);
  w.ok(!there(w, 'harrow', ALWIN()) && !inHarrow(w, 'well_cart'), 'by day neither Alwin nor the cart is at the gatehouse');
  const hire = (): void => {
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('Mottram sets a bucket') && w.news.at(-1) === 'New quest: The Well Tastes of Iron.' && !!page(w, 'well')?.goal,
      `Mottram's first meeting begins The Well Tastes of Iron, with a goal (${w.news.at(-1)})`);
  };
  if (!alwinFirst) hire();
  clock(w, 0);
  see(w, 'harrow:well_cart');
  w.ok(w.world.used('well_cart'), 'by night the cart leaves the gatehouse');
  w.ok(there(w, 'harrow', ALWIN()) && hear(w, 'harrow', ALWIN()).startsWith('A big man in Warden grey') && !!w.party.flags.q_well_alwin, 'by night Alwin stands by the cart, and says what is under the keep');
  if (alwinFirst) hire();
  w.ok(page(w, 'well')?.goal === 'Take what the mason said back to Mottram\'s Stores.', `the mason heard, the goal is Mottram (${page(w, 'well')?.goal})`);
}

/** Whether the lamp room at Crowness shows its dark words or its lit ones now. */
const lamp = (w: Walk): string => {
  const e = MAP_DEFS.find((d) => d.id === 'downs_e3')!.features!.filter((f) => f.kind === 'event' && f.id.startsWith('e3_lamp_'));
  return e.filter((f) => w.world.present(f)).map((f) => (f as { id: string }).id).join() || 'none';
};

/** Oil for the Lamp to Mottram's question: Aldred first, then Mottram, who hires for the well first. */
function oilAsked(w: Walk): void {
  w.ok(lamp(w) === 'e3_lamp_dark', `before the oil, the lamp room is dark (${lamp(w)})`);
  w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('The lamp room at the top of the tower is dark') && w.news.at(-1) === 'New quest: Oil for the Lamp.' && !!page(w, 'oil')?.goal,
    `Aldred's first meeting begins Oil for the Lamp, with a goal (${w.news.at(-1)})`);
  w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('"Still dark.'), "then, while it is dark, his words of the second light");
  w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('Mottram sets a bucket') && !!w.party.flags.q_well, 'Aldred met first, Mottram still hires for the well at the first meeting');
}

/** Who Lived at Ashcombe to the key in hand: the kitchen at the farmhouse's back and its chest. */
function keyFound(w: Walk): void {
  see(w, 'downs_e3:ash_kitchen');
  w.ok(w.world.used('ash_kitchen'), 'the kitchen is seen and its words said');
  open(w, 'downs_e3:ash_hearth');
  w.ok(w.party.bag.includes('hearth_key'), 'the kitchen chimney holds the hearth-key');
}

/** The paper in hand: the crock beside the kitchen and its chest. */
function paperFound(w: Walk): void {
  see(w, 'downs_e3:ash_crock');
  w.ok(w.world.used('ash_crock'), 'the crock is lifted and its words said');
  open(w, 'downs_e3:ash_crock_c');
  w.ok(w.party.bag.includes('tenant_paper'), "under the crock is the tenant's paper");
}

/** Who Lived at Ashcombe to the paper in hand: Hob hires, takes his key and talks; the paper found. */
function tenantAsked(w: Walk): void {
  meetWho(w, 'q_ashcombe_who');
  w.ok(w.news.at(-1) === 'New quest: Who Lived at Ashcombe.' && !!page(w, 'tenant')?.goal, `Hob's first meeting begins Who Lived at Ashcombe, with a goal (${w.news.at(-1)})`);
  keyFound(w);
  const told = hear(w, 'harrow', HOB());
  w.ok(told.startsWith('Hob looks at the hearth-key') && !w.party.bag.includes('hearth_key') && !!w.party.flags.q_hob_key, 'Hob takes his key and says who took his cellar');
  w.ok(hear(w, 'harrow', HOB()).startsWith('"Still here.'), 'met again, he is still here');
  paperFound(w);
}

function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  { // Oil for the Lamp: bought and carried down. The lamp is lit, and both have heard.
    const w = newWalk(ok);
    oilAsked(w);
    w.ok(answerWho(w, 'q_well', 'We\'ll buy the oil.').startsWith('"Sensible.'), 'bought: Mottram will sell the oil');
    w.ok(page(w, 'oil')?.goal?.startsWith('Buy a flask') === true, `bought: the goal is the flask (${page(w, 'oil')?.goal})`);
    w.party.bag.push('lantern_oil'); // from Mottram's shelf, at 40
    w.ok(page(w, 'oil')?.goal?.startsWith('Carry the Lantern Oil') === true, `with the oil in the pack, the goal is Aldred (${page(w, 'oil')?.goal})`);
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('Aldred takes the flask') && !w.party.bag.includes('lantern_oil'), 'bought: Aldred takes the flask and lights the lamp');
    reads(w, 'oil', ['aldred', 'buy', 'lit'], ['vask', 'order'], 'bought');
    w.ok(lamp(w) === 'e3_lamp_lit', `bought: the lamp room is lit (${lamp(w)})`);
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('The lamp turns overhead, and Aldred has the look'), "bought: Aldred's after-lines are the company's oil");
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"Lit, is it?') && hear(w, 'harrow', MOTTRAM()).startsWith('Mottram sets a bucket'), 'bought: Mottram has heard, says so once, and then as before');
  }
  { // Oil for the Lamp: put to Vask. His order lights it; Aldred and Mottram say what it cost.
    const w = newWalk(ok);
    oilAsked(w);
    answerWho(w, 'q_well', 'We\'ll put it to Vask.');
    w.ok(page(w, 'oil')?.goal?.startsWith('Put the keeper\'s oil to Lord Vask') === true, `put to Vask: the goal is Vask (${page(w, 'oil')?.goal})`);
    w.ok(hear(w, 'keep', VASK()).startsWith('Vask hears you out') && !!w.party.flags.q_oil_lit, 'put to Vask: he lifts the order, and the lamp is lit');
    w.ok(hear(w, 'keep', VASK()).startsWith('A tall man in Warden grey'), 'put to Vask: his words are said once');
    reads(w, 'oil', ['aldred', 'vask', 'order', 'lit'], ['buy'], 'put to Vask');
    w.ok(lamp(w) === 'e3_lamp_lit', `put to Vask: the lamp room is lit (${lamp(w)})`);
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('The lamp turns overhead. Aldred does not look up'), "put to Vask: Aldred's after-lines are the Crown's");
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"The sergeant came back') && hear(w, 'harrow', MOTTRAM()).startsWith('Mottram sets a bucket'), 'put to Vask: Mottram has seen the sergeant back for his paper, says so once, and then as before');
  }
  { // Oil for the Lamp: put to Vask, but the oil carried in first. The company lit it, and the order's words lapse.
    const w = newWalk(ok);
    oilAsked(w);
    answerWho(w, 'q_well', 'We\'ll put it to Vask.');
    w.party.bag.push('lantern_oil');
    hear(w, 'downs_e3', ALDRED());
    w.ok(hear(w, 'keep', VASK()).startsWith('A tall man in Warden grey') && !w.party.flags.q_oil_order, 'put to Vask, then lit with oil carried in: Vask has nothing to lift');
    reads(w, 'oil', ['aldred', 'vask', 'lit'], ['buy', 'order'], 'put to Vask, lit with oil');
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('The lamp turns overhead, and Aldred has the look'), "and Aldred's after-lines are the company's oil");
  }
  { // Oil for the Lamp: oil carried in at the first meeting. Aldred takes it, and never asks.
    const w = newWalk(ok);
    w.party.bag.push('lantern_oil'); // found in Thornmark, or bought at Thornhold
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('Aldred takes the flask') && !w.party.flags.q_keeper && !w.party.flags.q_oil, 'carried in: Aldred takes the flask at the first meeting, and asks nothing');
    reads(w, 'oil', ['lit'], ['aldred', 'buy', 'vask', 'order'], 'carried in');
    w.ok(lamp(w) === 'e3_lamp_lit' && hear(w, 'downs_e3', ALDRED()).startsWith('The lamp turns overhead, and Aldred has the look'), 'carried in: the lamp room is lit, and his after-lines are the company\'s oil');
  }
  { // The Boat: nobody who buys the boards stands where every way home from the hoard must pass.
    const w = newWalk(ok);
    w.ok(around('downs_f3', HAMO(), [1, 14], WAT()), 'the boards go home from the hoard to Wat by a way that never steps on Hamo');
  }
  { // The Boat: the boards home to Wat. Hamo has heard, and Wat's after-lines are home's.
    const w = newWalk(ok);
    w.ok(hear(w, 'downs_f3', WAT()).startsWith('An old man sits') && w.news.at(-1) === 'New quest: A Boat With No Name-Board.', 'Wat begins the Boat');
    see(w, 'downs_f3:f3_hoard');
    open(w, 'downs_f3:f3_hoard_chest');
    w.ok((readText(TABLES.items, 'customs_chit') ?? []).length === 2 && w.party.bag.includes('name_boards'), 'the hoard holds the boards, and the chit reads from the pack');
    const gold = w.party.gold;
    w.ok(hear(w, 'downs_f3', WAT()).startsWith('Wat turns the board over') && w.party.gold === gold + 60, 'home: Wat takes the boards and pays 60');
    reads(w, 'board', ['wat', 'hoard', 'chit', 'home'], ['sold'], 'home');
    w.ok(hear(w, 'downs_f3', HAMO()).startsWith('"I heard the boards went up') && hear(w, 'downs_f3', WAT()).startsWith('"Up in the loft'), "home: Hamo has heard, and Wat's after-lines are home's");
  }
  { // The Boat: the boards sold to Hamo. Wat knows, and Hamo's after-lines are the sale's.
    const w = newWalk(ok);
    hear(w, 'downs_f3', WAT());
    see(w, 'downs_f3:f3_hoard');
    open(w, 'downs_f3:f3_hoard_chest');
    const gold = w.party.gold;
    w.ok(hear(w, 'downs_f3', HAMO()).startsWith('Hamo counts the coin') && w.party.gold === gold + 140, 'sold: Hamo takes the boards and pays 140');
    reads(w, 'board', ['wat', 'hoard', 'chit', 'sold'], ['home'], 'sold');
    w.ok(hear(w, 'downs_f3', WAT()).startsWith('"You sold them."') && hear(w, 'downs_f3', HAMO()).startsWith('"Still here.'), "sold: Wat knows, and Hamo's after-lines are the sale's");
  }
  { // The Boat: the hoard first. The chest begins it, and Wat takes the boards at the first meeting.
    const w = newWalk(ok);
    open(w, 'downs_f3:f3_hoard_chest');
    w.ok(w.news.at(-1) === 'New quest: A Boat With No Name-Board.', 'the hoard first begins the Boat');
    w.ok(hear(w, 'downs_f3', WAT()).startsWith('Wat turns the board over'), 'the hoard first: Wat takes the boards at the first meeting');
    reads(w, 'board', ['hoard', 'chit', 'home'], ['wat', 'sold'], 'the hoard first');
  }
  { // The bell: the name given. Ebba is gone from the Eel and never in the Chapel.
    const w = newWalk(ok);
    bellAsked(w);
    const said = answerWho(w, 'q_bell', 'The adjunct, Ebba.');
    w.ok(said.startsWith('"A Lantern. Under my own roof."'), 'the name given, Osmund writes it');
    reads(w, 'bell', ['osmund', 'boats', 'wall', 'ebba', 'named'], ['kept'], 'the name given');
    w.ok(!there(w, 'harrow', EBBA_EEL()) && !there(w, 'harrow', EBBA_CHAPEL()), 'the name given, Ebba is gone from the Eel and is not in the Chapel');
    w.ok(!there(w, 'harrow', FISHERMAN()) && !there(w, 'harrow', WALL()), 'the name given, the fisherman and the Warden on the wall are gone');
    w.ok(hear(w, 'harrow', OSMUND()).startsWith('"They took her to the keep'), "and Osmund's after-lines are the name given's");
  }
  { // The bell: the name kept. Ebba moves to the Chapel, says what she saw of Vask, then asks after the survey.
    const w = newWalk(ok);
    bellAsked(w);
    answerWho(w, 'q_bell', "We couldn't find out.");
    reads(w, 'bell', ['osmund', 'boats', 'wall', 'ebba', 'kept'], ['named'], 'the name kept');
    w.ok(!there(w, 'harrow', EBBA_EEL()) && there(w, 'harrow', EBBA_CHAPEL()), 'the name kept, Ebba is gone from the Eel and in the Chapel');
    w.ok(!there(w, 'harrow', FISHERMAN()) && !there(w, 'harrow', WALL()), 'the name kept, the fisherman and the Warden on the wall are gone');
    w.ok(hear(w, 'harrow', OSMUND()).startsWith('"Rang itself. It\'s in the book'), "Osmund's after-lines are the name kept's");
    w.ok(hear(w, 'harrow', EBBA_CHAPEL()).startsWith('Ebba is in the Chapel, sober') && !!w.party.flags.q_ebba_chapel, 'in the Chapel Ebba first says what she saw of Vask');
    const survey = hear(w, 'harrow', EBBA_CHAPEL());
    w.ok(survey.startsWith('"The survey team.') && w.news.at(-1) === 'New quest: The Rest of the Survey.' && !!page(w, 'survey')?.goal, `then asks after the survey, and The Rest of the Survey begins with a goal (${w.news.at(-1)})`);
    // The survey from the Chapel: Ailith to Thornhold.
    see(w, 'shelf:survey_ring');
    w.ok(there(w, 'shelf', AILITH_WOOD()) && !there(w, 'thornhold', AILITH_HOLD()), 'Ailith is in the woods, not at Thornhold');
    answerWho(w, 'q_ailith', 'Thornhold, over the Scarth.');
    reads(w, 'survey', ['ebba', 'ring', 'ailith', 'thornhold'], ['chapel'], 'Ailith sent to Thornhold, from the Chapel');
    w.ok(!there(w, 'shelf', AILITH_WOOD()) && there(w, 'thornhold', AILITH_HOLD()), 'then Ailith is gone from the woods and in the Chapterhouse at Thornhold');
    w.ok(hear(w, 'thornhold', AILITH_HOLD()).startsWith('Ailith is in the Chapterhouse') && hear(w, 'harrow', EBBA_CHAPEL()).startsWith('"Thornhold. Good.'), 'Ailith speaks at Thornhold, and Ebba in the Chapel has heard');
  }
  { // The survey from Ebba at the Eel, before any bell: Ailith to the Chapel.
    const w = newWalk(ok);
    const survey = hear(w, 'harrow', EBBA_EEL());
    w.ok(survey.startsWith('"The survey team.') && w.news.at(-1) === 'New quest: The Rest of the Survey.', `Ebba at the Eel, at a first meeting, asks after the survey and begins The Rest of the Survey (${w.news.at(-1)})`);
    answerWho(w, 'q_ailith', 'The Chapel, in Helmstow.');
    // The fire-ring stepped on after she is sent writes nothing into a finished journal.
    see(w, 'shelf:survey_ring');
    reads(w, 'survey', ['ebba', 'ailith', 'chapel'], ['thornhold', 'ring'], 'Ailith sent to the Chapel, from the Eel, the fire-ring seen after');
    w.ok(!there(w, 'shelf', AILITH_WOOD()) && !there(w, 'thornhold', AILITH_HOLD()), 'then Ailith is not seen again');
    w.ok(hear(w, 'harrow', EBBA_EEL()).startsWith('"She came home, and then the Wardens came."'), 'and Ebba at the Eel has heard');
    // Osmund, never met, hires for the bell first, then says his line about her, once.
    const first = hear(w, 'harrow', OSMUND()), second = hear(w, 'harrow', OSMUND()), third = hear(w, 'harrow', OSMUND());
    w.ok(first.startsWith('A thin man in a leather apron') && second.startsWith('"The survey adjunct?') && third.startsWith('A thin man in a leather apron'), "Osmund's first meeting comes first, then his line about Ailith, once");
  }
  { // The survey from the woods alone, after the bell's name was given: Ebba is gone, and the woods begin it.
    const w = newWalk(ok);
    bellAsked(w);
    answerWho(w, 'q_bell', 'The adjunct, Ebba.');
    see(w, 'shelf:survey_ring');
    const goal = page(w, 'survey')?.goal ?? '';
    w.ok(w.news.at(-1) === 'New quest: The Rest of the Survey.' && goal.startsWith('Find whoever lit the fire-ring') && !goal.includes('Ailith'), `with Ebba gone, the woods alone begin The Rest of the Survey, with a goal that does not name her (${goal})`);
    answerWho(w, 'q_ailith', 'Thornhold, over the Scarth.');
    reads(w, 'survey', ['ring', 'ailith', 'thornhold'], ['ebba', 'chapel'], 'Ailith sent to Thornhold, from the woods');
  }
  { // Ailith sent to Thornhold before the bell is answered, then the name kept: in the Chapel, Ebba
    // still says what she saw of Vask first, then what she has heard of Ailith.
    const w = newWalk(ok);
    answerWho(w, 'q_ailith', 'Thornhold, over the Scarth.');
    bellAsked(w);
    answerWho(w, 'q_bell', "We couldn't find out.");
    const first = hear(w, 'harrow', EBBA_CHAPEL()), then = hear(w, 'harrow', EBBA_CHAPEL());
    w.ok(first.startsWith('Ebba is in the Chapel, sober') && then.startsWith('"Thornhold. Good.'), 'Ailith sent first, Ebba in the Chapel says what she saw of Vask first, then what she has heard');
  }
  { // The seal to Maud: she pays, says her last words once, and is gone.
    const w = newWalk(ok);
    meetWho(w, 'q_seal');
    w.ok(w.news.at(-1) === 'New quest: The Clerk\'s Seal.' && !!page(w, 'seal')?.goal, `Maud's first meeting begins The Clerk's Seal, with a goal (${w.news.at(-1)})`);
    sealFound(w);
    const gold = w.party.gold;
    meetWho(w, 'q_seal_maud');
    w.ok(w.party.gold === gold + 150 && !w.party.bag.includes('clerks_seal'), 'Maud takes the seal and pays 150');
    reads(w, 'seal', ['maud', 'coat', 'seal', 'sold'], ['hale'], 'the seal to Maud');
    w.ok(there(w, 'harrow', MAUD()) && hear(w, 'harrow', MAUD()).startsWith('"Sold.') && !there(w, 'harrow', MAUD()), 'Maud says her last words once, and is gone from the Eel');
  }
  { // The seal to Hale: he takes it as his second hand-in and pays; Maud's last words are the Warden's.
    const w = newWalk(ok);
    meetWho(w, 'q_seal');
    sealFound(w);
    const gold = w.party.gold;
    meetWho(w, 'q_seal_hale');
    w.ok(w.party.gold === gold + 150 && !w.party.bag.includes('clerks_seal') && !w.party.flags.q_greywater_done, 'Hale takes the seal, without the ledger, and pays 150');
    reads(w, 'seal', ['maud', 'coat', 'seal', 'hale'], ['sold'], 'the seal to Hale');
    w.ok(hear(w, 'harrow', MAUD()).startsWith('"You gave it to the Warden."') && !there(w, 'harrow', MAUD()), 'Maud says her last words once, and is gone from the Eel');
  }
  { // The seal found with no word from Maud, taken to Hale: the quest shows done, and Maud, met
    // after, asks after Edwin once and then says her last words.
    const w = newWalk(ok);
    sealFound(w);
    meetWho(w, 'q_seal_hale');
    reads(w, 'seal', ['coat', 'seal', 'hale'], ['maud', 'sold'], 'the seal to Hale, Maud never met');
    const first = hear(w, 'harrow', MAUD()), last = hear(w, 'harrow', MAUD());
    w.ok(first.startsWith('A woman in a good plain dress') && last.startsWith('"You gave it to the Warden."') && !there(w, 'harrow', MAUD()), 'Maud met after asks after Edwin first, then says her last words, and is gone');
  }
  { // The well: the Wardens told. Alwin and the cart are gone, and the gatehouse is swept.
    const w = newWalk(ok);
    wellAsked(w, false);
    const said = answerWho(w, 'q_well', 'The Wardens.');
    w.ok(said.startsWith('"The Wardens. Good. Yes."'), 'the Wardens told, Mottram breathes out');
    reads(w, 'well', ['mottram', 'alwin', 'wardens'], ['lanterns'], 'the Wardens told');
    clock(w, 12);
    w.ok(!inHarrow(w, 'well_swept'), 'the Wardens told, by day the gatehouse is not swept');
    clock(w, 0);
    w.ok(!there(w, 'harrow', ALWIN()) && !inHarrow(w, 'well_cart'), 'the Wardens told, by night Alwin and the cart are gone');
    see(w, 'harrow:well_swept');
    w.ok(w.world.used('well_swept'), 'and the gatehouse is swept');
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"Still iron." He does not offer'), "Mottram's after-lines are the Wardens'");
    const first = hear(w, 'harrow', OSMUND()), then = hear(w, 'harrow', OSMUND());
    w.ok(first.startsWith('A thin man in a leather apron') && then.startsWith('A thin man in a leather apron') && !w.party.flags.q_osmund_well, 'and Osmund, met twice, has nothing written');
  }
  { // The well: Alwin met before Mottram, the Lanterns told. Mottram hires first; Osmund writes it down.
    const w = newWalk(ok);
    wellAsked(w, true);
    answerWho(w, 'q_well', 'The Lanterns.');
    reads(w, 'well', ['mottram', 'alwin', 'lanterns'], ['wardens'], 'the Lanterns told');
    clock(w, 0);
    w.ok(there(w, 'harrow', ALWIN()) && inHarrow(w, 'well_cart') && !inHarrow(w, 'well_swept'), 'the Lanterns told, by night Alwin and the cart are still there, and nothing is swept');
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"Still iron. It\'s in a book now'), "Mottram's after-lines are the Lanterns'");
    const first = hear(w, 'harrow', OSMUND()), record = hear(w, 'harrow', OSMUND()), then = hear(w, 'harrow', OSMUND());
    w.ok(first.startsWith('A thin man in a leather apron') && record.startsWith('"Written. Stone dust') && then.startsWith('A thin man in a leather apron'), "Osmund's first meeting comes first, then his record, once");
  }
  { // The paper to Vask: he pays; Hob is gone from the inn, and his empty chair is said once.
    const w = newWalk(ok);
    w.ok(!there(w, 'downs_f3', HOB_GULLWICK()), 'before the paper is given, Hob is not at Gullwick');
    tenantAsked(w);
    const gold = w.party.gold;
    toVask(w);
    w.ok(w.party.gold === gold + 50 && !w.party.bag.includes('tenant_paper') && !w.party.flags.q_ashcombe_done, 'Vask takes the paper, without the wand, and pays 50');
    reads(w, 'tenant', ['hob', 'kitchen', 'key', 'paper', 'vask'], ['hale'], 'the paper to Vask');
    w.ok(!there(w, 'harrow', HOB()) && !there(w, 'downs_f3', HOB_GULLWICK()), 'the paper to Vask, Hob is gone from the inn and not at Gullwick');
    see(w, 'harrow:hob_chair');
    const again = (w.world.travel('harrow', 4, 4), w.world.eventsHere());
    w.ok(w.world.used('hob_chair') && again.length === 0, 'and his empty chair is said once');
  }
  { // The paper to Hale: he takes it as his third hand-in and pays; Hob is gone, and no chair is said.
    const w = newWalk(ok);
    tenantAsked(w);
    const gold = w.party.gold;
    meetWho(w, 'q_paper_hale');
    w.ok(w.party.gold === gold + 50 && !w.party.bag.includes('tenant_paper') && !w.party.flags.q_greywater_done, 'Hale takes the paper, without the ledger, and pays 50');
    reads(w, 'tenant', ['hob', 'kitchen', 'key', 'paper', 'hale'], ['vask'], 'the paper to Hale');
    w.ok(!there(w, 'harrow', HOB()) && there(w, 'downs_f3', HOB_GULLWICK()), 'the paper to Hale, Hob is gone from the inn and on the shingle at Gullwick');
    w.ok(hear(w, 'downs_f3', HOB_GULLWICK()).startsWith('Hob is on the shingle at Gullwick'), 'where he says he stayed');
    see(w, 'harrow:hob_chair');
    w.ok(!w.world.used('hob_chair'), 'and no empty chair is said');
  }
  { // The crock alone, the paper to Vask: nothing on the way names Hob, and the kitchen after writes nothing.
    const w = newWalk(ok);
    paperFound(w);
    toVask(w);
    reads(w, 'tenant', ['paper', 'vask'], ['hob', 'kitchen', 'key', 'hale'], 'the crock alone, the paper to Vask');
    w.ok(!page(w, 'tenant')?.entries.some((e) => e.text.includes('Hob')), 'and its journal does not name Hob, whom the company never met');
    see(w, 'downs_e3:ash_kitchen');
    w.ok(!w.world.used('ash_kitchen') && !page(w, 'tenant')?.entries.some((e) => e.id === 'kitchen'), 'the kitchen stepped into after the paper is given is not said, and writes nothing');
  }
  { // The key brought to Hob before he is heard: the hand-in begins the quest, and his after-lines follow.
    const w = newWalk(ok);
    keyFound(w);
    const told = hear(w, 'harrow', HOB());
    w.ok(told.startsWith('Hob looks at the hearth-key') && w.news.at(-1) === 'New quest: Who Lived at Ashcombe.' && !!page(w, 'tenant')?.goal, `Hob given his key unasked takes it and begins Who Lived at Ashcombe, with a goal (${w.news.at(-1)})`);
    w.ok(hear(w, 'harrow', HOB()).startsWith('"Still here.'), 'met again, he is still here');
    paperFound(w);
    toVask(w);
    reads(w, 'tenant', ['kitchen', 'key', 'paper', 'vask'], ['hob', 'hale'], 'the paper to Vask, Hob never hired');
  }
  { // Ailith met first, with no word from anyone: her meeting begins the quest; Esc puts her question again.
    const w = newWalk(ok);
    const ailith = AILITH_WOOD();
    w.world.travel('shelf', ailith.x, ailith.y);
    const m = meet(ailith, w.party, heard(w.world, ailith));
    listen(w);
    w.ok(!!m.choice && w.news.at(-1) === 'New quest: The Rest of the Survey.' && page(w, 'survey')?.goal === 'Tell Ailith where to go: the Chapel in Helmstow, or Thornhold over the Scarth.', `Ailith met first begins The Rest of the Survey, with her question as its goal (${w.news.at(-1)})`);
    w.ok(!!meet(ailith, w.party, heard(w.world, ailith)).choice, 'unanswered, her question is put again');
  }
}

// ---- Helmstow between acts (#157) ----

/**
 * Helmstow before Act II is done and after (`q_salt_done`, which Vask's answer at Lantern Watch sets):
 * the old city, then the changed one to the default company, whose paladin Idris is orcblood, and
 * to one without him. The flag is set by hand, since Helmstow's band refuses a company of 16 on the
 * road (sunderwood.md §9, 6). Either company gets in, and the shops and trainers stay.
 */

const HALE = (): Person => who('shelf', 29, 8, 'Captain Hale'), STRANGERS = (): Person => who('shelf', 29, 8, 'two Wardens');

/** Down the Edge into the Delta, by the Salt Road: what the first step there says. */
function intoTheDelta(w: Walk): string[] {
  w.world.travel('downs_d4', 1, 30, SOUTH);
  const said: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'delta_d5'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
  listen(w);
  return said;
}

/**
 * Hale gone from the Scarth (#156): the ledger given and the Delta set foot in, two strangers in
 * Warden grey hold the pass, warn nothing and take Dunstan's letter; the pass is walked as before.
 * The Delta first, or the ledger kept, and Hale is there.
 */
function haleGone(ok: (cond: boolean, msg: string) => void): void {
  { // The Delta before the ledger: nothing is seen on the Edge, and Hale still holds the Scarth.
    const w = newWalk(ok);
    const said = intoTheDelta(w);
    w.ok(!said.some((m) => m.includes('two riders in Warden grey')) && !w.party.flags.q_hale_taken, 'into the Delta before Hale has the ledger, nothing goes over the Edge');
    w.ok(there(w, 'shelf', HALE()) && !there(w, 'shelf', STRANGERS()), 'and Hale holds the Scarth');
  }
  const w = newWalk(ok);
  // Dunstan writes to Hale, and the letter is carried no further than the pack.
  meetWho(w, 'q_riders');
  clock(w, 0);
  see(w, 'downs_e2:e2_riders');
  answerWho(w, 'q_riders', 'Write to Hale.');
  w.ok(w.party.bag.includes('dunstan_letter'), 'Dunstan writes to Hale, and gives the company the letter');
  meetWho(w, 'q_seal');
  sealFound(w);
  ledgerGiven(w);
  w.ok(there(w, 'shelf', HALE()) && !there(w, 'shelf', STRANGERS()), 'the ledger given, Hale holds the Scarth until the company is down the Edge');
  const said = intoTheDelta(w);
  w.ok(said.some((m) => m.includes('two riders in Warden grey')) && !!w.party.flags.q_hale_taken, `into the Delta, two riders go over the Edge towards the Scarth, and Hale is taken (${said.join(' | ')})`);
  w.ok(!intoTheDelta(w).some((m) => m.includes('Warden grey')), 'down the Edge again, they are not seen again');
  w.ok(page(w, 'riders')?.goal === 'Take Dunstan\'s letter to the Scarth.' && page(w, 'seal')?.goal === 'Take the seal to Maud at the Gilded Eel.', `Hale gone, the letter goes to the Scarth and the seal to Maud (${page(w, 'riders')?.goal}; ${page(w, 'seal')?.goal})`);
  w.ok(!there(w, 'shelf', HALE()) && there(w, 'shelf', STRANGERS()), 'Hale is gone from the Scarth, and two strangers in Warden grey hold it');
  const took = hear(w, 'shelf', STRANGERS());
  w.ok(took.includes('"Noted."') && !w.party.bag.includes('dunstan_letter') && !!w.party.flags.q_riders_grey, 'they take Dunstan\'s letter, and it goes into a coat');
  reads(w, 'riders', ['dunstan', 'ford', 'letter', 'grey'], ['hale', 'kept'], 'the letter to the strangers');
  const asked = hear(w, 'shelf', STRANGERS());
  w.ok(asked.includes('"Your business?"') && asked.includes('Nobody of that name') && !asked.includes('wolves'), 'they ask the company\'s business, do not know Hale\'s name and warn of nothing');
  w.ok(w.party.bag.includes('clerks_seal') && !w.party.flags.q_seal_hale, 'they take nothing else: the seal stays in the pack');
  walkThrough(w, 'shelf', 30, 9, EAST, 'thornmark');
}

function homecoming(ok: (cond: boolean, msg: string) => void): void {
  const business = (w: Walk, x: number, y: number) => { w.world.travel('harrow', x, y, NORTH); const f = w.world.featureHere(); return f && f.x === x && f.y === y ? f : undefined; };
  const night = (w: Walk, x: number, y: number): string[] => { clock(w, 0); w.world.travel('harrow', x, y, NORTH); return w.world.eventsHere(); };
  const day = (w: Walk, x: number, y: number): string[] => { clock(w, 12); w.world.travel('harrow', x, y, NORTH); return w.world.eventsHere(); };
  const step = (w: Walk, turn?: 'left' | 'right'): string[] => { if (turn) w.world.turn(turn); const r = w.world.move('forward'); return r.kind === 'moved' ? r.messages : [`blocked: ${'reason' in r ? r.reason : ''}`]; };
  const inn = (w: Walk) => { const f = business(w, 4, 4); return f?.kind === 'inn' ? f.price : 0; };
  const shop = (w: Walk, id: string) => { const f = business(w, 4, 10); return f?.kind === 'shop' ? priceIn(TABLES.items, f, id) : 0; };
  const CAPTAIN = (): Person => who('harrow', 3, 13, 'Captain Ordgar');
  { // The old city: the gate lets Idris in, the Chapel cures, the old Eel and prices, no bell or Wardens.
    const w = newWalk(ok);
    w.ok(w.party.members.some((m) => m.race === 'orcblood'), 'the default company has an orcblood member, Idris');
    walkThrough(w, 'shelf', 16, 4, NORTH, 'harrow');
    w.ok(w.world.state.x === 7 && w.world.state.y === 14, 'before Act II is done, the south gate lets a company with an orcblood member into Helmstow');
    const eel = business(w, 12, 13);
    w.ok(business(w, 11, 4)?.kind === 'temple' && there(w, 'harrow', OSMUND()) && eel?.kind === 'npc' && eel.lines[0] === 'The tavern is loud and smells of eel.', 'the old city: the Chapel open with Osmund in it, and the Eel\'s old talk');
    w.ok(inn(w) === 12 && shop(w, 'rations') === 4 && shop(w, 'longsword') === 120, `the old city's prices: the inn at 12, rations at 4 and a long sword at 120 (${inn(w)}, ${shop(w, 'rations')}, ${shop(w, 'longsword')})`);
    w.ok(!night(w, 7, 6).length && !there(w, 'harrow', CAPTAIN()) && !day(w, 7, 13).length, 'the old city: no curfew bell by night, no captain at the Drillyard and no Wardens at the gate');
    walkThrough(w, 'harrow', 13, 14, SOUTH, 'shelf');
    walkThrough(w, 'shelf', 18, 4, NORTH, 'harrow');
    w.ok(w.world.state.x === 13 && w.world.state.y === 14, 'the harbour postern is open both ways in the old city too');
  }
  { // The changed city, to a company with Idris in it: turned back at the gate, in by the postern.
    const w = newWalk(ok);
    meetWho(w, 'q_bell');
    w.party.flags.q_salt_done = 1;
    w.world.travel('shelf', 16, 4, NORTH);
    const gate = step(w);
    w.ok(gate[0] === 'blocked: A sergeant steps into the gate: "No orcblood past the gate. Regent\'s orders."' && w.world.zone?.id === 'shelf', `after Act II the sergeant turns back a company with an orcblood member at the south gate (${gate[0]})`);
    walkThrough(w, 'shelf', 18, 4, NORTH, 'harrow');
    w.ok(w.world.state.x === 13 && w.world.state.y === 14, 'and the harbour postern lets it in, by the Gilded Eel');
    const wardens = step(w, 'left'), again = (w.world.travel('harrow', 14, 14, NORTH), w.world.eventsHere());
    w.ok(wardens.some((m) => m.startsWith('Wardens on the wall above the postern')) && !again.length, 'the Wardens over the postern are said on the first step inside, once');
    w.ok(business(w, 11, 4)?.kind !== 'temple' && !there(w, 'harrow', OSMUND()) && !there(w, 'harrow', EBBA_EEL()), 'the Chapel is shut: no cure, no Osmund and no Ebba');
    see(w, 'harrow:chapel_shut');
    const rung = page(w, 'bell');
    w.ok(w.world.used('chapel_shut') && !!rung?.done && rung.entries.some((e) => e.id === 'shut') && w.news.includes('Quest complete: The Bell That Rang Twice.'), 'its notice read, an unanswered bell ends at the shut door, and says where the sexton went');
    const night6 = night(w, 7, 6), day6 = day(w, 8, 6);
    w.ok(night6.length === 1 && night6[0].startsWith('The curfew bell') && !day6.length && night(w, 7, 6).length === 1, 'the curfew bell rings by night on the middle street, every time, and not by day');
    const yard = business(w, 3, 13);
    w.ok(yard?.kind === 'trainer' && there(w, 'harrow', CAPTAIN()), 'the Drillyard stays, and the cousin\'s captain is in it');
    const first = hear(w, 'harrow', CAPTAIN()), then = hear(w, 'harrow', CAPTAIN());
    w.ok(first.startsWith('A captain in Warden grey') && then.startsWith('"The board\'s there.') && wrap(first, SAY_W).length <= SAY_LINES, 'the captain says the walls are Vask\'s, then where the work is');
    w.ok(inn(w) === 18 && shop(w, 'rations') === 6 && shop(w, 'longsword') === 180 && shop(w, 'lantern_oil') === 40, `the shops stay, dearer: the inn at 18, rations at 6, a long sword at 180, the oil still 40 (${inn(w)}, ${shop(w, 'rations')}, ${shop(w, 'longsword')}, ${shop(w, 'lantern_oil')})`);
    const eel = business(w, 12, 13);
    w.ok(eel?.kind === 'npc' && eel.lines[0].startsWith('The tavern is half as loud'), 'the Eel\'s talk is the curfew\'s');
    walkThrough(w, 'harrow', 7, 14, SOUTH, 'shelf');
    // The bell's witnesses are gone with Osmund, and Ailith, met now, asks after the Watch, not the Chapel.
    w.ok(!there(w, 'harrow', FISHERMAN()) && !there(w, 'harrow', WALL()), 'after Act II the bell\'s witnesses are gone too');
    const ailith = who('shelf', 2, 14, 'Ailith'), twin = MAP_DEFS.find((d) => d.id === 'shelf')!.features!.filter((f): f is Person => f.kind === 'npc' && f.name === ailith.name)[1];
    w.ok(!there(w, 'shelf', ailith) && there(w, 'shelf', twin), 'Ailith in the wood is the one who has heard the Chapel is shut');
    const m = meet(twin, w.party, heard(w.world, twin)), watch = m.choice?.answers.find((a) => a.label === 'Lantern Watch, over the Sunder.');
    listen(w);
    const asked = page(w, 'survey')?.goal ?? '';
    w.ok(!!watch && !m.choice?.answers.some((a) => a.label.includes('Chapel')) && asked.startsWith('Tell Ailith where to go: Lantern Watch'), `she asks between the Watch and Thornhold, and the goal says so (${asked})`);
    if (watch) answer(TABLES.items, watch, w.party);
    listen(w);
    reads(w, 'survey', ['ailith', 'watch'], ['chapel', 'thornhold'], 'Ailith sent to the Watch, after Act II');
    w.ok(!there(w, 'shelf', twin), 'and she is gone from the wood');
  }
  { // The changed city, to a company with no orcblood member: the gate lets it in, under the Wardens.
    const w = newWalk(ok);
    w.party.members.splice(w.party.members.findIndex((m) => m.race === 'orcblood'), 1);
    w.party.flags.q_salt_done = 1;
    walkThrough(w, 'shelf', 16, 4, NORTH, 'harrow');
    w.ok(w.world.state.x === 7 && w.world.state.y === 14, 'after Act II the south gate lets a company with no orcblood member in');
    const wardens = step(w), beside = (w.world.travel('harrow', 8, 13, NORTH), w.world.eventsHere());
    w.ok(wardens.some((m) => m.startsWith('Wardens on the wall-walk')) && !beside.length, 'and the Wardens at the gate look it over on the first step inside, once');
  }
}

/**
 * The Walk Home (Hearth Isle's §6 and §12, #765): any ending walks Wenna home to Gullwick. Before one,
 * Hild ties her knots and nobody stands at the third house's door, on the tideline or beside her. After
 * each, the walk passes Helmstow's open gate, Jowan's mother takes his letter, Hild's words end it and Wenna sits on the shingle beside
 * her, gone from the Core; only then does the sea ask for the ring, with the girl there to look round.
 * It asks a company with no ring too, its throw barred. The flags and the finds are set by hand, as the
 * homecoming's are.
 */
function walkHome(ok: (cond: boolean, msg: string) => void): void {
  const HILD = who('downs_f3', 10, 15, 'Hild'), MOTHER = who('downs_f3', 10, 13, 'Jowan'), SEA = who('downs_f3', 9, 15, 'The sea'), WENNA = who('downs_f3', 11, 15, 'Wenna');
  const GIRL = who('core', 7, 4, 'The girl out of the hole');
  const ready = (end?: string, ring = true): Walk => {
    const w = newWalk(ok);
    for (const f of ['q_wenna', VOICE_WHOLE, ...(end ? [end] : [])]) w.party.flags[f] = 1;
    w.party.bag.push('gullwick_letter', ...(ring ? ['queens_signet'] : []));
    listen(w);
    return w;
  };
  {
    const w = ready();
    w.ok(hear(w, 'downs_f3', HILD).startsWith('Hild has tied another knot') && ![MOTHER, SEA, WENNA].some((p) => there(w, 'downs_f3', p)) && !page(w, 'walk_home')?.begun,
      'before any ending Hild ties her knots, nobody stands at the third house\'s door, on the tideline or beside her, and no walk home is begun');
  }
  for (const end of Object.values(ENDINGS)) {
    const w = ready(end.flag), how = `after ${end.flag}`;
    w.ok(w.news.includes('New quest: The Walk Home.') && page(w, 'walk_home')?.goal === 'Along the coast road to Gullwick, to the shore where her mother stands.' && there(w, 'core', GIRL) && !there(w, 'downs_f3', WENNA) && !there(w, 'downs_f3', SEA),
      `${how} the walk home begins, its goal Gullwick's shore; Wenna is at the Core and not yet on the shingle, and the sea does not ask yet`);
    see(w, 'shelf:gate_open');
    w.ok(page(w, 'walk_home')?.entries.map((e) => e.id).join() === 'spring,gate', `${how} Helmstow's gate stands open as the company passes, and the walk home writes it (${page(w, 'walk_home')?.entries.map((e) => e.id).join()})`);
    const read = hear(w, 'downs_f3', MOTHER);
    w.ok(read.startsWith('She reads it standing, twice') && !w.party.bag.includes('gullwick_letter') && !!w.party.flags.q_letter_given && !!page(w, 'letter')?.done,
      `${how} Jowan's mother at her door takes his letter, and A Letter for Gullwick is done`);
    const home = hear(w, 'downs_f3', HILD), after = hear(w, 'downs_f3', HILD), wenna = hear(w, 'downs_f3', WENNA);
    w.ok(home.endsWith('This time, she cries.') && !!w.party.flags[WENNA_HOME] && !!page(w, 'walk_home')?.done && after.endsWith('"It is going to take till summer. Sit down."'),
      `${how} Hild cries this time and the walk home is done, and after it she unties the knots with her girl`);
    w.ok(there(w, 'downs_f3', WENNA) && !there(w, 'core', GIRL) && wenna.includes('I\'m not anyone\'s key.'),
      `${how} Wenna sits on the shingle beside her mother, gone from the Core, and will not take the ring`);
    w.world.travel('downs_f3', SEA.x, SEA.y);
    const sea = meet(SEA, w.party, heard(w.world, SEA)), toss = sea.choice?.answers.find((a) => a.label === 'Throw it in.');
    const thrown = toss ? answer(TABLES.items, toss, w.party) : '';
    listen(w);
    w.ok(sea.text === SEA.lines.join('\n\n') && sea.choice?.ask === 'Throw the ring in?' && thrown.includes('the girl beside her does.') && !w.party.bag.includes('queens_signet') && !there(w, 'downs_f3', SEA) && !!page(w, 'signet')?.done,
      `${how}, Wenna home, the sea off Gullwick takes the ring and is gone, and The Signet is done`);
  }
  {
    const w = ready(ENDINGS.finish.flag, false);
    w.party.flags[WENNA_HOME] = 1;
    w.world.travel('downs_f3', SEA.x, SEA.y);
    const c = meet(SEA, w.party, heard(w.world, SEA)).choice, toss = c?.answers.find((a) => a.label === 'Throw it in.'), keep = c?.answers.find((a) => a.label === 'Keep it.');
    w.ok(!!toss && barred(toss, w.party) && !!keep && answer(TABLES.items, keep, w.party) === 'The sea goes on giving nothing back.' && there(w, 'downs_f3', SEA),
      'a company with no ring is asked too, the throw barred; kept, the sea goes on giving nothing back and stays');
  }
}

/**
 * Helmstow once the Hand has Wenna (#449): `q_wenna_taken`, set by a rest at the camp's fire on
 * Sheer Point, makes Vask's city worse again. After Act II and before it, the middle street is bare and
 * the Eel talks of the curfew; after it, a gibbet stands in the street, said once on either of its two
 * squares, and the Eel talks of that and of the oars locked in the keep. The flags are set by hand, as
 * the homecoming's is.
 */
function underVask(ok: (cond: boolean, msg: string) => void): void {
  const eel = MAP_DEFS.find((d) => d.id === 'harrow')!.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'The Gilded Eel' && JSON.stringify(f.after) === JSON.stringify({ flag: 'q_salt_done' }))!;
  const street = (w: Walk, x: number): string[] => { w.world.travel('harrow', x, 9, NORTH); return w.world.eventsHere(); };
  { // After Act II, before Wenna is taken: no gibbet, and the Eel's talk the curfew's.
    const w = newWalk(ok);
    w.party.flags.q_salt_done = 1;
    w.ok(!street(w, 7).length && !street(w, 8).length && hear(w, 'harrow', eel) === eel.lines.join('\n\n'), 'after Act II, before the Hand has Wenna, the middle street is bare and the Eel talks of the curfew');
  }
  { // After it: the gibbet, said once on whichever square of the street is walked first, and the Eel's talk of it.
    const w = newWalk(ok);
    w.party.flags.q_salt_done = 1;
    w.party.flags.q_wenna_taken = 1;
    const first = street(w, 8), again = [...street(w, 7), ...street(w, 8)], talk = hear(w, 'harrow', eel);
    w.ok(first.length === 1 && first[0].startsWith('A gibbet') && !again.length, `once the Hand has Wenna, a gibbet stands new in Helmstow's street, said once (${first.join(' / ')})`);
    w.ok(talk.startsWith('The tavern is near empty') && talk.includes('hanged nobody') && wrap(talk, SAY_W).length <= SAY_LINES, 'and the Eel is near empty, and talks of the gibbet and the oars locked in the keep');
  }
}

/**
 * The Council of Helmstow (#764): once the Hand has Wenna, Wiglaf at the chapel's door puts the case
 * once, with four answers or, to a company Wenna led up, five; the Council sits that night, and by
 * day Wiglaf says what it found, once. The six verdicts in turn, their pieces set by hand as the
 * homecoming's flags are, and Helmstow after each: Vask gone and his door the Council's, the gibbets
 * down, the Council's proclamation over his, the Eel's talk the verdict's and the gate open to Idris;
 * a failed case leaves all of it as it was. Last, the twins of a Council that sits after an ending.
 */
function council(ok: (cond: boolean, msg: string) => void): void {
  const CLERK = (): Person => who('keep', 4, 6, 'Wiglaf'), SITTING = (): Person => who('keep', 4, 5, 'Wiglaf');
  const VASK = (): Person => who('keep', 7, 4, 'Lord Aumery Vask'), DOOR = (): Person => who('keep', 7, 4, 'Wiglaf');
  const eel = MAP_DEFS.find((d) => d.id === 'harrow')!.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'The Gilded Eel' && JSON.stringify(f.after) === JSON.stringify({ flag: 'q_salt_done' }))!;
  const company = (...flags: string[]): Walk => { const w = newWalk(ok); for (const f of ['q_salt_done', 'q_wenna_taken', ...flags]) w.party.flags[f] = 1; clock(w, 12); return w; };
  /** Make the case to Wiglaf at the chapel's door: the answers he puts. */
  const put = (w: Walk, label: string): string[] => {
    const p = CLERK();
    w.world.travel('keep', p.x, p.y, NORTH);
    const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => x.label === label);
    if (a) answer(TABLES.items, a, w.party);
    listen(w);
    return m.choice?.answers.map((x) => x.label) ?? [];
  };
  /** What Wiglaf says at the chapel's door at the hour, the next day: nothing if he is not there. */
  const sits = (w: Walk, hour: number): string => { clock(w, hour); return there(w, 'keep', SITTING()) ? hear(w, 'keep', SITTING()) : ''; };
  const gate = (w: Walk): boolean => { w.world.travel('shelf', 16, 4, NORTH); const r = w.world.move('forward'); return r.kind === 'moved' && w.world.state.mapId === 'harrow'; };
  const street = (w: Walk): string[] => [7, 8].flatMap((x) => { w.world.travel('harrow', x, 9, NORTH); return w.world.eventsHere(); });
  const proclaimed = (w: Walk): string[] => { w.world.travel('keep', 9, 8, NORTH); return w.world.eventsHere(); };
  /** A case made and sat on: the morning's words. */
  const sat = (w: Walk, label: string): string => { put(w, label); return sits(w, 12); };
  const business = (w: Walk, x: number, y: number) => { w.world.travel('harrow', x, y, NORTH); const f = w.world.featureHere(); return f && f.x === x && f.y === y ? f : undefined; };
  /** The inn's price, the Chapel open or shut, and a long sword's, rations' and the oil's price at Mottram's. */
  const shops = (w: Walk): string => {
    const inn = business(w, 4, 4), chapel = business(w, 11, 4), stores = business(w, 4, 10);
    return [inn?.kind === 'inn' ? inn.price : 0, chapel?.kind === 'temple' ? 'open' : 'shut', ...(stores?.kind === 'shop' ? ['longsword', 'rations', 'lantern_oil'].map((id) => priceIn(TABLES.items, stores, id)) : [])].join(' ');
  };
  /** Helmstow once a verdict has removed Vask: the inn at 12 again, the Chapel open for the hold alone, the stores a port's for Tallis alone. */
  const removed = (w: Walk, talk: string, how: string, trade = '12 shut 180 6 40'): void => {
    w.ok(!!w.party.flags.q_throne_removed && !w.party.flags.q_case_failed && !there(w, 'keep', VASK()) && there(w, 'keep', DOOR()), `${how}: Vask and his guards are gone from the keep, and Wiglaf keeps its door for the Council`);
    const said = proclaimed(w), hung = street(w), heardEel = hear(w, 'harrow', eel);
    w.ok(said.length === 2 && said[1] === 'Over it: the Council of Helmstow holds the city under its seal.' && !hung.length, `${how}: the Council's proclamation is said over the Regent's, and the gibbets are down (${said.join(' / ')})`);
    w.ok(heardEel === talk && wrap(heardEel, SAY_W).length <= SAY_LINES, `${how}: the Eel talks of the verdict, with no Warden at its door (${heardEel})`);
    w.ok(gate(w), `${how}: the south gate lets a company with an orcblood member in`);
    const now = shops(w);
    w.ok(now === trade, `${how}: the inn, the Chapel and Mottram's long sword, rations and oil are ${now}`);
  };
  { // Nothing shows before the Hand has Wenna.
    const w = newWalk(ok);
    w.party.flags.q_salt_done = 1;
    clock(w, 12);
    w.ok(!there(w, 'keep', CLERK()) && !there(w, 'keep', SITTING()) && !there(w, 'keep', DOOR()) && there(w, 'keep', VASK()) && !page(w, 'council'), 'before the Hand has Wenna there is no clerk at the chapel and no Council, and Vask holds the keep');
    const trade = shops(w);
    w.ok(trade === '18 shut 180 6 40', `and the inn, the Chapel and Mottram's are Vask's city's (${trade})`);
  }
  { // The cousin, carried by two of her pieces; four answers to a company Wenna did not lead up.
    const w = company('q_riders_hale', 'q_seal_hale');
    const offered = put(w, 'The Queen\'s cousin.'), goal = page(w, 'council')?.goal ?? '';
    w.ok(offered.length === 4 && !offered.includes('Wenna of Gullwick.') && !!w.party.flags.q_case_cousin && !there(w, 'keep', CLERK()), `once the Hand has Wenna, Wiglaf puts the case, four answers (${offered.join(' ')}), and is gone once it is made`);
    w.ok(goal.startsWith('Come back to the keep\'s chapel in the morning'), `and the log says to come back in the morning (${goal})`);
    const night = sits(w, 0), day = sits(w, 12), again = sits(w, 12);
    w.ok(!night && day.startsWith('The Council sits in the chapel where she lay in state') && day.endsWith('The Regent is not in the keep when they come for him.') && !again && !!w.party.flags.q_throne_cousin,
      `the Council sits that night, and by day Wiglaf says the cousin's verdict, once (${day})`);
    removed(w, 'A Warden, loud, with the old badge on: "The cousin sits in the chair and the Regent sits in a cell, and I was on the wall for both."', 'the cousin');
    reads(w, 'council', ['met', 'for_cousin', 'cousin'], ['cousin_irons', 'failed'], 'the cousin\'s case');
  }
  { // The hold, carried by the signet alone.
    const w = company('q_signet_hold');
    const day = sat(w, 'The elves of Henlys.');
    w.ok(day.startsWith('The Council reads the treaty aloud') && !!w.party.flags.q_throne_hold, `the signet given to the hold carries its case alone (${day})`);
    removed(w, 'A fisherman: "An elf on Helmstow\'s chair, and the treaty read out on the keep steps. My grandfather said it was so and we laughed at him."', 'the hold', '12 open 180 6 40');
  }
  { // Tallis, carried by the crown sailed and the ring sold.
    const w = company('q_crown_sailed', 'q_ring_sold');
    const day = sat(w, 'Jory Tallis.');
    w.ok(day.startsWith('The Council counts hulls.') && !!w.party.flags.q_throne_tallis, `two of Tallis's pieces carry his case (${day})`);
    removed(w, 'A dockhand: "Tallis sailed in with his hulls and the Council counted them. Prices are a port\'s now. So is the gate."', 'Tallis', '12 shut 240 8 40');
  }
  { // Wenna: five answers to a company she led up, carried by the sleepers seen.
    const w = company('q_wenna_up', 'q_sleepers_seen');
    const offered = put(w, 'Wenna of Gullwick.'), day = sits(w, 12);
    w.ok(offered.length === 5 && offered[3] === 'Wenna of Gullwick.' && day.startsWith('The Council sits a long time') && !!w.party.flags.q_throne_wenna, `to a company Wenna led up he puts five answers, and her case carries (${day})`);
    removed(w, 'A fisherman, quiet: "The chair\'s kept for a girl from Gullwick nobody has seen. They say the doors know her. I don\'t know what that means and nor does the Council."', 'Wenna');
  }
  { // Nobody, which always carries.
    const w = company();
    const day = sat(w, 'Nobody.');
    w.ok(day.startsWith('The Council seals the chair empty') && !!w.party.flags.q_throne_council, `a case for nobody carries with no pieces at all (${day})`);
    removed(w, 'A Warden: "The Council holds the city under its own seal and nobody is in the chair. It is the quietest Helmstow has been in a year."', 'nobody');
  }
  { // A failed case: one piece of the cousin's. Vask keeps the keep, and Helmstow is as it was.
    const w = company('q_riders_hale');
    const day = sat(w, 'The Queen\'s cousin.');
    w.ok(day.includes('is not persuaded. The Regent holds the keep.') && !!w.party.flags.q_case_failed && !w.party.flags.q_throne_removed && !w.party.flags.q_throne_cousin, `one piece does not carry: the case fails and removes nobody (${day})`);
    const said = proclaimed(w), hung = street(w), talk = hear(w, 'harrow', eel);
    w.ok(there(w, 'keep', VASK()) && !there(w, 'keep', DOOR()) && said.length === 1 && hung.length === 1 && talk.startsWith('The tavern is near empty') && !gate(w),
      'and Vask holds the keep, the gibbet stands, the Eel is the gibbet\'s and the gate still turns Idris back');
    const trade = shops(w);
    w.ok(trade === '18 shut 180 6 40', `and the inn, the Chapel and Mottram's stay Vask's city's (${trade})`);
    w.ok(!there(w, 'keep', CLERK()) && !sits(w, 12), 'the Council does not sit twice');
    reads(w, 'council', ['met', 'for_cousin', 'failed'], ['cousin', 'failed_ended'], 'a failed case');
  }
  { // After the endings (#759 sets them): Vask before the Council in irons, and a failed case's chair empty.
    const w = company('q_riders_hale', 'q_seal_hale', 'q_end_reignite');
    const day = sat(w, 'The Queen\'s cousin.');
    w.ok(day.endsWith('Vask stands before the Council in irons.') && !!w.party.flags.q_throne_removed, `a Council that sits after the relit ending has Vask before it in irons (${day})`);
    reads(w, 'council', ['met', 'for_cousin', 'cousin_irons'], ['cousin'], 'the cousin\'s case after the relit ending');
    const late = company('q_end_arrive'), failed = sat(late, 'Jory Tallis.');
    w.ok(failed.includes('is not persuaded. The chair stays empty.') && !!late.party.flags.q_case_failed, `and a failed case after the hull is opened leaves the chair empty (${failed})`);
  }
}

/**
 * The road behind after the Heart (#765, Helmstow's half): once the company is on the isle Vask is gone
 * from his keep, the throne room empty behind his door and his steward before it. After an ending the
 * gate stands open, said once on the road before it, and the gate lets Idris (the orcblood paladin) in;
 * the Council's clerk by it asks where the ring goes; the inn is at 12 and the Chapel open; the
 * gatehouse has the ending's proclamation; Vask stands in irons for the relit and the finished; and the
 * Eel, Ordgar and the Guildhall's Luminary have each ending's word, first of all. Before the isle and
 * the endings, none of it.
 */
function roadBehind(ok: (cond: boolean, msg: string) => void): void {
  const H6 = MAP_DEFS.find((d) => d.id === 'hearthisle_h6')!;
  const STEWARD = (): Person => who('keep', 7, 5, 'The Regent\'s steward'), CLERK = (): Person => who('shelf', 15, 4, 'Wiglaf');
  const ORDGAR = (): Person => who('harrow', 3, 13, 'Captain Ordgar'), LUMINARY = (): Person => who('harrow', 12, 11, 'The Guildhall\'s Luminary');
  const eel = MAP_DEFS.find((d) => d.id === 'harrow')!.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'The Gilded Eel' && JSON.stringify(f.after) === JSON.stringify({ flag: 'q_salt_done' }))!;
  /** A company after Act II, on the isle once if `isle`, with the flags given. */
  const company = (isle: boolean, ...flags: string[]): Walk => {
    const w = newWalk(ok);
    for (const f of ['q_salt_done', ...flags]) w.party.flags[f] = 1;
    if (isle) w.world.travel(H6.id, H6.start.x, H6.start.y);
    return w;
  };
  /** Up the road from 16,6 to the gate and through it: what is said on the way, and whether the company, Idris with it, is let in. */
  const road = (w: Walk): { said: string[]; inside: boolean } => {
    w.world.travel('shelf', 16, 6, NORTH);
    const said: string[] = [];
    for (let i = 0; i < 3 && w.world.state.mapId !== 'harrow'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    return { said, inside: w.world.state.mapId === 'harrow' };
  };
  const opened = (said: readonly string[]): number => said.filter((m) => m.startsWith('The gate stands open')).length;
  /** The business at the keep's door now, and the people in it. */
  const door = (w: Walk): string => {
    w.world.travel('keep', 7, 4, NORTH);
    const f = w.world.featureHere();
    return [f?.kind === 'npc' ? f.name : 'nothing', ...w.world.peopleAt(7, 4).map((p) => p.name)].join(' / ');
  };
  /** What the gatehouse says, either side of the gate. */
  const gatehouse = (w: Walk): string[] => [9, 6].flatMap((x) => { w.world.travel('keep', x, 8, NORTH); return w.world.eventsHere(); });
  /** The inn's price and the Chapel open or shut. */
  const trade = (w: Walk): string => {
    const at = (x: number, y: number) => { w.world.travel('harrow', x, y, NORTH); const f = w.world.featureHere(); return f && f.x === x && f.y === y ? f : undefined; };
    const inn = at(4, 4), chapel = at(11, 4);
    return `${inn?.kind === 'inn' ? inn.price : 0} ${chapel?.kind === 'temple' ? 'open' : 'shut'}`;
  };
  // Each ending's first words from the Eel, Ordgar and the Luminary.
  const WORDS: Record<string, readonly string[]> = {
    q_end_reignite: ['A fisherman, from the door: "Steady as a post', '"The light\'s steady', '"Every lamp in the house'],
    q_end_arrive: ['The tavern\'s door stands open', '"Wind on the walls.', '"Half the house says'],
    q_end_finish: ['A fisherman, with his hand flat on the table', '"The ground hums.', '"The Hearth burns harder'],
  };
  const ending = (said: string): boolean => Object.values(WORDS).flat().some((s) => said.startsWith(s));
  { // Before the isle and the endings: Vask at his door and nobody before it, the gate shut to Idris, and none of the words.
    const w = company(false);
    const r = road(w), keep = door(w), posted = gatehouse(w), talk = [hear(w, 'harrow', eel), hear(w, 'harrow', ORDGAR())];
    w.ok(!opened(r.said) && !r.inside && !there(w, 'shelf', CLERK()), 'before an ending the road to Helmstow\'s gate is as it was, with no clerk by it, and the gate turns Idris back');
    w.ok(keep === 'Lord Aumery Vask, Regent-Warden' && !there(w, 'keep', STEWARD()) && posted.length === 1, `and Vask holds his door with nobody before it, and the gatehouse has the Regent's proclamation alone (${keep})`);
    w.ok(talk[0] === eel.lines.join('\n\n') && !talk.some(ending) && !there(w, 'harrow', LUMINARY()) && trade(w) === '18 shut', 'and Helmstow is Vask\'s city: the Eel and Ordgar as they were, no Luminary on the Guildhall\'s step, the inn at 18 and the Chapel shut');
  }
  { // On the isle, before an ending: Vask at the panel, the throne room empty and his steward before its door.
    const w = company(true);
    const keep = door(w), said = there(w, 'keep', STEWARD()) ? hear(w, 'keep', STEWARD()) : '';
    w.ok(keep === 'The throne room' && said.includes('He went over to the isle with the grey men'), `once the company is on the isle, Vask is gone from his door, the throne room behind it empty and his steward before it (${keep})`);
    w.ok(trade(w) === '18 shut' && !road(w).inside && !there(w, 'shelf', CLERK()), 'and the rest of Helmstow waits on an ending');
  }
  for (const [flag, how] of [['q_end_reignite', 'relit'], ['q_end_arrive', 'opened'], ['q_end_finish', 'finished']] as const) {
    const w = company(true, flag);
    const first = road(w), again = road(w), irons = flag !== 'q_end_arrive', keep = door(w), posted = gatehouse(w);
    w.ok(opened(first.said) === 1 && !opened(again.said) && first.inside && again.inside, `${how}: the gate stands open, said once on the road before it, and lets Idris in`);
    w.ok(trade(w) === '12 open' && there(w, 'keep', STEWARD()) && hear(w, 'keep', STEWARD()).startsWith('The Regent\'s steward at the throne room\'s door, the keys still at his belt'),
      `${how}: the inn is at 12 again and the Chapel open, and the steward stands on at the door with the Council's word, since the Council has not sat (#795)`);
    w.ok(keep === (irons ? 'The throne room / Aumery Vask, before the Council' : 'The throne room') && posted.length === 2
      && posted[1].startsWith(irons ? 'A proclamation on the gatehouse: the Council of Helmstow sits in judgement' : 'A proclamation on the gatehouse, the ink run'),
    `${how}: ${irons ? 'Vask stands in irons before the Council' : 'the throne room stands empty'}, and the gatehouse has the ending's proclamation (${keep}; ${posted[1]})`);
    const talk = [hear(w, 'harrow', eel), hear(w, 'harrow', ORDGAR()), there(w, 'harrow', LUMINARY()) ? hear(w, 'harrow', LUMINARY()) : ''];
    w.ok(talk.every((t, i) => t.startsWith(WORDS[flag][i])) && wrap(talk[0], SAY_W).length <= SAY_LINES, `${how}: the Eel, Ordgar and the Guildhall's Luminary on its step each have the ending's word (${talk.map((t) => t.slice(0, 24)).join(' / ')})`);
  }
  { // First of all: after a verdict and the finished ending the Eel talks of the hum, and Wiglaf keeps the door with Vask in irons inside.
    const w = company(true, 'q_end_finish', 'q_throne_cousin', 'q_throne_removed');
    const keep = door(w), posted = gatehouse(w), talk = hear(w, 'harrow', eel);
    w.ok(talk.startsWith(WORDS.q_end_finish[0]) && keep === 'Wiglaf, at the keep\'s door / Aumery Vask, before the Council' && posted.length === 3 && !there(w, 'keep', STEWARD()),
      `after the Council's verdict and an ending, the ending's word comes first, and Wiglaf keeps the door with Vask in irons inside, the steward gone to him (${keep})`);
  }
  { // The clerk by the gate: not without the ring's answers, then the ring given to the cousin, and he is gone.
    const w = company(true, 'q_end_reignite');
    const clerk = CLERK(), seen = there(w, 'shelf', clerk);
    const bare = meet(clerk, w.party, heard(w.world, clerk)).choice!.answers.find((x) => x.label === 'To the cousin.')!;
    const refused = answer(TABLES.items, bare, w.party), unset = !w.party.flags.q_signet_cousin;
    w.party.bag.push('queens_signet');
    const m = meet(clerk, w.party, heard(w.world, clerk)), cousin = m.choice!.answers.find((x) => x.label === 'To the cousin.')!;
    const said = answer(TABLES.items, cousin, w.party);
    listen(w);
    w.ok(seen && refused === 'You have none to give.' && unset && m.choice!.answers.length === 4, 'after an ending the Council\'s clerk waits by the gate, and asks where the ring goes, four answers, the ring\'s three barred without it');
    w.ok(said.includes('The Council will sit on it within the week.') && !!w.party.flags.q_signet_cousin && countItem(w.party, 'queens_signet') === 0 && !there(w, 'shelf', clerk), `given to the cousin, the ring goes in a cloth and the clerk with it (${said})`);
  }
  { // Once the Council has sat, the ring goes into the chair's keeping; kept, the clerk waits on.
    const w = company(true, 'q_end_arrive', 'q_throne_council', 'q_throne_removed');
    w.party.bag.push('queens_signet');
    const clerk = CLERK();
    w.world.travel('shelf', clerk.x, clerk.y);
    const m = meet(clerk, w.party, heard(w.world, clerk)), pick = (label: string) => m.choice!.answers.find((x) => x.label === label)!;
    const kept = answer(TABLES.items, pick('We keep it.'), w.party), stays = there(w, 'shelf', clerk) && countItem(w.party, 'queens_signet') === 1;
    const said = answer(TABLES.items, pick('To the hold.'), w.party);
    listen(w);
    w.ok(kept.includes('counts without it') && stays && said.includes('It goes into the chair\'s keeping.') && !said.includes('within the week') && !!w.party.flags.q_signet_hold && !there(w, 'shelf', clerk),
      `once the Council has sat, the ring kept leaves the clerk waiting, and given goes into the chair's keeping (${said})`);
  }
}

/**
 * Vask's hand-ins after he is gone (#795): the survey wand (300 gold, `q_ashcombe_done`), the tenant's paper (50,
 * `q_paper_vask`) and the keeper's oil put to him (his order, `q_oil_order` and `q_oil_lit`). In every state of the
 * keep exactly one of Vask, his steward and Wiglaf at the door stands to take them: Vask until the company is on the
 * isle, the steward from its first step onto it, and after an ending, until the Council has sat, and Wiglaf then.
 * Each takes all three with the same pay and flags, and so none is lost by the isle, the Council or an ending.
 */
function keepHandIns(ok: (cond: boolean, msg: string) => void): void {
  const H6 = MAP_DEFS.find((d) => d.id === 'hearthisle_h6')!;
  const VASK_ = (): Person => who('keep', 7, 4, 'Lord Aumery Vask'), STEWARD = (): Person => who('keep', 7, 5, 'The Regent\'s steward'), DOOR = (): Person => who('keep', 7, 4, 'Wiglaf');
  const SAT = ['q_throne_cousin', 'q_throne_removed'];
  /** A company after Act II, on the isle once if `isle`, with the flags given, the wand and the paper in the pack and the oil put to Vask. */
  const company = (isle: boolean, ...flags: string[]): Walk => {
    const w = newWalk(ok);
    for (const f of ['q_salt_done', 'q_oil_vask', ...flags]) w.party.flags[f] = 1;
    w.party.bag.push('survey_wand', 'tenant_paper');
    if (isle) w.world.travel(H6.id, H6.start.x, H6.start.y);
    return w;
  };
  /** Three meetings with `p`: the wand, then the paper, then the oil order, and what each paid and set. */
  const handIn = (w: Walk, p: Person): { said: string[]; gold: number; paid: boolean } => {
    const gold = w.party.gold, said = [hear(w, 'keep', p), hear(w, 'keep', p), hear(w, 'keep', p)];
    const paid = w.party.gold === gold + 350 && !w.party.bag.includes('survey_wand') && !w.party.bag.includes('tenant_paper')
      && ['q_ashcombe_done', 'q_paper_vask', 'q_oil_order', 'q_oil_lit'].every((f) => !!w.party.flags[f]);
    return { said, gold: w.party.gold - gold, paid };
  };
  { // On the isle first, the oil put to Vask by the keeper's own road: the steward takes the wand, the paper and the order, and is Vask's for the log.
    const w = newWalk(ok);
    oilAsked(w);
    answerWho(w, 'q_well', 'We\'ll put it to Vask.');
    w.party.bag.push('survey_wand', 'tenant_paper');
    w.world.travel(H6.id, H6.start.x, H6.start.y);
    const door = there(w, 'keep', VASK_()), steward = there(w, 'keep', STEWARD()), r = handIn(w, STEWARD());
    w.ok(!door && steward && r.said[0].startsWith('The steward takes the cracked survey wand') && r.said[1].startsWith('The steward reads the paper') && r.said[2].startsWith('The steward hears you out') && r.paid && r.gold === 350,
      `on the isle first, Vask's steward takes the wand (300 gold), the tenant's paper (50) and the oil order, with their flags (${r.said.map((s) => s.slice(0, 24)).join(' / ')})`);
    reads(w, 'oil', ['aldred', 'vask', 'order', 'lit'], ['buy'], 'put to Vask, said to the steward');
    w.ok(lamp(w) === 'e3_lamp_lit' && hear(w, 'keep', STEWARD()).startsWith('The Regent\'s steward before the throne room\'s door'), `the lamp is lit by his order (${lamp(w)}), and the steward's next words are his first`);
  }
  { // The wand given to Vask in Act I: on the isle the steward still says his first words, and no receipt for a wand he never took.
    const w = newWalk(ok);
    w.party.flags.q_ashcombe_done = 1;
    w.world.travel(H6.id, H6.start.x, H6.start.y);
    w.ok(there(w, 'keep', STEWARD()) && hear(w, 'keep', STEWARD()).startsWith('The Regent\'s steward before the throne room\'s door'), 'a company that gave the wand to Vask in Act I hears the steward\'s first words on the isle, not a receipt');
  }
  { // The Council has sat: Wiglaf at the door takes the same three, and the steward is gone.
    const w = company(true, ...SAT);
    const r = handIn(w, DOOR());
    w.ok(!there(w, 'keep', STEWARD()) && !there(w, 'keep', VASK_()) && there(w, 'keep', DOOR()) && r.said[0].startsWith('Wiglaf holds the cracked survey wand') && r.said[1].startsWith('Wiglaf reads the paper') && r.said[2].startsWith('Wiglaf hears you out') && r.paid,
      `once the Council has sat, Wiglaf at the door takes the wand, the paper and the order, and the steward is gone (${r.said.map((s) => s.slice(0, 18)).join(' / ')})`);
  }
  { // An ending, the Council not sat: the steward stands on, and takes them; sat, Wiglaf.
    const open = company(true, 'q_end_arrive'), r = handIn(open, STEWARD());
    open.ok(there(open, 'keep', STEWARD()) && !there(open, 'keep', DOOR()) && r.paid && r.said[2].startsWith('The steward hears you out'), `after an ending, the Council not yet sat, the steward takes the wand, the paper and the order (${r.said[0].slice(0, 24)})`);
    const relit = company(true, 'q_end_reignite', ...SAT), s = handIn(relit, DOOR());
    relit.ok(!there(relit, 'keep', STEWARD()) && s.paid && s.said[2].startsWith('Wiglaf hears you out'), `after an ending and the Council's verdict, Wiglaf takes them (${s.said[0].slice(0, 24)})`);
  }
  { // Every state of the keep: exactly one of the three stands, the right one, and takes all three.
    const bad: string[] = [];
    let n = 0;
    for (const isle of [false, true]) for (const sat of [false, true]) for (const end of ['', 'q_end_reignite', 'q_end_arrive', 'q_end_finish']) {
      const name = `${isle ? 'isle' : 'no isle'}, ${sat ? 'sat' : 'not sat'}, ${end || 'no ending'}`, w = company(isle, ...(sat ? SAT : []), ...(end ? [end] : []));
      const stands = [['Vask', VASK_()], ['the steward', STEWARD()], ['Wiglaf', DOOR()]] as const;
      const here = stands.filter(([, p]) => there(w, 'keep', p)), want = sat ? 'Wiglaf' : isle || end ? 'the steward' : 'Vask';
      n++;
      if (here.length !== 1 || here[0][0] !== want) { bad.push(`${name}: ${here.map(([k]) => k).join(' and ') || 'nobody'}`); continue; }
      const r = handIn(w, here[0][1]);
      if (!r.paid) bad.push(`${name}: ${want} does not take all three`);
    }
    ok(!bad.length, `in each of the keep's ${n} states exactly one of Vask, his steward and Wiglaf stands, and takes the wand, the paper and the oil order${bad.length ? ' -> ' + bad.join('; ') : ''}`);
  }
}

/**
 * The prestiges taught here (#19): the Knight's first by the armourer in the keep's ward, the
 * Paladin's by Mottram in his stores and the Bard's by the luthier under the Hearthlight's eaves,
 * in the old city and the changed one; and the Knight's second at Coldharbour, off the road and the
 * fights. At 11 a knight, a paladin and a bard are sent and taught; at 16, after Act II, again,
 * Idris let in by the postern; at 19 the knight is sent to Coldharbour.
 */
function trainers(ok: (cond: boolean, msg: string) => void): void {
  const WULFRIC = who('keep', 4, 7, 'Wulfric'), ALDITH = who('harrow', 5, 5, 'Aldith'), SIWARD = who('downs_f2', 19, 16, 'Siward');
  const only = (id: string, want: [string, number][]) => taught(id).length === want.length && want.every(([c, n]) => taught(id).some((t) => t.cls === c && t.prestige === n));
  ok(only('keep', [['knight', 1]]) && only('harrow', [['paladin', 1], ['bard', 1]]) && only('downs_f2', [['knight', 2]]), 'the keep teaches the Knight\'s first, Helmstow the Paladin\'s and the Bard\'s, and Coldharbour\'s box the Knight\'s second');
  const others = (map: string, p: Person) => (mapOf(map).features ?? []).filter((f) => f.x === p.x && f.y === p.y && f !== p);
  const stores = others('harrow', MOTTRAM()).filter((f) => f.kind === 'shop');
  ok(stores.length === 3 && stores.every((f) => f.kind === 'shop' && ['lantern_oil', 'torch'].every((id) => f.stock.includes(id))), 'Mottram the chandler stands in his stores, in the old city, Vask\'s and Tallis\'s, and they sell Lantern Oil and torches');
  ok(mapOf('keep').rows[WULFRIC.y][WULFRIC.x] === '.' && !others('keep', WULFRIC).length, 'the armourer works at a bench in the ward, before the shut armoury, with no door');
  ok(mapOf('harrow').rows[ALDITH.y][ALDITH.x] === ',' && !others('harrow', ALDITH).length, 'the luthier sits in the street, and keeps no shop');
  ok([WULFRIC, MOTTRAM(), ALDITH, SIWARD].every((p) => !!p.teaches?.seek?.includes(p.name.split(',')[0].split(' ')[0]) && p.teaches.seek.includes(PRESTIGES[p.teaches.cls].titles[p.teaches.prestige - 1])), 'each one\'s seeking names them and the title they give');

  // Mottram's lesson: said once to a company he has hired with a paladin of 11, never to one without.
  const lesson = (w: Walk) => { w.party.flags.q_well = 1; return hear(w, 'harrow', MOTTRAM()); };
  const none = newWalk(ok);
  for (const c of none.party.members) { c.xp = xpForLevel(11); c.level = 11; }
  none.party.members.splice(none.party.members.findIndex((c) => c.cls === 'paladin'), 1);
  const at11 = newWalk(ok);
  at11.party.members[5] = createCharacter(TABLES, 'Hollis', 'human', 'bard', {}, makeRng(11));
  for (const c of at11.party.members) { c.xp = xpForLevel(11); c.level = 11; }
  const first = lesson(at11), then = hear(at11, 'harrow', MOTTRAM());
  ok(first.includes('lamp') && first !== then && !lesson(none).includes(first.slice(0, 40)), 'Mottram holds a lamp to a paladin of 11 once, and to a company with none never');

  // At 11, the old city: the knight to the keep, the paladin and the bard to Helmstow, each taught.
  const where = (p: Party, map: string) => sought(questLog(TABLES, at11.world.state, p)).find((s) => s.at === map)?.who ?? [];
  const named = (p: Party, cls: string) => p.members.find((c) => c.cls === cls)!.name;
  ok(where(at11.party, 'keep').includes(named(at11.party, 'knight')) && ['paladin', 'bard'].every((c) => where(at11.party, 'harrow').includes(named(at11.party, c))), 'at 11 the knight is sent to the keep, and the paladin and the bard to Helmstow');
  const teachAll = (w: Walk, how: string) => {
    for (const p of [WULFRIC, MOTTRAM(), ALDITH]) {
      const who = w.party.members.findIndex((c) => c.cls === p.teaches!.cls), title = PRESTIGES[p.teaches!.cls].titles[0];
      w.party.gold = 1000;
      ok(teach(p.teaches!, w.party, w.world.state, who).taught && prestigeOf(w.party.members[who]) === 1 && w.party.gold === 0
        && questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === seekId(who, 1))?.done === true, `${how}, ${p.name.split(',')[0]} makes ${/^[AEIOU]/.test(title) ? 'an' : 'a'} ${title} for 1,000 gold, and the seeking is done`);
    }
  };
  teachAll(at11, 'at 11');

  // At 16, after Act II: Idris turned back at the gate and let in by the postern, and all three there.
  const changed = newWalk(ok);
  changed.party.members[5] = createCharacter(TABLES, 'Hollis', 'human', 'bard', {}, makeRng(11));
  for (const c of changed.party.members) { c.xp = xpForLevel(16); c.level = 16; }
  changed.party.flags.q_salt_done = 1;
  ok([WULFRIC, MOTTRAM(), ALDITH].every((p) => there(changed, p === WULFRIC ? 'keep' : 'harrow', p)), 'after Act II the three firsts\' trainers are all still there');
  walkThrough(changed, 'shelf', 18, 4, NORTH, 'harrow');
  ok(changed.world.state.x === 13 && changed.world.state.y === 14 && changed.party.members.some((c) => c.race === 'orcblood'), 'after Act II a company of 16 with Idris comes in by the postern');
  const nobody = { x: -1, y: -1 } as Person;
  ok(around('harrow', nobody, [13, 14], MOTTRAM()) && around('harrow', nobody, [13, 14], ALDITH), 'and walks from the postern to Mottram and the luthier');
  walkThrough(changed, 'harrow', 7, 1, NORTH, 'keep');
  ok(changed.world.state.mapId === 'keep' && around('keep', nobody, [7, 8], WULFRIC), 'and up through the gatehouse into the ward, to the armourer');
  teachAll(changed, 'at 16, after Act II');

  // The second, off the beaten path: off the road and off the fights, and reached on foot.
  const f2 = mapOf('downs_f2'), sw = SIWARD;
  const road = f2.rows.flatMap((r, y) => [...r].flatMap((ch, x) => (ch === '=' ? [{ x, y }] : [])));
  ok(road.every((r) => Math.abs(r.x - sw.x) + Math.abs(r.y - sw.y) > 10), 'the old standard-bearer is more than ten squares off the road');
  ok(f2.encounters!.every((g) => Math.abs(g.x - sw.x) + Math.abs(g.y - sw.y) > 10), 'and more than ten squares from any group, so no trainer\'s door is a fight\'s doorstep');
  ok(around('downs_f2', nobody, [f2.start.x, f2.start.y], sw), 'he is reached on foot from the box\'s way in, by no secret door');
  const at19 = newWalk(ok);
  for (const c of at19.party.members) { c.xp = xpForLevel(19); c.level = 19; }
  const knight = at19.party.members.findIndex((c) => c.cls === 'knight');
  takePrestige(at19.party.members[knight]);
  at19.party.flags.q_salt_done = 1;
  ok(sought(questLog(TABLES, at19.world.state, at19.party)).find((s) => s.at === 'downs_f2')?.who.includes(at19.party.members[knight].name) === true, 'at 19 the knight is sent to Coldharbour\'s box');
  at19.party.gold = 4000;
  ok(there(at19, 'downs_f2', sw) && teach(sw.teaches!, at19.party, at19.world.state, knight).taught && prestigeOf(at19.party.members[knight]) === 2 && at19.party.gold === 0,
    `he makes a ${PRESTIGES.knight.titles[1]} for 4,000 gold`);
}
