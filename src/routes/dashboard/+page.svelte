<script>
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { isTokenExpired } from "$lib/utils/auth.js";

  let username = 'GUEST_001';
  let userScores = {};
  let globalHighscores = {};
  let isLoading = true;
  let isLoggedIn = false;
  let now = Date.now();

  const games = [
    { key: 'chimp-test',      name: 'Chimp Test',      desc: 'Train memory and focus with sequences.'      },
    { key: 'aim-trainer',     name: 'Aim Trainer',      desc: 'Improve precision with target practice.'     },
    { key: 'reaction-timer',  name: 'Reaction Time',    desc: 'Test your speed and reaction time.'          },
    { key: 'memory-trainer',  name: 'Memory Trainer',   desc: 'Challenge your short-term memory skills.'    },
    { key: 'type-racer',      name: 'Type Racer',       desc: 'Boost your typing speed and accuracy.'       },
    { key: 'simon-says',      name: 'Simon Says',       desc: 'Classic pattern recognition challenge.'      },
    { key: 'connections',     name: 'Connections',      desc: 'Find groups of related words.'               },
    { key: 'word-game',       name: 'Word Game',        desc: 'Expand your vocabulary and recall.'          }
  ];

  onMount(() => {
    const interval = setInterval(() => now = Date.now(), 5000);

    (async () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');

      if (token && !isTokenExpired(token)) {
        isLoggedIn = true;
        username = (storedUsername || 'PLAYER').toUpperCase();

        try {
          const res = await fetch('/api/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (res.ok) {
            const data = await res.json();

            const newUser = {};
            for (const [key, score] of Object.entries(data.userScores)) {
              newUser[key] = {
                ...score,
                timestamp: score.updatedAt
                  ? new Date(score.updatedAt).getTime()
                  : null
              };
            }

            globalHighscores = data.globalBests;
            userScores = newUser;
          }
        } catch (err) {
          console.error('Dashboard fetch error:', err);
        }

      } else {
        isLoggedIn = false;
        username = 'GUEST_001';

        const localScores = {};
        for (const game of games) {
          const raw = localStorage.getItem(`guest_${game.key}_score`);
          if (raw) {
            try {
              localScores[game.key] = { ...JSON.parse(raw), rank: '—' };
            } catch {
              // skip malformed local data
            }
          }
        }
        userScores = localScores;
      }

      isLoading = false;
    })();

    return () => clearInterval(interval);
  });

  const isRecent = (timestamp) => {
    if (!timestamp) return false;
    const diff = now - timestamp;
    return diff > 0 && diff < 60000;
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

      {#if isLoading}
        <div class="loading-gate">INITIALIZING_DATA_STREAMS...</div>
      {:else}
        <div class="game-grid">
          {#each games as game (game.key)}
            {@const score = userScores[game.key]}
            {@const global = globalHighscores[game.key]}
            {@const recent = isRecent(score?.timestamp)}

            <div class="game-card" class:recent-pulse={recent}>
              {#if recent}
                <div class="recent-tag">RECENT_UPLINK</div>
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
                    <span class="value">{score?.rounds ?? '0'}</span>
                  </div>

                  <div class="comparison-grid">
                    <div class="stat-col">
                      <span class="col-title highlight-orange">SESSION</span>
                      {#if game.key === 'aim-trainer'}
                        <div class="mini-data">
                          <span class="mini-label">HITS</span>
                          <span class="mini-val white-text">{score?.hits ?? 0}</span>
                        </div>
                        <div class="mini-data">
                          <span class="mini-label">ACC</span>
                          <span class="mini-val green-text">{score?.accuracy ?? 0}%</span>
                        </div>
                      {:else}
                        <div class="mini-data">
                          <span class="mini-label">SCORE</span>
                          <span class="mini-val white-text">{score?.rounds ?? 0}</span>
                        </div>
                        <div class="mini-data">
                          <span class="mini-label">STATUS</span>
                          <span class="mini-val green-text">{score ? 'STABLE' : 'IDLE'}</span>
                        </div>
                      {/if}
                    </div>

                    <div class="vr-line"></div>

                    <div class="stat-col">
                      {#if isLoggedIn}
                        <span class="col-title highlight-gold">NETWORK</span>
                        <div class="mini-data">
                          <span class="mini-label">GLOBAL</span>
                          <span class="mini-val gold-text">{global?.rounds ?? '—'}</span>
                        </div>
                        <div class="mini-data">
                          <span class="mini-label">RANK</span>
                          <span class="mini-val" class:gold-text={score?.rank === 1}>
                            {score?.rank ? `#${score.rank}` : '#—'}
                          </span>
                        </div>
                      {:else}
                        <div class="locked-state">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="3">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
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
                      {global?.rounds ?? '—'}
                      <span class="wr-user">@{global?.user?.username ?? 'ANON'}</span>
                    </span>
                  {:else}
                    <a href="/login" class="wr-locked-link">LOGIN TO COMPETE</a>
                  {/if}
                </div>
              </div>

              <a href="/{game.key}" class="play-action">
                <span>ENTER SIMULATION</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </a>
            </div>
          {/each}
        </div>
      {/if}
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

  .dashboard-wrapper { max-width: 1400px; margin: 0 auto; padding: 2rem 1rem; font-family: 'Inter', sans-serif; background: var(--bg-dark); min-height: 100vh; }
  .brand-orange { color: var(--accent-orange) !important; font-weight: 900; }
  .white-text { color: var(--text-main); }
  .gold-text { color: #fbbf24; text-shadow: 0 0 8px rgba(251, 191, 36, 0.3); }
  .green-text { color: var(--accent-green); }

  .hero-banner { background: #000; padding: 2.5rem; border-radius: 12px; border: 1px solid var(--accent-orange); margin-bottom: 2rem; }
  .hero-banner h1 { font-size: 2.2rem; margin: 0; letter-spacing: -1px; }
  .hero-stats { color: var(--text-muted); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-top: 8px; letter-spacing: 1px; }
  .save-warning { color: var(--accent-red); font-size: 0.7rem; font-weight: 900; margin-top: 4px; opacity: 0.8; }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .status-pill { padding: 6px 14px; border-radius: 99px; font-size: 0.65rem; font-weight: 900; border: 1px solid; }
  .status-pill.live { color: var(--accent-green); border-color: var(--accent-green); }
  .status-pill.offline-alert { color: var(--accent-orange); border-color: var(--accent-orange); }

  .game-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }

  .game-card {
    background: var(--card-bg); border: 1px solid var(--border-color);
    border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column;
    min-height: 520px; transition: border-color 0.2s, box-shadow 0.2s; position: relative;
  }
  .game-card:hover { border-color: var(--accent-orange); }

  .recent-pulse {
    border-color: var(--accent-orange);
    box-shadow: 0 0 25px rgba(255, 140, 0, 0.2);
    animation: pulse-border 2s infinite ease-in-out;
  }

  @keyframes pulse-border {
    0%   { border-color: var(--border-color); box-shadow: 0 0 0px rgba(255, 140, 0, 0); }
    50%  { border-color: var(--accent-orange); box-shadow: 0 0 30px rgba(255, 140, 0, 0.25); }
    100% { border-color: var(--border-color); box-shadow: 0 0 0px rgba(255, 140, 0, 0); }
  }

  .recent-tag { position: absolute; top: -8px; right: 15px; background: var(--accent-orange); color: black; font-size: 0.55rem; font-weight: 900; padding: 3px 8px; border-radius: 4px; z-index: 10; }
  .loading-gate { color: var(--accent-orange); font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; text-align: center; margin-top: 4rem; }

  .title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
  .title-row h3 { margin: 0; font-size: 1.4rem; color: #fff; font-weight: 800; }
  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .dot.online { background: var(--accent-orange); box-shadow: 0 0 10px var(--accent-orange); }
  .dot.offline { background: #222; }

  .game-desc { color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; margin-bottom: 1.2rem; min-height: 40px; }

  .score-container {
    background: var(--panel-bg); padding: 1.2rem; border-radius: 12px;
    margin-bottom: 1.2rem; border: 1px solid #161618;
    flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;
  }

  .main-metric { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.8rem; }
  .main-metric .label { font-size: 0.65rem; color: var(--text-muted); font-weight: 900; letter-spacing: 1px; }
  .main-metric .value { font-size: 2.4rem; font-weight: 900; color: #fff; font-family: 'JetBrains Mono', monospace; }

  .comparison-grid { display: flex; justify-content: space-between; background: #060608; border: 1px solid #1a1a1c; border-radius: 8px; padding: 10px; min-height: 80px; }
  .stat-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .col-title { font-size: 0.55rem; font-weight: 900; letter-spacing: 1px; border-bottom: 1px solid #1a1a1c; padding-bottom: 4px; margin-bottom: 4px; text-align: center; }
  .highlight-orange { color: var(--accent-orange); }
  .highlight-gold { color: #fbbf24; }

  .mini-data { display: flex; justify-content: space-between; align-items: center; padding: 0 4px; }
  .mini-label { font-size: 0.55rem; color: var(--text-muted); font-weight: 800; }
  .mini-val { font-size: 0.8rem; font-weight: 900; }

  .vr-line { width: 1px; background: #1a1a1c; margin: 0 10px; }

  .locked-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.2; }
  .lock-label { font-size: 0.5rem; font-weight: 900; margin-top: 4px; color: #555; }

  .wr-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #161618; padding-top: 10px; margin-top: 8px; }
  .wr-label { font-size: 0.6rem; color: var(--text-muted); font-weight: 900; }
  .wr-value { font-size: 0.8rem; font-weight: 900; }
  .wr-user { font-size: 0.6rem; color: var(--text-muted); margin-left: 4px; }
  .wr-locked-link { font-size: 0.65rem; color: var(--accent-orange); text-decoration: none; font-weight: 900; }

  .play-action {
    display: flex; justify-content: center; align-items: center; gap: 8px;
    background: var(--accent-green); color: white !important; text-decoration: none;
    padding: 1rem; border-radius: 12px; font-weight: 900;
    border-bottom: 4px solid #15803d; transition: transform 0.1s, border-bottom-width 0.1s; font-size: 0.9rem;
  }
  .play-action:active { transform: translateY(2px); border-bottom-width: 2px; }

  @media (max-width: 900px) { .game-grid { grid-template-columns: 1fr; } }
</style>