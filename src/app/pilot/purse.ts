// The pilot's purse (#719, #721; docs/PILOT.md): the reserve the quartermaster keeps back and the gold
// over it, which gear, a guild's fee and spells and a crossing may spend. A file of its own so that the
// navigator, which weighs a crossing's fare, reads the one rule the quartermaster and talk read.
import type { Party } from '../../game/party.ts';

/** What the quartermaster keeps back: 100 gold a level of the highest in the company, the most a temple asks to raise one of it (`templePrice`). */
export const reserve = (p: Party): number => 100 * Math.max(0, ...p.members.map((c) => c.level));
/** The gold over the reserve: what gear may cost (`better`), and a guild's fee, a spell or a crossing (#721). */
export const spare = (p: Party): number => Math.max(0, p.gold - reserve(p));
