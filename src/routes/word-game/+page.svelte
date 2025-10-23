<script>
  import Layout from "../../layouts/Layout.svelte";
  import { onMount } from 'svelte';

  const maxRows = 6;
  const wordLength = 5;
  const words = ['apple', 'grape', 'melon', 'peach', 'berry', 'lemon'];

  let targetWord = '';
  let currentRow = 0;
  let currentGuess = '';
  let won = false;
  let showModal = false;
  let rows = Array(maxRows).fill('').map(() =>
    Array(wordLength).fill({ letter: '', status: '', theme: 'light', typed: false })
  );
  let keyboardStatus = {};
  let isDarkMode = false;

  const h1Color = '#0a74da';

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

function detectTheme() {
  isDarkMode = document.documentElement.classList.contains('dark');
  applyThemeToRows();
  updateCurrentRow();
}


function startGame() {
  targetWord = getRandomWord();
  currentRow = 0;
  currentGuess = '';
  won = false;
  showModal = false;
  keyboardStatus = {};
  rows = Array(maxRows).fill('').map(() =>
    Array(wordLength).fill({
      letter: '',
      status: '',
      theme: isDarkMode ? 'dark' : 'light',
      typed: false
    })
  );
}


  function evaluateGuess(guess) {
    const result = Array(wordLength).fill('missing');
    const targetArray = targetWord.split('');

    guess.split('').forEach((letter, i) => {
      if (targetArray[i] === letter) {
        result[i] = 'exact';
        targetArray[i] = null;
      }
    });

    guess.split('').forEach((letter, i) => {
      if (result[i] === 'missing') {
        const idx = targetArray.indexOf(letter);
        if (idx !== -1) {
          result[i] = 'close';
          targetArray[idx] = null;
        }
      }
    });

    return result;
  }

  function update(event) {
    event.preventDefault();
    const key = event.target.getAttribute('data-key');
    if (!key) return;

    if (key === 'backspace') {
      currentGuess = currentGuess.slice(0, -1);
      updateCurrentRow();
    } else if (key === 'enter') {
      if (currentGuess.length === wordLength) {
        const status = evaluateGuess(currentGuess);
        rows[currentRow] = currentGuess.split('').map((letter, i) => ({
          letter,
          status: status[i],
          theme: isDarkMode ? 'dark' : 'light',
          typed: false
        }));

        status.forEach((s, i) => {
          const letter = rows[currentRow][i].letter;
          if (s === 'exact' || (s === 'close' && keyboardStatus[letter] !== 'exact')) {
            keyboardStatus[letter] = s;
          } else if (!keyboardStatus[letter]) {
            keyboardStatus[letter] = s;
          }
        });

        won = status.every((s) => s === 'exact');
        if (won || currentRow + 1 === maxRows) showModal = true;

        currentRow++;
        currentGuess = '';
      }
    } else if (/^[a-z]$/.test(key) && currentGuess.length < wordLength) {
      currentGuess += key;
      updateCurrentRow();
    }
  }

function updateCurrentRow() {
  rows[currentRow] = currentGuess
    .split('')
    .map((l, i) => {
      const oldCell = rows[currentRow]?.[i] || {};
      return {
        ...oldCell,
        letter: l,
        typed: true,
        theme: isDarkMode ? 'dark' : 'light'
      };
    })
    .concat(
      Array(wordLength - currentGuess.length).fill({ letter: '', status: '', typed: false, theme: isDarkMode ? 'dark' : 'light' })
    );
}

function keydown(event) {
  if (event.metaKey) return;

  const key = event.key.toLowerCase();

  // Prevent spacebar scrolling
  if (key === ' ' || key === 'spacebar') {
    event.preventDefault();
    return;
  }

  // Only trigger clicks for your on-screen keyboard
  const keyboardButton = document.querySelector(`.keyboard [data-key="${key}"]`);
  if (keyboardButton) {
    keyboardButton.click();
    event.preventDefault(); // Stop bubbling to other buttons
  }
}

function applyThemeToRows() {
  rows = rows.map(row =>
    row.map(cell => ({
      ...cell,
      theme: isDarkMode ? 'dark' : 'light'
    }))
  );
}

  function closeModal() {
    showModal = false;
  }

  onMount(() => {
    detectTheme();
    startGame();
    window.addEventListener('keydown', keydown);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', detectTheme);
    return () => {
      window.removeEventListener('keydown', keydown);
      mq.removeEventListener('change', detectTheme);
    };
  });
</script>

<svelte:head>
  <title>Word Game - Brain Trainer Arcade</title>
  <meta name="description" content="Play our Wordle-style game in Brain Trainer Arcade." />
</svelte:head>

<Layout>
  <div class="word-game-container">
    <div class="header">
      <h1 style="color: {h1Color}">Word Game</h1>
      <button class="refresh-btn" on:click={startGame} title="Restart Game">↻</button>
    </div>

    <a class="how-to-play" href="/word-game/how-to-play">How to Play</a>

    <div class="grid">
      {#each rows as row}
        <div class="row">
          {#each row as cell}
            <div class="letter {cell.status} {cell.theme} {cell.typed ? 'typed' : ''}">
              {cell.letter.toUpperCase()}
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <div class="keyboard">
      {#each ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as row}
        <div class="row">
          {#each row.split('') as letter}
            <button
              type="button"
              data-key={letter}
              class={keyboardStatus[letter]}
              on:click={update}
            >
              {letter.toUpperCase()}
            </button>
          {/each}
        </div>
      {/each}
      <div class="row last-row">
        <button type="button" data-key="enter" on:click={update}>Enter</button>
        <button type="button" data-key="backspace" on:click={update}>Back</button>
      </div>
    </div>

    {#if showModal}
      <div class="modal-backdrop">
        <div class="modal">
          <h2>{won ? 'Hooray! 🎉' : 'Game Over'}</h2>
          <p>
            {won
              ? `You guessed the word "${targetWord.toUpperCase()}" in ${currentRow} ${currentRow === 1 ? 'guess' : 'guesses'}!`
              : `The word was "${targetWord.toUpperCase()}"`}
          </p>
          <button on:click={closeModal}>Close</button>
        </div>
      </div>
    {/if}
  </div>
</Layout>

<style>
.word-game-container {
  width: 100%;
  max-width: 480px;
  padding: 1rem;
  margin: 0 auto;
  color: inherit;
  background: inherit;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

h1 { text-align: center; margin: 0; }

a.how-to-play {
  display: block;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-link, #0af);
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.3rem;
}

/* Letter colors */
.letter.light { color: black; }
.letter.dark { color: white; }

/* typed letters */
.letter.typed.light { color: black; }
.letter.typed.dark { color: #ddd; }

.letter {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  font-weight: bold;
  border-radius: 10px;
  background: rgba(255,255,255,0.15);
  box-shadow: inset 0 2px 6px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.1);
  text-transform: uppercase;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);
}

/* evaluated letters */
.letter.exact { background: rgba(106,170,100,0.85); color:white; }
.letter.close { background: rgba(201,180,88,0.85); color:white; }
.letter.missing { background: rgba(120,124,126,0.85); color:white; opacity:0.8; }

.keyboard {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.keyboard .row {
  display: flex;
  justify-content: center;
  gap: 0.2rem;
}
.keyboard button {
  width: 40px;
  height: 50px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
  background: var(--btn-light, #eee);
  color: var(--btn-text-light, #111);
}
.keyboard button:hover { transform: scale(1.05); }

.keyboard button.exact { background: #6aaa64; color:white; }
.keyboard button.close { background: #c9b458; color:white; }
.keyboard button.missing { background: #787c7e; color:white; opacity:0.8; }

.keyboard .row.last-row { gap: 1rem; justify-content: center; }
.keyboard button[data-key="enter"],
.keyboard button[data-key="backspace"] {
  width: 80px; background: #0a74da; color: white; font-size: 1rem; font-weight: bold;
}
.keyboard button[data-key="enter"]:hover,
.keyboard button[data-key="backspace"]:hover {
  background: #095bb5; transform: scale(1.05);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}
.modal {
  background: inherit;
  color: inherit;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
}
.modal button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  background: var(--btn-bg, #6aaa64);
  color: var(--btn-text, white);
}

@media screen and (max-width: 480px) {
  .letter { width: 45px; height: 45px; font-size: 1.5rem; }
  .keyboard button { width: 35px; height: 45px; font-size: 0.9rem; }
  .keyboard button[data-key="enter"], .keyboard button[data-key="backspace"] { width: 70px; }
}
</style>
