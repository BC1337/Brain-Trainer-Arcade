<div class="text-column">
  <h1>How to play Generic Word Game</h1>

  <p>
    Generic Word Game is a clone of 
    <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank">Wordle</a>, the
    word guessing game. To play, enter a five-letter English word. For example:
  </p>

  <div class="example">
    <span class="close">r</span>
    <span class="missing">i</span>
    <span class="close">t</span>
    <span class="missing">z</span>
    <span class="exact">y</span>
  </div>

  <p>
    The <span class="exact">y</span> is in the right place. 
    <span class="close">r</span> and <span class="close">t</span>
    are the right letters, but in the wrong place. The other letters are wrong, and can be discarded.
    Let's make another guess:
  </p>

  <div class="example">
    <span class="exact">p</span>
    <span class="exact">a</span>
    <span class="exact">r</span>
    <span class="exact">t</span>
    <span class="exact">y</span>
  </div>

  <p>This time we guessed right! You have <strong>six</strong> guesses to get the word.</p>

  <!-- BUTTON instead of a tag -->
  <button class="play-button" on:click={() => window.location.href='/word-game'}>Play Now</button>
</div>

<style>
/* ---- Page container ---- */
.text-column {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
  color: #111;
  background: #f7f7f7; /* off-white */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Text styling */
.text-column h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #222;
}
.text-column p {
  font-size: 1rem;
  line-height: 1.5;
  margin: 1rem 0;
  color: #222;
}
.text-column a {
  color: #0a74da;
  text-decoration: underline;
}

/* Example boxes like game board */
.example {
  display: flex;
  gap: 0.3rem;
  margin: 1rem 0;
  justify-content: flex-start;
}
.example span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 6px;
  text-transform: uppercase;
  background: #ededed; /* pre-submission light grey */
  color: black;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
.example span.exact { background: #6aaa64; color: white; }
.example span.close { background: #c9b458; color: white; }
.example span.missing { background: #787c7e; color: white; opacity: 0.8; }

/* Inline spans inside paragraph */
p span {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1.5em;
  height: 1.5em;
  font-size: 0.9em;
  font-weight: bold;
}

/* ---- Play Now button ---- */
.play-button {
  display: block;
  margin: 2rem auto 0;
  padding: 0.8rem 1.6rem;
  background-color: #6aaa64; /* green */
  color: white;
  font-weight: bold;
  border-radius: 6px;
  font-size: 1rem;
  border: none;
  cursor: pointer;

  /* NO hover/active changes */
  transition: none;
}
.play-button:hover,
.play-button:active,
.play-button:focus {
  background-color: #6aaa64;
  color: white;
  transform: none;
}
</style>
