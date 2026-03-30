<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Layout from '../../layouts/Layout.svelte';
  import { rawGroupSets } from './wordSets.js';

  let grid = [];
  let selected = [];
  let completed = [];
  let mistakes = 0;
  const maxMistakes = 4;
  let gameOver = false;
  let won = false;
  let isShaking = false;
  let showOneAway = false;
  let currentGroups = [];

  const categoryColors = {
    yellow: '#fdfd96', 
    green:  '#a8e6cf', 
    blue:   '#b0e0e6', 
    purple: '#e6d6ff'  
  };

  function stripColor(title) {
    return title ? title.replace(/^(YELLOW|GREEN|BLUE|PURPLE): ?/i, '') : '';
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  onMount(() => {
    if (browser) resetGame();
  });

  function resetGame() {
    if (!rawGroupSets || rawGroupSets.length === 0) return;
    let attempts = 0, selectedSet = null, isValid = false;

    while (!isValid && attempts < 500) {
      const idx = Math.floor(Math.random() * rawGroupSets.length);
      const potentialSet = rawGroupSets[idx];
      const flatWords = potentialSet.flatMap(g => g.words.map(w => w.trim().toUpperCase()));
      if (new Set(flatWords).size === 16) {
        selectedSet = potentialSet;
        isValid = true;
      }
      attempts++;
    }

    if (!selectedSet) selectedSet = rawGroupSets[0];

    currentGroups = selectedSet.map(group => ({
      ...group,
      words: group.words.map(w => w.trim().toUpperCase())
    }));

    grid = shuffle([...currentGroups.flatMap(g => g.words)]);
    selected = [];
    completed = [];
    mistakes = 0;
    gameOver = false;
    won = false;
  }

  function selectWord(word) {
    if (gameOver || won) return;
    if (selected.includes(word)) {
      selected = selected.filter(w => w !== word);
    } else if (selected.length < 4) {
      selected = [...selected, word];
    }
  }

  function submitGuess() {
    if (selected.length !== 4 || gameOver || won) return;

    const sortedSel = [...selected].sort().join(',');
    const match = currentGroups.find(g => [...g.words].sort().join(',') === sortedSel);

    if (match) {
      completed = [...completed, { ...match, words: [...selected] }];
      grid = grid.filter(w => !selected.includes(w));
      selected = [];

      if (completed.length === 4) {
        won = true;
        completed = completed.sort((a, b) => a.difficulty - b.difficulty);
      }
    } else {
      mistakes += 1;
      isShaking = true;
      
      for (const g of currentGroups) {
        if (selected.filter(w => g.words.includes(w)).length === 3) {
          showOneAway = true;
          setTimeout(() => showOneAway = false, 2000);
          break;
        }
      }

      setTimeout(() => {
        isShaking = false;
        selected = [];

        // --- REVEAL LOGIC ON LOSS ---
        if (mistakes >= maxMistakes) {
          gameOver = true;
          // Find groups not yet completed
          const remaining = currentGroups.filter(
            g => !completed.some(c => c.title === g.title)
          );
          // Add them to the completed list to show the colors
          completed = [...completed, ...remaining].sort((a, b) => a.difficulty - b.difficulty);
          // Clear the grid so words don't show twice
          grid = [];
        }
      }, 500);
    }
  }
</script>

<Layout>
  <div class="connections-wrapper">
    <div class="connections-container">
      <div class="header">
        <h1>Connections</h1>
        <p>Create four groups of four!</p>
      </div>

      {#if showOneAway}
        <div class="toast">One away...</div>
      {/if}

      <div class="game-board">
        {#each completed as group}
          <div class="completed-row" style="background-color: {categoryColors[group.color]}">
            <h3>{stripColor(group.title)}</h3>
            <p>{group.words.join(', ')}</p>
          </div>
        {/each}

        {#if grid.length > 0 && !gameOver}
          <div class="grid {isShaking ? 'shake' : ''}">
            {#each grid as word}
              <button 
                class="word-card {selected.includes(word) ? 'selected' : ''}"
                on:click={() => selectWord(word)}
              >
                {word}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="controls">
        {#if !gameOver && !won}
          <div class="mistakes">
            Mistakes remaining: 
            {#each Array(Math.max(0, maxMistakes - mistakes)) as _}
              <span class="dot"></span>
            {/each}
          </div>

          <div class="buttons">
            <button class="btn" on:click={() => (grid = shuffle([...grid]))}>Shuffle</button>
            <button class="btn" on:click={() => (selected = [])}>Deselect All</button>
            <button class="btn submit" on:click={submitGuess} disabled={selected.length !== 4}>Submit</button>
          </div>
        {/if}

        {#if gameOver || won}
          <div class="end-screen">
            <h2>{won ? 'Well Done!' : 'Next Time...'}</h2>
            <button class="btn play-again" on:click={resetGame}>New Game</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</Layout>

<style>
  :global(body) {
    --bg-color: #ffffff;
    --text-color: #000000;
    --card-bg: #efefe6;
    --card-selected-bg: #5a594e;
    --card-selected-text: #ffffff;
    --border-color: #000000;
  }

  @media (prefers-color-scheme: dark) {
    :global(body) {
      --bg-color: #121212;
      --text-color: #ffffff;
      --card-bg: #2a2a2a;
      --card-selected-bg: #ffffff;
      --card-selected-text: #000000;
      --border-color: #ffffff;
    }
  }

  .connections-wrapper {
    background-color: var(--bg-color);
    color: var(--text-color);
    min-height: 100vh;
  }

  .connections-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
    text-align: center;
  }

  .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800; }

  .game-board { display: flex; flex-direction: column; gap: 10px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

  .word-card {
    aspect-ratio: 1.2/1;
    background: var(--card-bg);
    color: var(--text-color);
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    text-transform: uppercase;
  }

  .word-card.selected { 
    background: var(--card-selected-bg); 
    color: var(--card-selected-text); 
  }

  .completed-row { 
    padding: 18px; 
    border-radius: 8px; 
    color: #000 !important;
    animation: reveal 0.4s ease-out forwards;
  }
  .completed-row h3 { margin: 0; font-size: 1.1rem; font-weight: 800; }
  .completed-row p { margin: 5px 0 0; font-weight: 500; }

  .controls { margin-top: 40px; }
  .mistakes { margin-bottom: 25px; }
  .dot { 
    display: inline-block; 
    width: 14px; height: 14px; 
    background: var(--card-selected-bg); 
    border-radius: 50%; margin: 0 6px; 
  }

  .buttons { display: flex; justify-content: center; gap: 15px; }
  .btn { 
    padding: 12px 24px; 
    border: 2px solid var(--border-color); 
    border-radius: 30px; 
    background: transparent; 
    color: var(--text-color);
    cursor: pointer; 
    font-weight: 700;
  }

  .btn.submit { 
    background: var(--border-color); 
    color: var(--bg-color); 
  }
  .btn.submit:disabled { opacity: 0.3; }

  .end-screen h2 { margin-bottom: 20px; font-size: 1.8rem; }
  
  .toast { 
    position: fixed; top: 15%; left: 50%; transform: translateX(-50%); 
    background: #333; color: #fff; padding: 12px 24px; 
    border-radius: 8px; z-index: 1000;
  }

  .shake { animation: shake 0.4s ease-in-out; }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }

  @keyframes reveal {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
</style>