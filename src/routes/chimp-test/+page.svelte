<script>
  import { onMount } from "svelte";
  import Layout from '../../layouts/Layout.svelte'
  
  let canvasWidth = 600;
  let canvasHeight = 400;
  let ctx;
  let boxes = [];
  let currentBoxIndex = 0; // To keep track of the current box user should click
  let round = 1; // Track the current round
  let numBoxes = 4; // Initial number of boxes
  let hideNumbers = false; // Flag to hide numbers after the first box click in subsequent rounds

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
      let size = 50;
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
    currentBoxIndex = 0; // Reset currentBoxIndex
    hideNumbers = false; // Reset hideNumbers flag
    drawCanvas();
  }

  function startGame() {
    round = 1; // Reset round to 1
    numBoxes = 4; // Reset number of boxes
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
      clickedBox.clicked = true; // Mark the box as clicked
      currentBoxIndex++;

      if (currentBoxIndex === numBoxes) {
        // User completed the round successfully
        alert('Congratulations! You completed round ' + round + ' successfully.');
        round++; // Increment round
        numBoxes++; // Increase number of boxes for the next round
        generateBoxes(); // Start a new round
      } else if (currentBoxIndex === 1 && round > 1) {
        // Hide numbers after clicking the first box in subsequent rounds
        hideNumbers = true;
        drawCanvas(); // Redraw canvas after hiding numbers
      } else {
        drawCanvas(); // Redraw canvas after successful click
      }
    } else {
      // User clicked the wrong box, game over
      alert('Game Over! You clicked the wrong box.');
      startGame(); // Restart the game
    }
  }

  function checkOverlap(x, y, size) {
    for (let box of boxes) {
      if (
        x < box.x + box.size &&
        x + size > box.x &&
        y < box.y + box.size &&
        y + size > box.y
      ) {
        return true; // Overlap found
      }
    }
    return false; // No overlap
  }

  onMount(() => {
    let canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    generateBoxes(); // Generate boxes when the component mounts
  });
</script>

<style>
  #container {
    text-align: center;
  }
  
  #canvas {
    border: 2px solid #000;
    cursor: pointer;
    margin: 10% auto;
  }
</style>

<Layout>
  <div id="container">
    <h1>Memory Game</h1>
    <p>Click the boxes in sequential order</p>
    <canvas id="canvas" width={canvasWidth} height={canvasHeight} on:click={handleCanvasClick}></canvas>
  </div>
</Layout>
