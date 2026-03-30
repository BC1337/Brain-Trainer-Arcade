<script>
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';

  // Game States: 'idle', 'waiting', 'go', 'result', 'early'
  let gameState = 'idle'; 
  let startTime;
  let reactionTime = null;
  let attempts = [];
  let highScores = [];
  let timerId;

  onMount(() => {
    if (typeof window !== 'undefined') {
      const savedScores = localStorage.getItem('reactionHighScores');
      if (savedScores) highScores = JSON.parse(savedScores);
    }
  });

  const saveScore = (score) => {
    highScores = [...highScores, score].sort((a, b) => a - b).slice(0, 5);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reactionHighScores', JSON.stringify(highScores));
    }
  };

  const startTest = () => {
    gameState = 'waiting';
    reactionTime = null;
    
    // Random delay between 2 and 5 seconds for better pacing
    const delay = Math.random() * 3000 + 2000;
    
    timerId = setTimeout(() => {
      gameState = 'go';
      startTime = Date.now();
    }, delay);
  };

  const handleTrigger = () => {
    if (gameState === 'waiting') {
      clearTimeout(timerId);
      gameState = 'early';
    } else if (gameState === 'go') {
      const endTime = Date.now();
      reactionTime = endTime - startTime;
      attempts = [reactionTime, ...attempts].slice(0, 5);
      saveScore(reactionTime);
      gameState = 'result';
    } else if (gameState === 'idle' || gameState === 'result' || gameState === 'early') {
      startTest();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleTrigger();
    }
  };
</script>

<svelte:head>
  <title>Reaction Trainer | Cognitive Lab</title>
</svelte:head>

<Layout>
  <main class="game-wrapper">
    <header class="game-header">
      <h1 class="title">Reaction Time</h1>
      <p class="description">Test your visual reflexes. Click as fast as you can.</p>
      
      <div class="stats-bar">
        <div class="stat">
          <span class="label">Best</span>
          <span class="value">{highScores[0] ? highScores[0] + 'ms' : '--'}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="label">Avg (Last 5)</span>
          <span class="value">
            {attempts.length ? Math.round(attempts.reduce((a, b) => a + b) / attempts.length) + 'ms' : '--'}
          </span>
        </div>
      </div>
    </header>

    <section 
      class="trigger-zone {gameState}"
      on:mousedown={handleTrigger}
      on:keydown={handleKeyDown}
      tabindex="0"
      role="button"
    >
      <div class="content">
        {#if gameState === 'idle'}
          <span class="icon">⚡</span>
          <h2>Ready?</h2>
          <p>Click anywhere to start</p>
        {:else if gameState === 'waiting'}
          <div class="pulse-loader"></div>
          <h2>Wait for Green...</h2>
        {:else if gameState === 'go'}
          <h2 class="go-text">CLICK!</h2>
        {:else if gameState === 'result'}
          <span class="res-value">{reactionTime} ms</span>
          <p>Click to try again</p>
        {:else if gameState === 'early'}
          <span class="icon">⚠️</span>
          <h2>Too Fast!</h2>
          <p>Click to reset</p>
        {/if}
      </div>
    </section>

    <footer class="scores-footer">
      <h3>Top Performances</h3>
      <div class="scores-grid">
        {#each Array(5) as _, i}
          <div class="score-slot" class:filled={highScores[i]}>
            <span class="rank">#{i + 1}</span>
            <span class="ms">{highScores[i] ? highScores[i] + 'ms' : '---'}</span>
          </div>
        {/each}
      </div>
    </footer>
  </main>
</Layout>

<style>
  .game-wrapper {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: system-ui, sans-serif;
  }

  /* Header Styles */
  .title {
    font-size: 2.5rem;
    font-weight: 900;
    color: #f59e0b; /* Amber */
    text-align: center;
    margin-bottom: 0.25rem;
  }

  .description {
    font-size: 1rem;
    color: #64748b;
    text-align: center;
    margin-bottom: 2rem;
    font-weight: 600;
  }

  /* Stats Bar */
  .stats-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1e293b;
    padding: 0.75rem 2rem;
    border-radius: 16px;
    gap: 2.5rem;
    width: fit-content;
    margin: 0 auto 2rem;
    color: white;
  }

  .stat { text-align: center; }
  .stat .label { font-size: 0.65rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; display: block; }
  .stat .value { font-size: 1.2rem; font-weight: 800; }
  .stat-divider { width: 1px; height: 30px; background: #334155; }

  /* TRIGGER ZONE (The core game area) */
  .trigger-zone {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
    outline: none;
  }

  /* Game State Colors */
  .idle { background: #f1f5f9; border: 4px solid #cbd5e1; color: #475569; }
  .waiting { background: #334155; color: #94a3b8; }
  .go { background: #10b981; color: white; transform: scale(1.02); }
  .result { background: #3b82f6; color: white; }
  .early { background: #ef4444; color: white; }

  .trigger-zone:active { transform: scale(0.98); }

  .content h2 { font-size: 2rem; font-weight: 900; margin: 0; }
  .content p { font-size: 1rem; opacity: 0.8; margin-top: 0.5rem; }
  .icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
  .res-value { font-size: 4rem; font-weight: 900; display: block; line-height: 1; }
  .go-text { font-size: 4rem; letter-spacing: -2px; }

  /* Scores Footer */
  .scores-footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #e2e8f0;
  }

  .scores-footer h3 {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #94a3b8;
    letter-spacing: 1px;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
  }

  .score-slot {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    border: 2px solid #e2e8f0;
  }

  .score-slot.filled { border-color: #f59e0b; background: #fffbeb; }

  .rank { display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom: 4px; }
  .ms { font-size: 1.1rem; font-weight: 700; color: #1e293b; }

  /* Animation for the "waiting" state */
  .pulse-loader {
    width: 12px;
    height: 12px;
    background: #64748b;
    border-radius: 50%;
    margin: 0 auto 1rem;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(2); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }

  @media (max-width: 500px) {
    .trigger-zone { aspect-ratio: 1 / 1; }
    .res-value, .go-text { font-size: 3rem; }
  }
</style>