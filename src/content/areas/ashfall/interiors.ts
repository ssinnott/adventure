// Ashfall's businesses' painted rooms, all in Cinderport (#512), each drawn in
// src/ui/interiors/ashfall/ (#521). Drawn ahead of the area's first map, so src/content/index.ts
// listed them in ROOMS_AHEAD until G10 listed the area (#511); its Area takes them as `interiors`.
export const INTERIORS = ['cinderport_inn', 'cinderport_temple', 'cinderport_armourer', 'cinderport_chandlery', 'cinderport_yard', 'cinderport_cartographers', 'cinderport_factor', 'cinderport_potter'] as const;
