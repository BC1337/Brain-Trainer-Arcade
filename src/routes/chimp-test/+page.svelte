<script>
  import { onMount } from "svelte";
  import Layout from '../../layouts/Layout.svelte'
  let canvasWidth = 600;
  let canvasHeight = 400;
  let ctx;
  let boxes = [];
  let currentBoxIndex = 0; // To keep track of the current box user should click

  function drawCanvas() {
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    for (let box of boxes) {
      ctx.fillStyle = '#009688';
      ctx.fillRect(box.x, box.y, box.size, box.size);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(box.number, box.x + box.size / 2, box.y + box.size / 2);
    }
  }

  function generateBoxes() {
    boxes = [];
    for (let i = 1; i <= 4; i++) {
      let size = 50;
      let x = Math.random() * (canvasWidth - size);
      let y = Math.random() * (canvasHeight - size);
      boxes.push({ x, y, size, number: i });
    }
    currentBoxIndex = 0; // Reset currentBoxIndex
    drawCanvas();
  }

  function startGame() {
    generateBoxes();
  }

  function handleCanvasClick(event) {
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let clickedBox = boxes.find(box => {
      return (
        x >= box.x &&
        x <= box.x + box.size &&
        y >= box.y &&
        y <= box.y + box.size &&
        box.number === currentBoxIndex + 1
      );
    });

    if (clickedBox) {
      // User clicked the correct box
      boxes.splice(boxes.indexOf(clickedBox), 1); // Remove clicked box from boxes array
      currentBoxIndex++;

      if (currentBoxIndex === 4) {
        // User completed the round successfully
        alert('Congratulations! You completed the round successfully.');
        generateBoxes(); // Start a new round
      }
      drawCanvas(); // Redraw canvas after successful click
    } else {
      // User clicked the wrong box, game over
      alert('Game Over! You clicked the wrong box.');
      generateBoxes(); // Start a new round
    }
  }

  onMount(() => {
    let canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    generateBoxes(); // Generate boxes when the component mounts
  });
</script>

<style>
  canvas {
    border: 2px solid #000;
    cursor: pointer;
  }
</style>
<Layout>
  <canvas id="canvas" width={canvasWidth} height={canvasHeight} on:click={handleCanvasClick}></canvas>

  <button on:click={startGame}>Start Game</button>
</Layout>
