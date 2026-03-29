<script>
  import { onMount, onDestroy } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';

  let canvas;
  let ctx;
  let playAreaWidth;
  let playAreaHeight;
  const minWidth = 300;
  const maxWidth = 800;
  const screenHeightPercentage = 0.65;
  const minHeight = 200;

  let gameStarted = false;
  let timer = 10;
  let successfulClicks = 0;
  let totalClicks = 0;
  let accuracy = 0;
  let targetX = 0;
  let targetY = 0;
  let targetSize = 25;
  let roundLength = 10;
  let showStatsModal = false;
  let showSettingsModal = false;
  let highScores = [];
  let timerInterval;

  const isBrowser = typeof window !== 'undefined';

  onMount(() => {
    if (isBrowser) {
      ctx = canvas.getContext('2d');
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

  const resizeCanvas = () => {
    playAreaWidth = Math.max(minWidth, Math.min(window.innerWidth * 0.9, maxWidth));
    playAreaHeight = Math.max(window.innerHeight * screenHeightPercentage, minHeight);
    if (canvas) {
      canvas.width = playAreaWidth;
      canvas.height = playAreaHeight;
      if (gameStarted) drawTarget();
    }
  };

  const drawTarget = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetSize, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4d4d'; // Using the CSS accent color
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 77, 77, 0.5)';
    ctx.fill();
    ctx.closePath();
  };

  const generateNewTarget = () => {
    // Math ensures the target center is at least targetSize away from any edge
    targetX = Math.random() * (canvas.width - targetSize * 2) + targetSize;
    targetY = Math.random() * (canvas.height - targetSize * 2) + targetSize;
    drawTarget();
  };

  const handleInput = (e) => {
    if (!gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    let clickX, clickY;

    if (e.type === 'touchstart') {
      clickX = e.touches[0].clientX - rect.left;
      clickY = e.touches[0].clientY - rect.top;
    } else {
      clickX = e.clientX - rect.left;
      clickY = e.clientY - rect.top;
    }

    const dist = Math.sqrt((clickX - targetX) ** 2 + (clickY - targetY) ** 2);
    totalClicks++;

    if (dist <= targetSize) {
      successfulClicks++;
      generateNewTarget();
    }
    
    accuracy = (successfulClicks / totalClicks) * 100;
  };

  const startGame = () => {
    gameStarted = true;
    showStatsModal = false;
    showSettingsModal = false;
    successfulClicks = 0;
    totalClicks = 0;
    accuracy = 0;
    timer = roundLength;
    
    generateNewTarget();
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timer--;
      if (timer <= 0) endGame();
    }, 1000);
  };

  const endGame = () => {
    clearInterval(timerInterval);
    gameStarted = false;
    showStatsModal = true;
    
    // Save high score (Accuracy based)
    if (totalClicks > 0) {
      highScores = [...highScores, accuracy].sort((a, b) => b - a).slice(0, 5);
      localStorage.setItem('aimTrainerHighScores', JSON.stringify(highScores));
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSettings = () => {
    localStorage.setItem('aimTrainerSettings', JSON.stringify({ size: targetSize, length: roundLength }));
    showSettingsModal = false;
  };
</script>

<Layout>
  <main class="content-wrapper">
    <h1 class="game-title">Aim Trainer</h1>
    
    <section class="game-container">
      <div class="game-header">
        <div class="timer-display" class:low-time={timer < 5}>
          {timer}s
        </div>
        {#if !gameStarted}
          <button class="btn btn-settings" on:click={() => (showSettingsModal = true)}>
            ⚙️ Settings
          </button>
        {/if}
      </div>

      <div class="play-area-container" style="height: {playAreaHeight}px; width: {playAreaWidth}px;">
        <canvas
          bind:this={canvas}
          on:mousedown|preventDefault={handleInput}
          on:touchstart|preventDefault={handleInput}
          class="play-area"
        ></canvas>

        {#if !gameStarted && !showStatsModal}
          <div class="overlay">
            <button class="btn btn-start" on:click={startGame}>Start Training</button>
          </div>
        {/if}
      </div>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="label">Hits</span>
          <span class="value">{successfulClicks}</span>
        </div>
        <div class="stat-item">
          <span class="label">Accuracy</span>
          <span class="value">{accuracy.toFixed(1)}%</span>
        </div>
      </div>
    </section>

    {#if showStatsModal}
      <div class="modal-backdrop">
        <div class="modal">
          <h2>Round Complete!</h2>
          <div class="final-stats">
            <p>Hits: <strong>{successfulClicks}</strong></p>
            <p>Accuracy: <strong>{accuracy.toFixed(2)}%</strong></p>
          </div>
          <div class="score-board">
            <h3>Personal Best (Accuracy)</h3>
            <ul>
              {#each highScores as score, i}
                <li><span>#{i + 1}</span> <span>{score.toFixed(1)}%</span></li>
              {/each}
            </ul>
          </div>
          <div class="modal-actions">
            <button class="btn btn-start" on:click={startGame}>Try Again</button>
            <button class="btn btn-close" on:click={() => (showStatsModal = false)}>Close</button>
          </div>
        </div>
      </div>
    {/if}

    {#if showSettingsModal}
      <div class="modal-backdrop">
        <div class="modal">
          <h2>Game Settings</h2>
          <div class="setting-group">
            <label>Target Size: {targetSize}px</label>
            <input type="range" min="10" max="60" bind:value={targetSize} />
          </div>
          <div class="setting-group">
            <label>Duration: {roundLength}s</label>
            <input type="range" min="5" max="60" bind:value={roundLength} />
          </div>
          <button class="btn btn-start" on:click={saveSettings}>Save Settings</button>
        </div>
      </div>
    {/if}
  </main>
</Layout>

<style>
  :root {
    --accent: #ff4d4d;
    --bg: #1a1a1a;
    --card: #2a2a2a;
    --text: #ffffff;
  }

  .content-wrapper {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: 'Inter', sans-serif;
  }

  .game-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: var(--text);
  }

  .game-container {
    background: var(--card);
    padding: 1.5rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .timer-display {
    font-size: 1.5rem;
    font-weight: bold;
    background: #333;
    padding: 0.5rem 1.5rem;
    border-radius: 10px;
    color: var(--text);
  }

  .low-time {
    color: var(--accent);
    animation: pulse 1s infinite;
  }

  .play-area-container {
    position: relative;
    background: #111;
    border-radius: 12px;
    border: 2px solid #444;
    overflow: hidden;
    margin: 0 auto;
  }

  .play-area {
    display: block;
    cursor: crosshair;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
  }

  .stats-bar {
    display: flex;
    gap: 2rem;
    margin-top: 1.5rem;
    justify-content: center;
  }

  .stat-item {
    text-align: center;
  }

  .stat-item .label {
    display: block;
    font-size: 0.8rem;
    color: #888;
    text-transform: uppercase;
  }

  .stat-item .value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text);
  }

  .btn {
    padding: 0.8rem 1.8rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.2s;
  }

  .btn-start { background: var(--accent); color: white; }
  .btn-settings { background: #444; color: white; }
  .btn-close { background: #666; color: white; margin-top: 1rem; }

  .btn:active { transform: scale(0.95); }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .modal {
    background: var(--card);
    padding: 2.5rem;
    border-radius: 20px;
    width: 90%;
    max-width: 450px;
    text-align: center;
  }

  .score-board {
    margin: 1.5rem 0;
    background: #222;
    padding: 1rem;
    border-radius: 10px;
  }

  .score-board ul { list-style: none; padding: 0; margin: 0.5rem 0; }
  .score-board li { 
    display: flex; 
    justify-content: space-between; 
    padding: 0.3rem 0;
    border-bottom: 1px solid #333;
  }

  .setting-group {
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .setting-group label { display: block; margin-bottom: 0.5rem; }
  input[type="range"] { width: 100%; accent-color: var(--accent); }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
</style>