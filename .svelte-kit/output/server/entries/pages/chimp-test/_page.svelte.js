import { c as create_ssr_component, a as subscribe, o as onDestroy, v as validate_component } from "../../../chunks/ssr.js";
import { w as writable } from "../../../chunks/index2.js";
import { L as Layout } from "../../../chunks/Layout.js";
import { T as Toast } from "../../../chunks/Toast.js";
const css = {
  code: "#container.svelte-1rvcqll{text-align:center;padding-top:80px}.game-container.svelte-1rvcqll{display:flex;justify-content:center;align-items:center;margin-top:30px}#canvas.svelte-1rvcqll{border:2px solid #000;cursor:pointer;margin-top:24px;max-width:100%;max-height:100%}h1.svelte-1rvcqll{font-size:22px;color:#f0a500;margin-bottom:12px}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n  import { onMount, onDestroy } from \\"svelte\\";\\n  import { writable } from \\"svelte/store\\";\\n  import Layout from '../../layouts/Layout.svelte';\\n  import Toast from \\"../../lib/components/Toast.svelte\\";\\n\\n  let canvas;\\n  let ctx;\\n  let boxes = [];\\n  let currentBoxIndex = 0;\\n  let round = 1;\\n  let numBoxes = 4;\\n  let hideNumbers = false;\\n  let canvasWidth, canvasHeight;\\n  const minWidth = 320;\\n  const minHeight = 568;\\n  const maxWidth = 1200;\\n\\n  const toastMessage = writable({ message: \\"\\", type: \\"\\" });\\n\\n  function drawCanvas() {\\n    ctx.fillStyle = '#E0E0E0';\\n    ctx.fillRect(0, 0, canvasWidth, canvasHeight);\\n\\n    for (let box of boxes) {\\n      if (!box.clicked) {\\n        ctx.fillStyle = '#009688';\\n        ctx.fillRect(box.x, box.y, box.size, box.size);\\n        if (!hideNumbers) {\\n          ctx.fillStyle = '#FFFFFF';\\n          ctx.font = '20px Arial';\\n          ctx.textAlign = 'center';\\n          ctx.textBaseline = 'middle';\\n          ctx.fillText(box.number, box.x + box.size / 2, box.y + box.size / 2);\\n        }\\n      }\\n    }\\n  }\\n\\n  function generateBoxes() {\\n    boxes = [];\\n    for (let i = 1; i <= numBoxes; i++) {\\n      let size = Math.min(canvasWidth, canvasHeight) / 10;\\n      let overlap = true;\\n      let x, y;\\n      while (overlap) {\\n        x = Math.random() * (canvasWidth - size);\\n        y = Math.random() * (canvasHeight - size);\\n        overlap = checkOverlap(x, y, size);\\n      }\\n      boxes.push({ x, y, size, number: i, clicked: false });\\n    }\\n    currentBoxIndex = 0;\\n    hideNumbers = false;\\n    drawCanvas();\\n  }\\n\\n  function startGame() {\\n    round = 1;\\n    numBoxes = 4;\\n    generateBoxes();\\n  }\\n\\n  function handleCanvasClick(event) {\\n    let rect = canvas.getBoundingClientRect();\\n    let x = event.clientX - rect.left;\\n    let y = event.clientY - rect.top;\\n\\n    let clickedBox = boxes.find(box => (\\n      x >= box.x && x <= box.x + box.size &&\\n      y >= box.y && y <= box.y + box.size\\n    ));\\n\\n    if (clickedBox) {\\n      if (clickedBox.number === currentBoxIndex + 1) {\\n        clickedBox.clicked = true;\\n        currentBoxIndex++;\\n\\n        if (currentBoxIndex === numBoxes) {\\n          showToast('Congratulations! You completed round ' + round + ' successfully.', 'success');\\n          round++;\\n          numBoxes++;\\n          generateBoxes();\\n        } else if (currentBoxIndex === 1 && round > 1) {\\n          hideNumbers = true;\\n          drawCanvas();\\n        } else {\\n          drawCanvas();\\n        }\\n      } else {\\n        showToast('Game Over! You clicked the wrong box.', 'error');\\n        startGame();\\n      }\\n    } else {\\n      console.log('Clicked on empty area');\\n    }\\n  }\\n\\n  function showToast(message, type) {\\n    toastMessage.set({ message, type });\\n    setTimeout(() => {\\n      toastMessage.set({ message: '', type: '' });\\n    }, 1650);\\n  }\\n\\n  function checkOverlap(x, y, size) {\\n    for (let box of boxes) {\\n      if (\\n        x < box.x + box.size &&\\n        x + size > box.x &&\\n        y < box.y + box.size &&\\n        y + size > box.y\\n      ) {\\n        return true;\\n      }\\n    }\\n    return false;\\n  }\\n\\n  function resizeCanvas() {\\n    if (typeof window !== 'undefined') {\\n      canvasWidth = Math.max(minWidth, Math.min(window.innerWidth * 0.9, maxWidth));\\n      canvasHeight = Math.max(minHeight, window.innerHeight * 0.7);\\n      canvas.width = canvasWidth;\\n      canvas.height = canvasHeight;\\n      generateBoxes();\\n    }\\n  }\\n\\n  onMount(() => {\\n    if (typeof window !== 'undefined') {\\n      canvas = document.getElementById('canvas');\\n      ctx = canvas.getContext('2d');\\n      resizeCanvas();\\n      window.addEventListener('resize', resizeCanvas);\\n\\n      return () => {\\n        window.removeEventListener('resize', resizeCanvas);\\n      };\\n    }\\n  });\\n\\n  onDestroy(() => {\\n    if (typeof window !== 'undefined') {\\n      window.removeEventListener('resize', resizeCanvas);\\n    }\\n  });\\n<\/script>\\n\\n<Layout showThemeToggle={true}>\\n  <div id=\\"container\\">\\n    <h1>Click the boxes in sequential order</h1>\\n    <div class=\\"game-container\\">\\n      <canvas id=\\"canvas\\" on:click={handleCanvasClick}></canvas>\\n    </div>\\n    <Toast message={$toastMessage.message} type={$toastMessage.type} />\\n  </div>\\n</Layout>\\n\\n<style>\\n  /* Center the game window properly */\\n  #container {\\n    text-align: center;\\n    padding-top: 80px; /* Pushes everything down nicely from the nav */\\n  }\\n\\n  .game-container {\\n    display: flex;\\n    justify-content: center; /* Horizontally center */\\n    align-items: center; /* Vertically center */\\n    margin-top: 30px; /* Adjust the space between the title and canvas */\\n  }\\n\\n  #canvas {\\n    border: 2px solid #000;\\n    cursor: pointer;\\n    margin-top: 24px;\\n    max-width: 100%;\\n    max-height: 100%;\\n  }\\n\\n  h1 {\\n    font-size: 22px;\\n    color: #f0a500;\\n    margin-bottom: 12px;\\n  }\\n\\n  p {\\n    color: #f0a500;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAiKE,yBAAW,CACT,UAAU,CAAE,MAAM,CAClB,WAAW,CAAE,IACf,CAEA,8BAAgB,CACd,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,IACd,CAEA,sBAAQ,CACN,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CACtB,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IACd,CAEA,iBAAG,CACD,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,OAAO,CACd,aAAa,CAAE,IACjB"}`
};
const minWidth = 320;
const minHeight = 568;
const maxWidth = 1200;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toastMessage, $$unsubscribe_toastMessage;
  let canvas;
  let ctx;
  let boxes = [];
  let numBoxes = 4;
  let hideNumbers = false;
  let canvasWidth, canvasHeight;
  const toastMessage = writable({ message: "", type: "" });
  $$unsubscribe_toastMessage = subscribe(toastMessage, (value) => $toastMessage = value);
  function drawCanvas() {
    ctx.fillStyle = "#E0E0E0";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    for (let box of boxes) {
      if (!box.clicked) {
        ctx.fillStyle = "#009688";
        ctx.fillRect(box.x, box.y, box.size, box.size);
        if (!hideNumbers) {
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(box.number, box.x + box.size / 2, box.y + box.size / 2);
        }
      }
    }
  }
  function generateBoxes() {
    boxes = [];
    for (let i = 1; i <= numBoxes; i++) {
      let size = Math.min(canvasWidth, canvasHeight) / 10;
      let overlap = true;
      let x, y;
      while (overlap) {
        x = Math.random() * (canvasWidth - size);
        y = Math.random() * (canvasHeight - size);
        overlap = checkOverlap(x, y, size);
      }
      boxes.push({ x, y, size, number: i, clicked: false });
    }
    hideNumbers = false;
    drawCanvas();
  }
  function checkOverlap(x, y, size) {
    for (let box of boxes) {
      if (x < box.x + box.size && x + size > box.x && y < box.y + box.size && y + size > box.y) {
        return true;
      }
    }
    return false;
  }
  function resizeCanvas() {
    if (typeof window !== "undefined") {
      canvasWidth = Math.max(minWidth, Math.min(window.innerWidth * 0.9, maxWidth));
      canvasHeight = Math.max(minHeight, window.innerHeight * 0.7);
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      generateBoxes();
    }
  }
  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", resizeCanvas);
    }
  });
  $$result.css.add(css);
  $$unsubscribe_toastMessage();
  return `${validate_component(Layout, "Layout").$$render($$result, { showThemeToggle: true }, {}, {
    default: () => {
      return `<div id="container" class="svelte-1rvcqll"><h1 class="svelte-1rvcqll" data-svelte-h="svelte-amoqra">Click the boxes in sequential order</h1> <div class="game-container svelte-1rvcqll"><canvas id="canvas" class="svelte-1rvcqll"></canvas></div> ${validate_component(Toast, "Toast").$$render(
        $$result,
        {
          message: $toastMessage.message,
          type: $toastMessage.type
        },
        {},
        {}
      )}</div>`;
    }
  })}`;
});
export {
  Page as default
};
