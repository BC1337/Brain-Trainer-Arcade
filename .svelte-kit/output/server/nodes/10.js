

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/simon-says/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.89GxF2CW.js","_app/immutable/chunks/DrcihTyg.js","_app/immutable/chunks/wD6G4jnR.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/Bpl_OkKT.js"];
export const stylesheets = ["_app/immutable/assets/Layout.bcskZ5eW.css","_app/immutable/assets/10.kbYwNFmP.css"];
export const fonts = [];
