// An item past a plus (#855): a stat it raises while it is borne (`statOf`) and an element its blows
// carry (an added die), held on fixtures, since no item of the content carries either yet; and what a
// shop pays for an item (`sellPrice`). The content is held to the shape only, so the areas may add.
// And the bounds' artifacts (#847): their mark, their shape, where each is found, their powers as any
// item's, the shop that will not take one and the sheet's line for each.
import { ITEMS, MAP_DEFS, MONSTERS, AREAS } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/map.ts';
import { hits, sellPrice, ELEMENT_DIE, ARTIFACT_RAISE, REFUSED } from '../../src/game/items.ts';
import { ARTIFACT_PRICE } from '../../src/content/items.ts';
import { giftOf } from '../../src/game/wilds.ts';
import { personGives } from '../../src/game/people.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { defaultParty, equip, armorClass, attackBonus, spellHeal, statOf, itemsChanged, STATS } from '../../src/game/party.ts';
import type { Party, Stat } from '../../src/game/party.ts';
import { ELEMENTS } from '../../src/game/spells.ts';
import type { Element } from '../../src/game/spells.ts';
import { startCombat, currentTurn, partyAct, monsterAct } from '../../src/game/combat.ts';
import type { CombatState } from '../../src/game/combat.ts';
import { elementMult } from '../../src/game/monsters.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { TIER_NAMES } from '../../src/game/mastery.ts';
import type { Tier } from '../../src/game/mastery.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { statText, weaponLine, describe, businessEntries, artifactLines, power, SHEET_COL_W } from '../../src/ui/screens.ts';
import type { ChoiceScreen } from '../../src/ui/screens.ts';
import { FONT_CHARS, measureText } from '../../src/lib/engine/text.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ok, owed, headlessGame, drive } from './lib.ts';

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
 * The bounds' artifacts built so far (DESIGN §9, #847): each with its area, whose items define it, the
 * Hand's piece whose numbers it betters by a point, and who may bear it. The second half of #847 adds
 * the other five, with the three kinds of power not yet built.
 */
const BUILT: Readonly<Record<string, { area: string; hand: string; classes: readonly string[] }>> = {
  telstok: { area: 'saltreach', hand: 'grey_staff', classes: ['cleric', 'sorcerer', 'druid', 'monk'] },
  erzhemd: { area: 'kilns', hand: 'grey_mail', classes: ['knight', 'paladin', 'ranger', 'thief', 'barbarian', 'bard', 'druid'] },
  akkush: { area: 'glasswold', hand: 'grey_bow', classes: ['ranger'] },
};
/**
 * The artifacts no lair holds yet, each its area's issue's, which lays the lair and places it: reported
 * as that issue's while it waits and failed once it is placed, so its entry is dropped. The table only
 * shrinks, as maps.ts's UNPLACED does: an artifact comes into it only as it is defined.
 */
const UNPLACED: Readonly<Record<string, string>> = { telstok: '#830', erzhemd: '#831', akkush: '#833' };
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
  for (const d of FIXTURES) ITEMS[d.id] = d;
  itemsChanged();
  try {
    raised();
    blows();
    shown();
    sold();
    artifacts();
  } finally {
    for (const d of FIXTURES) delete ITEMS[d.id];
    itemsChanged();
  }
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
    ITEMS.test_long_blade = { ...STORM, id: 'test_long_blade', name: 'A'.repeat(n) };
    const e = endOf(ITEMS.test_long_blade);
    delete ITEMS.test_long_blade;
    return e;
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

/** What is wrong with an artifact (DESIGN §9): not one power of a kind built, a raise past the bound, a plus, a resistance, a skill or a use, no words of two lines, or another price. */
function artifactFaults(d: ItemDef): string[] {
  const out: string[] = [], raises = Object.values(d.stat ?? {}), powers = raises.length + (d.element ? 1 : 0);
  if (powers !== 1) out.push(`${d.id}: ${powers} powers`);
  for (const n of raises) if (n < 1 || n > ARTIFACT_RAISE) out.push(`${d.id}: a raise of ${n}, not 1 to ${ARTIFACT_RAISE}`);
  for (const k of ['plus', 'resist', 'skill', 'use'] as const) if (d[k] !== undefined) out.push(`${d.id}: a ${k}`);
  if (d.text?.length !== 2) out.push(`${d.id}: not two lines of words`);
  if (d.price !== ARTIFACT_PRICE) out.push(`${d.id}: at ${d.price}, not ${ARTIFACT_PRICE}`);
  return out;
}

/** Where an item lies in the world: each chest, gift or person's hand that gives it, and each monster that drops it. */
const placesOf = (id: string): string[] => [
  ...MAP_DEFS.flatMap((m) => (m.features ?? []).filter((f) => [...(giftOf(f)?.items ?? []), ...(f.kind === 'npc' ? personGives(f) : [])].includes(id)).map((f) => `${m.id} ${f.kind} ${f.x},${f.y}`)),
  ...Object.values(MONSTERS).filter((m) => (m.drops ?? []).some((x) => x.item === id)).map((m) => `${m.id}'s drop`),
];

/** The bounds' artifacts (#847): of the shape, one in the world, sold nowhere, their powers as any item's, refused by a shop and said on the sheet. */
function artifacts(): void {
  const want = Object.keys(BUILT).sort().join(), have = ARTS.map((d) => d.id).sort().join();
  ok(have === want, `the artifacts in the item tables are DESIGN §9's built so far, ${want} (${have})`);
  const caught = (d: ItemDef, want: string): void => { const got = artifactFaults(d).join('; '); ok(got === want, `the artifact's check catches ${want} (${got || 'nothing'})`); };
  const tel = ITEMS.telstok, erz = ITEMS.erzhemd, akk = ITEMS.akkush;
  caught({ ...erz, element: 'fire' }, 'erzhemd: 2 powers');
  caught({ ...erz, stat: { speed: ARTIFACT_RAISE + 1 } }, `erzhemd: a raise of ${ARTIFACT_RAISE + 1}, not 1 to ${ARTIFACT_RAISE}`);
  caught({ ...tel, resist: ['cold'] }, 'telstok: a resist');
  caught({ ...akk, price: 6900 }, `akkush: at 6900, not ${ARTIFACT_PRICE}`);
  const stocked = new Set(MAP_DEFS.flatMap((m) => (m.features ?? []).flatMap((f) => (f.kind === 'shop' ? f.stock : []))));
  for (const d of ARTS) {
    const b = BUILT[d.id], h = b ? ITEMS[b.hand] : undefined, bad = artifactFaults(d);
    const homed = !!b && !!AREAS.find((a) => a.id === b.area)?.items.some((x) => x.id === d.id);
    const point = !h ? 0 : d.slot === 'weapon' ? (d.bonus ?? 0) - (h.bonus ?? 0) : (d.ac ?? 0) - (h.ac ?? 0);
    const like = !!h && d.slot === h.slot && d.dice === h.dice && d.sides === h.sides && !!d.twoHanded === !!h.twoHanded && !!d.ranged === !!h.ranged && d.kind === h.kind;
    ok(homed && !bad.length && point === 1 && like && (d.classes ?? []).join() === b.classes.join(),
      `${d.name}: an artifact in ${b?.area}'s items, one power (${power(d)}), the ${h?.name}'s numbers and a point, for the ${b?.classes.join(', ')}${bad.length ? ' -> ' + bad.join('; ') : ''}`);
    ok(!stocked.has(d.id), `${d.name}: no shop sells it`);
    const at = placesOf(d.id), once = at.length === 1 && !at[0].endsWith('drop');
    const msg = `${d.name} is one in the world, in one chest, gift or person's hand and no drop${at.length ? ` (${at.join(', ')})` : ''}`;
    if (Object.hasOwn(UNPLACED, d.id)) owed(once, msg, UNPLACED[d.id]); else ok(once, msg);
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

  // The sheet says each artifact borne and its power, a line each; none for one in the pack and not
  // worn, or for a twin without the mark; in the font's glyphs and inside the sheet's column.
  const q = defaultParty(makeRng(1)), [b2, , w2, , m2] = q.members;
  equip(w2, akk.id); equip(w2, erz.id); equip(m2, tel.id);
  b2.pack.push(erz.id); equip(b2, TWINS.erzhemd.id);
  const said = [...artifactLines(w2), ...artifactLines(m2)], lines = ARTS.map((d) => `ARTIFACT ${d.name}, ${power(d)}`);
  const glyphs = (t: string): boolean => [...t.toUpperCase()].every((ch) => ch === ' ' || FONT_CHARS.includes(ch));
  ok(said.join(' / ') === 'ARTIFACT Akkush, ACCURACY +5 / ARTIFACT The Erzhemd, SPEED +5 / ARTIFACT The Telstok, HOLY BLOWS' && !artifactLines(b2).length,
    `the sheet says each artifact borne and its power, a line each: ${said.join(' / ')}; none for one in the pack or a twin without the mark`);
  ok(lines.every(glyphs) && lines.every((l) => measureText(l) <= SHEET_COL_W), `every artifact's line is in the font's glyphs and inside the sheet's ${SHEET_COL_W} px column (the widest ${Math.max(...lines.map((l) => measureText(l)))})`);
}
