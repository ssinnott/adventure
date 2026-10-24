// The brush and the hash moved into the paint kit, src/ui/paint/brush.ts (#983). This path re-exports
// them, so nothing that imports it changes; a file takes the kit's path when it is next edited.
export * from './paint/brush.ts';
