import { c as create_ssr_component, e as escape } from "./ssr.js";
const css = {
  code: ".toast-container.svelte-1ghf1yn.svelte-1ghf1yn{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);width:-moz-fit-content;width:fit-content;max-width:90%;padding:1rem 1.5rem;border-radius:0.5rem;font-size:1rem;color:white;z-index:9999;box-shadow:0 4px 12px rgba(0, 0, 0, 0.3);background-color:rgba(0, 0, 0, 0.85);transition:opacity 0.3s ease-in-out}.toast-container.success.svelte-1ghf1yn.svelte-1ghf1yn{background-color:#16a34a}.toast-container.error.svelte-1ghf1yn.svelte-1ghf1yn{background-color:#dc2626}.toast-container.svelte-1ghf1yn p.svelte-1ghf1yn{margin:0;font-weight:bold;text-align:center}",
  map: `{"version":3,"file":"Toast.svelte","sources":["Toast.svelte"],"sourcesContent":["<!-- Toast.svelte -->\\n<script>\\n    export let message;\\n    export let type; // 'success' or 'error'\\n  <\/script>\\n  \\n  {#if message && message.trim() !== ''}\\n    <div class=\\"toast-container {type}\\">\\n      <p>{message}</p>\\n    </div>\\n  {/if}\\n  \\n  <style>\\n  .toast-container {\\n    position: fixed;\\n    bottom: 2rem;\\n    left: 50%;\\n    transform: translateX(-50%);\\n    width: -moz-fit-content;\\n    width: fit-content;\\n    max-width: 90%;\\n    padding: 1rem 1.5rem;\\n    border-radius: 0.5rem;\\n    font-size: 1rem;\\n    color: white;\\n    z-index: 9999;\\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\\n    background-color: rgba(0, 0, 0, 0.85);\\n    transition: opacity 0.3s ease-in-out;\\n  }\\n  \\n  .toast-container.success {\\n    background-color: #16a34a;\\n  }\\n  \\n  .toast-container.error {\\n    background-color: #dc2626;\\n  }\\n  \\n  .toast-container p {\\n    margin: 0;\\n    font-weight: bold;\\n    text-align: center;\\n  }\\n  </style>\\n  "],"names":[],"mappings":"AAaE,8CAAiB,CACf,QAAQ,CAAE,KAAK,CACf,MAAM,CAAE,IAAI,CACZ,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,WAAW,IAAI,CAAC,CAC3B,KAAK,CAAE,gBAAgB,CACvB,KAAK,CAAE,WAAW,CAClB,SAAS,CAAE,GAAG,CACd,OAAO,CAAE,IAAI,CAAC,MAAM,CACpB,aAAa,CAAE,MAAM,CACrB,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,KAAK,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACzC,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACrC,UAAU,CAAE,OAAO,CAAC,IAAI,CAAC,WAC3B,CAEA,gBAAgB,sCAAS,CACvB,gBAAgB,CAAE,OACpB,CAEA,gBAAgB,oCAAO,CACrB,gBAAgB,CAAE,OACpB,CAEA,+BAAgB,CAAC,gBAAE,CACjB,MAAM,CAAE,CAAC,CACT,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,MACd"}`
};
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { message } = $$props;
  let { type } = $$props;
  if ($$props.message === void 0 && $$bindings.message && message !== void 0) $$bindings.message(message);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  $$result.css.add(css);
  return `  ${message && message.trim() !== "" ? `<div class="${"toast-container " + escape(type, true) + " svelte-1ghf1yn"}"><p class="svelte-1ghf1yn">${escape(message)}</p></div>` : ``}`;
});
export {
  Toast as T
};
