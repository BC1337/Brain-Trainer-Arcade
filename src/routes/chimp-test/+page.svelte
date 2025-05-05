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
  const minWidth = 320;
  const minHeight = 568;
  const maxWidth = 1200;

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

    let clickedBox = boxes.find(box => (
      x >= box.x && x <= box.x + box.size &&
      y >= box.y && y <= box.y + box.size
    ));

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

    // Auto-scroll on small screens (less than ~6 inch width, ~430px)
    if (window.innerWidth < 431) {
      // Give canvas time to render
      setTimeout(() => {
        canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }

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

<Layout showThemeToggle={true}>
  <div id="container">
    <h1>Click the boxes in sequential order</h1>
    <div class="game-container">
      <canvas id="canvas" on:click={handleCanvasClick}></canvas>
    </div>
    <Toast message={$toastMessage.message} type={$toastMessage.type} />
  </div>
</Layout>

<style>
  /* Center the game window properly */
  #container {
    text-align: center;
    padding-top: 80px; /* Pushes everything down nicely from the nav */
  }

  .game-container {
    display: flex;
    justify-content: center; /* Horizontally center */
    align-items: center; /* Vertically center */
    margin-top: 30px; /* Adjust the space between the title and canvas */
  }

  #canvas {
    border: 2px solid #000;
    cursor: pointer;
    margin-top: 24px;
    max-width: 100%;
    max-height: 100%;
  }

  h1 {
    font-size: 22px;
    color: #f0a500;
    margin-bottom: 12px;
  }

  p {
    color: #f0a500;
  }
</style>
