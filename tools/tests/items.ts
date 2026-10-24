// An item past a plus (#855): a stat it raises while it is borne (`statOf`) and an element its blows
// carry (an added die), held on fixtures; and what a shop pays for an item (`sellPrice`). The content
// is held to the shape only, so the areas may add.
// And the bounds' artifacts (#847): their mark, their shape, the lair each lies in, their five kinds of
// power in a fight and out, the shop that will not take one, the sheet that says each and their words.
import { ITEMS, MAP_DEFS, MONSTERS, AREAS, SPELLS, GUILD_QUESTS } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/map.ts';
import { hits, sellPrice, ELEMENT_DIE, ARTIFACT_RAISE, ARTIFACT_CASTINGS, ARTIFACT_LEVEL, REFUSED, chargesLeft } from '../../src/game/items.ts';
import { ARTIFACT_PRICE } from '../../src/content/items.ts';
import { giftOf } from '../../src/game/wilds.ts';
import { personGives } from '../../src/game/people.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { defaultParty, createCharacter, equip, armorClass, attackBonus, spellHeal, statOf, itemsChanged, addCondition, hasCondition, mendOf, dawnOf, rankMult, STATS, CLASSES, WARDABLE, MAX_LEVEL } from '../../src/game/party.ts';
import type { Party, Stat, ClassId } from '../../src/game/party.ts';
import { SKILLS } from '../../src/game/skills.ts';
import { MINUTES_PER_DAY } from '../../src/game/calendar.ts';
import { ELEMENTS, spellDice } from '../../src/game/spells.ts';
import type { Element } from '../../src/game/spells.ts';
import { startCombat, currentTurn, partyAct, monsterAct } from '../../src/game/combat.ts';
import type { CombatState } from '../../src/game/combat.ts';
import { elementMult } from '../../src/game/monsters.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { TIER_NAMES } from '../../src/game/mastery.ts';
import type { Tier } from '../../src/game/mastery.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { statText, weaponLine, slotLine, describe, businessEntries, artifactLines, power, sheetRows, SheetScreen, MessageScreen, SHEET_COL_W, SHEET_FOOT, SHEET_ITEMS, SHEET_ITEMS_Y } from '../../src/ui/screens.ts';
import { CombatScreen, castRows } from '../../src/ui/combat.ts';
import type { Action } from '../../src/input.ts';
import type { ChoiceScreen } from '../../src/ui/screens.ts';
import { FONT_CHARS, measureText, lineHeight } from '../../src/lib/engine/text.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import type { RngInstance } from '../../src/lib/engine/rng.ts';
import { ok, owed, headlessGame, drive, withDefs } from './lib.ts';

/** The stats a fight reads; endurance, intellect and luck have no live effect (DESIGN §5). */
const LIVE: readonly Stat[] = ['might', 'accuracy', 'speed', 'personality'];

/** What is wrong with an item's raise or element: no stat, a raise not whole, a stat nothing reads, no element or one on what strikes no blow. */
function faults(d: ItemDef): string[] {
  const out: string[] = [];
  for (const [s, n] of Object.entries(d.stat ?? {})) {
    if (!STATS.includes(s as Stat)) out.push(`${d.id}: '${s}' is no stat`);
    else if (!Number.isInteger(n) || n === 0) out.push(`${d.id}: a raise of ${n} ${s}`);
    else if (!LIVE.includes(s as Stat)) out.push(`${d.id}: ${s} has no live effect`);
  }
  if (d.element !== undefined && !ELEMENTS.includes(d.element)) out.push(`${d.id}: '${d.element}' is no element`);
  else if (d.element && d.slot !== 'weapon') out.push(`${d.id}: an element on what strikes no blow`);
  return out;
}

const COAT: ItemDef = { id: 'test_quick_coat', name: 'Quick Coat', slot: 'armor', price: 40, ac: 2, stat: { speed: 3 } };
const TWIN: ItemDef = { id: 'test_plain_coat', name: 'Plain Coat', slot: 'armor', price: 40, ac: 2 };
const PLAIN: ItemDef = { id: 'test_plain_blade', name: 'Plain Blade', slot: 'weapon', price: 0, dice: 1, sides: 6 };
const STORM: ItemDef = { ...PLAIN, id: 'test_storm_blade', name: 'Storm Blade', element: 'lightning' };
const BRAND: ItemDef = { ...PLAIN, id: 'test_fire_blade', name: 'Fire Blade', element: 'fire' };
const SHIELD: ItemDef = { id: 'test_quick_shield', name: 'Quick Shield', slot: 'shield', price: 0, stat: { speed: 3 } };
const TRUE: ItemDef = { ...PLAIN, id: 'test_true_blade', name: 'True Blade', stat: { accuracy: 3 } };
/** A slotless charm of each stat a fight reads, borne from the pack. */
const CHARMS = Object.fromEntries(LIVE.map((s) => [s, { id: `test_${s}_charm`, name: 'Charm', slot: 'none', price: 0, stat: { [s]: 3 } } satisfies ItemDef])) as Record<Stat, ItemDef>;
/**
 * The bounds' eight (DESIGN §9, #847): each with its area, whose items define it, the Hand's piece
 * whose numbers it betters by a point (none for a thing carried, which has no numbers), and who may
 * bear it (none named: any of the ten).
 */
const BUILT: Readonly<Record<string, { area: string; hand: string; classes: readonly string[] }>> = {
  hagstone: { area: 'shelf', hand: '', classes: [] },
  telstok: { area: 'saltreach', hand: 'grey_staff', classes: ['cleric', 'sorcerer', 'druid', 'monk'] },
  holdfast: { area: 'wrackholm', hand: 'grey_knife', classes: ['thief', 'bard', 'sorcerer'] },
  erzhemd: { area: 'kilns', hand: 'grey_mail', classes: ['knight', 'paladin', 'ranger', 'thief', 'barbarian', 'bard', 'druid'] },
  torhide: { area: 'cairnmoor', hand: 'grey_shield', classes: ['knight', 'paladin', 'ranger'] },
  wakerobe: { area: 'rimewater', hand: 'grey_robe', classes: ['cleric', 'sorcerer', 'druid', 'monk'] },
  akkush: { area: 'glasswold', hand: 'grey_bow', classes: ['ranger'] },
  grims_axe: { area: 'ashfall', hand: 'grey_axe', classes: ['knight', 'paladin', 'ranger', 'barbarian'] },
};
/**
 * The artifacts no lair holds yet, each its area's issue's, which lays the lair and places it: reported
 * as that issue's while it waits and failed once it is placed, so its entry is dropped. The table only
 * shrinks, as maps.ts's UNPLACED does: an artifact comes into it only as it is defined.
 */
const UNPLACED: Readonly<Record<string, string>> = { telstok: '#830' };
/** The content's artifacts, and each one's twin without the mark: what the mark alone changes. */
const ARTS = Object.values(ITEMS).filter((d) => d.artifact);
const TWINS = Object.fromEntries(ARTS.map((d) => [d.id, { ...d, id: `test_${d.id}_twin`, artifact: undefined } satisfies ItemDef])) as Record<string, ItemDef>;
/** The Telstok's twin with no element: what the element alone adds to a blow. */
const BARE_STAFF: ItemDef = { ...ITEMS.telstok, id: 'test_bare_staff', artifact: undefined, element: undefined };
const FIXTURES = [COAT, TWIN, PLAIN, STORM, BRAND, SHIELD, TRUE, ...Object.values(CHARMS), ...Object.values(TWINS), BARE_STAFF];

/** A sturdy target that every blow can reach, and its kin that lightning does nothing to, half to and half again to; and one that mends. */
const target = (id: string, more: Partial<MonsterDef> = {}): MonsterDef => ({ ...MONSTERS.bandit, id, name: 'Target', plural: 'Targets', hp: 999, ac: -10, ...more });
const NEUTRAL = target('test_target'), IMMUNE = target('test_immune', { immune: ['lightning'] });
const RESISTANT = target('test_resistant', { resist: ['lightning'] }), WEAK = target('test_weak', { weak: ['lightning'] });
const MENDER = target('test_mender', { regen: 5 }), FIREPROOF = target('test_fireproof', { regen: 5, immune: ['fire'] });

/** Bram, the knight, strikes the target once in the fight's first round, every other turn braced or the target's own: what his blow did. */
function strike(seed: number, def: MonsterDef, dress: (p: Party) => void): { s: CombatState; dmg: number } {
  const p = defaultParty(makeRng(1)), rng = makeRng(seed);
  for (const c of p.members) c.hp = c.maxHp = 999;
  dress(p);
  const s = startCombat(p, [{ id: 'a', monsters: [def] }], rng);
  for (let guard = 0; guard < 50 && s.outcome === 'ongoing'; guard++) {
    const t = currentTurn(s, p, rng);
    if (!t) break;
    if (t.side === 'monster') monsterAct(s, p, rng);
    else if (t.i !== 0) partyAct(s, p, rng, { type: 'defend' });
    else { const hp = s.monsters[0].hp; partyAct(s, p, rng, { type: 'attack', target: 0 }); return { s, dmg: hp - s.monsters[0].hp }; }
  }
  throw new Error('Bram never struck');
}
const wield = (w: ItemDef) => (p: Party): void => { equip(p.members[0], w.id); };

export function items(): void {
  // The content, to the shape alone: whatever an area adds must be a stat a fight reads, a whole raise, an element on a weapon.
  const content = Object.values(ITEMS), bad = content.flatMap(faults);
  ok(!bad.length, `every item that raises a stat or carries an element is of the shape (${content.filter((d) => d.stat).length} raise a stat, ${content.filter((d) => d.element).length} carry an element)${bad.length ? ' -> ' + bad.join('; ') : ''}`);
  const caught = (d: ItemDef, want: string): void => { const got = faults(d).join('; '); ok(got === want, `the shape's check catches ${want} (${got || 'nothing'})`); };
  caught({ ...COAT, stat: { luck: 3 } }, `${COAT.id}: luck has no live effect`);
  caught({ ...COAT, stat: { speed: 1.5 } }, `${COAT.id}: a raise of 1.5 speed`);
  caught({ ...COAT, element: 'fire' }, `${COAT.id}: an element on what strikes no blow`);
  caught({ ...STORM, element: 'wind' as Element }, `${STORM.id}: 'wind' is no element`);
  ok(faults(COAT).length + faults(STORM).length + faults(CHARMS.might).length === 0, 'and the fixtures are of the shape');

  // The raisers are worked out before the fixtures come, as in a run of every suite: the fixtures'
  // raises count only once `itemsChanged` says the table has changed, and again once they go.
  statOf(defaultParty(makeRng(1)).members[0], 'speed');
  withDefs(ITEMS, FIXTURES, () => {
    raised();
    blows();
    shown();
    sold();
    artifacts();
  });
}

/** A +3 speed coat moves AC and the turn's order while worn, not in the pack or the bag; each read a fight makes takes the raise; a save holds none. */
function raised(): void {
  const bare = (): Party => { const p = defaultParty(makeRng(1)); p.members[0].equipment.armor = null; return p; };
  const p = bare(), c = p.members[0], own = { ...c.stats }, ac = armorClass(c);
  equip(c, TWIN.id); const twin = armorClass(c);
  equip(c, COAT.id); const worn = armorClass(c), quick = statOf(c, 'speed');
  c.equipment.armor = null; c.pack.push(COAT.id); const packed = armorClass(c);
  c.pack = c.pack.filter((id) => id !== COAT.id && id !== TWIN.id); p.bag.push(COAT.id); const bagged = armorClass(c);
  ok(twin === ac + 2 && worn === twin + 1 && quick === own.speed + 3 && packed === ac && bagged === ac,
    `a +3 speed coat worn adds a step of AC to its own (${ac} bare, ${twin} in a plain coat, ${worn} in the quick one); in the pack or the bag, nothing (${packed}, ${bagged})`);
  ok(JSON.stringify(c.stats) === JSON.stringify(own), 'and the member\'s own stats are as they were');

  // Worn on any slot: a +3 speed shield adds a step of AC, a +3 accuracy blade in hand a step of to-hit.
  const q0 = bare(), b = q0.members[0];
  b.equipment.weapon = null; b.equipment.shield = null;
  const acBare = armorClass(b), shielded = equip(b, SHIELD.id), acShield = armorClass(b);
  equip(b, PLAIN.id); const hitPlain = attackBonus(b);
  equip(b, TRUE.id); const hitTrue = attackBonus(b);
  ok(shielded && acShield === acBare + 1 && hitTrue === hitPlain + 1 && statOf(b, 'speed') === b.stats.speed + 3 && statOf(b, 'accuracy') === b.stats.accuracy + 3,
    `a +3 speed shield worn adds a step of AC (${acBare} -> ${acShield}), a +3 accuracy blade in hand a step of to-hit (${hitPlain} -> ${hitTrue})`);

  // The turn's order: Bram, three slower than Idris, goes first now and then bare, about half the time in the coat and as bare with it in the bag.
  const order = (seed: number, dress: (q: Party) => void): number[] => {
    const q = bare(); q.members[0].stats.speed = 10; q.members[1].stats.speed = 13; dress(q);
    const rng = makeRng(seed), s = startCombat(q, [{ id: 'a', monsters: [NEUTRAL] }], rng);
    currentTurn(s, q, rng);
    return s.order.filter((r) => r.side === 'party').map((r) => r.i);
  };
  const seeds = Array.from({ length: 100 }, (_, i) => i + 1), first = (o: number[]): boolean => o.indexOf(0) < o.indexOf(1);
  const bareOrders = seeds.map((n) => order(n, () => {})), wornOrders = seeds.map((n) => order(n, (q) => { equip(q.members[0], COAT.id); }));
  const bagOrders = seeds.map((n) => order(n, (q) => { q.bag.push(COAT.id); }));
  const nBare = bareOrders.filter(first).length, nWorn = wornOrders.filter(first).length;
  ok(nWorn >= nBare + 25 && bagOrders.every((o, i) => o.join() === bareOrders[i].join()),
    `the coat worn puts Bram before Idris, three faster, in ${nWorn} of 100 first rounds against ${nBare} bare; in the bag it changes no round's order`);

  // Each read a fight makes takes the raise: might in the blow, accuracy in to-hit, personality in a heal; from the pack, never the bag.
  const might = (where: 'pack' | 'bag' | null) => (q: Party): void => { wield(PLAIN)(q); if (where) (where === 'pack' ? q.members[0].pack : q.bag).push(CHARMS.might.id); };
  const struck = [1, 2, 3, 4, 5, 6].map((n) => [strike(n, NEUTRAL, might(null)).dmg, strike(n, NEUTRAL, might('pack')).dmg, strike(n, NEUTRAL, might('bag')).dmg]).filter(([b]) => b > 0);
  ok(struck.length >= 3 && struck.every(([b, packed, bagged]) => packed === b + 1 && bagged === b),
    `a +3 might charm in the pack adds a step to each blow, in the bag nothing (${struck.map((x) => x.join('/')).join(', ')})`);
  const step = (s: Stat, read: (m: Party['members'][number]) => number): boolean => {
    const q = bare(), m = q.members[1], before = read(m);
    q.bag.push(CHARMS[s].id); const bagged = read(m);
    m.pack.push(CHARMS[s].id);
    return bagged === before && read(m) === before + 1;
  };
  ok(step('accuracy', attackBonus) && step('personality', (m) => spellHeal(m, 10)) && step('speed', armorClass),
    'a +3 charm of accuracy, personality or speed in the pack adds a step to to-hit, a heal and AC; in the bag, nothing');

  // A save holds no raise: the coat is saved worn, the stats as the member's own.
  const g = headlessGame(4), m = g.party.members[0];
  m.equipment.armor = null;
  const mine = { ...m.stats };
  equip(m, COAT.id);
  const back = deserialize(serialize(g.world.state, g.party, 0)).party.members[0];
  ok(JSON.stringify(m.stats) === JSON.stringify(mine) && JSON.stringify(back.stats) === JSON.stringify(mine) && back.equipment.armor === COAT.id && statOf(back, 'speed') === mine.speed + 3,
    `a save holds the coat worn and the stats as the member's own (speed ${back.stats.speed}, ${statOf(back, 'speed')} in the coat)`);
}

/** A lightning blade's blow adds its die through what the monster is, the steel landing as ever; fire stops a mender; the company sees it. */
function blows(): void {
  ok(hits(STORM) === hits(PLAIN) + (ELEMENT_DIE + 1) / 2 && hits(STORM) - hits(PLAIN) === 3.5, `a weapon's measure counts its element's die at 3.5 (${hits(PLAIN)} plain, ${hits(STORM)} with lightning)`);
  ok([NEUTRAL, MENDER].every((d) => elementMult(d, 'lightning') === 1 && elementMult(d, 'fire') === 1) && elementMult(IMMUNE, 'lightning') === 0 && elementMult(RESISTANT, 'lightning') < 1 && elementMult(WEAK, 'lightning') > 1,
    'the targets: one lightning does its all to, and ones it does nothing to, half to and half again to');
  const rows: { die: number; immune: number; resistant: number; weak: number; steel: number }[] = [];
  const seen: string[] = [];
  for (let n = 1; n <= 30; n++) {
    const extra = (d: MonsterDef): { steel: number; extra: number; s: CombatState } => {
      const plain = strike(n, d, wield(PLAIN)), storm = strike(n, d, wield(STORM));
      if (plain.s.seen[d.id]) seen.push(`a plain blade taught ${d.id}`);
      if (storm.dmg > 0 && storm.s.seen[d.id]?.lightning !== elementMult(d, 'lightning')) seen.push(`${d.id} on seed ${n}`);
      return { steel: plain.dmg, extra: storm.dmg - plain.dmg, s: storm.s };
    };
    const neutral = extra(NEUTRAL);
    if (neutral.steel <= 0) continue;
    rows.push({ die: neutral.extra, immune: extra(IMMUNE).extra, resistant: extra(RESISTANT).extra, weak: extra(WEAK).extra, steel: neutral.steel });
  }
  const dice = rows.map((r) => r.die);
  ok(rows.length >= 15 && dice.every((d) => d >= 1 && d <= ELEMENT_DIE) && new Set(dice).size >= 4,
    `a lightning blade's blow that lands adds a d${ELEMENT_DIE} to the steel (${dice.join(' ')})`);
  ok(rows.every((r) => r.immune === 0 && r.steel > 0), 'against the immune it adds nothing, and the steel lands as before, so no blow is nothing');
  ok(rows.every((r) => r.resistant === Math.ceil(r.die / 2) && r.weak === r.die + Math.floor(r.die / 2)),
    `against the resistant half the die, against the weak half again (${rows.slice(0, 6).map((r) => `${r.die}: ${r.resistant}/${r.weak}`).join(', ')})`);
  ok(!seen.length, `the element goes into what the company has seen, as a spell's does, and a plain blade's blow teaches nothing${seen.length ? ' -> ' + seen.join(', ') : ''}`);

  // Fire that lands marks a mender burnt, as a spell's does; lightning does not, nor fire on one it cannot hurt.
  const burnt = (d: MonsterDef, w: ItemDef): boolean[] => [1, 2, 3, 4, 5, 6, 7, 8].map((n) => strike(n, d, wield(w))).filter((r) => r.dmg > 0).map((r) => !!r.s.monsters[0].burnt);
  const fire = burnt(MENDER, BRAND), storm = burnt(MENDER, STORM), plain = burnt(MENDER, PLAIN), proof = burnt(FIREPROOF, BRAND);
  ok(fire.length >= 4 && fire.every(Boolean) && [...storm, ...plain, ...proof].every((b) => !b),
    `a fire blade's blow burns a mender, so it mends not this round (${fire.length} of ${fire.length}); a lightning or a plain blade does not, nor fire on one immune to it`);
}

/** The sheet prints the total with the raise and the weapon's element, in the font's glyphs and inside its column; a shop says both. */
function shown(): void {
  const p = defaultParty(makeRng(1)), c = p.members[0];
  c.equipment.armor = null;
  const plain = statText(c, 'speed');
  equip(c, COAT.id); equip(c, STORM.id);
  const quick = statText(c, 'speed'), other = statText(c, 'might');
  const w0 = weaponLine(c);
  c.tiers = { arms: 'expert' };
  const w1 = weaponLine(c);
  ok(plain[1] === '' && quick[0] === String(c.stats.speed + 3) && quick[1] === '(+3)' && other[1] === '' && other[0] === String(c.stats.might),
    `the sheet prints the total a fight reads and the raise, SPE ${quick.join('')} (bare ${plain.join('')}), and a stat not raised as ever (MIG ${other.join('')})`);
  ok(w0 === 'WEAPON Storm Blade, LIGHTNING' && w1 === 'WEAPON Storm Blade, LIGHTNING, EXPERT', `the WEAPON line says the element, before the tier: "${w1}"`);
  ok(describe(STORM.id) === '1d6 lightning' && describe(COAT.id) === 'AC+2 speed+3' && describe(CHARMS.might.id) === 'might+3' && describe(PLAIN.id) === '1d6' && describe(TWIN.id) === 'AC+2',
    `a shop says the element and the raise: "${describe(STORM.id)}", "${describe(COAT.id)}", "${describe(CHARMS.might.id)}"; plain wares as ever`);

  // In the font's glyphs, and inside the sheet's columns (src/ui/screens.ts: labels at 100, totals flush
  // to 140 with the raise a glyph's gap on, the left column from 20, the items column at 340).
  const glyphs = (t: string): boolean => [...t.toUpperCase()].every((ch) => ch === ' ' || FONT_CHARS.includes(ch));
  const label = 100 + measureText('SPE'), total = 140 - measureText(quick[0]), end = 141 + measureText(quick[1]);
  ok([w1, quick.join(''), describe(STORM.id), describe(COAT.id)].every(glyphs) && label < total && end <= LEFT_END,
    `in the font's glyphs; the raise ends at ${end}, and the label at ${label}, short of the total at ${total}`);
  // Every elemental weapon's WEAPON line, with the widest tier, ends inside the left column.
  const tier = (Object.keys(TIER_NAMES) as Tier[]).reduce((a, b) => (measureText(TIER_NAMES[b]) > measureText(TIER_NAMES[a]) ? b : a));
  const endOf = (d: ItemDef): number => { const m = defaultParty(makeRng(1)).members[0]; m.equipment.weapon = d.id; m.tiers = { arms: tier }; return 20 + measureText(weaponLine(m)); };
  const elemental = Object.values(ITEMS).filter((d) => d.slot === 'weapon' && d.element), over = elemental.filter((d) => endOf(d) > LEFT_END);
  ok(elemental.length >= 2 && !over.length, `every elemental weapon's WEAPON line, ${TIER_NAMES[tier]} at arms, ends by ${LEFT_END} (the widest at ${Math.max(...elemental.map(endOf))})${over.length ? ' -> ' + over.map((d) => `${d.name} at ${endOf(d)}`).join(', ') : ''}`);
  // The cap on an elemental weapon's name, exact: with lightning, the widest element, and the widest tier.
  const named = (n: number): number => {
    const blade: ItemDef = { ...STORM, id: 'test_long_blade', name: 'A'.repeat(n) };
    return withDefs(ITEMS, [blade], () => endOf(blade));
  };
  const widest = ELEMENTS.reduce((a, e) => (measureText(e) > measureText(a) ? e : a));
  ok(widest === STORM.element && named(NAME_CAP) <= LEFT_END && named(NAME_CAP + 1) > LEFT_END,
    `an elemental weapon's name fits to ${NAME_CAP} characters: its line ends at ${named(NAME_CAP)} with ${NAME_CAP} and at ${named(NAME_CAP + 1)} with ${NAME_CAP + 1}, of ${LEFT_END}`);
}
/** Where the sheet's left column must end: a glyph short of its items column at 340. */
const LEFT_END = 340 - 6;
/** The most characters an elemental weapon's name may have, for its WEAPON line to end by `LEFT_END` (DESIGN §5). */
const NAME_CAP = 26;

/** What a shop pays: half the price, rounded down, nothing for what is priced at nothing; and the sell screen pays just that. */
function sold(): void {
  const g = headlessGame(4), p = g.party;
  ok(sellPrice(p, 40) === 20 && sellPrice(p, 25) === 12 && sellPrice(p, 1) === 0 && sellPrice(p, 0) === 0, 'a shop pays half an item\'s price, rounded down: 20 for 40, 12 for 25, nothing for 1 or 0');
  const shop = MAP_DEFS.find((d) => d.id === 'harrow')!.features!.find((f): f is Extract<Feature, { kind: 'shop' }> => f.kind === 'shop')!;
  const sell = (id: string): number => {
    while (g.screens.length > 1) g.pop();
    p.bag = [id];
    g.push(businessEntries(g, shop)[0].open());
    drive(g, ['down', 'interact']);
    const gold = p.gold;
    drive(g, ['interact']);
    return p.gold - gold;
  };
  const coat = sell(COAT.id), coatGone = !p.bag.includes(COAT.id), blade = sell(PLAIN.id);
  ok(coat === sellPrice(p, COAT.price) && coat === 20 && coatGone && blade === 0 && p.bag.includes(PLAIN.id),
    `${shop.name} pays ${coat} for the coat of ${COAT.price} and takes it; a blade priced at nothing it will not buy (${blade})`);
}

/**
 * What is wrong with an artifact (DESIGN §9): not one power, a raise past the bound, castings past
 * theirs or of a spell its bearers cast or one not cast in a fight, a ward past the conditions it may
 * keep off, a plus, a resistance, a skill or a use, no words of two lines, or another price.
 */
function artifactFaults(d: ItemDef): string[] {
  const out: string[] = [], raises = Object.values(d.stat ?? {}), powers = raises.length + (d.element ? 1 : 0) + (d.casts ? 1 : 0) + (d.regen ? 1 : 0) + (d.ward ? 1 : 0);
  if (powers !== 1) out.push(`${d.id}: ${powers} powers`);
  for (const n of raises) if (n < 1 || n > ARTIFACT_RAISE) out.push(`${d.id}: a raise of ${n}, not 1 to ${ARTIFACT_RAISE}`);
  if (d.casts) {
    const sp = SPELLS[d.casts.spell], t = d.casts.times;
    if (!Number.isInteger(t) || t < 1 || t > ARTIFACT_CASTINGS) out.push(`${d.id}: ${t} castings a day, not 1 to ${ARTIFACT_CASTINGS}`);
    if (!sp) out.push(`${d.id}: '${d.casts.spell}' is no spell`);
    else {
      if (sp.context !== 'combat') out.push(`${d.id}: ${sp.name} is not cast in a fight`);
      const casters = (d.classes ?? Object.keys(CLASSES)).filter((k) => CLASSES[k as ClassId].spells === sp.list);
      if (casters.length) out.push(`${d.id}: ${sp.name} is cast by its ${casters.join(', ')}`);
    }
  }
  if (d.ward && !WARDABLE.includes(d.ward)) out.push(`${d.id}: a ward against ${d.ward}`);
  for (const k of ['plus', 'resist', 'skill', 'use'] as const) if (d[k] !== undefined) out.push(`${d.id}: a ${k}`);
  if (d.text?.length !== 2) out.push(`${d.id}: not two lines of words`);
  if (d.price !== ARTIFACT_PRICE) out.push(`${d.id}: at ${d.price}, not ${ARTIFACT_PRICE}`);
  return out;
}

/**
 * Where an item lies in the world: each chest, cairn, den, statue or person's hand that gives it, each
 * shop that sells it, each guild's reward and each monster that drops it; and whether that place is a
 * lair of the area `area` (a chest, cairn or statue on one of its enclaves at the cap, DESIGN §9).
 */
const placesOf = (id: string, area = ''): { at: string; lair: boolean }[] => {
  const own = new Set(AREAS.find((a) => a.id === area)?.maps.map((m) => m.id) ?? []);
  return [
    ...MAP_DEFS.flatMap((m) => (m.features ?? []).filter((f) => [...(giftOf(f)?.items ?? []), ...(f.kind === 'npc' ? personGives(f) : []), ...(f.kind === 'shop' ? f.stock : [])].includes(id))
      .map((f) => ({ at: `${m.id} ${f.kind} ${f.x},${f.y}`, lair: ['chest', 'cairn', 'statue'].includes(f.kind) && own.has(m.id) && !!m.enclave && m.band?.[1] === MAX_LEVEL }))),
    ...GUILD_QUESTS.filter((q) => q.pay.items?.includes(id)).map((q) => ({ at: `${q.id}'s reward`, lair: false })),
    ...Object.values(MONSTERS).filter((m) => (m.drops ?? []).some((x) => x.item === id)).map((m) => ({ at: `${m.id}'s drop`, lair: false })),
  ];
};

/** The bounds' artifacts (#847): of the shape, one in the world in its lair, sold nowhere, their powers as any item's, refused by a shop and said on the sheet. */
function artifacts(): void {
  const want = Object.keys(BUILT).sort().join(), have = ARTS.map((d) => d.id).sort().join();
  ok(have === want, `the artifacts in the item tables are DESIGN §9's eight, ${want} (${have})`);
  const caught = (d: ItemDef, want: string): void => { const got = artifactFaults(d).join('; '); ok(got === want, `the artifact's check catches ${want} (${got || 'nothing'})`); };
  const tel = ITEMS.telstok, erz = ITEMS.erzhemd, akk = ITEMS.akkush, axe = ITEMS.grims_axe, knife = ITEMS.holdfast, stone = ITEMS.hagstone;
  caught({ ...erz, element: 'fire' }, 'erzhemd: 2 powers');
  caught({ ...erz, stat: { speed: ARTIFACT_RAISE + 1 } }, `erzhemd: a raise of ${ARTIFACT_RAISE + 1}, not 1 to ${ARTIFACT_RAISE}`);
  caught({ ...tel, resist: ['cold'] }, 'telstok: a resist');
  caught({ ...akk, price: 6900 }, `akkush: at 6900, not ${ARTIFACT_PRICE}`);
  caught({ ...axe, casts: { spell: 'meteor', times: ARTIFACT_CASTINGS + 1 } }, `grims_axe: ${ARTIFACT_CASTINGS + 1} castings a day, not 1 to ${ARTIFACT_CASTINGS}`);
  caught({ ...knife, classes: ['thief', 'druid'] }, 'holdfast: Grasping Roots is cast by its druid');
  caught({ ...knife, casts: { spell: 'foxfire', times: 1 } }, 'holdfast: Foxfire is not cast in a fight');
  caught({ ...stone, ward: 'dead' }, 'hagstone: a ward against dead');
  caught({ ...stone, regen: true }, 'hagstone: 2 powers');
  const stocked = new Set(MAP_DEFS.flatMap((m) => (m.features ?? []).flatMap((f) => (f.kind === 'shop' ? f.stock : []))));
  for (const d of ARTS) {
    const b = BUILT[d.id], h = b?.hand ? ITEMS[b.hand] : undefined, bad = artifactFaults(d);
    const homed = !!b && !!AREAS.find((a) => a.id === b.area)?.items.some((x) => x.id === d.id);
    const point = !h ? 0 : d.slot === 'weapon' ? (d.bonus ?? 0) - (h.bonus ?? 0) : (d.ac ?? 0) - (h.ac ?? 0);
    const like = !!h && d.slot === h.slot && d.dice === h.dice && d.sides === h.sides && !!d.twoHanded === !!h.twoHanded && !!d.ranged === !!h.ranged && d.kind === h.kind;
    // A thing carried has no numbers; any other piece is its Hand's piece and a point.
    const numbers = d.slot === 'none' ? !b?.hand && [d.dice, d.bonus, d.ac].every((n) => n === undefined) : point === 1 && like;
    ok(homed && !bad.length && numbers && (d.classes ?? []).join() === b.classes.join(),
      `${d.name}: an artifact in ${b?.area}'s items, one power (${power(d)}), ${h ? `the ${h.name}'s numbers and a point` : 'carried, with no numbers'}, for ${b?.classes.length ? `the ${b.classes.join(', ')}` : 'any of the ten'}${bad.length ? ' -> ' + bad.join('; ') : ''}`);
    ok(!stocked.has(d.id), `${d.name}: no shop sells it`);
    // Placed, it lies once in the world, in a lair of its own area; waiting, its lair's issue owes it until it lies anywhere.
    const at = placesOf(d.id, b?.area), where = at.length ? ` (${at.map((x) => x.at).join(', ')})` : '';
    if (Object.hasOwn(UNPLACED, d.id)) owed(at.length > 0, `${d.name} lies in its lair${where}`, UNPLACED[d.id]);
    else ok(at.length === 1 && at[0].lair, `${d.name} is one in the world, in a chest, cairn or statue on an enclave of ${b?.area} at the cap, and nowhere else${where}`);
  }
  const stale = Object.keys(UNPLACED).filter((id) => !ITEMS[id]?.artifact);
  ok(!stale.length, `every artifact waiting for its lair is one${stale.length ? ' -> ' + stale.join(', ') : ''}`);

  // Each kind works for an artifact as for a found item: its twin without the mark does just the same.
  const p = defaultParty(makeRng(1)), [bram, , wren] = p.members;
  bram.equipment.armor = null;
  const own = bram.stats.speed, bare = armorClass(bram);
  equip(bram, erz.id); const worn = armorClass(bram), quick = statOf(bram, 'speed');
  equip(bram, TWINS.erzhemd.id); const twinAc = armorClass(bram), twinQuick = statOf(bram, 'speed');
  ok(quick === own + 5 && worn >= bare + (erz.ac ?? 0) && worn === twinAc && quick === twinQuick,
    `the Erzhemd worn raises speed by 5 (${own} -> ${quick}) and gives AC ${worn} where bare is ${bare}, as its twin without the mark does (${twinQuick}, ${twinAc})`);
  const hit0 = attackBonus(wren), aim0 = statOf(wren, 'accuracy');
  equip(wren, akk.id); const hit = attackBonus(wren), aim = statOf(wren, 'accuracy');
  equip(wren, TWINS.akkush.id); const twinHit = attackBonus(wren);
  ok(aim === aim0 + 5 && hit === twinHit && hits(akk) === hits(TWINS.akkush),
    `Akkush in Wren's hands raises accuracy by 5 (${aim0} -> ${aim}) and her to-hit to +${hit} (+${hit0} with her own bow), as its twin's does (+${twinHit})`);
  const hold = (w: ItemDef) => (q: Party): void => { q.members[0].equipment.shield = null; q.members[0].equipment.weapon = w.id; };
  const struck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => [strike(n, NEUTRAL, hold(tel)).dmg, strike(n, NEUTRAL, hold(TWINS.telstok)).dmg, strike(n, NEUTRAL, hold(BARE_STAFF)).dmg]).filter(([, , b]) => b > 0);
  ok(struck.length >= 6 && struck.every(([a, t, b]) => a === t && a - b >= 1 && a - b <= ELEMENT_DIE),
    `the Telstok's blow that lands adds a d${ELEMENT_DIE} of holy to the steel, as its twin's does (${struck.map(([a, , b]) => a - b).join(' ')})`);
  const g0 = headlessGame(4), m0 = g0.party.members[0], mine = { ...m0.stats };
  equip(m0, erz.id);
  const back = deserialize(serialize(g0.world.state, g0.party, 0)).party.members[0];
  ok(JSON.stringify(back.stats) === JSON.stringify(mine) && back.equipment.armor === erz.id && statOf(back, 'speed') === mine.speed + 5,
    `a save holds the Erzhemd worn and the stats as the member's own (speed ${back.stats.speed}, ${statOf(back, 'speed')} in it)`);
  powers();

  // No shop takes one: offered at Mottram's, it shows no price and is refused, and the company keeps it;
  // its twin without the mark is bought at half its price.
  const g = headlessGame(4), shop = MAP_DEFS.find((d) => d.id === 'harrow')!.features!.find((f): f is Extract<Feature, { kind: 'shop' }> => f.kind === 'shop')!;
  const offer = (id: string): { paid: number; kept: boolean; said: string; row: string } => {
    while (g.screens.length > 1) g.pop();
    g.party.bag = [id];
    g.push(businessEntries(g, shop)[0].open());
    drive(g, ['down', 'interact']);
    const row = (g.top as ChoiceScreen).options[0], gold = g.party.gold;
    drive(g, ['interact']);
    return { paid: g.party.gold - gold, kept: g.party.bag.includes(id), said: g.log.at(-1) ?? '', row };
  };
  const art = offer(tel.id), twin = offer(TWINS.telstok.id);
  ok(art.paid === 0 && art.kept && art.said === REFUSED && !art.row.includes('\t') && twin.paid === sellPrice(g.party, tel.price) && twin.paid > 0 && !twin.kept,
    `${shop.name} will not take the Telstok, shown with no price: ${art.said} Its twin without the mark it buys for ${twin.paid}`);
  sheet();
}

/**
 * The three kinds #847's second half builds (DESIGN §9), each in a fight and out of one: a ward keeps
 * its condition off and lifts none, regeneration mends by the clock's hour and never in a fight, and a
 * spell is cast from an artifact for a charge that comes back at dawn and is kept through a save.
 */
function powers(): void {
  const stone = ITEMS.hagstone, robe = ITEMS.wakerobe, shield = ITEMS.torhide, knife = ITEMS.holdfast, axe = ITEMS.grims_axe;
  // A ward, out of a fight: the condition is never taken, and one taken before stays.
  const p = defaultParty(makeRng(1)), [bram, , , ottilie, maren] = p.members;
  bram.pack.push(stone.id); addCondition(bram, 'paralysed'); addCondition(ottilie, 'paralysed');
  equip(maren, robe.id); addCondition(maren, 'asleep');
  const before = defaultParty(makeRng(1)).members[0]; addCondition(before, 'paralysed'); before.pack.push(stone.id);
  ok(!hasCondition(bram, 'paralysed') && hasCondition(ottilie, 'paralysed') && !hasCondition(maren, 'asleep') && hasCondition(before, 'paralysed'),
    'the Hagstone carried keeps paralysis off Bram, not off Ottilie beside him; the Wakerobe worn keeps sleep off Maren; and the stone lifts no paralysis taken before');
  // A ward, in a fight: a foe whose every blow holds fast, the same seeds with the stone on everyone and on no one.
  const HOLDER = target('test_holder', { attack: 99, dice: 1, sides: 1, inflict: { cond: 'paralysed', chance: 1 } });
  const held = (seed: number, carry: string | null): number => {
    const q = defaultParty(makeRng(1)), rng = makeRng(seed);
    for (const c of q.members) { c.hp = c.maxHp = 999; if (carry) c.pack.push(carry); }
    const s = startCombat(q, [{ id: 'a', monsters: [HOLDER, HOLDER] }], rng);
    for (let guard = 0; guard < 40 && s.outcome === 'ongoing'; guard++) {
      const t = currentTurn(s, q, rng);
      if (!t) break;
      if (t.side === 'monster') monsterAct(s, q, rng); else partyAct(s, q, rng, { type: 'defend' });
    }
    return q.members.filter((c) => hasCondition(c, 'paralysed')).length;
  };
  const seeds = [1, 2, 3, 4, 5, 6], bare = seeds.map((n) => held(n, null)), warded = seeds.map((n) => held(n, stone.id)), twin = withDefs(ITEMS, [{ ...stone, id: 'test_stone_twin', artifact: undefined }], () => seeds.map((n) => held(n, 'test_stone_twin')));
  ok(bare.every((n) => n >= 1) && warded.every((n) => n === 0) && twin.every((n) => n === 0),
    `in a fight with a foe whose blows hold fast, seeded, the company is held ${bare.join(' ')} without the Hagstone and never with it, nor with its twin without the mark`);

  // Regeneration, out of a fight: a tenth of the most hit points each whole hour the clock passes, never past the most, not for the down.
  const g = headlessGame(4), w = g.world, [b, idris, m] = g.party.members;
  m.equipment.weapon = null;
  equip(b, shield.id); equip(m, shield.id);
  for (const c of [b, idris]) { c.maxHp = 300; c.hp = 100; }
  m.hp = 0; m.conditions = ['unconscious'];
  w.state.minutes = Math.ceil(w.state.minutes / 60) * 60 + 60;
  w.advance(59); const early = b.hp;
  w.advance(1); const hour = b.hp;
  w.advance(180); const three = b.hp;
  w.advance(24 * 60); const whole = b.hp;
  ok(mendOf(b) === 30 && early === 100 && hour === 130 && three === 220 && whole === 300 && idris.hp === 100 && m.hp === 0 && m.equipment.shield === shield.id,
    `Torhide borne mends Bram a tenth of his ${b.maxHp} (${mendOf(b)}) each whole hour: 59 minutes ${early}, the hour ${hour}, three more ${three}, a day ${whole} and no further; Idris beside him mends nothing, nor Wren, down, though she bears another`);
  // Regeneration, in a fight: its rounds pass no clock.
  const q = defaultParty(makeRng(1)), rng = makeRng(3), [qb] = q.members;
  equip(qb, shield.id); qb.hp = 500; qb.maxHp = 999;
  const s = startCombat(q, [{ id: 'a', monsters: [target('test_idle', { attack: -99 })] }], rng);
  for (let guard = 0; guard < 60 && s.outcome === 'ongoing'; guard++) { const t = currentTurn(s, q, rng); if (!t) break; if (t.side === 'monster') monsterAct(s, q, rng); else partyAct(s, q, rng, { type: 'defend' }); }
  ok(qb.hp === 500 && s.round >= 5, `in a fight Torhide mends nothing: ${s.round} rounds and Bram stands at ${qb.hp} as he began`);

  // A spell, in a fight: the bearer casts it whatever they know, for a charge and no spell points, at
  // their level held at ARTIFACT_LEVEL with no rank; refused to one who does not bear it and once spent.
  const cast = (who: number, from: string, spellId: string, dress: (q: Party) => void, r: RngInstance = makeRng(5)): { q: Party; s: CombatState; done: boolean[] } => {
    const q = defaultParty(makeRng(1));
    for (const c of q.members) c.hp = c.maxHp = 999;
    dress(q);
    const s = startCombat(q, [{ id: 'a', monsters: [NEUTRAL, NEUTRAL, NEUTRAL] }], r), done: boolean[] = [];
    for (let guard = 0; guard < 200 && done.length < 4 && s.outcome === 'ongoing'; guard++) {
      const t = currentTurn(s, q, r);
      if (!t) break;
      if (t.side === 'monster') monsterAct(s, q, r);
      else if (t.i !== who) partyAct(s, q, r, { type: 'defend' });
      else { const ok1 = partyAct(s, q, r, { type: 'cast', spellId, target: 0, from }); done.push(ok1); if (!ok1) partyAct(s, q, r, { type: 'defend' }); }
    }
    return { q, s, done };
  };
  const thief = cast(3, knife.id, 'roots', (q) => { q.members[3].equipment.weapon = knife.id; });
  const left = chargesLeft(thief.q, knife.id), sp = thief.q.members[3].sp;
  const stranger = cast(3, knife.id, 'roots', (q) => { q.members[0].equipment.weapon = knife.id; });
  ok(thief.done.join() === 'true,true,true,false' && left === 0 && sp === defaultParty(makeRng(1)).members[3].sp && thief.q.members[3].spells.length === 0 && stranger.done.every((x) => !x)
    && thief.s.log.some((l) => l.startsWith(`${thief.q.members[3].name} casts Grasping Roots`)),
    `Ottilie, who knows no spell, casts Grasping Roots from Holdfast three times in a fight and is refused the fourth (${thief.done.join(', ')}), spending no spell points; one who does not bear it is refused`);
  const top: RngInstance = { ...makeRng(1), next: () => 0.999999, int: (_a: number, z: number) => z, range: (_a: number, z: number) => z, chance: () => false };
  const swarm = cast(1, axe.id, 'meteor', (q) => { const c = q.members[1]; c.level = MAX_LEVEL; c.prestige = 3; c.tiers = { magic: 'master' }; c.equipment.shield = null; c.equipment.weapon = axe.id; }, top);
  const most = spellDice(SPELLS.meteor, ARTIFACT_LEVEL) * (SPELLS.meteor.sides ?? 4), dealt = swarm.s.monsters.map((x) => x.def.hp - x.hp);
  ok(swarm.done[0] && dealt.every((n) => n === most * swarm.done.filter(Boolean).length) && rankMult(swarm.q.members[1]) > 1 && swarm.done.filter(Boolean).length === axe.casts!.times,
    `Idris at ${MAX_LEVEL}, ranked, casts Meteor Swarm from Grim's Axe ${axe.casts!.times} times, each at most ${most} on every foe, a level-${ARTIFACT_LEVEL} unranked roll (${dealt.join(' ')} in all)`);
  // Through the fight's screen, by keys: Ottilie's list holds Holdfast's spell with its castings left; Cast,
  // the spell and a group take a charge; once they are spent the screen says so and casts nothing.
  CombatScreen.instant = true;
  try {
    const g3 = headlessGame(4), o3 = g3.party.members[3], seen: string[] = [], after: number[] = [];
    for (const c of g3.party.members) c.hp = c.maxHp = 999;
    o3.equipment.weapon = knife.id;
    g3.world.travel('shelf', 16, 4);
    g3.fight(['road_rats']);
    const st = (g3.top as CombatScreen).state;
    for (let guard = 0; guard < 400 && st.outcome === 'ongoing' && after.length < 4; guard++) {
      const t = currentTurn(st, g3.party, g3.rng);
      if (!t || t.side === 'monster') { g3.update(null); continue; }
      if (t.i !== 3) { g3.update('n4' as Action); continue; }
      const had = chargesLeft(g3.party, knife.id);
      seen.push(castRows(g3.party, o3).map((r) => r.label).join());
      g3.update('n2' as Action); g3.update('interact');
      if (had > 0) g3.update('interact'); else { seen.push(g3.log.at(-1) ?? ''); g3.update('cancel'); g3.update('n4' as Action); }
      after.push(chargesLeft(g3.party, knife.id));
    }
    const cast3 = st.log.filter((l) => l.startsWith(`${o3.name} casts Grasping Roots`)).length;
    ok(after.join() === '2,1,0,0' && seen[0] === 'Grasping Roots (3 LEFT)' && seen[3] === 'Grasping Roots (0 LEFT)' && seen[4] === 'Nothing left in it until dawn.' && cast3 === 3,
      `through the fight's screen, by keys, Ottilie's spells read ${seen[0]}; Cast, the spell and a group take a charge each time (${after.join(', ')} left), and once spent: ${seen[4]}`);
  } finally {
    CombatScreen.instant = false;
  }
  // A spell, out of a fight: the charges spent are kept through a save and come back whole at dawn, slept or not.
  const g2 = headlessGame(4), w2 = g2.world;
  g2.party.spent = { [knife.id]: 2 };
  const kept = deserialize(serialize(w2.state, g2.party, 0)).party, day = Math.floor(w2.state.minutes / MINUTES_PER_DAY), dawn = dawnOf(day + 1);
  w2.state.minutes = dawn - 61; w2.advance(60); const night = chargesLeft(g2.party, knife.id);
  w2.advance(1); const morning = chargesLeft(g2.party, knife.id);
  const old = deserialize(serialize(w2.state, { ...g2.party, spent: undefined }, 0)).party;
  ok(kept.spent?.[knife.id] === 2 && night === 1 && morning === 3 && !g2.party.spent && chargesLeft(old, knife.id) === 3 && chargesLeft(g2.party, ITEMS.telstok.id) === 0,
    `a save keeps two of Holdfast's castings spent (${chargesLeft(kept, knife.id)} left); the hour before dawn ${night} is left, and at dawn all ${morning} come back; a save without the field has them all`);
}

/**
 * The sheet (#847): an artifact with a slot says its power on its slot's line and one carried a line
 * of its own; the fullest member of every class ends above the panel's foot; and a piece's words are
 * read as it is taken up from the pack.
 */
function sheet(): void {
  const q = defaultParty(makeRng(1)), [b2, , w2, o2, m2] = q.members;
  equip(w2, ITEMS.akkush.id); equip(w2, ITEMS.erzhemd.id); equip(m2, ITEMS.telstok.id); equip(o2, ITEMS.holdfast.id);
  b2.pack.push(ITEMS.hagstone.id); equip(b2, ITEMS.torhide.id); m2.pack.push(ITEMS.wakerobe.id);
  const said = [weaponLine(w2), slotLine(w2, 'armor'), weaponLine(m2), weaponLine(o2), slotLine(b2, 'shield'), ...artifactLines(b2), ...artifactLines(m2), ...artifactLines(w2)];
  const glyphs = (t: string): boolean => [...t.toUpperCase()].every((ch) => ch === ' ' || FONT_CHARS.includes(ch));
  ok(said.join(' / ') === "WEAPON Akkush, ACCURACY +5 / ARMOUR The Erzhemd, SPEED +5 / WEAPON The Telstok, HOLY BLOWS / WEAPON Holdfast, GRASPING ROOTS 3 A DAY / SHIELD Torhide, MENDS A TENTH AN HOUR / ARTIFACT The Hagstone, NEVER PARALYSED",
    `the sheet says each artifact borne and its power, on its slot's line or, carried, a line of its own: ${said.join(' / ')}; none for armour in the pack`);
  // The fullest member of each class: at the cap, every skill, every spell of their list, a resistance and
  // every artifact they may bear at once, the stone carried.
  const ends: string[] = [], wide: string[] = [];
  for (const cls of Object.keys(CLASSES) as ClassId[]) {
    const c = createCharacter('Wenceslaus', 'human', cls, {}, makeRng(1));
    Object.assign(c, { level: MAX_LEVEL, prestige: 3, tiers: { arms: 'master', magic: 'master' }, skills: Object.keys(SKILLS), blessed: [{ element: 'fire' }], hp: 999, maxHp: 999, sp: 999, maxSp: 999 });
    c.spells = Object.values(SPELLS).filter((x) => x.list === CLASSES[cls].spells).map((x) => x.id);
    c.conditions = ['poisoned', 'diseased', 'cursed'];
    for (const d of ARTS) if (d.slot === 'none') c.pack.push(d.id); else if (!d.classes || d.classes.includes(cls)) equip(c, d.id);
    const rows = sheetRows(c), last = rows.at(-1)!;
    ends.push(`${cls} ${last.y + 7}`);
    for (const r of rows) if (!r.text.startsWith('SPELLS ') && (measureText(r.text) > SHEET_COL_W || !glyphs(r.text))) wide.push(r.text);
  }
  ok(ends.every((e) => Number(e.split(' ')[1]) <= SHEET_FOOT) && !wide.length,
    `the fullest member of every class, the stone carried, ends above the sheet's foot at ${SHEET_FOOT} (${ends.join(', ')}), every line but the spells' in the font and the ${SHEET_COL_W} px column${wide.length ? ' -> ' + wide.join('; ') : ''}`);
  // Each artifact's own line, with the most a bearer adds after it (a master's tier at arms), in the font and the column.
  const lineOf = (d: ItemDef): string => {
    const c = createCharacter('Wenceslaus', 'human', (d.classes?.[0] ?? 'knight') as ClassId, {}, makeRng(1));
    c.tiers = { arms: 'master' }; c.equipment.weapon = null; c.equipment.shield = null;
    if (d.slot === 'none') { c.pack.push(d.id); return artifactLines(c)[0] ?? ''; }
    equip(c, d.id);
    return d.slot === 'weapon' ? weaponLine(c) : slotLine(c, d.slot === 'armor' ? 'armor' : 'shield');
  };
  const own = ARTS.map(lineOf), widest = own.reduce((a, b) => (measureText(b) > measureText(a) ? b : a));
  ok(own.every((l) => l.includes(power(ITEMS[ARTS[own.indexOf(l)].id])) && glyphs(l) && measureText(l) <= SHEET_COL_W),
    `each of the ${own.length} artifacts' sheet lines says its power in the font's glyphs inside the ${SHEET_COL_W} px column (the widest ${measureText(widest)}: ${widest})`);
  // The SPELLS line runs on past the column into the item list's, so it starts under the list's last row,
  // for a member with nothing more above it as for the fullest.
  const lastItem = SHEET_ITEMS_Y + (SHEET_ITEMS - 1) * (lineHeight() + 1), tops: string[] = [];
  for (const cls of Object.keys(CLASSES) as ClassId[]) {
    if (!CLASSES[cls].spells) continue;
    const c = createCharacter('Wenceslaus', 'human', cls, {}, makeRng(1));
    tops.push(`${cls} ${sheetRows(c).find((r) => r.text.startsWith('SPELLS '))?.y}`);
  }
  ok(tops.every((t) => Number(t.split(' ')[1]) >= lastItem + lineHeight() - 1),
    `the SPELLS line, which runs on into the item list, starts under its ${SHEET_ITEMS}th row at ${lastItem} for a caster with least above it (${tops.join(', ')})`);
  // The words: Space on the Telstok in the bag puts it in Maren's hands and shows its two lines.
  const g = headlessGame(4), at = 4;
  g.party.bag = [ITEMS.telstok.id];
  g.push(new SheetScreen(at));
  drive(g, [...Array(g.party.members[at].pack.length).fill('down'), 'interact']);
  const box = g.top instanceof MessageScreen ? g.top.text : '';
  ok(box === ITEMS.telstok.text!.join('\n\n') && g.party.members[at].equipment.weapon === ITEMS.telstok.id,
    `Space on the Telstok in the bag puts it in ${g.party.members[at].name}'s hands and shows its words: ${box.replace('\n\n', ' / ')}`);
}
