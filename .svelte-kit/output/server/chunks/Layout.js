import { c as create_ssr_component, b as add_attribute, e as escape, v as validate_component } from "./ssr.js";
import { faSun } from "@fortawesome/free-solid-svg-icons";
function getTransform(scale, translateX, translateY, rotate, flip, translateTimes = 1, translateUnit = "", rotateUnit = "") {
  let flipX = 1;
  let flipY = 1;
  if (flip) {
    if (flip == "horizontal") {
      flipX = -1;
    } else if (flip == "vertical") {
      flipY = -1;
    } else {
      flipX = flipY = -1;
    }
  }
  if (typeof scale === "string") {
    scale = parseFloat(scale);
  }
  if (typeof translateX === "string") {
    translateX = parseFloat(translateX);
  }
  if (typeof translateY === "string") {
    translateY = parseFloat(translateY);
  }
  const x = `${translateX * translateTimes}${translateUnit}`;
  const y = `${translateY * translateTimes}${translateUnit}`;
  let output = `translate(${x},${y}) scale(${flipX * scale},${flipY * scale})`;
  if (rotate) {
    output += ` rotate(${rotate}${rotateUnit})`;
  }
  return output;
}
const css$4 = {
  code: ".svelte-fa-base{height:1em;overflow:visible;transform-origin:center;vertical-align:-0.125em}.svelte-fa-fw{text-align:center;width:1.25em}.svelte-fa-pull-left.svelte-bvo74f{float:left}.svelte-fa-pull-right.svelte-bvo74f{float:right}.svelte-fa-size-lg.svelte-bvo74f{font-size:1.33333em;line-height:0.75em;vertical-align:-0.225em}.svelte-fa-size-sm.svelte-bvo74f{font-size:0.875em}.svelte-fa-size-xs.svelte-bvo74f{font-size:0.75em}.spin.svelte-bvo74f{animation:svelte-bvo74f-spin 2s 0s infinite linear}.pulse.svelte-bvo74f{animation:svelte-bvo74f-spin 1s infinite steps(8)}@keyframes svelte-bvo74f-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
  map: '{"version":3,"file":"fa.svelte","sources":["fa.svelte"],"sourcesContent":["<script>import { getTransform, setCustomFontSize } from \\"./utils.js\\";\\nlet clazz = void 0;\\nexport { clazz as class };\\nexport let id = void 0;\\nexport let style = void 0;\\nexport let icon;\\nexport let title = void 0;\\nexport let size = void 0;\\nexport let color = void 0;\\nexport let fw = false;\\nexport let pull = void 0;\\nexport let scale = 1;\\nexport let translateX = 0;\\nexport let translateY = 0;\\nexport let rotate = void 0;\\nexport let flip = void 0;\\nexport let spin = false;\\nexport let pulse = false;\\nexport let primaryColor = \\"\\";\\nexport let secondaryColor = \\"\\";\\nexport let primaryOpacity = 1;\\nexport let secondaryOpacity = 0.4;\\nexport let swapOpacity = false;\\nlet svgElement;\\n$:\\n  if (svgElement && size) {\\n    setCustomFontSize(svgElement, size);\\n  }\\n$:\\n  i = icon && icon.icon || [0, 0, \\"\\", [], \\"\\"];\\n$:\\n  transform = getTransform(scale, translateX, translateY, rotate, flip, 512);\\n<\/script>\\n\\n{#if i[4]}\\n  <!-- eslint-disable svelte/no-inline-styles -- Only styles passed to this component should be included -->\\n  <svg\\n    {id}\\n    class=\\"svelte-fa svelte-fa-base {clazz}\\"\\n    class:pulse\\n    class:svelte-fa-size-lg={size === \\"lg\\"}\\n    class:svelte-fa-size-sm={size === \\"sm\\"}\\n    class:svelte-fa-size-xs={size === \\"xs\\"}\\n    class:svelte-fa-fw={fw}\\n    class:svelte-fa-pull-left={pull === \\"left\\"}\\n    class:svelte-fa-pull-right={pull === \\"right\\"}\\n    class:spin\\n    bind:this={svgElement}\\n    {style}\\n    viewBox=\\"0 0 {i[0]} {i[1]}\\"\\n    aria-hidden={title === undefined}\\n    role=\\"img\\"\\n    xmlns=\\"http://www.w3.org/2000/svg\\"\\n  >\\n    <!-- eslint-enable -->\\n    {#if title}\\n      <title>{title}</title>\\n    {/if}\\n    <g transform=\\"translate({i[0] / 2} {i[1] / 2})\\" transform-origin=\\"{i[0] / 4} 0\\">\\n      <g {transform}>\\n        {#if typeof i[4] == \\"string\\"}\\n          <path\\n            d={i[4]}\\n            fill={color || primaryColor || \\"currentColor\\"}\\n            transform=\\"translate({i[0] / -2} {i[1] / -2})\\"\\n          />\\n        {:else}\\n          <!-- Duotone icons -->\\n          <path\\n            d={i[4][0]}\\n            fill={secondaryColor || color || \\"currentColor\\"}\\n            fill-opacity={swapOpacity != false ? primaryOpacity : secondaryOpacity}\\n            transform=\\"translate({i[0] / -2} {i[1] / -2})\\"\\n          />\\n          <path\\n            d={i[4][1]}\\n            fill={primaryColor || color || \\"currentColor\\"}\\n            fill-opacity={swapOpacity != false ? secondaryOpacity : primaryOpacity}\\n            transform=\\"translate({i[0] / -2} {i[1] / -2})\\"\\n          />\\n        {/if}\\n      </g>\\n    </g>\\n  </svg>\\n{/if}\\n\\n<style>\\n  :global(.svelte-fa-base) {\\n    height: 1em;\\n    overflow: visible;\\n    transform-origin: center;\\n    vertical-align: -0.125em;\\n  }\\n\\n  :global(.svelte-fa-fw) {\\n    text-align: center;\\n    width: 1.25em;\\n  }\\n\\n  .svelte-fa-pull-left {\\n    float: left;\\n  }\\n\\n  .svelte-fa-pull-right {\\n    float: right;\\n  }\\n\\n  .svelte-fa-size-lg {\\n    font-size: 1.33333em;\\n    line-height: 0.75em;\\n    vertical-align: -0.225em;\\n  }\\n\\n  .svelte-fa-size-sm {\\n    font-size: 0.875em;\\n  }\\n\\n  .svelte-fa-size-xs {\\n    font-size: 0.75em;\\n  }\\n\\n  .spin {\\n    animation: spin 2s 0s infinite linear;\\n  }\\n\\n  .pulse {\\n    animation: spin 1s infinite steps(8);\\n  }\\n\\n  @keyframes spin {\\n    0% {\\n      transform: rotate(0deg);\\n    }\\n    100% {\\n      transform: rotate(360deg);\\n    }\\n  }\\n</style>\\n"],"names":[],"mappings":"AAuFU,eAAiB,CACvB,MAAM,CAAE,GAAG,CACX,QAAQ,CAAE,OAAO,CACjB,gBAAgB,CAAE,MAAM,CACxB,cAAc,CAAE,QAClB,CAEQ,aAAe,CACrB,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,MACT,CAEA,kCAAqB,CACnB,KAAK,CAAE,IACT,CAEA,mCAAsB,CACpB,KAAK,CAAE,KACT,CAEA,gCAAmB,CACjB,SAAS,CAAE,SAAS,CACpB,WAAW,CAAE,MAAM,CACnB,cAAc,CAAE,QAClB,CAEA,gCAAmB,CACjB,SAAS,CAAE,OACb,CAEA,gCAAmB,CACjB,SAAS,CAAE,MACb,CAEA,mBAAM,CACJ,SAAS,CAAE,kBAAI,CAAC,EAAE,CAAC,EAAE,CAAC,QAAQ,CAAC,MACjC,CAEA,oBAAO,CACL,SAAS,CAAE,kBAAI,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,CACrC,CAEA,WAAW,kBAAK,CACd,EAAG,CACD,SAAS,CAAE,OAAO,IAAI,CACxB,CACA,IAAK,CACH,SAAS,CAAE,OAAO,MAAM,CAC1B,CACF"}'
};
const Fa = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let i;
  let transform;
  let { class: clazz = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { style = void 0 } = $$props;
  let { icon } = $$props;
  let { title = void 0 } = $$props;
  let { size = void 0 } = $$props;
  let { color = void 0 } = $$props;
  let { fw = false } = $$props;
  let { pull = void 0 } = $$props;
  let { scale = 1 } = $$props;
  let { translateX = 0 } = $$props;
  let { translateY = 0 } = $$props;
  let { rotate = void 0 } = $$props;
  let { flip = void 0 } = $$props;
  let { spin = false } = $$props;
  let { pulse = false } = $$props;
  let { primaryColor = "" } = $$props;
  let { secondaryColor = "" } = $$props;
  let { primaryOpacity = 1 } = $$props;
  let { secondaryOpacity = 0.4 } = $$props;
  let { swapOpacity = false } = $$props;
  let svgElement;
  if ($$props.class === void 0 && $$bindings.class && clazz !== void 0) $$bindings.class(clazz);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0) $$bindings.icon(icon);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
  if ($$props.fw === void 0 && $$bindings.fw && fw !== void 0) $$bindings.fw(fw);
  if ($$props.pull === void 0 && $$bindings.pull && pull !== void 0) $$bindings.pull(pull);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0) $$bindings.scale(scale);
  if ($$props.translateX === void 0 && $$bindings.translateX && translateX !== void 0) $$bindings.translateX(translateX);
  if ($$props.translateY === void 0 && $$bindings.translateY && translateY !== void 0) $$bindings.translateY(translateY);
  if ($$props.rotate === void 0 && $$bindings.rotate && rotate !== void 0) $$bindings.rotate(rotate);
  if ($$props.flip === void 0 && $$bindings.flip && flip !== void 0) $$bindings.flip(flip);
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0) $$bindings.spin(spin);
  if ($$props.pulse === void 0 && $$bindings.pulse && pulse !== void 0) $$bindings.pulse(pulse);
  if ($$props.primaryColor === void 0 && $$bindings.primaryColor && primaryColor !== void 0) $$bindings.primaryColor(primaryColor);
  if ($$props.secondaryColor === void 0 && $$bindings.secondaryColor && secondaryColor !== void 0) $$bindings.secondaryColor(secondaryColor);
  if ($$props.primaryOpacity === void 0 && $$bindings.primaryOpacity && primaryOpacity !== void 0) $$bindings.primaryOpacity(primaryOpacity);
  if ($$props.secondaryOpacity === void 0 && $$bindings.secondaryOpacity && secondaryOpacity !== void 0) $$bindings.secondaryOpacity(secondaryOpacity);
  if ($$props.swapOpacity === void 0 && $$bindings.swapOpacity && swapOpacity !== void 0) $$bindings.swapOpacity(swapOpacity);
  $$result.css.add(css$4);
  i = icon && icon.icon || [0, 0, "", [], ""];
  transform = getTransform(scale, translateX, translateY, rotate, flip, 512);
  return `${i[4] ? ` <svg${add_attribute("id", id, 0)} class="${[
    "svelte-fa svelte-fa-base " + escape(clazz, true) + " svelte-bvo74f",
    (pulse ? "pulse" : "") + " " + (size === "lg" ? "svelte-fa-size-lg" : "") + " " + (size === "sm" ? "svelte-fa-size-sm" : "") + " " + (size === "xs" ? "svelte-fa-size-xs" : "") + " " + (fw ? "svelte-fa-fw" : "") + " " + (pull === "left" ? "svelte-fa-pull-left" : "") + " " + (pull === "right" ? "svelte-fa-pull-right" : "") + " " + (spin ? "spin" : "")
  ].join(" ").trim()}"${add_attribute("style", style, 0)} viewBox="${"0 0 " + escape(i[0], true) + " " + escape(i[1], true)}"${add_attribute("aria-hidden", title === void 0, 0)} role="img" xmlns="http://www.w3.org/2000/svg"${add_attribute("this", svgElement, 0)}>${title ? `<title>${escape(title)}</title>` : ``}<g transform="${"translate(" + escape(i[0] / 2, true) + " " + escape(i[1] / 2, true) + ")"}" transform-origin="${escape(i[0] / 4, true) + " 0"}"><g${add_attribute("transform", transform, 0)}>${typeof i[4] == "string" ? `<path${add_attribute("d", i[4], 0)}${add_attribute("fill", color || primaryColor || "currentColor", 0)} transform="${"translate(" + escape(i[0] / -2, true) + " " + escape(i[1] / -2, true) + ")"}"></path>` : ` <path${add_attribute("d", i[4][0], 0)}${add_attribute("fill", secondaryColor || color || "currentColor", 0)}${add_attribute("fill-opacity", swapOpacity != false ? primaryOpacity : secondaryOpacity, 0)} transform="${"translate(" + escape(i[0] / -2, true) + " " + escape(i[1] / -2, true) + ")"}"></path> <path${add_attribute("d", i[4][1], 0)}${add_attribute("fill", primaryColor || color || "currentColor", 0)}${add_attribute("fill-opacity", swapOpacity != false ? secondaryOpacity : primaryOpacity, 0)} transform="${"translate(" + escape(i[0] / -2, true) + " " + escape(i[1] / -2, true) + ")"}"></path>`}</g></g></svg>` : ``}`;
});
const css$3 = {
  code: ".theme-toggle.svelte-1iolbz1{z-index:9999;background-color:transparent;color:#f0a500;border:none;border-radius:50%;padding:10px;cursor:pointer}body.dark-mode{background-color:rgb(255, 255, 255);color:#ffffff}",
  map: `{"version":3,"file":"ThemeToggle.svelte","sources":["ThemeToggle.svelte"],"sourcesContent":["<script>\\n  import { onMount } from 'svelte';\\n  import Fa from 'svelte-fa';\\n  import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';\\n\\n  let isDarkMode = false;\\n\\n  // Function to toggle the theme\\n  function toggle() {\\n    isDarkMode = !isDarkMode;\\n    document.body.classList.toggle('dark-mode', isDarkMode);\\n\\n    // Save the theme preference to localStorage\\n    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');\\n  }\\n\\n  // On mount, check if there's a saved theme preference\\n  onMount(() => {\\n    const savedTheme = localStorage.getItem('theme');\\n    isDarkMode = savedTheme === 'dark';\\n    document.body.classList.toggle('dark-mode', isDarkMode);\\n  });\\n<\/script>\\n\\n<button class=\\"theme-toggle\\" on:click={toggle}>\\n  <Fa icon={isDarkMode ? faMoon : faSun} size=\\"2x\\" />\\n</button>\\n\\n<style>\\n  .theme-toggle {\\n    z-index: 9999;\\n    background-color: transparent;\\n    color: #f0a500;\\n    border: none;\\n    border-radius: 50%;\\n    padding: 10px;\\n    cursor: pointer;\\n  }\\n\\n  :global(body.dark-mode) {\\n    background-color: rgb(255, 255, 255); /* Light background color for dark mode */\\n    color: #ffffff;\\n  }\\n\\n  /* Add smooth transition for background color change */\\n  /* body {\\n    transition: background-color 0.3s ease, color 0.3s ease;\\n  } */\\n</style>\\n"],"names":[],"mappings":"AA6BE,4BAAc,CACZ,OAAO,CAAE,IAAI,CACb,gBAAgB,CAAE,WAAW,CAC7B,KAAK,CAAE,OAAO,CACd,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,OACV,CAEQ,cAAgB,CACtB,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACpC,KAAK,CAAE,OACT"}`
};
const ThemeToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<button class="theme-toggle svelte-1iolbz1">${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faSun,
      size: "2x"
    },
    {},
    {}
  )} </button>`;
});
const css$2 = {
  code: ".navbar.svelte-plcojt{display:flex;justify-content:space-between;align-items:center;background-color:#222;padding:1rem;color:white;box-shadow:0 2px 4px rgba(0, 0, 0, 0.3);transition:background-color 0.3s ease}.navbar.svelte-plcojt:hover{background-color:#333}.left-section.svelte-plcojt{display:flex;align-items:center}.theme-toggle-wrapper.svelte-plcojt{margin-right:25px}.nav-brand.svelte-plcojt{font-size:1.8rem;font-weight:bold;text-decoration:none;color:white;display:flex;align-items:center}.nav-items.svelte-plcojt{display:flex;list-style:none;margin:0;padding:0}.nav-item.svelte-plcojt{margin-left:2rem}.nav-link.svelte-plcojt{text-decoration:none;color:white;transition:color 0.3s ease}.nav-link.svelte-plcojt:hover{color:#ff7f50}",
  map: `{"version":3,"file":"Navbar.svelte","sources":["Navbar.svelte"],"sourcesContent":["<script>\\n  import { onMount } from 'svelte';\\n  import ThemeToggle from './ThemeToggle.svelte';\\n\\n  let token = null;\\n\\n  onMount(() => {\\n    if (typeof window !== 'undefined') {\\n      token = localStorage.getItem('token');\\n    }\\n  });\\n\\n  const logout = () => {\\n    if (typeof window !== 'undefined') {\\n      localStorage.removeItem('token');\\n      token = null;\\n    }\\n  };\\n<\/script>\\n\\n<style>\\n  .navbar {\\n    display: flex;\\n    justify-content: space-between;\\n    align-items: center;\\n    background-color: #222;\\n    padding: 1rem;\\n    color: white;\\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\\n    transition: background-color 0.3s ease;\\n  }\\n\\n  .navbar:hover {\\n    background-color: #333;\\n  }\\n\\n  .left-section {\\n    display: flex;\\n    align-items: center;\\n  }\\n\\n  .theme-toggle-wrapper {\\n    margin-right: 25px;\\n  }\\n\\n  .nav-brand {\\n    font-size: 1.8rem;\\n    font-weight: bold;\\n    text-decoration: none;\\n    color: white;\\n    display: flex;\\n    align-items: center;\\n  }\\n\\n  .nav-items {\\n    display: flex;\\n    list-style: none;\\n    margin: 0;\\n    padding: 0;\\n  }\\n\\n  .nav-item {\\n    margin-left: 2rem;\\n  }\\n\\n  .nav-link {\\n    text-decoration: none;\\n    color: white;\\n    transition: color 0.3s ease;\\n  }\\n\\n  .nav-link:hover {\\n    color: #ff7f50;\\n  }\\n</style>\\n\\n<div class=\\"navbar\\">\\n  <div class=\\"left-section\\">\\n    <div class=\\"theme-toggle-wrapper\\">\\n      <ThemeToggle />\\n    </div>\\n    <a href=\\"/\\" class=\\"nav-brand\\">\\n      <span class=\\"neon-letter\\">B</span>rain Trainer\\n    </a>\\n  </div>\\n\\n  <ul class=\\"nav-items\\">\\n    <li class=\\"nav-item\\"><a href=\\"/\\" class=\\"nav-link\\">Home</a></li>\\n    <li class=\\"nav-item\\"><a href=\\"/games\\" class=\\"nav-link\\">Games</a></li>\\n\\n    {#if token}\\n      <li class=\\"nav-item\\"><a href=\\"/profile\\" class=\\"nav-link\\">Profile</a></li>\\n      <li class=\\"nav-item\\"><a href=\\"#\\" class=\\"nav-link\\" on:click={logout}>Logout</a></li>\\n    {:else}\\n      <li class=\\"nav-item\\"><a href=\\"/login\\" class=\\"nav-link\\">Login</a></li>\\n      <li class=\\"nav-item\\"><a href=\\"/signup\\" class=\\"nav-link\\">Sign Up</a></li>\\n    {/if}\\n  </ul>\\n</div>\\n"],"names":[],"mappings":"AAqBE,qBAAQ,CACN,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,gBAAgB,CAAE,IAAI,CACtB,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxC,UAAU,CAAE,gBAAgB,CAAC,IAAI,CAAC,IACpC,CAEA,qBAAO,MAAO,CACZ,gBAAgB,CAAE,IACpB,CAEA,2BAAc,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MACf,CAEA,mCAAsB,CACpB,YAAY,CAAE,IAChB,CAEA,wBAAW,CACT,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,IAAI,CACjB,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MACf,CAEA,wBAAW,CACT,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,CACX,CAEA,uBAAU,CACR,WAAW,CAAE,IACf,CAEA,uBAAU,CACR,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,KAAK,CAAC,IAAI,CAAC,IACzB,CAEA,uBAAS,MAAO,CACd,KAAK,CAAE,OACT"}`
};
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="navbar svelte-plcojt"><div class="left-section svelte-plcojt"><div class="theme-toggle-wrapper svelte-plcojt">${validate_component(ThemeToggle, "ThemeToggle").$$render($$result, {}, {}, {})}</div> <a href="/" class="nav-brand svelte-plcojt" data-svelte-h="svelte-1w0bgwf"><span class="neon-letter">B</span>rain Trainer</a></div> <ul class="nav-items svelte-plcojt"><li class="nav-item svelte-plcojt" data-svelte-h="svelte-gcee0a"><a href="/" class="nav-link svelte-plcojt">Home</a></li> <li class="nav-item svelte-plcojt" data-svelte-h="svelte-1hh3fzv"><a href="/games" class="nav-link svelte-plcojt">Games</a></li> ${`<li class="nav-item svelte-plcojt" data-svelte-h="svelte-4lpipb"><a href="/login" class="nav-link svelte-plcojt">Login</a></li> <li class="nav-item svelte-plcojt" data-svelte-h="svelte-1ui0229"><a href="/signup" class="nav-link svelte-plcojt">Sign Up</a></li>`}</ul></div>`;
});
const css$1 = {
  code: "footer.svelte-ml22o9.svelte-ml22o9{background:linear-gradient(to top, #111, #1a1a1a);color:#fff;padding:30px 20px;text-align:center;font-size:14px;border-top:1px solid #333}.footer-content.svelte-ml22o9 a.svelte-ml22o9{color:#fff;text-decoration:none;font-weight:500;position:relative}.footer-content.svelte-ml22o9 a.svelte-ml22o9::after{content:'';position:absolute;left:0;bottom:-2px;width:100%;height:2px;background-color:transparent;transition:background-color 0.2s ease}.footer-content.svelte-ml22o9 a.svelte-ml22o9:hover::after{background-color:#f0a500}.social-links.svelte-ml22o9 a.svelte-ml22o9{margin:0 10px;color:#fff;text-decoration:none;font-weight:500;transition:color 0.2s ease;position:relative}.social-links.svelte-ml22o9 a.svelte-ml22o9::after{content:'';position:absolute;left:0;bottom:-2px;width:100%;height:2px;background-color:transparent;transition:background-color 0.2s ease}.social-links.svelte-ml22o9 a.svelte-ml22o9:hover::after{background-color:#f0a500}.bc1337.svelte-ml22o9.svelte-ml22o9{color:#f0a500}footer.svelte-ml22o9 p.svelte-ml22o9{margin-bottom:10px;color:#ccc}footer.svelte-ml22o9 p.svelte-ml22o9:first-child::after{content:'';display:block;width:50px;height:2px;background-color:#f0a500;margin:8px auto 0}",
  map: `{"version":3,"file":"Footer.svelte","sources":["Footer.svelte"],"sourcesContent":["<script>\\n    // Future logic can go here\\n  <\/script>\\n  \\n  <footer>\\n    <div class=\\"footer-content\\">\\n      <p>&copy;Brain Trainer Arcade 2025 All rights reserved.</p>\\n      <p>\\n        Crafted by <a href=\\"https://github.com/bc1337\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\" class=\\"bc1337\\">BC1337</a>\\n      </p>\\n  \\n      <div class=\\"social-links\\">\\n        <a href=\\"https://github.com/bc1337\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">GitHub</a>\\n        <a href=\\"BrainTrainerArcade@proton.me\\">Contact</a>\\n      </div>\\n    </div>\\n  </footer>\\n  \\n  <style>\\n    footer {\\n      background: linear-gradient(to top, #111, #1a1a1a); /* Dark gradient */\\n      color: #fff;\\n      padding: 30px 20px;\\n      text-align: center;\\n      font-size: 14px;\\n      border-top: 1px solid #333;\\n    }\\n  \\n    .footer-content a {\\n      color: #fff;\\n      text-decoration: none;\\n      font-weight: 500;\\n      position: relative;\\n    }\\n  \\n    .footer-content a::after {\\n      content: '';\\n      position: absolute;\\n      left: 0;\\n      bottom: -2px;\\n      width: 100%;\\n      height: 2px;\\n      background-color: transparent;\\n      transition: background-color 0.2s ease;\\n    }\\n  \\n    .footer-content a:hover::after {\\n      background-color: #f0a500; /* Orange underline */\\n    }\\n  \\n    .social-links a {\\n      margin: 0 10px;\\n      color: #fff;\\n      text-decoration: none;\\n      font-weight: 500;\\n      transition: color 0.2s ease;\\n      position: relative;\\n    }\\n  \\n    .social-links a::after {\\n      content: '';\\n      position: absolute;\\n      left: 0;\\n      bottom: -2px;\\n      width: 100%;\\n      height: 2px;\\n      background-color: transparent;\\n      transition: background-color 0.2s ease;\\n    }\\n  \\n    .social-links a:hover::after {\\n      background-color: #f0a500; /* Orange underline */\\n    }\\n  \\n    .bc1337 {\\n      color: #f0a500; /* Orange text for BC1337 */\\n    }\\n  \\n    footer p {\\n      margin-bottom: 10px;\\n      color: #ccc;\\n    }\\n  \\n    footer p:first-child::after {\\n      content: '';\\n      display: block;\\n      width: 50px;\\n      height: 2px;\\n      background-color: #f0a500; /* Orange line under copyright */\\n      margin: 8px auto 0;\\n    }\\n  </style>\\n  "],"names":[],"mappings":"AAmBI,kCAAO,CACL,UAAU,CAAE,gBAAgB,EAAE,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,CAAC,OAAO,CAAC,CAClD,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IACxB,CAEA,6BAAe,CAAC,eAAE,CAChB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,WAAW,CAAE,GAAG,CAChB,QAAQ,CAAE,QACZ,CAEA,6BAAe,CAAC,eAAC,OAAQ,CACvB,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,WAAW,CAC7B,UAAU,CAAE,gBAAgB,CAAC,IAAI,CAAC,IACpC,CAEA,6BAAe,CAAC,eAAC,MAAM,OAAQ,CAC7B,gBAAgB,CAAE,OACpB,CAEA,2BAAa,CAAC,eAAE,CACd,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,WAAW,CAAE,GAAG,CAChB,UAAU,CAAE,KAAK,CAAC,IAAI,CAAC,IAAI,CAC3B,QAAQ,CAAE,QACZ,CAEA,2BAAa,CAAC,eAAC,OAAQ,CACrB,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,WAAW,CAC7B,UAAU,CAAE,gBAAgB,CAAC,IAAI,CAAC,IACpC,CAEA,2BAAa,CAAC,eAAC,MAAM,OAAQ,CAC3B,gBAAgB,CAAE,OACpB,CAEA,mCAAQ,CACN,KAAK,CAAE,OACT,CAEA,oBAAM,CAAC,eAAE,CACP,aAAa,CAAE,IAAI,CACnB,KAAK,CAAE,IACT,CAEA,oBAAM,CAAC,eAAC,YAAY,OAAQ,CAC1B,OAAO,CAAE,EAAE,CACX,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,GAAG,CAAC,IAAI,CAAC,CACnB"}`
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<footer class="svelte-ml22o9" data-svelte-h="svelte-n7yawa"><div class="footer-content svelte-ml22o9"><p class="svelte-ml22o9">©Brain Trainer Arcade 2025 All rights reserved.</p> <p class="svelte-ml22o9">Crafted by <a href="https://github.com/bc1337" target="_blank" rel="noopener noreferrer" class="bc1337 svelte-ml22o9">BC1337</a></p> <div class="social-links svelte-ml22o9"><a href="https://github.com/bc1337" target="_blank" rel="noopener noreferrer" class="svelte-ml22o9">GitHub</a> <a href="BrainTrainerArcade@proton.me" class="svelte-ml22o9">Contact</a></div></div> </footer>`;
});
const css = {
  code: ".footer-separator.svelte-cmhaih{width:100%;height:2px;background-color:#f0a500;margin-top:60px}",
  map: `{"version":3,"file":"Layout.svelte","sources":["Layout.svelte"],"sourcesContent":["<script>\\n  import Navbar from \\"../lib/components/Navbar.svelte\\";\\n  import '../routes/styles.css';\\n  import Footer from \\"../lib/components/Footer.svelte\\";\\n<\/script>\\n\\n<Navbar />\\n<slot />\\n\\n<!-- Separator line between content and footer -->\\n<div class=\\"footer-separator\\"></div>\\n\\n<Footer />\\n\\n<style>\\n  .footer-separator {\\n    width: 100%;\\n    height: 2px;\\n    background-color: #f0a500; /* your orange accent */\\n    margin-top: 60px;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAeE,+BAAkB,CAChB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,OAAO,CACzB,UAAU,CAAE,IACd"}`
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}  <div class="footer-separator svelte-cmhaih"></div> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as L
};
