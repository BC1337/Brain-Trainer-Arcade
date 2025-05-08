<script>
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import Layout from '../../layouts/Layout.svelte';
  import Toast from "../../lib/components/Toast.svelte";
  import { isTokenExpired } from "$lib/utils/auth.js";

  let canvas;
  let ctx;
  let boxes = [], currentBoxIndex = 0, round = 1, numBoxes = 4;
  let hideNumbers = false, canvasWidth, canvasHeight;
  const minWidth = 320, minHeight = 568, maxWidth = 1200;

  let maxRoundAchieved = 1;
  const toastMessage = writable({ message: "", type: "" });
  let globalHighscores = [];

  const showToast = (message, type) => {
    toastMessage.set({ message, type });
    setTimeout(() => toastMessage.set({ message: '', type: '' }), 1650);
  };

  const toastError = (message) => {
    console.error(message);
    showToast(message, 'error');
  };

  async function saveHighscore(roundsCompleted) {
    try {
      const token = localStorage.getItem('token');
      console.log('📦 Token being sent to backend:', token);
      if (!token || isTokenExpired(token)) {
        toastError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('sessionUser');
        return;
      }

const response = await fetch('/api/user/highscore/chimp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    score: roundsCompleted,   // or whatever you want to save
    duration: 0,
    timestamp: Date.now(),
    rounds: roundsCompleted
  }),
});

      const data = await response.json();

      if (!response.ok) {
        toastError(data?.error || 'Failed to save highscore');
      } else {
        showToast('Highscore saved!', 'success');
        loadGlobalHighscores(); // refresh after saving
      }
    } catch (err) {
      console.error('Error saving highscore:', err);
      toastError('An error occurred while saving your highscore');
    }
  }

  async function loadGlobalHighscores() {
    try {
      const response = await fetch('/api/highscore/chimp');
      const data = await response.json();

      if (response.ok) {
        globalHighscores = data.highscores || [];
      } else {
        console.error('Failed to fetch global highscores:', data.error);
      }
    } catch (err) {
      console.error('Error loading global highscores:', err);
    }
  }

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
    maxRoundAchieved = 1;
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
          showToast('Round ' + round + ' complete!', 'success');
          maxRoundAchieved = Math.max(maxRoundAchieved, round);
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
        saveHighscore(maxRoundAchieved);
        startGame();
      }
    }
  }

  function checkOverlap(x, y, size) {
    return boxes.some(box =>
      x < box.x + box.size &&
      x + size > box.x &&
      y < box.y + box.size &&
      y + size > box.y
    );
  }

  function resizeCanvas() {
    canvasWidth = Math.max(minWidth, Math.min(window.innerWidth * 0.9, maxWidth));
    canvasHeight = Math.max(minHeight, window.innerHeight * 0.7);
    if (canvas) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      generateBoxes();
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      if (canvas) {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
          toastError("Session expired. Please log in again.");
          localStorage.removeItem('token');
          localStorage.removeItem('sessionUser');
          return;
        }

        if (window.innerWidth < 431) {
          setTimeout(() => {
            canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200);
        }
      }

      loadGlobalHighscores();
    }
  });

  // gate the window onDestroy testing an SSR error fix.
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
      <canvas bind:this={canvas} on:click={handleCanvasClick}></canvas>
    </div>

    <Toast message={$toastMessage.message} type={$toastMessage.type} />


  </div>
</Layout>

<style>
  #container {
    text-align: center;
    padding-top: 80px;
  }

  .game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
  }

  canvas {
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

</style>
