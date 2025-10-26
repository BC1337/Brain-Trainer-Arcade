<!-- src/routes/connections/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';

  // -------------------------------------------------
  // 1. Import the 300+ puzzle sets
  // -------------------------------------------------
  import { groupSets } from './wordSets.js';

  // -------------------------------------------------
  // 2. Reactive state
  // -------------------------------------------------
  let grid = [];
  let selected = [];
  let completed = [];
  let mistakes = 0;
  const maxMistakes = 4;
  let gameOver = false;
  let won = false;
  let isShaking = false;
  let showOneAway = false;

  let currentGroups = [];   // the 4 groups for the current puzzle
  let oneAwayShown = false; // prevent toast spam

  // -------------------------------------------------
  // 3. Styling helpers
  // -------------------------------------------------
  const categoryColors = {
    yellow: '#FFD1DC', // Pastel pink
    green: '#B5EAD7',  // Pastel mint
    blue: '#C7CEEA',   // Pastel lavender
    purple: '#E2C1F5'  // Pastel lilac
  };

  // -------------------------------------------------
  // 4. Lifecycle
  // -------------------------------------------------
  onMount(() => {
    resetGame();
  });

  // -------------------------------------------------
  // 5. Core game logic
  // -------------------------------------------------
  function resetGame() {
    // OPTIONAL: daily seed (uncomment for a true daily puzzle)
    // const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
    // const seed = parseInt(today,10) % groupSets.length;

    const idx = Math.floor(Math.random() * groupSets.length);
    currentGroups = groupSets[idx];               // <-- each entry is an array of 4 groups
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
      // ---- CORRECT ----
      completed = [...completed, { ...match, words: [...selected] }];
      grid = grid.filter(w => !selected.includes(w));
      shuffleGrid();               // auto-shuffle after a correct group
      selected = [];

      if (completed.length === 4) {
        won = true;
        completed = completed.sort((a, b) => a.difficulty - b.difficulty);
      }
    } else {
      // ---- WRONG ----
      let oneAway = false;
      for (const g of currentGroups) {
        const overlap = selected.filter(w => g.words.includes(w)).length;
        if (overlap === 3) { oneAway = true; break; }
      }

      mistakes += 1;
      isShaking = true;
      oneAwayShown = false; // reset for next mistake

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

<!-- =============================================== -->
<!-- =================== MARKUP ==================== -->
<!-- =============================================== -->
<head>
  <title>Connections</title>
  <meta
    name="description"
    content="Group words that share a common thread in this challenging puzzle game inspired by NYT Connections."
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

      <!-- Completed groups (top) -->
      <div class="completed-groups">
        {#each completed as group}
          <div
            class="completed-group"
            style="background-color:{categoryColors[group.color]};color:#000;"
          >
            <h3>{group.title}</h3>
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
                on:keydown={e => e.key === 'Enter' && selectWord(word)}
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

      <!-- Win / Game-Over modal -->
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

            <div class="modal-groups">
              {#each completed as group}
                <div
                  class="completed-group"
                  style="background-color:{categoryColors[group.color]};color:#000;"
                >
                  <h3>{group.title}</h3>
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

<!-- =============================================== -->
<!-- =================== STYLES ==================== -->
<!-- =============================================== -->
<style>
  :root {
    --background-color: var(--theme-background, #1a1a1a);
    --card-background: var(--theme-card, #2a2a2a);
    --text-color: var(--theme-text, #ffffff);
    --accent-color: #FFF3B0;
    --shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    --transition: all 0.3s ease;
  }

  /* Layout */
  .content-wrapper { display: grid; gap: 2rem; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
  .game-title { font-size: 2rem; font-weight: 600; text-align: center; }
  .game-container { display: grid; gap: 1.5rem; justify-items: center; padding: 1.5rem; background: var(--card-background); border-radius: 16px; box-shadow: var(--shadow); }

  .game-description { font-size: 1.2rem; color: var(--text-color); text-align: center; margin-bottom: 1rem; }

  /* Completed groups */
  .completed-groups { width: 100%; display: grid; gap: 1rem; }
  .completed-group { padding: 1.5rem; border-radius: 8px; text-align: center; }
  .completed-group h3 { margin: 0 0 .75rem; font-size: 1.4rem; text-transform: uppercase; }
  .group-words { display: flex; justify-content: center; gap: .75rem; flex-wrap: wrap; }
  .word-box { padding: .5rem 1rem; background: rgba(0,0,0,.2); border-radius: 4px; font-weight: bold; }

  /* Grid */
  .grid-container { position: relative; width: 100%; max-width: 600px; }
  .grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; }
  .word-card {
    padding: 1.5rem; background: var(--background-color); border: 2px solid var(--text-color);
    border-radius: 8px; text-align: center; font-size: 1.2rem; font-weight: bold;
    color: var(--text-color); cursor: pointer; transition: var(--transition);
  }
  .word-card:hover { transform: scale(1.05); }
  .word-card:focus { outline: 2px solid var(--accent-color); }
  .selected { background: var(--accent-color); color: var(--card-background); border-color: var(--accent-color); }

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
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    background: rgba(0,0,0,.85); color: #fff; padding: 1rem 1.5rem;
    border-radius: 8px; font-size: 1.2rem; font-weight: bold; z-index: 10;
  }

  /* Buttons */
  .action-buttons { display: flex; gap: 1rem; margin-top: 1rem; }
  .mistakes { font-size: 1.2rem; color: var(--text-color); margin-top: 1rem; }

  .btn {
    padding: .75rem 1.5rem; font-size: 1rem; font-weight: 500;
    border: none; border-radius: 8px; cursor: pointer; transition: var(--transition);
  }
  .btn-shuffle, .btn-deselect { background: var(--text-color); color: var(--card-background); }
  .btn-submit, .btn-restart { background: var(--accent-color); color: var(--card-background); }
  .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow); }
  .btn:disabled { opacity: .5; cursor: not-allowed; }

  /* Modal */
  .modal { position: fixed; inset: 0; background: rgba(0,0,0,.7); display: flex; justify-content: center; align-items: center; z-index: 9999; }
  .modal-content { background: var(--card-background); border-radius: 12px; padding: 2rem; text-align: center; max-width: 600px; width: 90%; color: var(--text-color); box-shadow: var(--shadow); }
  .modal-content h2 { font-size: 1.75rem; margin-bottom: 1.5rem; }
  .modal-content p { font-size: 1.2rem; margin-bottom: 1.5rem; }
  .modal-groups { display: grid; gap: 1.5rem; margin-bottom: 2rem; }
  .modal-buttons { display: flex; gap: 1rem; justify-content: center; }

  /* Responsive */
  @media (max-width: 600px) {
    .content-wrapper { margin: 1rem; }
    .game-title { font-size: 1.5rem; }
    .game-container { padding: 1rem; }
    .game-description { font-size: 1rem; }
    .grid { gap: .5rem; }
    .word-card { padding: 1rem; font-size: 1rem; }
    .completed-group { padding: 1rem; }
    .completed-group h3 { font-size: 1.2rem; }
    .action-buttons { flex-direction: column; }
    .btn { padding: .5rem 1rem; font-size: .9rem; }
    .modal-content { padding: 1.5rem; }
    .modal-content h2 { font-size: 1.5rem; }
    .modal-content p { font-size: 1rem; }
    .toast { font-size: 1rem; padding: .75rem; }
  }
</style>