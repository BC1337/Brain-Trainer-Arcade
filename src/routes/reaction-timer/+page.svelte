<!-- src/routes/ReactionTime.svelte -->
<script>
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';

  let gameState = 'preGame'; // preGame, inGame
  let playAreaColor = 'red';
  let startTime;
  let endTime;
  let attempts = [];
  let highScores = [];
  let showEarlyClickAlert = false;
  let timerId;
  let isStarting = false;

  // Load high scores from localStorage
  onMount(() => {
    if (typeof window !== 'undefined') {
      const savedScores = localStorage.getItem('reactionHighScores');
      if (savedScores) {
        highScores = JSON.parse(savedScores).slice(0, 5);
      }
    }
    console.log('Component mounted, highScores:', highScores);
  });

  const saveHighScores = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reactionHighScores', JSON.stringify(highScores));
    }
  };

  const startGame = () => {
    if (isStarting) return;
    isStarting = true;
    gameState = 'inGame';
    playAreaColor = 'red';
    startTime = null;
    endTime = null;
    showEarlyClickAlert = false;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      playAreaColor = 'green';
      startTime = Date.now();
      console.log('Game started. Start time:', startTime);
      isStarting = false;
    }, Math.random() * 5000 + 4000); // 4-9s delay
  };

  const handleClick = () => {
    if (gameState !== 'inGame') return;

    if (playAreaColor === 'green') {
      endTime = Date.now();
      const responseTime = endTime - startTime;
      attempts = [...attempts, responseTime].slice(-5); // Keep last 5 attempts
      highScores = [...highScores, responseTime].sort((a, b) => a - b).slice(0, 5);
      saveHighScores();
      console.log('Clicked. Response time:', responseTime);
      gameState = 'preGame';
    } else {
      showEarlyClickAlert = true;
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        playAreaColor = 'green';
        startTime = Date.now();
        console.log('Game restarted after early click. Start time:', startTime);
        showEarlyClickAlert = false;
      }, Math.random() * 5000 + 4000);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Space') {
      handleClick();
    }
  };
</script>

<head>
  <title>Reaction Timer!</title>
  <meta name="description" content="Test your reaction time with this online game. Click the button as quickly as possible when the color turns green. Challenge your friends and see who has the fastest reflexes!">
  <meta name="keywords" content="reaction timer, reaction game, reflex game, online game, timer game, reflex test, reaction speed, challenge game">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<Layout>
  <main class="content-wrapper" aria-labelledby="game-title">
    <h1 class="game-title" id="game-title">Reaction Trainer</h1>
    <section class="game-container" aria-label="Reaction timer game">
      <p class="game-description">Click when the box turns green. Don’t click too early!</p>
      <div class="play-area-container">
        {#if gameState === 'preGame'}
          <div class="start-game-modal">
            <button class="btn btn-start" on:click={startGame} disabled={isStarting} aria-label="Start game">Start Game</button>
          </div>
        {/if}
        <div
          class="play-area"
          class:active={playAreaColor === 'green'}
          style="background-color: {playAreaColor}"
          role="button"
          tabindex="0"
          on:click={handleClick}
          on:keydown={handleKeyDown}
          aria-label="Reaction play area"
        ></div>
        {#if showEarlyClickAlert}
          <div class="early-click-alert" aria-live="assertive">
            <p>You clicked too early! Wait for the green color.</p>
          </div>
        {/if}
      </div>
      <div class="timer-stats">
        <div class="stats-container">
          <div class="high-scores" aria-labelledby="high-scores-title">
            <h2 id="high-scores-title">Top 5 High Scores</h2>
            <ol>
              {#each highScores as score, index}
                <li>{index + 1}. {score} ms</li>
              {/each}
            </ol>
          </div>
          <div class="recent-attempts" aria-labelledby="recent-attempts-title">
            <h2 id="recent-attempts-title">Recent Attempts</h2>
            <ol>
              {#each attempts as attempt, index}
                <li>{index + 1}. {attempt} ms</li>
              {/each}
            </ol>
          </div>
        </div>
      </div>
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
    max-width: 600px;
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

  .play-area-container {
    position: relative;
    width: 300px;
    height: 300px;
  }

  .play-area {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  }

  .play-area.active {
    box-shadow: 0 0 10px var(--accent-color);
    animation: pulse 0.4s ease;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
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

  .btn-start {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    background: var(--text-color);
    color: var(--card-background);
    cursor: pointer;
    transition: var(--transition);
  }

  .btn-start:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  .btn-start:focus {
    outline: 2px solid var(--text-color);
    outline-offset: 2px;
  }

  .btn-start:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .early-click-alert {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--accent-color);
    padding: 1rem;
    border-radius: 8px;
    color: var(--text-color);
    box-shadow: var(--shadow);
    font-size: 1rem;
    font-weight: 500;
  }

  .early-click-alert p {
    margin: 0;
  }

  .timer-stats {
    width: 100%;
    max-width: 400px;
  }

  .stats-container {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
  }

  .high-scores,
  .recent-attempts {
    flex: 1;
    color: var(--text-color);
  }

  .high-scores h2,
  .recent-attempts h2 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .high-scores ol,
  .recent-attempts ol {
    list-style: none;
    padding: 0;
    font-size: 1rem;
  }

  .high-scores li,
  .recent-attempts li {
    margin: 0.5rem 0;
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
      width: 250px;
      height: 250px;
    }

    .stats-container {
      flex-direction: column;
      gap: 1rem;
    }

    .game-description {
      font-size: 1rem;
    }

    .btn-start {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
</style>