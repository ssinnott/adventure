// The families' plumbing moved into the monsters' kit, ./kit/common.ts (#983). This path re-exports
// it, so no family changes an import; a family takes the kit's path when it is next edited.
export * from './kit/common.ts';
