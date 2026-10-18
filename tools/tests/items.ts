// An item past a plus (#855): a stat it raises while it is borne (`statOf`) and an element its blows
// carry (an added die), held on fixtures, since no item of the content carries either yet; and what a
// shop pays for an item (`sellPrice`). The content is held to the shape only, so the areas may add.
import { ITEMS, MAP_DEFS, MONSTERS } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/map.ts';
import { hits, sellPrice, ELEMENT_DIE } from '../../src/game/items.ts';
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
import { statText, weaponLine, describe, businessEntries } from '../../src/ui/screens.ts';
import { FONT_CHARS, measureText } from '../../src/lib/engine/text.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ok, headlessGame, drive } from './lib.ts';

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
const FIXTURES = [COAT, TWIN, PLAIN, STORM, BRAND, SHIELD, TRUE, ...Object.values(CHARMS)];

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
