<script>
  import { onMount } from 'svelte';

  const maxRows = 6;
  const wordLength = 5;

  const words = ['apple', 'grape', 'melon', 'peach', 'berry', 'lemon'];

  let targetWord = '';
  let currentRow = 0;
  let currentGuess = '';
  let won = false;
  let showModal = false;

  let rows = Array(maxRows)
    .fill('')
    .map(() => Array(wordLength).fill({ letter: '', status: '' }));
  let keyboardStatus = {};

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  function startGame() {
    targetWord = getRandomWord();
    currentRow = 0;
    currentGuess = '';
    won = false;
    showModal = false;
    keyboardStatus = {};
    rows = Array(maxRows)
      .fill('')
      .map(() => Array(wordLength).fill({ letter: '', status: '' }));
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
        rows[currentRow] = currentGuess
          .split('')
          .map((letter, i) => ({ letter, status: status[i] }));

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
      .map((l) => ({ letter: l, status: '' }))
      .concat(Array(wordLength - currentGuess.length).fill({ letter: '', status: '' }));
  }

  function keydown(event) {
    if (event.metaKey) return;
    const key = event.key.toLowerCase();
    if (/^[a-z]$/.test(key) || key === 'enter' || key === 'backspace') {
      document.querySelector(`[data-key="${key}"]`)?.click();
    }
  }

  function closeModal() {
    showModal = false;
  }

  onMount(() => {
    startGame();
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  });
</script>

<svelte:head>
  <title>Word Game</title>
  <meta name="description" content="A Wordle clone in SvelteKit" />
</svelte:head>

<div class="header">
  <h1>Word Game</h1>
  <button class="refresh-btn" on:click={startGame} title="Restart Game">↻</button>
</div>

<a class="how-to-play" href="/word-game/how-to-play">How to Play</a>

<div class="grid">
  {#each rows as row}
    <div class="row">
      {#each row as cell}
        <div class="letter {cell.status}">{cell.letter.toUpperCase()}</div>
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

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .refresh-btn {
    background: #6aaa64;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
  }

  .refresh-btn:hover {
    transform: rotate(20deg) scale(1.1);
    box-shadow: 0 0 8px #6aaa64;
  }

  h1 { text-align: center; margin: 0; }

  .how-to-play { display: block; text-align: center; margin: 0.5rem 0 1rem; color: #0af; }

  .grid {
    max-width: 420px;
    margin: 0 auto 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.3rem;
  }

  .letter {
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    font-weight: bold;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 2px 6px rgba(255,255,255,0.3),
      0 4px 6px rgba(0,0,0,0.1);
    text-transform: uppercase;
    transition: all 0.3s ease;
    backdrop-filter: blur(6px);
  }

  .letter.exact { 
    background: rgba(106,170,100,0.85);
    color: white;
    box-shadow:
      0 0 10px rgba(106,170,100,0.7),
      inset 0 2px 6px rgba(255,255,255,0.2);
  }
  .letter.close { 
    background: rgba(201,180,88,0.85);
    color: white;
    box-shadow:
      0 0 10px rgba(201,180,88,0.7),
      inset 0 2px 6px rgba(255,255,255,0.2);
  }
  .letter.missing { 
    background: rgba(120,124,126,0.85);
    color: white;
    opacity: 0.8;
    box-shadow:
      0 0 10px rgba(120,124,126,0.6),
      inset 0 2px 6px rgba(255,255,255,0.2);
  }

  .keyboard { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.2rem; }
  .keyboard .row { display: flex; justify-content: center; gap: 0.2rem; }

  .keyboard button {
    width: 40px;
    height: 50px;
    border: none;
    border-radius: 6px;
    background: #eee;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s ease;
  }

  .keyboard button:hover {
    transform: scale(1.05);
    background: #ddd;
  }

  .keyboard button.exact { background: #6aaa64; color: white; }
  .keyboard button.close { background: #c9b458; color: white; }
  .keyboard button.missing { background: #787c7e; color: white; opacity: 0.8; }

  .keyboard .row.last-row {
    gap: 1rem;
    justify-content: center;
  }

  .keyboard button[data-key="enter"],
  .keyboard button[data-key="backspace"] {
    width: 80px;
    background: #0a74da;
    color: white;
    font-size: 1rem;
    font-weight: bold;
  }

  .keyboard button[data-key="enter"]:hover,
  .keyboard button[data-key="backspace"]:hover {
    background: #095bb5;
    transform: scale(1.05);
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #111;
    color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    max-width: 300px;
  }

  .modal button {
    margin-top: 1rem;
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    background: #6aaa64;
    color: white;
  }
</style>
