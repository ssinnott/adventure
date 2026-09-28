// The Foreland's walkthrough: its chapter of the one quest, The Quiet Farm, played from a new game by
// the game's own moves and checked a step at a time (tools/walk.ts); Thornmark's plays the chain.
// Then a new company walks out of Helmstow to the Lodestone, and Gytha gives it the lesson, and
// her later words as Thornhold's news reaches her.
import type { Walkthrough } from '../../area.ts';
import { CHAPTER } from './chapter.ts';
import { MAP_DEFS } from '../../index.ts';
import { newWalk, meetWho, walkThrough, see, fight, playChapter, quest, listen } from '../../../../tools/walk.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { wrap } from '../../../ui/draw.ts';
import { SAY_W, SAY_LINES, logLines } from '../../../ui/frame.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { EAST, SOUTH } from '../../../game/types.ts';

/** Vask hires the company: before the chapter, or its last step for a company that came early. */
export const HIRE: Step = { name: 'the hire', play: (w) => meetWho(w, 'q_ashcombe') };

/** The chapter once hired: the farm, the cellar and the wand taken back. */
export const STEPS: readonly Step[] = [
  { name: 'to Ashcombe', play: (w) => walkThrough(w, 'shelf', 23, 20, EAST, 'mill') },
  { name: 'the cellar', play: (w) => { see(w, 'mill:mill_lantern'); fight(w, 'mill:m_warden'); see(w, 'mill:mill_core'); } },
  { name: 'the wand', play: (w) => meetWho(w, 'survey_wand') },
];

/** A new game hired by Vask, the way the chapter begins in order. */
export function hired(w: Walk): void {
  listen(w);
  w.ok(!quest(w), 'a new game has no quest yet');
  HIRE.play(w);
  w.ok(w.news.at(-1) === 'New quest: The Dimming.', `Vask's hire begins the one quest (${w.news.at(-1)})`);
}

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  hired(w);
  playChapter(w, CHAPTER, STEPS, 'in order');
  ok(quest(w)?.pages.find((p) => p.def === CHAPTER)?.done === true && w.news.includes('Chapter complete: The Quiet Farm.'), 'in order, the wand back to Vask finishes The Quiet Farm');

  lodestone(newWalk(ok), 'a new company');
  // A company Sylvane has spoken to before it comes by still gets the lesson first.
  const late = newWalk(ok);
  meetWho(late, 'q_grove');
  const g = gytha();
  ok(g !== undefined && meet(g, late.party, heard(late.world, g)).text.includes("That's a Stone, whole.") && /Cut\. With tools\./.test(meet(g, late.party, heard(late.world, g)).text),
    'Sylvane met first: Gytha gives the lesson, and then the cut\'s words');
};

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
  const g = gytha(), here = w.world.featureHere();
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
