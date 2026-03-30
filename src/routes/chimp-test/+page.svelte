<script>
  import { onMount, onDestroy } from "svelte";
  import Layout from '../../layouts/Layout.svelte';
  import { isTokenExpired } from "$lib/utils/auth.js";

  let canvas;
  let ctx;
  let boxes = [], currentBoxIndex = 0, round = 1, numBoxes = 4;
  let hideNumbers = false;
  let canvasWidth = 800;
  let canvasHeight = 600;
  let gameStarted = false;
  let showGameOverModal = false;
  let lastScore = 0;
  
  const minWidth = 320, maxWidth = 800;

  let isLoggedIn = false;
  let isSaving = false;

  function checkAuth() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      isLoggedIn = !!(token && !isTokenExpired(token));
    }
  }

  const saveGuestScore = () => {
    const guestData = {
      rounds: lastScore,
      timestamp: Date.now()
    };
    localStorage.setItem('guest_chimp-test_score', JSON.stringify(guestData));
  };

  const generateBoxes = () => {
    if (!canvas || !ctx) return;
    boxes = [];
    currentBoxIndex = 0;
    hideNumbers = false; 
    let size = Math.min(canvas.width, canvas.height) / 8;

    for (let i = 1; i <= numBoxes; i++) {
      let overlap = true;
      let x, y, attempts = 0;
      while (overlap && attempts < 300) {
        x = Math.random() * (canvas.width - size - 40) + 20;
        y = Math.random() * (canvas.height - size - 40) + 20;
        overlap = checkOverlap(x, y, size);
        attempts++;
      }
      boxes.push({ x, y, size, number: i, clicked: false });
    }
    drawCanvas();
  };

  const drawCanvas = () => {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let box of boxes) {
      if (!box.clicked) {
        ctx.fillStyle = '#16a34a';
        ctx.strokeStyle = '#f0a500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(box.x, box.y, box.size, box.size, 8);
        else ctx.rect(box.x, box.y, box.size, box.size);
        ctx.fill();
        ctx.stroke();

        if (!hideNumbers) {
          ctx.fillStyle = '#FFFFFF';
          const fontSize = Math.floor(box.size * 0.45);
          ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(box.number, box.x + box.size / 2, box.y + box.size / 2);
        }
      }
    }
  };

  const handleCanvasClick = (event) => {
    if (showGameOverModal || !gameStarted) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    const clickedBox = boxes.find(box => (
      !box.clicked && x >= box.x && x <= box.x + box.size && y >= box.y && y <= box.y + box.size
    ));

    if (clickedBox) {
      if (clickedBox.number === currentBoxIndex + 1) {
        clickedBox.clicked = true;
        currentBoxIndex++;
        if (currentBoxIndex === 1) hideNumbers = true;
        if (currentBoxIndex === numBoxes) {
          round++;
          numBoxes++;
          generateBoxes();
        } else drawCanvas();
      } else handleGameOver();
    }
  };

  const handleGameOver = async () => {
    lastScore = round;
    gameStarted = false;
    showGameOverModal = true;
    
    // Local backup / Dashboard update
    saveGuestScore();

    if (isLoggedIn) {
      isSaving = true;
      const token = localStorage.getItem('token');
      try {
        await fetch('/api/user/highscore/chimp-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ rounds: lastScore }),
        });
      } catch (e) { console.error("Database sync failed:", e); }
      isSaving = false;
    }
  };

  function checkOverlap(x, y, size) {
    return boxes.some(box =>
      x < box.x + box.size + 20 && x + size + 20 > box.x &&
      y < box.y + box.size + 20 && y + size + 20 > box.y
    );
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvasWidth = Math.max(minWidth, Math.min(window.innerWidth * 0.95, maxWidth));
    canvasHeight = Math.max(450, window.innerHeight * 0.65);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    if (gameStarted) drawCanvas();
  }

  const startGame = () => {
    round = 1;
    numBoxes = 4;
    showGameOverModal = false;
    gameStarted = true;
    generateBoxes();
  };

  onMount(() => {
    checkAuth();
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') window.removeEventListener('resize', resizeCanvas);
  });
</script>

<Layout>
  <div class="game-wrapper">
    <div class="header-ui">
      <div class="title-block">
        <h1>Chimp Test</h1>
        <p class="subtitle">Sequential Memory Challenge</p>
      </div>
      <div class="stats-pills">
        <div class="pill">Level <span>{round}</span></div>
        <div class="pill">Squares <span>{numBoxes}</span></div>
      </div>
    </div>

    <div class="canvas-container" style="width: {canvasWidth}px; height: {canvasHeight}px;">
      <canvas bind:this={canvas} on:mousedown|preventDefault={handleCanvasClick} class:dimmed={!gameStarted || showGameOverModal}></canvas>

      {#if !gameStarted && !showGameOverModal}
        <div class="overlay">
          <div class="card">
            <p>Click the squares in order by their numbers.</p>
            <p class="warning">Numbers disappear after the first click!</p>
            <button class="btn btn-primary" on:click={startGame}>Start Test</button>
          </div>
        </div>
      {/if}

      {#if showGameOverModal}
        <div class="overlay">
          <div class="card">
            <div class="sync-badge">
              <span class="dot"></span>
              {#if isLoggedIn}
                {isSaving ? 'DATABASE_UPLINKING...' : 'DATABASE_UPLINK_SUCCESS'}
              {:else}
                DASHBOARD_DATA_UPDATED
              {/if}
            </div>

            <h2 class="status-text">Test Completed</h2>
            <div class="score-display">
              <span class="label">Rounds Completed</span>
              <span class="value">{lastScore}</span>
            </div>
            
            <div class="sync-status">
              {#if isLoggedIn}
                <div class="status-indicator success">
                   <span>{isSaving ? 'Syncing...' : 'Global Rank Updated! ✔'}</span>
                </div>
              {:else}
                <div class="status-indicator guest">
                  <p>Guest Progress Saved</p>
                  <a href="/login" class="login-link">Login for Global Rankings</a>
                </div>
              {/if}
            </div>

            <button class="btn btn-primary" on:click={startGame}>Try Again</button>
            <a href="/dashboard" class="dashboard-link">Back to Dashboard</a>
          </div>
        </div>
      {/if}
    </div>
  </div>
</Layout>

<style>
  :root {
    --chimp-accent: #f0a500;
    --chimp-green: #16a34a;
    --chimp-bg: #1a1a1a;
  }

  .game-wrapper { max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: white; }
  .header-ui { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }

  h1 { font-size: 2.2rem; color: var(--chimp-green); margin: 0; font-weight: 900; }
  .subtitle { color: #888; margin: 0; font-size: 0.95rem; }

  .stats-pills { display: flex; gap: 0.8rem; }
  .pill { 
    background: #2a2a2a; padding: 0.6rem 1.2rem; border-radius: 12px; border: 1px solid #333; color: #888;
  }
  .pill span { color: var(--chimp-accent); font-weight: bold; margin-left: 6px; }

  .canvas-container {
    position: relative; border-radius: 20px; overflow: hidden; background: #111; border: 3px solid #333; margin: 0 auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  canvas { display: block; width: 100%; height: 100%; cursor: crosshair; transition: filter 0.4s ease; }
  .dimmed { filter: blur(6px) brightness(0.3); }

  .overlay { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 20; padding: 1.5rem; }
  .card { 
    background: #1a1a1a; padding: 2.5rem; border-radius: 28px; border: 1px solid #333; 
    text-align: center; width: 100%; max-width: 380px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); 
  }

  .sync-badge {
    display: inline-flex; align-items: center; gap: 6px; background: rgba(22, 163, 74, 0.1);
    color: var(--chimp-green); font-size: 0.65rem; font-weight: 900; padding: 6px 12px;
    border-radius: 6px; border: 1px solid rgba(22, 163, 74, 0.2); margin-bottom: 1.2rem;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .sync-badge .dot { width: 6px; height: 6px; background: var(--chimp-green); border-radius: 50%; animation: pulse 1.5s infinite; }

  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

  .warning { color: var(--chimp-accent); font-size: 0.85rem; margin: 1rem 0; font-weight: 600; }
  .score-display { margin: 1.5rem 0; }
  .score-display .label { color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
  .score-display .value { display: block; font-size: 5rem; font-weight: 900; color: var(--chimp-accent); line-height: 1; }

  .sync-status { background: #0d0d0d; padding: 1rem; border-radius: 16px; margin-bottom: 2rem; border: 1px solid #222; }
  .status-indicator.success { color: #16a34a; font-weight: bold; }
  .status-indicator.guest p { margin: 0 0 0.4rem; color: #777; font-size: 0.85rem; }
  .login-link { color: var(--chimp-accent); text-decoration: none; font-weight: 800; }

  .btn { padding: 1.1rem; border-radius: 14px; font-weight: 800; cursor: pointer; border: none; width: 100%; text-transform: uppercase; }
  .btn-primary { background: var(--chimp-green); color: white; box-shadow: 0 4px 0 #0f763e; }
  .btn-primary:active { transform: translateY(3px); box-shadow: 0 1px 0 #0f763e; }

  .dashboard-link { display: block; margin-top: 1.5rem; color: #666; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
  .dashboard-link:hover { color: var(--chimp-accent); }
  .status-text { color: var(--chimp-green); margin: 0 0 1rem; font-size: 1.8rem; font-weight: 900; }

  @media (max-width: 600px) {
    .header-ui { flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
  }
</style>