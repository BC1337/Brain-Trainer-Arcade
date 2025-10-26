<!-- src/routes/connections/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';

  // Import the 300+ puzzle sets
  import { groupSets } from './wordSets.js';

  // Reactive state
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
  let oneAwayShown = false;

  // Pastel palette – soft yellow, mint, sky, lavender (NO PINK)
  const categoryColors = {
    yellow: '#fdfd96', // soft lemon yellow
    green:  '#a8e6cf', // mint
    blue:   '#b0e0e6', // powder sky blue
    purple: '#e6d6ff'  // lavender
  };

  // STRIP COLOR PREFIX: "YELLOW: KINDS OF BOATS" → "KINDS OF BOATS"
  function stripColor(title) {
    return title.replace(/^(YELLOW|GREEN|BLUE|PURPLE): ?/i, '');
  }

  // REMOVE DUPLICATES + NORMALIZE (trim + uppercase)
  function removeDuplicates(words) {
    return [...new Set(words.map(w => w.trim().toUpperCase()))];
  }

  // Auto-pick black or white text based on background brightness
  function textColorFor(bgHex) {
    const rgb = parseInt(bgHex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma > 186 ? '#000' : '#fff';
  }

  // Lifecycle
  onMount(() => {
    resetGame();
  });

  // Core game logic
  function resetGame() {
    const idx = Math.floor(Math.random() * groupSets.length);
    currentGroups = groupSets[idx].map(group => ({
      ...group,
      words: removeDuplicates(group.words)
    }));

    grid = currentGroups.flatMap(g => g.words).sort(() => Math.random() - 0.5);

    selected = [];
    completed = [];
    mistakes = 0;
    gameOver = false;
    won = false;
    showOneAway = false;
    oneAwayShown = false;
  }

  function shuffleGrid() {
    grid = [...grid].sort(() => Math.random() - 0.5);
  }

  function selectWord(word) {
    if (gameOver || won) return;
    if (selected.includes(word)) {
      selected = selected.filter(w => w !== word);
    } else if (selected.length < 4) {
      selected = [...selected, word];
    }
  }

  function deselectAll() {
    selected = [];
  }

  function submitGuess() {
    if (selected.length !== 4 || gameOver || won) return;

    const sortedSel = [...selected].sort().join(',');
    const match = currentGroups.find(g => [...g.words].sort().join(',') === sortedSel);

    if (match) {
      completed = [...completed, { ...match, words: [...selected] }];
      grid = grid.filter(w => !selected.includes(w));
      shuffleGrid();
      selected = [];

      if (completed.length === 4) {
        won = true;
        completed = completed.sort((a, b) => a.difficulty - b.difficulty);
      }
    } else {
      let oneAway = false;
      for (const g of currentGroups) {
        const overlap = selected.filter(w => g.words.includes(w)).length;
        if (overlap === 3) { oneAway = true; break; }
      }

      mistakes += 1;
      isShaking = true;
      oneAwayShown = false;

      setTimeout(() => {
        isShaking = false;
        selected = [];

        if (oneAway && !oneAwayShown) {
          showOneAway = true;
          oneAwayShown = true;
          setTimeout(() => (showOneAway = false), 2500);
        }

        if (mistakes >= maxMistakes) {
          gameOver = true;
          const remaining = currentGroups.filter(
            g => !completed.some(c => c.title === g.title)
          );
          completed = [...completed, ...remaining].sort(
            (a, b) => a.difficulty - b.difficulty
          );
        }
      }, 500);
    }
  }
</script>

<head>
  <title>Connections</title>
  <meta
    name="description"
    content="Group 16 words into 4 secret categories. You have 4 mistakes to get it right."
  />
  <meta
    name="keywords"
    content="connections game, word puzzle, nyt connections clone, grouping game, brain teaser"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<Layout>
  <main class="content-wrapper" aria-labelledby="game-title">
    <h1 class="game-title" id="game-title" style="color:#f28c38;">Connections</h1>

    <section class="game-container" aria-label="Connections puzzle">
      <p class="game-description">
        Group the 16 words into 4 categories of 4 words each that share a common theme.
        You have <strong>{maxMistakes}</strong> attempts before the puzzle is revealed.
      </p>

      <!-- Completed groups (live board) -->
      <div class="completed-groups">
        {#each completed as group}
          <div
            class="completed-group"
            style="
              background-color: {categoryColors[group.color]};
              color: {textColorFor(categoryColors[group.color])};
              border: 1px solid rgba(0,0,0,.1);
            "
          >
            <h3>{stripColor(group.title)}</h3>
            <div class="group-words">
              {#each group.words.sort() as word}
                <span class="word-box">{word}</span>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Active game board -->
      {#if !gameOver && !won}
        <div class="grid-container">
          <div class="grid {isShaking ? 'shake' : ''}">
            {#each grid as word}
              <div
                class="word-card {selected.includes(word) ? 'selected' : ''}"
                on:click={() => selectWord(word)}
                on:keydown={(e) => e.key === 'Enter' && selectWord(word)}
                role="button"
                tabindex="0"
                aria-label="Select word {word}"
                aria-pressed={selected.includes(word)}
              >
                {word}
              </div>
            {/each}
          </div>

          {#if showOneAway}
            <div class="toast" role="alert" aria-live="assertive">One away!</div>
          {/if}
        </div>

        <div class="action-buttons">
          <button class="btn btn-shuffle" on:click={shuffleGrid}>Shuffle</button>
          <button
            class="btn btn-deselect"
            on:click={deselectAll}
            disabled={selected.length === 0}
          >
            Deselect All
          </button>
          <button
            class="btn btn-submit"
            on:click={submitGuess}
            disabled={selected.length !== 4}
          >
            Submit
          </button>
        </div>

        <div class="mistakes" aria-live="polite">
          Mistakes remaining: <strong>{maxMistakes - mistakes}</strong>
        </div>
      {/if}

      <!-- Win / Game Over Modal -->
      {#if won || gameOver}
        <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
          <div class="modal-content">
            <h2 id="modal-title">
              <span style="color:var(--accent-color, #FFF3B0);">
                {won ? 'You Win!' : 'Game Over'}
              </span>
            </h2>
            <p>
              {won
                ? `Great job! You solved it with ${mistakes} mistake${mistakes === 1 ? '' : 's'}.`
                : "You've used all attempts. Here's the solution:"}
            </p>

            <!-- MODAL GROUPS: Max-width, centered, no color name -->
            <div class="modal-groups">
              {#each completed as group}
                <div
                  class="completed-group"
                  style="
                    background-color: {categoryColors[group.color]};
                    color: {textColorFor(categoryColors[group.color])};
                    border: 1px solid rgba(0,0,0,.1);
                  "
                >
                  <h3>{stripColor(group.title)}</h3>
                  <div class="group-words">
                    {#each group.words.sort() as word}
                      <span class="word-box">{word}</span>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>

            <div class="modal-buttons">
              <button class="btn btn-restart" on:click={resetGame}>Play Again</button>
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
    --accent-color: #FFF3B0;
    --shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    --transition: all 0.3s ease;
  }

  .content-wrapper {
    display: grid;
    gap: 1.5rem;
    max-width: 800px;
    margin: 1.5rem auto;
    padding: 0 0.5rem;
  }

  .game-title {
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
  }

  .game-container {
    display: grid;
    gap: 1rem;
    justify-items: center;
    padding: 1rem;
    background: var(--card-background);
    border-radius: 16px;
    box-shadow: var(--shadow);
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .game-description {
    font-size: 1.1rem;
    color: var(--text-color);
    text-align: center;
    margin-bottom: 0.75rem;
    word-break: break-word;
    hyphens: auto;
    line-height: 1.4;
    padding: 0 0.5rem;
  }

  /* Completed groups – live board */
  .completed-groups {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
  }

  .completed-group {
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }

  .completed-group h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    text-transform: uppercase;
  }

  .group-words {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .word-box {
    padding: 0.4rem 0.8rem;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .grid-container {
    position: relative;
    width: 100%;
    max-width: 100%;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
    width: 100%;
    box-sizing: border-box;
  }

  .word-card {
    padding: 1rem;
    background: var(--background-color);
    border: 2px solid var(--text-color);
    border-radius: 8px;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
    color: var(--text-color);
    cursor: pointer;
    transition: var(--transition);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .word-card:hover { transform: scale(1.05); }
  .word-card:focus { outline: 2px solid var(--accent-color); }
  .selected {
    background: var(--accent-color);
    color: var(--card-background);
    border-color: var(--accent-color);
  }

  .shake { animation: shake .5s; }
  @keyframes shake {
    0%,100%{transform:translate(0,0) rotate(0deg);}
    10%{transform:translate(-1px,-2px) rotate(-1deg);}
    20%{transform:translate(-3px,0) rotate(1deg);}
    30%{transform:translate(3px,2px) rotate(0deg);}
    40%{transform:translate(1px,-1px) rotate(1deg);}
    50%{transform:translate(-1px,2px) rotate(-1deg);}
    60%{transform:translate(-3px,1px) rotate(0deg);}
    70%{transform:translate(3px,1px) rotate(-1deg);}
    80%{transform:translate(-1px,-1px) rotate(1deg);}
    90%{transform:translate(1px,2px) rotate(0deg);}
  }

  .toast {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: rgba(0,0,0,.85);
    color: #fff;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    z-index: 10;
  }

  .action-buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .mistakes {
    font-size: 1rem;
    color: var(--text-color);
    margin-top: 0.75rem;
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    font-weight: 500;
    border: none; /* FIXED: was "border Denote: none;" */
    border-radius: 8px;
    cursor: pointer;
    transition: var(--transition);
    min-width: 80px;
  }

  .btn-shuffle, .btn-deselect {
    background: var(--text-color);
    color: var(--card-background);
  }

  .btn-submit, .btn-restart {
    background: var(--accent-color);
    color: var(--card-background);
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  .btn:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal-content {
    background: var(--card-background);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    max-width: 90%;
    width: 100%;
    color: var(--text-color);
    box-shadow: var(--shadow);
    overflow-y: auto;
    max-height: 90vh;
  }

  .modal-content h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .modal-content p {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  /* MODAL GROUPS: Max-width, centered */
  .modal-groups {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
    max-width: 800px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
  }

  .modal-buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  /* Mobile Fixes */
  @media (max-width: 600px) {
    .content-wrapper { margin: 1rem 0.75rem; padding: 0; }
    .game-title { font-size: 1.5rem; }
    .game-container { padding: 0.75rem; border-radius: 12px; }
    .game-description { font-size: 0.9rem; line-height: 1.3; margin-bottom: 0.5rem; padding: 0 0.25rem; }
    .grid { gap: 0.5rem; }
    .word-card { padding: 0.75rem; font-size: 0.85rem; border-width: 1px; }
    .completed-group { padding: 0.75rem; }
    .completed-group h3 { font-size: 1rem; }
    .action-buttons { flex-direction: column; gap: 0.5rem; }
    .btn { padding: 0.5rem 1rem; font-size: 0.85rem; }
    .modal-content { padding: 1rem; max-width: 95%; }
    .modal-content h2 { font-size: 1.4rem; }
    .modal-content p { font-size: 0.95rem; }
    .toast { font-size: 0.9rem; padding: 0.5rem 1rem; }
    .modal-groups { padding: 0 0.5rem; }
  }

  @media (max-width: 400px) {
    .game-description { font-size: 0.85rem; padding: 0; }
    .word-card { font-size: 0.8rem; padding: 0.5rem; }
    .grid { gap: 0.3rem; }
    .btn { font-size: 0.8rem; padding: 0.4rem 0.8rem; }
  }
</style>