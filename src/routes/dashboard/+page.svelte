<script>
  import Layout from '../../layouts/Layout.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let username = 'Player';
  let userScores = {}; 
  let globalHighscores = {};
  let isLoading = true;

  const games = [
    { key: 'chimp-test', name: 'Chimp Test', desc: 'Train memory and focus with sequences.' },
    { key: 'aim-trainer', name: 'Aim Trainer', desc: 'Improve precision with target practice.' },
    { key: 'reaction-timer', name: 'Reaction Time', desc: 'Test your speed and reaction time.' },
    { key: 'memory-trainer', name: 'Memory Trainer', desc: 'Challenge your short-term memory skills.' },
    { key: 'type-racer', name: 'Type Racer', desc: 'Boost your typing speed and accuracy.' },
    { key: 'simon-says', name: 'Simon Says', desc: 'Classic pattern recognition challenge.' },
    { key: 'connections', name: 'Connections', desc: 'Find groups of related words.' },
    { key: 'word-game', name: 'Word Game', desc: 'Expand your vocabulary and recall.' }
  ];

  onMount(async () => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (!token) {
      goto('/login');
      return;
    }
    
    username = storedUsername || 'Player';

    try {
      await Promise.all(games.map(async (game) => {
        await loadGlobalHighscore(game.key);
        await loadUserScore(game.key);
      }));
    } finally {
      isLoading = false;
    }
  });

  async function loadGlobalHighscore(gameKey) {
    try {
      const res = await fetch(`/api/highscore/${gameKey}`);
      if (res.ok) {
        const data = await res.json();
        if (data.highscore && data.highscore.rounds > 0) {
          globalHighscores[gameKey] = data.highscore;
        }
        globalHighscores = { ...globalHighscores };
      }
    } catch (err) {
      console.error(`Error loading global score: ${err}`);
    }
  }

  async function loadUserScore(gameKey) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/user/highscore/${gameKey}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        userScores[gameKey] = data.highscore;
        userScores = { ...userScores }; 
      }
    } catch (err) {
      console.error(`Error loading user score: ${err}`);
    }
  }
</script>

<Layout>
  <div class="dashboard-wrapper">
    <header class="hero-banner">
      <div class="welcome-box">
        <h1 class="brand-orange">SYSTEM DASHBOARD: <span class="brand-green">{username}</span></h1>
        <p class="hero-stats">Global Rankings Active • 24/7 Performance Tracking</p>
      </div>
    </header>

    <section class="content-section">
      <div class="section-header">
        <h2 class="brand-orange">NEURAL CHALLENGES</h2>
        <div class="status-pill">LIVE NETWORK</div>
      </div>
      
      <div class="game-grid">
        {#each games as game}
          <div class="game-card">
            <div class="card-top">
              <div class="title-row">
                <h3>{game.name}</h3>
                <div class="dot"></div>
              </div>
              <p class="game-desc">{game.desc}</p>
            </div>
            
            <div class="score-panel">
              <div class="score-row">
                <span class="score-label">PERSONAL BEST</span>
                <span class="score-val">{userScores[game.key]?.rounds ?? '0'}</span>
              </div>
              <div class="score-row">
                <span class="score-label">WORLD RECORD</span>
                <span class="score-val gold-text">
                  {#if globalHighscores[game.key]}
                    {globalHighscores[game.key].rounds} 
                    <span class="player-tag">{globalHighscores[game.key].user?.username || 'ANON'}</span>
                  {:else}
                    —
                  {/if}
                </span>
              </div>
            </div>
            
            <a href="/{game.key}" class="play-action">
              <span>ENTER SIMULATION</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>
        {/each}
      </div>
    </section>
  </div>
</Layout>

<style>
  :root {
    --bg-dark: #0a0a0c;
    --card-bg: #141417;
    --panel-bg: #050505;
    --accent-orange: #FF8C00;
    --accent-green: #16a34a;
    --text-muted: #94a3b8; /* Cleaner slate-grey */
    --border-color: #26262b;
  }

  .dashboard-wrapper {
    max-width: 1300px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    font-family: 'Inter', system-ui, sans-serif;
  }

  /* COLOR OVERRIDES */
  .brand-orange { color: var(--accent-orange) !important; font-weight: 900 !important; }
  .brand-green { color: var(--accent-green) !important; }
  .gold-text { color: #fbbf24 !important; }

  /* HERO BANNER */
  .hero-banner {
    background: linear-gradient(135deg, #111 0%, #050505 100%);
    padding: 3.5rem;
    border-radius: 24px;
    border: 1px solid var(--accent-orange);
    margin-bottom: 4rem;
    box-shadow: 0 0 40px rgba(255, 140, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .hero-banner h1 { font-size: 3rem; margin: 0; letter-spacing: -1px; }
  .hero-stats { color: var(--text-muted); margin: 1rem 0 0; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .section-header h2 { font-size: 1.4rem; margin: 0; letter-spacing: 3px; }

  .status-pill {
    background: rgba(22, 163, 74, 0.1);
    color: var(--accent-green);
    padding: 6px 14px;
    border-radius: 99px;
    font-size: 0.75rem;
    font-weight: 900;
    border: 1px solid var(--accent-green);
  }

  /* GRID */
  .game-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  @media (max-width: 1100px) { .game-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 700px) { .game-grid { grid-template-columns: 1fr; } }

  /* CARDS */
  .game-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .game-card:hover {
    transform: translateY(-8px);
    border-color: var(--accent-orange);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }

  .title-row { display: flex; justify-content: space-between; align-items: center; }
  .dot { width: 8px; height: 8px; background: var(--accent-orange); border-radius: 50%; box-shadow: 0 0 10px var(--accent-orange); }

  .card-top h3 { margin: 0; font-size: 1.7rem; color: #fff; font-weight: 900; }
  .game-desc { color: var(--text-muted); font-size: 0.95rem; margin: 1rem 0 2rem; line-height: 1.6; font-weight: 500; }

  /* SCORE PANEL */
  .score-panel {
    background: var(--panel-bg);
    padding: 1.5rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
  }

  .score-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
  .score-row:not(:last-child) { border-bottom: 1px solid #111; }

  .score-label { color: #555c6b; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; }
  .score-val { color: #fff; font-weight: 900; font-size: 1.3rem; }
  
  .player-tag { 
    font-size: 0.7rem; 
    font-weight: 700; 
    color: var(--text-muted); 
    margin-left: 8px; 
    background: #1e1e22;
    padding: 3px 8px;
    border-radius: 6px;
  }

  /* BUTTON */
  .play-action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: var(--accent-green);
    color: white !important;
    text-decoration: none;
    padding: 1.2rem;
    border-radius: 14px;
    font-weight: 900;
    transition: all 0.2s;
    border-bottom: 4px solid #0f763e;
  }

  .play-action:hover {
    background: #18b653;
    transform: translateY(-2px);
    border-bottom-width: 6px;
  }

  .play-action:active {
    transform: translateY(2px);
    border-bottom-width: 0;
  }
</style>