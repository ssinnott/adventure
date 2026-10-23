// Rimewater's items: Rime Lodge's furrier's step on the ladder (#535), the act's last, and the same
// with a plus that its boxes and the Sleepers' Bay give up by 22. Made ahead of the area (#535), as
// the Kilns' were, until its first box (#486) took the table into its Area; the lodge (#487) sells the
// step.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, NO_CASTER_HEAVY, ARTIFACT_PRICE } from '../../items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';

const plate = THORNMARK.find((i) => i.id === 'plate')!;

// Sold at Rime Lodge's furrier (#487): a step past the Kilns' and Cairnmoor's finds for every class, at 21.
export const iceAxe = W('ice_axe', 'Ice Axe', 1800, 2, 12, { bonus: 3, classes: [...MARTIAL, 'cleric'] });
export const skinningKnife = W('skinning_knife', 'Skinning Knife', 1800, 1, 8, { kind: 'light', bonus: 11 });
export const huntersBow = W('hunters_bow', "Hunter's Bow", 1900, 1, 12, { kind: 'bow', bonus: 10, ranged: true, twoHanded: true, classes: ['ranger'] });
export const bearSpear = W('bear_spear', 'Bear Spear', 1900, 2, 12, { bonus: 4, twoHanded: true, classes: MARTIAL });
export const guidesStaff = W('guides_staff', "Guide's Staff", 1600, 1, 10, { kind: 'staff', bonus: 10, twoHanded: true });
export const bearskin = A('bearskin', 'Bearskin Coat', 2500, 12, { classes: NO_CASTER_HEAVY });
export const furRobe = A('fur_robe', 'Fur Robe', 1600, 11);
const WARES = [iceAxe, skinningKnife, huntersBow, bearSpear, guidesStaff, bearskin, furRobe];

/** The furrier's stock, the act's last step (#487). */
export const FURRIER: readonly string[] = WARES.map((d) => d.id);

// Rimewater's of the bounds' eight (DESIGN §9, #847), with the Whitespine: the Grey Robe's 13 and a
// point, cut to the cleric, the sorcerer, the druid and the monk, and its wearer never asleep. Found
// and never sold; placed nowhere yet, for #832 lays its lair and puts it there.
export const wakerobe = A('wakerobe', 'The Wakerobe', ARTIFACT_PRICE, 14, { classes: ['cleric', 'sorcerer', 'druid', 'monk'], ward: 'asleep', artifact: true, text: [
  'A grey robe made for someone taller and thinner, the sleeves past your fingers.',
  'Whoever wore it last walked out of the ice in it, and did not lie down again.',
] });

// In the trolls' hoard in Creag Fionn, the enclave (#832): the furrier's Bear Spear with its head wrapped
// in pitch that burns, its blows carrying fire, which stops a troll mending. Found there alone and sold
// nowhere, inside the enclave's window, the Whitespine's 5,000 (EXPANSION §5.2, #845's 3).
export const trollbrand: ItemDef = { ...bearSpear, id: 'trollbrand', name: 'Trollbrand, Bear Spear', price: 2100, element: 'fire', text: [
  'A bear spear with its head bound in cord and pitch, black and hard as horn.',
  'Struck on stone it takes light, and it burns until it is wanted out.',
] };

export const ITEMS: readonly ItemDef[] = [
  ...WARES,
  // Found, not sold, by 22: the glacier's hollow on M9, the drove's strongbox on L9, the drowned
  // smith's iron on K9, the dark lamp's cache on K10 and the locker behind the bay's last row
  // (docs/areas/rimewater.md §4). The plate is plate's wearers' step past the Kilns' Plate Mail +3.
  P(iceAxe, 1),
  P(skinningKnife, 1),
  P(bearSpear, 1),
  P(guidesStaff, 1),
  // The bay's two (#490), in the locker behind its last row: the ladder's Hunter's Bow +1 and Plate
  // Mail +4, each named in the hill folk's tongue (§10), bogha a bow and luireach a coat of mail.
  P(huntersBow, 1, { name: 'Bogha Fionn +1', text: [
    'A bow of pale wood, unstrung, its string coiled beside it. It bends as if it were cut last spring.',
  ] }),
  P(plate, 4, { name: 'Luireach Dubh +4', text: [
    'Plate gone black with age and never rusted, laid flat in its drawer with a row\'s mark on it.',
  ] }),
  // K9's (#489), off the ladder: the drowned smith's own blade, beside his Bear Spear +1 in the hole
  // under the old bank. Lann is the hill folk's blade, and Fuar the village the loch came up over.
  W('lann_fuar', 'Lann Fuar', 2000, 2, 10, { bonus: 6, classes: MARTIAL, text: [
    'A long blade of dark iron, wrapped in greased hide and never carried. On the tang, a smith\'s mark: a little bell.',
  ] }),
  // The Matron's part (#490), a keepsake, as machines carry parts and no gold.
  { id: 'matron_cap', name: "The Matron's Cap", slot: 'none', price: 0, text: [
    'A cap of thin grey plate, folded stiff and white as starched linen.',
    'Inside the band, worn smooth, a loop inside a loop.',
  ] },
  // The Coach That Did Not Come (#494, #56's 40): the note the man in the healer's coat writes by the
  // coach on N8, read from the pack and taken by the coachman at the lodge, who sends the sledge.
  { id: 'healers_note', name: 'The Healer\'s Note', slot: 'none', price: 0, text: [
    'A leaf torn from a healer\'s book, in a careful hand.',
    '"To Rime Lodge. The coach is stopped on the moor road, its coachman dead. One patient, asleep. Send a sledge."',
  ] },
  wakerobe,
  trollbrand,
];
