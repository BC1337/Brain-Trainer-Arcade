<script>
  import { onMount, onDestroy } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';

  let canvas;
  let ctx;
  let playAreaWidth;
  let playAreaHeight;
  
  const RANKED_SIZE = 25;
  const RANKED_TIME = 30;

  let gameStarted = false;
  let timer = RANKED_TIME; 
  let successfulClicks = 0;
  let totalClicks = 0;
  let accuracy = 0;
  let targetX = 0;
  let targetY = 0;
  let isLoggedIn = false;
  
  let targetSize = RANKED_SIZE;
  let roundLength = RANKED_TIME;
  let modeSelection = 'ranked'; 
  
  let showStatsModal = false;
  let showSettingsModal = false;
  let timerInterval;

  const isBrowser = typeof window !== 'undefined';

  $: isRanked = modeSelection === 'ranked';
  $: if (modeSelection === 'ranked') {
    targetSize = RANKED_SIZE;
    roundLength = RANKED_TIME;
  }

  $: performanceRating = Math.round(successfulClicks * (accuracy / 100));

  onMount(() => {
    if (isBrowser) {
      isLoggedIn = !!localStorage.getItem('token');
      ctx = canvas.getContext('2d');
      const saved = localStorage.getItem('aimTrainerSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        modeSelection = parsed.mode || 'ranked';
        targetSize = parsed.size || RANKED_SIZE;
        roundLength = parsed.length || RANKED_TIME;
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
    playAreaWidth = Math.max(300, Math.min(window.innerWidth * 0.9, 800));
    playAreaHeight = Math.max(window.innerHeight * 0.6, 200);
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
    ctx.fillStyle = isRanked ? '#ff4d4d' : '#facc15';
    ctx.shadowBlur = 15;
    ctx.shadowColor = isRanked ? 'rgba(255, 77, 77, 0.4)' : 'rgba(250, 204, 21, 0.4)';
    ctx.fill();
    ctx.closePath();
  };

  const generateNewTarget = () => {
    targetX = Math.random() * (canvas.width - targetSize * 2) + targetSize;
    targetY = Math.random() * (canvas.height - targetSize * 2) + targetSize;
    drawTarget();
  };

  const handleInput = (e) => {
    if (!gameStarted) return;
    const rect = canvas.getBoundingClientRect();
    let clickX = (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX) - rect.left;
    let clickY = (e.type === 'touchstart' ? e.touches[0].clientY : e.clientY) - rect.top;
    const dist = Math.sqrt((clickX - targetX) ** 2 + (clickY - targetY) ** 2);
    totalClicks++;
    if (dist <= targetSize) {
      successfulClicks++;
      generateNewTarget();
    }
    accuracy = totalClicks > 0 ? (successfulClicks / totalClicks) * 100 : 0;
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

  // Saves to LocalStorage so the Dashboard can pick it up without a login
  const saveGuestScore = () => {
    const guestData = {
      rounds: performanceRating,
      hits: successfulClicks,
      accuracy: accuracy.toFixed(1),
      timestamp: Date.now()
    };
    localStorage.setItem('guest_aim-trainer_score', JSON.stringify(guestData));
  };

  async function syncToDatabase() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch('/api/user/highscore/aim-trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          rounds: performanceRating,
          hits: successfulClicks,
          accuracy: accuracy.toFixed(1)
        })
      });
    } catch (err) { console.error('Cloud Sync failed:', err); }
  }

  const endGame = () => {
    clearInterval(timerInterval);
    gameStarted = false;
    showStatsModal = true;
    
    // Always save locally for the dashboard
    saveGuestScore();
    
    // Sync to DB if logged in and in ranked mode
    if (isRanked && isLoggedIn) {
      syncToDatabase();
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSettings = () => {
    localStorage.setItem('aimTrainerSettings', JSON.stringify({ 
      mode: modeSelection, 
      size: targetSize, 
      length: roundLength 
    }));
    showSettingsModal = false;
  };
</script>

<Layout>
  <main class="aim-wrapper" class:custom-mode={!isRanked}>
    <header class="game-meta">
      <div class="title-group">
        <h1 class="brand-text">{isRanked ? 'AIM_TRAINER' : 'PRACTICE_LAB'}</h1>
        <p class="mode-text">{isRanked ? 'LEADERBOARD UPLINK: STABLE' : 'OFFLINE SIMULATION: ACTIVE'}</p>
      </div>
      <div class="status-indicator" class:active={isRanked}>
        <span class="pulse-dot"></span>
        {isRanked ? 'RANKED SESSION' : 'CUSTOM PARAMS'}
      </div>
    </header>

    <section class="stage">
      <div class="stage-header">
        <div class="lcd-display">{timer}s</div>
        {#if !gameStarted}
          <button class="settings-trigger" on:click={() => (showSettingsModal = true)}>
            SETTINGS ⚙️
          </button>
        {/if}
      </div>

      <div class="canvas-container">
        <canvas bind:this={canvas} on:mousedown|preventDefault={handleInput} on:touchstart|preventDefault={handleInput}></canvas>
        {#if !gameStarted && !showStatsModal}
          <div class="start-overlay">
            <button class="main-play-btn" on:click={startGame}>
              {isRanked ? 'START RANKED TRIAL' : 'START PRACTICE'}
            </button>
          </div>
        {/if}
      </div>

      <div class="bottom-stats">
        <div class="stat-block">
          <span class="stat-label">HITS</span>
          <span class="stat-value">{successfulClicks}</span>
        </div>
        <div class="stat-block">
          <span class="stat-label">ACCURACY</span>
          <span class="stat-value">{accuracy.toFixed(1)}%</span>
        </div>
      </div>
    </section>

    {#if showStatsModal}
      <div class="modal-layer">
        <div class="modal-card">
          <div class="sync-banner {isLoggedIn && isRanked ? 'cloud' : 'local'}">
            {isLoggedIn && isRanked ? '● Highscore Updated!' : '● Guest Data Saved!'}
          </div>

          <h2 class="brand-text">SESSION_END</h2>
          <div class="rating-display">
            <small>FINAL PERFORMANCE RATING</small>
            <div class="rating-value">{performanceRating}</div>
            <p class="formula">({successfulClicks} hits × {accuracy.toFixed(0)}% acc)</p>
          </div>
          <div class="final-grid">
            <div class="res-box"><small>HITS</small> {successfulClicks}</div>
            <div class="res-box"><small>ACC</small> {accuracy.toFixed(1)}%</div>
          </div>
          
          <div class="modal-btns">
            <button class="btn-primary" on:click={startGame}>RETRY</button>
            <button class="btn-outline" on:click={() => (showStatsModal = false)}>RETURN</button>
          </div>
        </div>
      </div>
    {/if}

    {#if showSettingsModal}
      <div class="modal-layer" on:click|self={() => (showSettingsModal = false)}>
        <div class="modal-card settings-card">
          <h2 class="brand-text">CONFIGURATION</h2>
          <div class="mode-toggle-group">
            <button class="mode-btn" class:active={modeSelection === 'ranked'} on:click={() => modeSelection = 'ranked'}>RANKED</button>
            <button class="mode-btn" class:active={modeSelection === 'custom'} on:click={() => modeSelection = 'custom'}>CUSTOM</button>
          </div>
          <div class="param-group" class:disabled={isRanked}>
            <div class="label-row"><label>TARGET SIZE</label><span class="val-display">{targetSize}px</span></div>
            <input type="range" min="10" max="60" bind:value={targetSize} disabled={isRanked} />
          </div>
          <div class="param-group" class:disabled={isRanked}>
            <div class="label-row"><label>TRIAL LENGTH</label><span class="val-display">{roundLength}s</span></div>
            <input type="range" min="5" max="60" bind:value={roundLength} disabled={isRanked} />
          </div>
          <button class="btn-primary" on:click={saveSettings}>SAVE & CLOSE</button>
        </div>
      </div>
    {/if}
  </main>
</Layout>

<style>
  .aim-wrapper { max-width: 900px; margin: 3rem auto; padding: 0 1rem; color: white; font-family: 'Inter', sans-serif; --accent: #ff4d4d; }
  .aim-wrapper.custom-mode { --accent: #facc15; }
  .brand-text { font-weight: 900; letter-spacing: -1px; margin: 0; color: var(--accent); }
  .game-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
  .mode-text { font-size: 0.65rem; font-weight: 800; color: #444; margin: 0; letter-spacing: 1px; }

  .status-indicator { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 900; padding: 6px 14px; background: #000; border: 1px solid #222; border-radius: 99px; color: #444; }
  .status-indicator.active { color: var(--accent); border-color: var(--accent); }
  .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  .stage { background: #111114; border: 1px solid #222; border-radius: 24px; padding: 1.5rem; }
  .stage-header { display: flex; justify-content: space-between; margin-bottom: 1.5rem; align-items: center; }
  .lcd-display { background: #000; padding: 10px 24px; border-radius: 12px; font-weight: 900; font-size: 1.8rem; border: 1px solid #222; font-family: monospace; }
  .settings-trigger { background: transparent; border: 1px solid #333; color: #666; padding: 10px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; }

  .canvas-container { position: relative; background: #000; border-radius: 16px; border: 1px solid #222; overflow: hidden; }
  canvas { display: block; cursor: crosshair; width: 100%; }

  .start-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); }
  .main-play-btn { background: var(--accent); color: #000; border: none; padding: 1.2rem 3rem; border-radius: 14px; font-weight: 900; cursor: pointer; transition: 0.2s; }

  .bottom-stats { display: flex; gap: 4rem; margin-top: 2rem; justify-content: center; }
  .stat-label { display: block; font-size: 0.6rem; color: #444; font-weight: 800; margin-bottom: 4px; }
  .stat-value { font-size: 2rem; font-weight: 900; font-family: monospace; }

  .sync-banner { font-size: 0.6rem; font-weight: 900; padding: 6px 12px; border-radius: 6px; margin-bottom: 1.5rem; text-align: center; letter-spacing: 1px; }
  .sync-banner.local { background: rgba(255, 140, 0, 0.1); color: #ff8c00; border: 1px solid #ff8c00; }
  .sync-banner.cloud { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid #22c55e; }

  .rating-display { background: #000; border: 1px solid #222; padding: 2rem; border-radius: 20px; margin: 1rem 0 1.5rem; text-align: center; }
  .rating-display small { font-size: 0.6rem; color: #444; font-weight: 900; letter-spacing: 2px; }
  .rating-value { font-size: 4rem; font-weight: 900; color: var(--accent); line-height: 1; margin: 0.5rem 0; }
  .formula { font-size: 0.7rem; color: #333; font-weight: 800; }

  .modal-layer { position: fixed; inset: 0; background: rgba(0,0,0,0.94); z-index: 100; display: flex; justify-content: center; align-items: center; }
  .modal-card { background: #0a0a0c; padding: 2rem; border-radius: 32px; border: 1px solid #222; width: 95%; max-width: 440px; }
  
  .mode-toggle-group { display: grid; grid-template-columns: 1fr 1fr; background: #000; padding: 4px; border-radius: 12px; margin: 2rem 0; border: 1px solid #222; }
  .mode-btn { background: transparent; border: none; color: #444; padding: 12px; border-radius: 8px; font-weight: 900; cursor: pointer; transition: 0.2s; }
  .mode-btn.active { background: #1a1a1c; color: var(--accent); }

  .param-group { margin-bottom: 1.5rem; transition: opacity 0.3s; }
  .param-group.disabled { opacity: 0.3; pointer-events: none; }
  .label-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .val-display { font-size: 0.9rem; font-weight: 900; font-family: monospace; }
  input[type="range"] { width: 100%; accent-color: var(--accent); }

  .btn-primary { background: var(--accent); color: #000; border: none; padding: 1.2rem; border-radius: 14px; font-weight: 900; cursor: pointer; width: 100%; }
  .final-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.5rem; }
  .res-box { background: #000; padding: 15px; border-radius: 12px; border: 1px solid #111; font-weight: 900; text-align: center; }
  .res-box small { display: block; font-size: 0.55rem; color: #444; margin-bottom: 4px; }
  .modal-btns { display: flex; flex-direction: column; gap: 10px; }
  .btn-outline { background: transparent; color: #444; border: 1px solid #222; padding: 1rem; border-radius: 14px; cursor: pointer; font-weight: 800; }
</style>