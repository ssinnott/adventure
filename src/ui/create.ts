// Party creation: six characters, each named, raced, classed and rolled, or the premade company
// for players who want to be walking in thirty seconds.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText } from '../lib/engine/text.ts';
import { makeRng } from '../lib/engine/rng.ts';
import type { RngInstance } from '../lib/engine/rng.ts';
import { panel, menu, paragraph } from './draw.ts';
import { INK, BRASS, TEXT, TEXT_DIM, YELLOW, GREEN } from './palette.ts';
import { RACES, CLASSES, STATS, createCharacter, createParty, defaultParty, bonus } from '../game/party.ts';
import type { Character, RaceId, ClassId, Stats } from '../game/party.ts';

type Step = 'intro' | 'name' | 'race' | 'class' | 'stats' | 'review';

const RACE_IDS = Object.keys(RACES) as RaceId[];
const CLASS_IDS = Object.keys(CLASSES) as ClassId[];
const SUGGESTED = ['Bram', 'Idris', 'Wren', 'Ottilie', 'Maren', 'Cassian', 'Tamsin', 'Hollis', 'Aveline', 'Rook', 'Sable', 'Piran'];

function rollStats(rng: RngInstance): Stats {
  const s = {} as Stats;
  for (const k of STATS) s[k] = 8 + rng.int(1, 4) + rng.int(1, 4);
  return s;
}

export class CreateScreen implements Screen {
  private step: Step = 'intro';
  private sel = 0;
  private slot = 0;
  private name = '';
  private race: RaceId = 'human';
  private cls: ClassId = 'knight';
  private stats: Stats;
  private members: Character[] = [];
  private rng: RngInstance;
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
    this.rng = makeRng(seed);
    this.stats = rollStats(this.rng);
  }

  private setText(g: Game, on: boolean): void { if (g.input) g.input.textMode = on; }

  update(g: Game, a: Action | null): void {
    // Text entry runs every step, action or not.
    if (this.step === 'name' && g.input) this.name = g.input.drainText(this.name, 10);
    if (!a) return;
    switch (this.step) {
      case 'intro':
        if (is(a, 'up', 'down')) this.sel = 1 - this.sel;
        else if (is(a, 'cancel')) g.pop();
        else if (is(a, 'interact')) {
          if (this.sel === 0) { g.rng.seed(this.seed); g.newGame(this.seed, defaultParty(g.rng)); }
          else { this.slot = 0; this.beginSlot(g); }
        }
        break;
      case 'name':
        if (is(a, 'cancel')) { this.setText(g, false); if (this.slot === 0) this.step = 'intro'; else { this.members.pop(); this.slot--; this.beginSlot(g); } }
        else if (is(a, 'interact', 'next')) { if (!this.name.trim()) this.name = SUGGESTED[this.slot]; this.setText(g, false); this.step = 'race'; this.sel = RACE_IDS.indexOf(this.race); }
        break;
      case 'race':
        if (is(a, 'up')) this.sel = (this.sel + RACE_IDS.length - 1) % RACE_IDS.length;
        else if (is(a, 'down')) this.sel = (this.sel + 1) % RACE_IDS.length;
        else if (is(a, 'cancel')) { this.step = 'name'; this.setText(g, true); }
        else if (is(a, 'interact')) { this.race = RACE_IDS[this.sel]; this.step = 'class'; this.sel = CLASS_IDS.indexOf(this.cls); }
        break;
      case 'class':
        if (is(a, 'up')) this.sel = (this.sel + CLASS_IDS.length - 1) % CLASS_IDS.length;
        else if (is(a, 'down')) this.sel = (this.sel + 1) % CLASS_IDS.length;
        else if (is(a, 'cancel')) { this.step = 'race'; this.sel = RACE_IDS.indexOf(this.race); }
        else if (is(a, 'interact')) { this.cls = CLASS_IDS[this.sel]; this.step = 'stats'; this.sel = 0; }
        break;
      case 'stats':
        if (is(a, 'rest')) this.stats = rollStats(this.rng);
        else if (is(a, 'cancel')) { this.step = 'class'; this.sel = CLASS_IDS.indexOf(this.cls); }
        else if (is(a, 'interact')) {
          this.members.push(createCharacter(this.name.trim(), this.race, this.cls, this.stats, this.rng));
          this.slot++;
          if (this.slot >= 6) { this.step = 'review'; this.sel = 0; }
          else this.beginSlot(g);
        }
        break;
      case 'review':
        if (is(a, 'up', 'down')) this.sel = 1 - this.sel;
        else if (is(a, 'cancel')) { this.members.pop(); this.slot = 5; this.beginSlot(g); }
        else if (is(a, 'interact')) {
          if (this.sel === 0) { g.rng.seed(this.seed); g.newGame(this.seed, createParty(this.members)); }
          else { this.members = []; this.slot = 0; this.beginSlot(g); }
        }
        break;
    }
  }

  private beginSlot(g: Game): void {
    this.step = 'name'; this.name = ''; this.stats = rollStats(this.rng);
    // Suggest a spread of classes so a first party is not six knights.
    this.cls = CLASS_IDS[this.slot % CLASS_IDS.length]; this.race = RACE_IDS[this.slot % RACE_IDS.length];
    this.setText(g, true);
  }

  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, 640, 360);
    panel(ctx, 16, 16, 608, 328);
    drawText(ctx, 'THE CHARTER', 32, 28, { size: 2, color: BRASS });
    // The company so far, down the right.
    drawText(ctx, 'THE COMPANY', 420, 30, { size: 1, color: TEXT_DIM });
    for (let i = 0; i < 6; i++) {
      const m = this.members[i];
      const row = i < 3 ? 'FRONT' : 'BACK';
      const line = m ? `${i + 1}. ${m.name}  ${RACES[m.race].name} ${CLASSES[m.cls].name}` : i === this.slot && this.step !== 'intro' && this.step !== 'review' ? `${i + 1}. ...` : `${i + 1}. -`;
      drawText(ctx, line, 420, 44 + i * 12, { size: 1, color: m ? TEXT : TEXT_DIM });
      if (i === 0 || i === 3) drawText(ctx, row, 600, 44 + i * 12, { size: 1, color: TEXT_DIM, align: 'right' });
    }
    const x = 32; let y = 60;
    switch (this.step) {
      case 'intro':
        y = paragraph(ctx, 'Every adventuring company in Caldera works under a Charter. Yours is fresh ink. Six of you, three in front to take the blows and three behind to deliver them.', x, y, 360, { color: TEXT }) + 10;
        menu(ctx, ['Take the premade company (a balanced six)', 'Muster your own'], x, y, this.sel);
        break;
      case 'name':
        drawText(ctx, `MEMBER ${this.slot + 1} OF 6  (${this.slot < 3 ? 'FRONT ROW' : 'BACK ROW'})`, x, y, { size: 1, color: TEXT_DIM }); y += 16;
        drawText(ctx, 'NAME', x, y, { size: 1, color: BRASS }); y += 12;
        drawText(ctx, (this.name || '') + ((frame >> 4) & 1 ? '_' : ' '), x, y, { size: 2, color: TEXT }); y += 24;
        drawText(ctx, `TYPE A NAME, OR ENTER FOR "${SUGGESTED[this.slot].toUpperCase()}"`, x, y, { size: 1, color: TEXT_DIM });
        break;
      case 'race':
        drawText(ctx, `${this.name.toUpperCase()}  -  RACE`, x, y, { size: 1, color: BRASS }); y += 14;
        y = menu(ctx, RACE_IDS.map((r) => RACES[r].name), x, y, this.sel) + 6;
        paragraph(ctx, RACES[RACE_IDS[this.sel]].blurb + '  ' + modsText(RACE_IDS[this.sel]), x, y, 360, { color: TEXT });
        break;
      case 'class':
        drawText(ctx, `${this.name.toUpperCase()} THE ${RACES[this.race].name.toUpperCase()}  -  CLASS`, x, y, { size: 1, color: BRASS }); y += 14;
        y = menu(ctx, CLASS_IDS.map((c) => CLASSES[c].name), x, y, this.sel) + 6;
        paragraph(ctx, CLASSES[CLASS_IDS[this.sel]].blurb + `  Kit: ${CLASSES[CLASS_IDS[this.sel]].kit.join(', ')}.`, x, y, 360, { color: TEXT });
        break;
      case 'stats': {
        drawText(ctx, `${this.name.toUpperCase()}, ${RACES[this.race].name.toUpperCase()} ${CLASSES[this.cls].name.toUpperCase()}  -  STATS`, x, y, { size: 1, color: BRASS }); y += 14;
        for (const s of STATS) {
          const mod = RACES[this.race].mods[s] ?? 0;
          const v = this.stats[s] + mod;
          drawText(ctx, s.toUpperCase(), x, y, { size: 1, color: TEXT_DIM });
          drawText(ctx, String(v), x + 90, y, { size: 1, color: v >= 14 ? GREEN : v <= 9 ? YELLOW : TEXT, align: 'right' });
          if (mod) drawText(ctx, `(${mod > 0 ? '+' : ''}${mod} ${RACES[this.race].name})`, x + 100, y, { size: 1, color: TEXT_DIM });
          drawText(ctx, bonusText(bonus(v)), x + 200, y, { size: 1, color: TEXT_DIM });
          y += 11;
        }
        y += 6;
        drawText(ctx, 'R  REROLL      SPACE  ACCEPT      ESC  BACK', x, y, { size: 1, color: TEXT_DIM });
        break;
      }
      case 'review':
        y = paragraph(ctx, 'The company is mustered. The Regent-Warden is hiring, the Hearth is flickering, and the road south is open.', x, y, 360, { color: TEXT }) + 10;
        menu(ctx, ['Sign the Charter', 'Start over'], x, y, this.sel);
        break;
    }
    drawText(ctx, 'ARROWS CHOOSE   SPACE CONFIRM   ESC BACK', 608, 328, { size: 1, color: TEXT_DIM, align: 'right' });
  }
}

function modsText(r: RaceId): string {
  const m = RACES[r].mods;
  const parts = STATS.filter((s) => m[s]).map((s) => `${s.slice(0, 3)} ${m[s]! > 0 ? '+' : ''}${m[s]}`);
  return parts.length ? parts.join(', ') + '.' : 'No stat changes.';
}
function bonusText(b: number): string { return b === 0 ? '' : b > 0 ? `+${b}` : String(b); }
