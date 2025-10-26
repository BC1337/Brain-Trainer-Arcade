<!-- src/routes/chimp-test/+page.svelte -->
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
    setTimeout(() => toastMessage.set({ message: '', type: '' }), 3000);
  };

  const toastError = (message) => {
    console.error(message);
    showToast(message, 'error');
  };

  async function saveHighscore(roundsCompleted) {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!(token && !isTokenExpired(token));

    if (!isLoggedIn) {
      showToast(
        `Congratulations! You made it to round ${roundsCompleted}. Please login to compete in the highscores.`,
        'info'
      );
      return;
    }

    try {
      const response = await fetch('/api/user/highscore/chimp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: roundsCompleted,
          duration: 0,
          timestamp: Date.now(),
          rounds: roundsCompleted
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('sessionUser');
          toastError('Session expired. Please log in again.');
        } else {
          toastError(data?.error || 'Failed to save highscore');
        }
      } else {
        showToast('Highscore saved!', 'success');
        loadGlobalHighscores();
      }
    } catch (err) {
      toastError('An error occurred while saving your highscore');
    }
  }

  async function loadGlobalHighscores() {
    try {
      const response = await fetch('/api/highscore/chimp');
      const data = await response.json();
      if (response.ok) {
        globalHighscores = data.highscores || [];
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
      ctx = canvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const token = localStorage.getItem('token');
      if (token && !isTokenExpired(token)) {
        loadGlobalHighscores();
      }

      if (window.innerWidth < 431) {
        setTimeout(() => {
          canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
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
      <canvas bind:this={canvas} on:click={handleCanvasClick}></canvas>
    </div>

    <!-- CENTERED TOAST -->
    {#if $toastMessage.message}
      <div class="center-toast {$toastMessage.type}">
        {$toastMessage.message}
      </div>
    {/if}
  </div>
</Layout>

<style>
  /* BUMPED UP EVEN MORE */
  #container {
    text-align: center;
    padding-top: 20px; /* was 40px */
  }

  .game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 8px; /* was 16px */
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

  /* CENTERED TOAST */
  .center-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.92);
    color: white;
    padding: 18px 36px;
    border-radius: 14px;
    font-size: 1.35rem;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    text-align: center;
    min-width: 260px;
    max-width: 90%;
    line-height: 1.4;
    pointer-events: none;
  }

  .center-toast.success { border: 3px solid #4caf50; }
  .center-toast.error   { border: 3px solid #f44336; }
  .center-toast.info    { border: 3px solid #2196f3; }

  @media (max-width: 480px) {
    #container { padding-top: 15px; }
    .game-container { margin-top: 6px; }
    .center-toast {
      font-size: 1.15rem;
      padding: 14px 24px;
    }
  }
</style>