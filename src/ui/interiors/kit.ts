// The rooms' stage moved into the rooms' kit, ./kit/stage.ts, and its ink, its glow and its flame into
// the paint kit, src/ui/paint/ (#983). This path re-exports them all, so no scene changes an import; a
// scene takes the kits' paths when it is next edited.
export * from './kit/stage.ts';
export { INK } from '../paint/ink.ts';
export { smudge, drawFlame } from '../paint/flame.ts';
