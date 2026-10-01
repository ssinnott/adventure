// The Foreland's items: what Helmstow sells past the kits, what Brandy Hole's chests hold, the finds
// of the Downs (the kits' gear and the band's with a plus, the named finds and two keepsakes) and the
// wand and the ledger Vask and Hale want.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, core, MARTIAL, MAIL } from '../../items.ts';

const spear = W('spear', 'Spear', 60, 1, 8, { twoHanded: true, classes: [...MARTIAL, 'monk', 'druid'] });
const longbow = W('longbow', 'Long Bow', 200, 1, 8, { kind: 'bow', bonus: 1, ranged: true, twoHanded: true, classes: ['ranger', 'knight'] });
const shield: ItemDef = { id: 'shield', name: 'Kite Shield', slot: 'shield', price: 150, ac: 2, classes: MAIL };
const halberd = W('halberd', 'Halberd', 150, 1, 12, { twoHanded: true, classes: MARTIAL });

export const ITEMS: readonly ItemDef[] = [
  spear,
  longbow,
  A('chain', 'Chain Mail', 500, 7, { classes: MAIL }),
  shield,
  halberd,
  // The kits with a plus: F2 and F3 (#47), E3 and E2 (#67, #68).
  P(core('dagger'), 1),
  P(core('mace'), 1),
  P(core('shortsword'), 1),
  P(core('staff'), 1),
  P(core('robe'), 1),
  P(core('leather'), 1),
  P(core('buckler'), 1),
  // The band's gear with a plus and the named finds: D2 (#69), the Berth (#70), D3 (#71), D4 (#72).
  P(halberd, 1),
  P(spear, 1),
  P(longbow, 1),
  P(shield, 1),
  P(core('longsword'), 1, { id: 'captains_sword', name: "Captain's Sword +1" }),
  P(core('scale'), 1, { id: 'captains_mail', name: "Captain's Mail +1" }),
  P(core('longsword'), 1, { id: 'queens_sword', name: "Queen's Long Sword +1" }),
  // Keepsakes: nothing is worn on a hand or a neck, so they sell.
  { id: 'ring_of_office', name: 'Ring of Office', slot: 'none', price: 300 },
  { id: 'silver_locket', name: 'Silver Locket', slot: 'none', price: 100 },
  { id: 'elixir', name: 'Elixir', slot: 'none', price: 90, use: { heal: 40 } },
  { id: 'potion_sp', name: 'Blue Vial', slot: 'none', price: 45, use: { sp: 10 } },
  { id: 'antidote', name: 'Antidote', slot: 'none', price: 25, use: { cure: ['poisoned'] } },
  { id: 'rations', name: 'Rations', slot: 'none', price: 4, use: { food: 5 } },
  { id: 'name_boards', name: 'Name-Boards', slot: 'none', price: 0 },
  { id: 'customs_chit', name: 'Customs Chit', slot: 'none', price: 0, text: [
    'A chit of thick paper, creased and salt-spotted, stamped with the Helmstow customs seal.',
    '"Passed for Helmstow, under seal: boards fourteen, oars twenty-two, cordage, one bell. Salvage, the Wyke shore. Duty paid."',
  ] },
  // The keeper's log at Crowness Light, of the night the Queen died: read from the pack (#67).
  { id: 'keepers_log', name: "Keeper's Log", slot: 'none', price: 0, text: [
    'CROWNESS LIGHT. Wind south-west, fresh; sea getting up. Lamp lit at dusk and trimmed for the night. Myself to Gullwick.',
    'Near midnight the Hearth went out. Not dim: out, and back, and out. Counted between, as for thunder.',
    'Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. Then no more.',
    'Eleven. Each about the length of a grace. The pairs even, every time, as if measured. Gullwick\'s boats had no light but mine. Not all in by dawn.',
    'Morning: a rider from Helmstow. The Queen is dead.',
  ] },
  { id: 'survey_wand', name: 'Cracked Survey Wand', slot: 'none', price: 0 },
  { id: 'greywater_ledger', name: 'Cargo Ledger', slot: 'none', price: 0 },
  { id: 'clerks_seal', name: "Clerk's Seal", slot: 'none', price: 0 },
  { id: 'hearth_key', name: 'Hearth-Key', slot: 'none', price: 0 },
  { id: 'tenant_paper', name: "Tenant's Paper", slot: 'none', price: 0, text: [
    'A grey paper folded small, soft at the creases from handling.',
    '"For the use of the cellar under Ashcombe, from this new moon to the next, twenty in gold, paid in hand. The tenant to ask nothing, to go down no stairs, and to keep his people above them, that the farm look lived in."',
    'Below, in place of a name, a cross, pressed hard enough to tear the paper. On the back, in the same grey ink: THE HEARTH IS A CAGE.',
  ] },
  { id: 'dunstan_letter', name: "Dunstan's Letter", slot: 'none', price: 0, text: [
    'A paper folded twice, unsealed, addressed in a square hand: HALE. THE SCARTH.',
    '"Hale. Eight riders, shod, no lights, the week she died. West to the Berth by my ford and back before dawn, and not once only. Grey under the cloaks. You know what I am not writing. Burn this. D."',
  ] },
];
