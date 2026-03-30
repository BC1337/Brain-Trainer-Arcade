<script>
  import Layout from '../../layouts/Layout.svelte';
  import { onMount } from 'svelte';

  let username = 'GUEST_001';
  let userScores = {}; 
  let globalHighscores = {};
  let isLoading = true;
  let isLoggedIn = false;
  let now = Date.now();

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
    
    // Update 'now' every 10 seconds to refresh the "Recent" pulse
    const interval = setInterval(() => now = Date.now(), 10000);

    if (token) {
      isLoggedIn = true;
      username = (storedUsername || 'PLAYER').toUpperCase();
      await Promise.all(games.map(async (game) => {
        await loadGlobalHighscore(game.key);
        await loadUserScore(game.key);
      }));
    } else {
      isLoggedIn = false;
      username = 'GUEST_001';
      games.forEach(game => {
        const localData = localStorage.getItem(`guest_${game.key}_score`);
        if (localData) {
          userScores[game.key] = JSON.parse(localData);
        }
      });
      userScores = { ...userScores };
    }
    isLoading = false;
    return () => clearInterval(interval);
  });

  async function loadGlobalHighscore(gameKey) {
    try {
      const res = await fetch(`/api/highscore/${gameKey}`);
      if (res.ok) {
        const data = await res.json();
        if (data.highscore) globalHighscores[gameKey] = data.highscore;
        globalHighscores = { ...globalHighscores };
      }
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
  }

  // Helper to check if a score was updated in the last 60 seconds
  const isRecent = (timestamp) => {
    if (!timestamp) return false;
    return (now - timestamp) < 60000;
  };
</script>

<Layout>
  <div class="dashboard-wrapper">
    <header class="hero-banner">
      <div class="welcome-box">
        <h1 class="brand-orange">SYSTEM DASHBOARD: <span class="white-text">{username}</span></h1>
        <div class="hero-status-stack">
          <p class="hero-stats">
            {isLoggedIn ? 'RANKED PROTOCOL ACTIVE' : 'UNRANKED SESSION • PROGRESS SAVED LOCALLY'}
          </p>
          {#if !isLoggedIn}
            <p class="save-warning">// LOG IN FOR GLOBAL LEADERBOARD UPLINK</p>
          {/if}
        </div>
      </div>
    </header>

    <section class="content-section">
      <div class="section-header">
        <h2 class="brand-orange">NEURAL CHALLENGES</h2>
        <div class="status-pill {isLoggedIn ? 'live' : 'offline-alert'}">
          {isLoggedIn ? 'NETWORK ONLINE' : 'LOCAL CACHE ACTIVE'}
        </div>
      </div>
      
      <div class="game-grid">
        {#each games as game}
          <div class="game-card" class:recent-pulse={isRecent(userScores[game.key]?.timestamp)}>
            {#if isRecent(userScores[game.key]?.timestamp)}
              <div class="recent-tag">RECENT_ACTIVITY</div>
            {/if}

            <div class="card-top">
              <div class="title-row">
                <h3>{game.name}</h3>
                <div class="dot {isLoggedIn ? 'online' : 'offline'}"></div>
              </div>
              <p class="game-desc">{game.desc}</p>
            </div>
            
            <div class="score-container">
              <div class="metric-top">
                <div class="main-metric">
                  <span class="label">{game.key === 'aim-trainer' ? 'RATING' : 'BEST'}</span>
                  <span class="value">{userScores[game.key]?.rounds ?? '0'}</span>
                </div>

                <div class="comparison-grid">
                  <div class="stat-col">
                    <span class="col-title highlight-orange">SESSION</span>
                    {#if game.key === 'aim-trainer'}
                      <div class="mini-data">
                        <span class="mini-label">HITS</span>
                        <span class="mini-val white-text">{userScores[game.key]?.hits || 0}</span>
                      </div>
                      <div class="mini-data">
                        <span class="mini-label">ACC</span>
                        <span class="mini-val green-text">{userScores[game.key]?.accuracy || 0}%</span>
                      </div>
                    {:else}
                      <div class="mini-data">
                        <span class="mini-label">SCORE</span>
                        <span class="mini-val white-text">{userScores[game.key]?.rounds || 0}</span>
                      </div>
                      <div class="mini-data">
                        <span class="mini-label">STATUS</span>
                        <span class="mini-val green-text">{userScores[game.key] ? 'STABLE' : 'IDLE'}</span>
                      </div>
                    {/if}
                  </div>

                  <div class="vr-line"></div>

                  <div class="stat-col">
                    {#if isLoggedIn}
                      <span class="col-title highlight-gold">NETWORK</span>
                      <div class="mini-data">
                        <span class="mini-label">GLOBAL</span>
                        <span class="mini-val gold-text">{globalHighscores[game.key]?.rounds || '—'}</span>
                      </div>
                      <div class="mini-data">
                        <span class="mini-label">RANK</span>
                        <span class="mini-val gold-text">#—</span>
                      </div>
                    {:else}
                      <div class="locked-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <span class="lock-label">LOCKED</span>
                      </div>
                    {/if}
                  </div>
                </div>
              </div>

              <div class="wr-footer">
                <span class="wr-label">GLOBAL BEST:</span>
                {#if isLoggedIn}
                  <span class="wr-value gold-text">
                    {globalHighscores[game.key]?.rounds || '—'}
                    <span class="wr-user">@{globalHighscores[game.key]?.user?.username || 'ANON'}</span>
                  </span>
                {:else}
                  <a href="/login" class="wr-locked-link">LOGIN TO COMPETE</a>
                {/if}
              </div>
            </div>
            
            <a href="/{game.key}" class="play-action">
              <span>ENTER SIMULATION</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>
        {/each}
      </div>
    </section>
  </div>
</Layout>

<style>
  :root {
    --bg-dark: #050505;
    --card-bg: #0c0c0e;
    --panel-bg: #000000;
    --accent-orange: #FF8C00;
    --accent-green: #22c55e;
    --accent-red: #ef4444;
    --text-main: #ffffff;
    --text-muted: #71717a;
    --border-color: #27272a;
  }

  .dashboard-wrapper { max-width: 1300px; margin: 0 auto; padding: 3rem 1.5rem; font-family: 'Inter', sans-serif; background: var(--bg-dark); min-height: 100vh; }
  
  .brand-orange { color: var(--accent-orange) !important; font-weight: 900; }
  .white-text { color: var(--text-main); }
  .gold-text { color: #fbbf24; }
  .green-text { color: var(--accent-green); }

  .hero-banner { background: #000; padding: 3rem; border-radius: 12px; border: 1px solid var(--accent-orange); margin-bottom: 3rem; }
  .hero-banner h1 { font-size: 2.5rem; margin: 0; letter-spacing: -1px; }
  .hero-stats { color: var(--text-muted); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-top: 10px; letter-spacing: 1px; }
  .save-warning { color: var(--accent-red); font-size: 0.75rem; font-weight: 900; margin-top: 5px; opacity: 0.8; }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
  .status-pill { padding: 6px 14px; border-radius: 99px; font-size: 0.7rem; font-weight: 900; border: 1px solid; }
  .status-pill.live { color: var(--accent-green); border-color: var(--accent-green); }
  .status-pill.offline-alert { color: var(--accent-orange); border-color: var(--accent-orange); }

  .game-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
  
  .game-card { 
    background: var(--card-bg); 
    border: 1px solid var(--border-color); 
    border-radius: 16px; 
    padding: 2rem; 
    display: flex; 
    flex-direction: column; 
    min-height: 620px; 
    transition: 0.3s;
    position: relative;
  }
  .game-card:hover { border-color: var(--accent-orange); transform: translateY(-4px); }

  /* RECENT ACTIVITY PULSE */
  .recent-pulse { border-color: var(--accent-orange); box-shadow: 0 0 20px rgba(255, 140, 0, 0.15); animation: pulse-border 2s infinite ease-in-out; }
  @keyframes pulse-border {
    0% { border-color: var(--border-color); }
    50% { border-color: var(--accent-orange); }
    100% { border-color: var(--border-color); }
  }

  .recent-tag { position: absolute; top: -10px; right: 20px; background: var(--accent-orange); color: black; font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 4px; z-index: 10; }

  .title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
  .title-row h3 { margin: 0; font-size: 1.6rem; color: #fff; font-weight: 800; }
  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .dot.online { background: var(--accent-orange); box-shadow: 0 0 10px var(--accent-orange); }
  .dot.offline { background: #333; }

  .game-desc { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem; min-height: 45px; }

  .score-container { 
    background: var(--panel-bg); 
    padding: 1.5rem; border-radius: 12px; 
    margin-bottom: 1.5rem; border: 1px solid #1a1a1c;
    flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;
  }

  .main-metric { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }
  .main-metric .label { font-size: 0.7rem; color: var(--text-muted); font-weight: 900; letter-spacing: 1px; }
  .main-metric .value { font-size: 2.8rem; font-weight: 900; color: #fff; font-family: 'JetBrains Mono', monospace; }

  .comparison-grid { 
    display: flex; justify-content: space-between; 
    background: #08080a; border: 1px solid #1a1a1c;
    border-radius: 8px; padding: 12px; min-height: 90px;
  }
  .stat-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .col-title { font-size: 0.6rem; font-weight: 900; letter-spacing: 1px; border-bottom: 1px solid #222; padding-bottom: 4px; margin-bottom: 6px; text-align: center; }
  .highlight-orange { color: var(--accent-orange); }
  .highlight-gold { color: #fbbf24; }
  
  .mini-data { display: flex; justify-content: space-between; align-items: center; padding: 0 5px; }
  .mini-label { font-size: 0.6rem; color: var(--text-muted); font-weight: 800; }
  .mini-val { font-size: 0.85rem; font-weight: 900; }
  
  .vr-line { width: 1px; background: #222; margin: 0 12px; }

  .locked-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.3; padding-top: 5px; }
  .lock-label { font-size: 0.55rem; font-weight: 900; margin-top: 4px; color: #666; }

  .wr-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1a1a1c; padding-top: 12px; margin-top: 10px; }
  .wr-label { font-size: 0.65rem; color: var(--text-muted); font-weight: 900; }
  .wr-value { font-size: 0.9rem; font-weight: 900; }
  .wr-user { font-size: 0.65rem; color: var(--text-muted); margin-left: 5px; }
  .wr-locked-link { font-size: 0.75rem; color: var(--accent-orange); text-decoration: none; font-weight: 900; }

  .play-action { 
    display: flex; justify-content: center; align-items: center; gap: 8px; 
    background: var(--accent-green); color: white !important; text-decoration: none; 
    padding: 1.1rem; border-radius: 12px; font-weight: 900; 
    border-bottom: 4px solid #15803d; transition: 0.1s;
  }
  .play-action:active { transform: translateY(2px); border-bottom-width: 2px; }
</style>