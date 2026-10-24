// The Foreland's items: what Helmstow sells past the kits, what Brandy Hole's chests hold, the finds
// of the Downs (the kits' gear and the band's with a plus, the named finds and two keepsakes) and the
// wand and the ledger Vask and Hale want.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, core, MARTIAL, MAIL, ARTIFACT_PRICE } from '../../items.ts';

export const spear = W('spear', 'Spear', 60, 1, 8, { twoHanded: true, classes: [...MARTIAL, 'monk', 'druid'] });
export const longbow = W('longbow', 'Long Bow', 200, 1, 8, { kind: 'bow', bonus: 1, ranged: true, twoHanded: true, classes: ['ranger', 'knight'] });
export const shield: ItemDef = { id: 'shield', name: 'Kite Shield', slot: 'shield', price: 150, ac: 2, classes: MAIL };
export const halberd = W('halberd', 'Halberd', 150, 1, 12, { twoHanded: true, classes: MARTIAL });

// The Foreland's of the bounds' eight (DESIGN §9, #847): a thing carried, for any of the ten, with no
// numbers, and its bearer never paralysed. Found and never sold: it lies in the box of black wood in
// the wrack of Hag Hole, the sea cave behind E4's cliff, past the Hag (#837).
export const hagstone: ItemDef = { id: 'hagstone', name: 'The Hagstone', slot: 'none', price: ARTIFACT_PRICE, ward: 'paralysed', artifact: true, text: [
  'A stone off the strand, a hole the sea wore through it and a cord gone green.',
  'Held to the eye, the hole shows the dark as only dark.',
] };

export const chain = A('chain', 'Chain Mail', 500, 7, { classes: MAIL });
// The kits with a plus: F2 and F3 (#47), E3 and E2 (#67, #68).
export const daggerPlus1 = P(core('dagger'), 1);
export const macePlus1 = P(core('mace'), 1);
export const shortswordPlus1 = P(core('shortsword'), 1);
export const staffPlus1 = P(core('staff'), 1);
export const robePlus1 = P(core('robe'), 1);
export const leatherPlus1 = P(core('leather'), 1);
export const bucklerPlus1 = P(core('buckler'), 1);
// The band's gear with a plus and the named finds: D2 (#69), the Berth (#70), D3 (#71), D4 (#72).
export const halberdPlus1 = P(halberd, 1);
export const spearPlus1 = P(spear, 1);
export const longbowPlus1 = P(longbow, 1);
export const shieldPlus1 = P(shield, 1);
export const captainsSword = P(core('longsword'), 1, { id: 'captains_sword', name: "Captain's Sword +1" });
export const captainsMail = P(core('scale'), 1, { id: 'captains_mail', name: "Captain's Mail +1" });
export const queensSword = P(core('longsword'), 1, { id: 'queens_sword', name: "Queen's Long Sword +1" });
// Keepsakes: nothing is worn on a hand or a neck, so they sell.
export const ringOfOffice: ItemDef = { id: 'ring_of_office', name: 'Ring of Office', slot: 'none', price: 300 };
export const silverLocket: ItemDef = { id: 'silver_locket', name: 'Silver Locket', slot: 'none', price: 100 };
export const elixir: ItemDef = { id: 'elixir', name: 'Elixir', slot: 'none', price: 90, use: { heal: 40 } };
export const potionSp: ItemDef = { id: 'potion_sp', name: 'Blue Vial', slot: 'none', price: 45, use: { sp: 10 } };
export const antidote: ItemDef = { id: 'antidote', name: 'Antidote', slot: 'none', price: 25, use: { cure: ['poisoned'] } };
export const rations: ItemDef = { id: 'rations', name: 'Rations', slot: 'none', price: 4, use: { food: 5 } };
export const nameBoards: ItemDef = { id: 'name_boards', name: 'Name-Boards', slot: 'none', price: 0 };
export const customsChit: ItemDef = { id: 'customs_chit', name: 'Customs Chit', slot: 'none', price: 0, text: [
  'A chit of thick paper, creased and salt-spotted, stamped with the Helmstow customs seal.',
  '"Passed for Helmstow, under seal: boards fourteen, oars twenty-two, cordage, one bell. Salvage, the Wyke shore. Duty paid."',
] };
// The keeper's log at Crowness Light, of the night the Queen died: read from the pack (#67).
export const keepersLog: ItemDef = { id: 'keepers_log', name: "Keeper's Log", slot: 'none', price: 0, text: [
  'CROWNESS LIGHT. Wind south-west, fresh; sea getting up. Lamp lit at dusk and trimmed for the night. Myself to Gullwick.',
  'Near midnight the Hearth went out. Not dim: out, and back, and out. Counted between, as for thunder.',
  'Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. Then no more.',
  'Eleven. Each about the length of a grace. The pairs even, every time, as if measured. Gullwick\'s boats had no light but mine. Not all in by dawn.',
  'Morning: a rider from Helmstow. The Queen is dead.',
] };
export const surveyWand: ItemDef = { id: 'survey_wand', name: 'Cracked Survey Wand', slot: 'none', price: 0 };
export const greywaterLedger: ItemDef = { id: 'greywater_ledger', name: 'Cargo Ledger', slot: 'none', price: 0 };
export const clerksSeal: ItemDef = { id: 'clerks_seal', name: "Clerk's Seal", slot: 'none', price: 0 };
export const hearthKey: ItemDef = { id: 'hearth_key', name: 'Hearth-Key', slot: 'none', price: 0 };
export const tenantPaper: ItemDef = { id: 'tenant_paper', name: "Tenant's Paper", slot: 'none', price: 0, text: [
  'A grey paper folded small, soft at the creases from handling.',
  '"For the use of the cellar under Ashcombe, from this new moon to the next, twenty in gold, paid in hand. The tenant to ask nothing, to go down no stairs, and to keep his people above them, that the farm look lived in."',
  'Below, in place of a name, a cross, pressed hard enough to tear the paper. On the back, in the same grey ink: THE HEARTH IS A CAGE.',
] };
export const dunstanLetter: ItemDef = { id: 'dunstan_letter', name: "Dunstan's Letter", slot: 'none', price: 0, text: [
  'A paper folded twice, unsealed, addressed in a square hand: HALE. THE SCARTH.',
  '"Hale. Eight riders, shod, no lights, the week she died. West to the Berth by my ford and back before dawn, and not once only. Grey under the cloaks. You know what I am not writing. Burn this. D."',
] };

export const ITEMS: readonly ItemDef[] = [
  spear,
  longbow,
  chain,
  shield,
  halberd,
  daggerPlus1,
  macePlus1,
  shortswordPlus1,
  staffPlus1,
  robePlus1,
  leatherPlus1,
  bucklerPlus1,
  halberdPlus1,
  spearPlus1,
  longbowPlus1,
  shieldPlus1,
  captainsSword,
  captainsMail,
  queensSword,
  ringOfOffice,
  silverLocket,
  elixir,
  potionSp,
  antidote,
  rations,
  nameBoards,
  customsChit,
  keepersLog,
  surveyWand,
  greywaterLedger,
  clerksSeal,
  hearthKey,
  tenantPaper,
  dunstanLetter,
  hagstone,
];
