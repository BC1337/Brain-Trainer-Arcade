<!-- src/routes/aim-trainer/+page.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';

  let playAreaWidth;
  let playAreaHeight;
  const minWidth = 300; // Adjusted for mobile
  const maxWidth = 800;
  const screenHeightPercentage = 0.65;
  const minHeight = 200;

  let gameStarted = false;
  let firstGameStarted = false;
  let timer = 10;
  let successfulClicks = 0;
  let missedClicks = 0;
  let totalClicks = 0;
  let accuracy = 0;
  let gameEnded = false;
  let targetX;
  let targetY;
  let targetSize = 25;
  let roundLength = 10;
  let showStatsModal = false;
  let showSettingsModal = false;
  let isStarting = false;
  let highScores = [];
  let timerInterval;

  let canvas;
  const isBrowser = typeof window !== 'undefined';

  // Load settings and high scores from localStorage
  onMount(() => {
    if (isBrowser) {
      canvas = document.getElementById('play-area');
      const savedSettings = localStorage.getItem('aimTrainerSettings');
      if (savedSettings) {
        const { size, length } = JSON.parse(savedSettings);
        targetSize = size || 25;
        roundLength = length || 10;
      }
      const savedScores = localStorage.getItem('aimTrainerHighScores');
      if (savedScores) {
        highScores = JSON.parse(savedScores).slice(0, 5);
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }
  });

  onDestroy(() => {
    if (isBrowser) {
      window.removeEventListener('resize', resizeCanvas);
      if (timerInterval) clearInterval(timerInterval);
    }
  });

  const saveSettings = () => {
    if (isBrowser) {
      localStorage.setItem('aimTrainerSettings', JSON.stringify({ size: targetSize, length: roundLength }));
    }
  };

  const saveHighScores = () => {
    if (isBrowser) {
      highScores = [...highScores, accuracy].sort((a, b) => b - a).slice(0, 5); // Sort descending for accuracy
      localStorage.setItem('aimTrainerHighScores', JSON.stringify(highScores));
    }
  };

  const resizeCanvas = () => {
    playAreaWidth = Math.max(minWidth, Math.min(window.innerWidth * 0.9, maxWidth));
    playAreaHeight = Math.max(window.innerHeight * screenHeightPercentage, minHeight);
    if (canvas) {
      canvas.width = playAreaWidth;
      canvas.height = playAreaHeight;
      if (gameStarted) {
        const ctx = canvas.getContext('2d');
        if (ctx) generateTarget(ctx);
      }
    }
  };

  const startGame = () => {
    if (isStarting) return;
    isStarting = true;
    gameStarted = true;
    firstGameStarted = true;
    gameEnded = false;
    successfulClicks = 0;
    missedClicks = 0;
    totalClicks = 0;
    accuracy = 0;
    timer = roundLength;
    showStatsModal = false;
    showSettingsModal = false;
    startTimer();
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      if (ctx) generateTarget(ctx);
      isStarting = false;
    }, 100);
  };

  const generateTarget = (ctx) => {
    if (gameStarted && ctx) {
      targetX = Math.random() * (playAreaWidth - targetSize * 2);
      targetY = Math.random() * (playAreaHeight - targetSize * 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetSize, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    }
  };

  const handleTargetClick = (event) => {
    if (gameStarted && canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { offsetX, offsetY } = event;
      const distance = Math.sqrt((offsetX - targetX) ** 2 + (offsetY - targetY) ** 2);
      totalClicks++;
      if (distance <= targetSize) {
        successfulClicks++;
        generateTarget(ctx);
      } else {
        missedClicks++;
      }
      accuracy = (successfulClicks / totalClicks) * 100 || 0;
    }
  };

  const handleKeyDown = (event) => {
    if (gameStarted && (event.key === 'Enter' || event.key === 'Space')) {
      handleTargetClick({ offsetX: targetX, offsetY: targetY }); // Simulate click on target
    }
  };

  const startTimer = () => {
    timerInterval = setInterval(() => {
      if (timer > 0) {
        timer--;
      } else {
        clearInterval(timerInterval);
        endGame();
      }
    }, 1000);
  };

  const endGame = () => {
    gameEnded = true;
    gameStarted = false;
    saveHighScores();
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    showStatsModal = true;
  };

  const closeStatsModal = () => {
    showStatsModal = false;
  };

  const applySettings = () => {
    saveSettings();
    startGame();
  };

  const toggleSettingsModal = () => {
    showSettingsModal = !showSettingsModal;
  };
</script>

<head>
  <title>Aim Trainer!</title>
  <meta name="description" content="Test your aiming skills in this fast-paced game. Click the targets as quickly and accurately as possible before time runs out. Challenge your friends to beat your high score!">
  <meta name="keywords" content="aim trainer, aiming game, reflex game, online game, accuracy game, target practice, reaction speed, challenge game">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<Layout>
  <main class="content-wrapper" aria-labelledby="game-title">
    <h1 class="game-title" id="game-title">Aim Trainer</h1>
    <section class="game-container" aria-label="Aim trainer game">
      <p class="game-description">Click the red targets as fast as you can before the timer runs out!</p>
      <div class="game-controls" aria-label="Game controls">
        {#if !gameStarted}
          <button class="btn btn-settings" on:click={toggleSettingsModal} aria-label="Open settings">
            <span class="icon">⚙️</span> Settings
          </button>
        {/if}
      </div>
      <div class="play-area-container" style="max-width: {maxWidth}px; min-width: {minWidth}px; height: {playAreaHeight}px;">
        {#if !gameStarted && !showStatsModal}
          <div class="start-game-modal">
            <button class="btn btn-start" on:click={startGame} disabled={isStarting} aria-label="Start game">Start Game</button>
          </div>
        {/if}
        <canvas
          id="play-area"
          class="play-area"
          width={playAreaWidth}
          height={playAreaHeight}
          on:click={handleTargetClick}
          on:keydown={handleKeyDown}
          role="button"
          tabindex="0"
          aria-label="Target practice area"
        ></canvas>
      </div>
      <div class="game-stats" aria-live="polite">
        <div class="stats-container">
          <div class="current-stats" aria-labelledby="current-stats-title">
            <h2 id="current-stats-title">Current Game</h2>
            <p>Time Left: {timer}s</p>
            <p>Successful Clicks: {successfulClicks}</p>
            <p>Total Clicks: {totalClicks}</p>
            <p>Accuracy: {accuracy.toFixed(2)}%</p>
          </div>
          <div class="high-scores" aria-labelledby="high-scores-title">
            <h2 id="high-scores-title">Top 5 High Scores (Accuracy)</h2>
            <ol>
              {#each highScores as score, index}
                <li>{index + 1}. {score.toFixed(2)}%</li>
              {/each}
            </ol>
          </div>
        </div>
      </div>
      {#if showStatsModal}
        <div class="modal" role="dialog" aria-labelledby="stats-modal-title" aria-modal="true">
          <div class="modal-content">
            <h2 id="stats-modal-title"><span style="color: var(--accent-color, #ff4d4d);">Game Over</span></h2>
            <p>Successful Clicks: {successfulClicks}</p>
            <p>Total Clicks: {totalClicks}</p>
            <p>Accuracy: {accuracy.toFixed(2)}%</p>
            {#if highScores.length > 0}
              <div class="high-scores" aria-labelledby="modal-high-scores-title">
                <h3 id="modal-high-scores-title">Top 5 High Scores (Accuracy)</h3>
                <ol>
                  {#each highScores as score, index}
                    <li>{index + 1}. {score.toFixed(2)}%</li>
                  {/each}
                </ol>
              </div>
            {/if}
            <div class="modal-buttons">
              <button class="btn btn-restart" on:click={startGame} aria-label="Play again">Play Again</button>
              <button class="btn btn-close" on:click={closeStatsModal} aria-label="Close modal">Close</button>
            </div>
          </div>
        </div>
      {/if}
      {#if showSettingsModal}
        <div class="modal" role="dialog" aria-labelledby="settings-modal-title" aria-modal="true">
          <div class="modal-content">
            <h2 id="settings-modal-title">Game Settings</h2>
            <div class="settings-form">
              <label for="target-size">Target Size: {targetSize}px</label>
              <input
                type="range"
                id="target-size"
                min="10"
                max="50"
                bind:value={targetSize}
                aria-label="Adjust target size"
              />
              <label for="round-length">Round Length: {roundLength}s</label>
              <input
                type="range"
                id="round-length"
                min="5"
                max="60"
                bind:value={roundLength}
                aria-label="Adjust round length"
              />
            </div>
            <div class="modal-buttons">
              <button class="btn btn-apply" on:click={applySettings} aria-label="Apply settings and start game">Apply & Start</button>
              <button class="btn btn-close" on:click={toggleSettingsModal} aria-label="Close settings">Cancel</button>
            </div>
          </div>
        </div>
      {/if}
    </section>
  </main>
</Layout>

<style>
  :root {
    --background-color: var(--theme-background, #1a1a1a);
    --card-background: var(--theme-card, #2a2a2a);
    --text-color: var(--theme-text, #ffffff);
    --accent-color: #ff4d4d;
    --shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    --transition: all 0.3s ease;
  }

  .content-wrapper {
    display: grid;
    gap: 2rem;
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .game-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-color);
    text-align: center;
  }

  .game-container {
    display: grid;
    gap: 1.5rem;
    justify-items: center;
    padding: 1.5rem;
    background: var(--card-background);
    border-radius: 16px;
    box-shadow: var(--shadow);
  }

  .game-description {
    font-size: 1.2rem;
    color: var(--text-color);
    text-align: center;
    margin-bottom: 1rem;
  }

  .game-controls {
    display: flex;
    gap: 1rem;
  }

  .play-area-container {
    position: relative;
  }

  .play-area {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 2px solid var(--accent-color);
    cursor: pointer;
    transition: box-shadow 0.3s ease;
  }

  .play-area:focus-visible {
    outline: 2px solid var(--text-color);
    outline-offset: 2px;
  }

  .start-game-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: var(--transition);
  }

  .btn-start,
  .btn-restart,
  .btn-apply {
    background: var(--accent-color);
    color: var(--text-color);
  }

  .btn-settings,
  .btn-close {
    background: var(--text-color);
    color: var(--card-background);
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  .btn:focus {
    outline: 2px solid var(--text-color);
    outline-offset: 2px;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-settings {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .game-stats {
    width: 100%;
    max-width: 600px;
  }

  .stats-container {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
  }

  .current-stats,
  .high-scores {
    flex: 1;
    color: var(--text-color);
  }

  .current-stats h2,
  .high-scores h2 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .current-stats p,
  .high-scores li {
    font-size: 1rem;
    margin: 0.5rem 0;
  }

  .high-scores ol {
    list-style: none;
    padding: 0;
  }

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
  }

  .modal-content {
    background-color: var(--card-background);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: var(--shadow);
    color: var(--text-color);
    max-width: 400px;
    width: 90%;
  }

  .modal-content h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .modal-content h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .modal-content p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .settings-form {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .settings-form label {
    font-size: 1rem;
    font-weight: 500;
  }

  .settings-form input[type="range"] {
    width: 100%;
    accent-color: var(--accent-color);
  }

  .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  @media (max-width: 600px) {
    .content-wrapper {
      margin: 1rem;
    }

    .game-title {
      font-size: 1.5rem;
    }

    .game-container {
      padding: 1rem;
    }

    .play-area-container {
      min-width: 250px;
      height: 200px;
    }

    .stats-container {
      flex-direction: column;
      gap: 1rem;
    }

    .game-description {
      font-size: 1rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .modal-content {
      padding: 15px;
    }

    .modal-content h2 {
      font-size: 1.5rem;
    }

    .modal-content h3 {
      font-size: 1rem;
    }

    .modal-content p {
      font-size: 1rem;
    }
  }
</style>