

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Bx1zuiL1.js","_app/immutable/chunks/DrcihTyg.js","_app/immutable/chunks/wD6G4jnR.js"];
export const stylesheets = [];
export const fonts = [];
