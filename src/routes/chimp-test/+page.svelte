<script>
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import Layout from '../../layouts/Layout.svelte';
  import Toast from "../../lib/components/Toast.svelte";

  let canvas;
  let ctx;
  let boxes = [];
  let currentBoxIndex = 0;
  let round = 1;
  let numBoxes = 4;
  let hideNumbers = false;
  let canvasWidth, canvasHeight;
  const minWidth = 320; // Minimum width for iPhone SE
  const minHeight = 568; // Minimum height for iPhone SE
  const maxWidth = 1200; // Maximum width

  // Declare toastMessage writable store
  const toastMessage = writable({ message: "", type: "" });

  function drawCanvas() {
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let box of boxes) {
      if (!box.clicked) {
        ctx.fillStyle = '#009688';
        ctx.fillRect(box.x, box.y, box.size, box.size);
        if (!hideNumbers) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(box.number, box.x + box.size / 2, box.y + box.size / 2);
        }
      }
    }
  }

  function generateBoxes() {
    boxes = [];
    for (let i = 1; i <= numBoxes; i++) {
      let size = Math.min(canvasWidth, canvasHeight) / 10; // Adjust box size dynamically
      let overlap = true;
      let x, y;
      // Generate positions until no overlap is found
      while (overlap) {
        x = Math.random() * (canvasWidth - size);
        y = Math.random() * (canvasHeight - size);
        overlap = checkOverlap(x, y, size);
      }
      boxes.push({ x, y, size, number: i, clicked: false });
    }
    currentBoxIndex = 0;
    hideNumbers = false;
    drawCanvas();
  }

  function startGame() {
    round = 1;
    numBoxes = 4;
    generateBoxes();
  }

  function handleCanvasClick(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let clickedBox = boxes.find(box => {
      return (
        x >= box.x &&
        x <= box.x + box.size &&
        y >= box.y &&
        y <= box.y + box.size
      );
    });

    if (clickedBox) {
      if (clickedBox.number === currentBoxIndex + 1) {
        clickedBox.clicked = true;
        currentBoxIndex++;

        if (currentBoxIndex === numBoxes) {
          showToast('Congratulations! You completed round ' + round + ' successfully.', 'success');
          round++;
          numBoxes++;
          generateBoxes();
        } else if (currentBoxIndex === 1 && round > 1) {
          hideNumbers = true;
          drawCanvas();
        } else {
          drawCanvas();
        }
      } else {
        showToast('Game Over! You clicked the wrong box.', 'error');
        startGame();
      }
    } else {
      console.log('Clicked on empty area');
    }
  }

  function showToast(message, type) {
    toastMessage.set({ message, type });
    setTimeout(() => {
      toastMessage.set({ message: '', type: '' });
    }, 1650);
  }

  function checkOverlap(x, y, size) {
    for (let box of boxes) {
      if (
        x < box.x + box.size &&
        x + size > box.x &&
        y < box.y + box.size &&
        y + size > box.y
      ) {
        return true;
      }
    }
    return false;
  }

  function resizeCanvas() {
    if (typeof window !== 'undefined') {
      canvasWidth = Math.max(minWidth, Math.min(window.innerWidth * 0.9, maxWidth));
      canvasHeight = Math.max(minHeight, window.innerHeight * 0.7);
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      generateBoxes();
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      canvas = document.getElementById('canvas');
      ctx = canvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', resizeCanvas);
    }
  });
</script>

<style>
  #container {
    text-align: center;
  }

  #canvas {
    border: 2px solid #000;
    cursor: pointer;
    margin: 5% auto;
  }

  h1 {
    color: #f0a500;
  }

  p {
    color: #f0a500;
  }
</style>

<Layout showThemeToggle={true}>
  <div id="container">
    <h1 class="text-3xl">Memory Game</h1>
    <p>Click the boxes in sequential order</p>
    <canvas id="canvas" on:click={handleCanvasClick}></canvas>
    <Toast message={$toastMessage.message} type={$toastMessage.type} />
  </div>
</Layout>
