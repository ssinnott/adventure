// The rooms' props moved into the rooms' kit, ./kit/props.ts, and a trade's own into ./kit/trades/
// (#983). This path re-exports them all, so no scene changes an import; a scene takes the kit's paths
// when it is next edited.
export * from './kit/props.ts';
export * from './kit/trades/temple.ts';
export * from './kit/trades/smithy.ts';
