// The wiki's page (wiki.html): the peoples, the classes, every pairing's first numbers and the
// bestiary, laid out from src/app/wiki/pages.ts and drawn by the game's own painters, a portrait by
// ui/portraits.ts and a monster by ui/sprites.ts as the fight draws it. Nothing is written here that
// the tables do not say, so the page cannot drift from the game; it says it is drawn by setting
// `data-ready` on its body, which the smoke's `wiki` part waits for before it counts the entries and
// checks each picture painted. A monster's card plays its idle while the pointer is on it.
import { drawPortrait } from '../../ui/portraits.ts';
import { drawMonsterSprite, SPAN } from '../../ui/sprites.ts';
import { createCharacter, CLASSES, RACES, STATS, type ClassId, type RaceId } from '../../game/party.ts';
import { makeRng } from '../../lib/engine/rng.ts';
import { TABLES } from '../../content/index.ts';
import { CALLING, STAT_NAME, bestiary, classes, featsOn, kinds, races, signed, starts, type Monster } from './pages.ts';

type Child = Node | string | number | null | undefined | false;

/** An element with its attributes and children; a child that is null, undefined or false is left out. */
function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  for (const c of children) if (c !== null && c !== undefined && c !== false) e.append(typeof c === 'number' ? String(c) : c);
  return e;
}

/** A table: its head, its rows and the columns that hold numbers, set right. */
function table(head: readonly string[], rows: readonly (readonly Child[])[], numeric: readonly number[] = [], attrs: Record<string, string> = {}): HTMLTableElement {
  const cls = (i: number): Record<string, string> => (numeric.includes(i) ? { class: 'num' } : {});
  return el('table', attrs,
    el('thead', {}, el('tr', {}, ...head.map((h, i) => el('th', cls(i), h)))),
    el('tbody', {}, ...rows.map((r) => el('tr', {}, ...r.map((c, i) => el('td', cls(i), c))))));
}

// ---- Pictures -----------------------------------------------------------------------------------

const PORTRAIT_W = 36, PORTRAIT_H = 46;

/** A member's portrait, as the party bar paints it, at `scale` with its pixels kept square. */
function portrait(race: RaceId, cls: ClassId, name: string, scale = 2): HTMLCanvasElement {
  const cv = el('canvas', { width: String(PORTRAIT_W), height: String(PORTRAIT_H), class: 'portrait', 'data-picture': 'portrait' });
  cv.style.width = `${PORTRAIT_W * scale}px`; cv.style.height = `${PORTRAIT_H * scale}px`;
  cv.title = `${RACES[race].name} ${CLASSES[cls].name}`;
  const c = createCharacter(TABLES, name, race, cls, CLASSES[cls].stats, makeRng(1));
  drawPortrait(cv.getContext('2d')!, c, 0, 0);
  return cv;
}

const SPRITE_BOX = 120;

/** A monster as the fight draws it, fitted to its box by its height and its span, its idle played while the pointer is on it. */
function sprite(m: Monster): HTMLCanvasElement {
  const cv = el('canvas', { width: String(SPRITE_BOX), height: String(SPRITE_BOX), class: 'sprite', 'data-picture': 'monster' });
  const ctx = cv.getContext('2d')!;
  const [left, right] = SPAN[m.sprite];
  const h = Math.min(SPRITE_BOX * 0.88, (SPRITE_BOX - 8) / Math.max(left + right, 0.01));
  const x = SPRITE_BOX / 2 + ((left - right) * h) / 2, y = SPRITE_BOX - 5;
  const paint = (frame: number): void => { ctx.clearRect(0, 0, SPRITE_BOX, SPRITE_BOX); drawMonsterSprite(ctx, m.sprite, x, y, h, m.tint, 1, frame); };
  paint(0);
  let raf = 0, frame = 0;
  const tick = (): void => { paint(++frame); raf = requestAnimationFrame(tick); };
  cv.addEventListener('pointerenter', () => { if (!raf) raf = requestAnimationFrame(tick); });
  cv.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); raf = 0; frame = 0; paint(0); });
  return cv;
}

// ---- The sections -------------------------------------------------------------------------------

const STAT_HEAD = STATS.map((s) => STAT_NAME[s].slice(0, 3));

function section(id: string, title: string, ...children: Child[]): HTMLElement {
  return el('section', { id }, el('h2', {}, el('a', { href: `#${id}` }, title)), ...children);
}

function racesSection(): HTMLElement {
  const rs = races();
  return section('races', 'Races',
    el('p', {}, 'Six peoples. A people adds to its class’s starting stats; the class sets the rest. Every stat starts at 10.'),
    table(['', 'Race', ...STAT_HEAD, 'Resists', 'Swims', 'Note'],
      rs.map((r) => [el('span', { class: 'faces' }, portrait(r.id, 'knight', `${r.name} one`), portrait(r.id, 'cleric', `${r.name} two`)),
        el('strong', {}, r.name), ...STATS.map((s) => signed(r.mods[s])), r.resists.join(', ') || '—', r.swims ? 'yes' : '—', r.note]),
      STATS.map((_, i) => i + 2), { 'data-table': 'races' }));
}

function classesSection(): HTMLElement {
  const cs = classes(), all = starts(), on = featsOn();
  const summary = table(['', 'Class', 'Hit die', 'Spell die', 'Casts', 'To-hit', 'Traits', 'Grows as'],
    cs.map((c) => [portrait('human', c.id, `${c.name} badge`), el('a', { href: `#class-${c.id}` }, c.name), `d${c.hpDie}`, c.spDie ? `d${c.spDie}` : '—',
      c.spells ? `${c.spells} list, by ${c.spStat}` : '—', signed(c.attack), c.traits.map((t) => t.name).join(', '), c.calling]),
    [2, 3, 5], { 'data-table': 'classes' });
  const one = (c: ReturnType<typeof classes>[number]): HTMLElement => el('article', { id: `class-${c.id}`, class: 'class', 'data-class': c.id },
    el('header', {}, portrait('human', c.id, `${c.name} badge`, 3), el('div', {},
      el('h3', {}, c.name), el('p', { class: 'note' }, c.note),
      el('p', {}, `Hit die d${c.hpDie}. `, c.spells ? `Spell die d${c.spDie}, from ${c.spStat}; casts from the ${c.spells} list. ` : 'Casts nothing. ',
        `To-hit ${signed(c.attack)}, and half its level. Starts with ${c.kit.join(', ')}.`))),
    el('h4', {}, 'Traits'),
    table(['Trait', 'What it does'], c.traits.map((t) => [el('strong', {}, t.name), t.text])),
    el('h4', {}, 'Prestiges'),
    el('p', {}, `The ${c.name.toLowerCase()} is ${CALLING[c.calling]}. Each prestige adds ${c.pools.hp} hit point${c.pools.hp === 1 ? '' : 's'}`,
      c.pools.sp ? ` and ${c.pools.sp} spell point${c.pools.sp === 1 ? '' : 's'}` : '', ' to every level from its own on; its title becomes the class’s name.'),
    table(['Title', 'Level', 'Costs'], c.prestiges.map((p) => [el('strong', {}, p.title), p.level, p.cost]), [1]),
    c.feats.length > 0 && el('h4', {}, 'Feats'),
    c.feats.length > 0 && !on && el('p', { class: 'aside' }, 'Built, but not yet in play.'),
    c.feats.length > 0 && table(['Level', 'Feat', 'Stamina', 'What it does'], c.feats.map((f) => [f.level, el('strong', {}, f.name), f.cost, f.text]), [0, 2]),
    el('h4', {}, 'At level 1, by people'),
    table(['Race', ...STAT_HEAD, 'HP', 'SP', 'AC', 'To-hit'],
      all.filter((s) => s.cls === c.id).map((s) => [RACES[s.race].name, ...STATS.map((k) => s.stats[k]), s.hp, s.sp, s.ac, signed(s.toHit)]),
      [...STATS.map((_, i) => i + 1), STATS.length + 1, STATS.length + 2, STATS.length + 3, STATS.length + 4]));
  return section('classes', 'Classes',
    el('p', {}, 'Ten classes, each with three prestiges, at levels 11, 19 and 27. A class sets its stats; its people’s go on top.'),
    summary, ...cs.map(one));
}

function pairingsSection(): HTMLElement {
  const all = starts(), rs = Object.values(RACES), cs = Object.values(CLASSES);
  return section('pairings', 'Every pairing',
    el('p', {}, 'Each people as each class at level 1, with the hit points and spell points it starts on.'),
    el('div', { class: 'scroll' }, table(['', ...rs.map((r) => r.name)], cs.map((c) => [el('strong', {}, c.name), ...rs.map((r) => {
      const s = all.find((x) => x.race === r.id && x.cls === c.id)!;
      return el('figure', { class: 'pair' }, portrait(r.id, c.id, `${r.name} ${c.name}`), el('figcaption', {}, `${s.hp} hp`, s.sp ? ` · ${s.sp} sp` : ''));
    })]), [], { class: 'grid', 'data-table': 'pairings' })));
}

function card(m: Monster): HTMLElement {
  return el('article', { class: 'monster', id: `monster-${m.id}`, 'data-monster': m.id, 'data-kind': m.kind, 'data-name': m.name.toLowerCase() },
    sprite(m),
    el('h4', {}, m.name),
    el('p', { class: 'kind' }, `${m.kind} · level ${m.level}`),
    table(['HP', 'AC', 'Hit', 'Blow', 'Spd', 'XP', 'Gold'], [[m.hp, m.ac, signed(m.toHit), m.blow, m.speed, m.xp, m.gold]], [0, 1, 2, 4, 5], { class: 'stats' }),
    m.look && el('p', { class: 'look' }, m.look),
    m.does && el('p', {}, el('strong', {}, 'Does: '), m.does),
    m.drops.length > 0 && el('p', {}, el('strong', {}, 'Drops: '), m.drops.map((d) => `${d.name} (${Math.round(d.chance * 100)}%)`).join(', ')));
}

function bestiarySection(): HTMLElement {
  const areas = bestiary(), count = areas.reduce((n, a) => n + a.monsters.length, 0);
  const find = el('input', { type: 'search', placeholder: 'Find a monster', 'aria-label': 'Find a monster' });
  const kindPick = el('select', { 'aria-label': 'Kind' }, el('option', { value: '' }, 'Every kind'), ...kinds().map((k) => el('option', { value: k.id }, k.id)));
  const filter = (): void => {
    const q = find.value.trim().toLowerCase(), k = kindPick.value;
    for (const a of Array.from(document.querySelectorAll<HTMLElement>('.area'))) {
      let shown = 0;
      for (const c of Array.from(a.querySelectorAll<HTMLElement>('.monster'))) {
        const show = (!q || c.dataset.name!.includes(q)) && (!k || c.dataset.kind === k);
        c.hidden = !show; if (show) shown++;
      }
      a.hidden = !shown;
    }
  };
  find.addEventListener('input', filter); kindPick.addEventListener('change', filter);
  return section('bestiary', 'Bestiary',
    el('p', {}, `${count} monsters, by area in the road’s order. Hover over one to see it move.`),
    el('h3', { id: 'kinds' }, 'Kinds'),
    el('p', {}, 'Every monster is of a kind, which says what works on it. A card lists only what the monster adds to its kind.'),
    table(['Kind', 'Shrugs off', 'Resists', 'Weak to', 'Holy Strike', 'Breaks'],
      kinds().map((k) => [el('strong', {}, k.id), k.immune || '—', k.resists || '—', k.weak || '—', k.holy ? 'bites' : '—', k.breaks]), [], { 'data-table': 'kinds' }),
    el('div', { class: 'filter' }, find, kindPick),
    ...areas.map((a) => el('section', { class: 'area', id: `area-${a.id}`, 'data-area': a.id },
      el('h3', {}, a.name, a.band ? el('span', { class: 'band' }, ` levels ${a.band[0]}–${a.band[1]}`) : null),
      el('div', { class: 'cards' }, ...a.monsters.map(card)))));
}

// ---- The page -----------------------------------------------------------------------------------

const root = document.getElementById('wiki')!;
const areas = bestiary();
root.append(
  el('nav', {},
    el('a', { href: '#races' }, 'Races'), el('a', { href: '#classes' }, 'Classes'), el('a', { href: '#pairings' }, 'Pairings'),
    el('a', { href: '#bestiary' }, 'Bestiary'),
    el('span', { class: 'areas' }, ...areas.map((a) => el('a', { href: `#area-${a.id}` }, a.name)))),
  el('main', {}, racesSection(), classesSection(), pairingsSection(), bestiarySection()),
);
// A link to a section follows it once the page is drawn, as the browser could not before.
if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
document.body.dataset.ready = 'true';
