<script>
  import Layout from "../../layouts/Layout.svelte";
  // Define the game board size
  const gridSize = 5;

  // Initialize variables
  let sequence = [];
  let userSequence = [];
  let round = 0;
  let isActive = false;
  let showStartButton = true;

  // Function to start the game
  const startGame = async () => {
    isActive = true;
    round = 0;
    sequence = [];
    userSequence = [];
    showStartButton = false;
    await wait(1000);
    nextRound();
  };

  // Custom wait function using setTimeout
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Function to generate a random box index
  const generateRandomBoxIndex = () => Math.floor(Math.random() * gridSize * gridSize);

  // Function to start the next round
  const nextRound = async () => {
    round++;
    if (round === 1) {
      // For the first round, generate only one box
      sequence = [generateRandomBoxIndex()];
      // Animate the first box for the first round
      await animateBox(sequence[0]);
    } else {
      // For subsequent rounds, replay the previous sequence and add a new box
      for (const boxIndex of sequence) {
        await animateBox(boxIndex);
      }
      // Add a new box for the current round
      sequence.push(generateRandomBoxIndex());
      // Animate the new box
      await animateBox(sequence[sequence.length - 1]);
    }
    isActive = true; // Allow user input after the sequence is shown
    userSequence = []; // Reset user sequence
  };

  // Function to animate a box
  const animateBox = async (index) => {
    const box = document.querySelectorAll('.box')[index];
    box.style.backgroundColor = 'red';
    await wait(500); // Wait for 0.5 seconds
    box.style.backgroundColor = '#ccc'; // Reset the color after a delay
  };

  // Function to handle box click
  const handleBoxClick = (index) => {
    if (!isActive) return;
    userSequence.push(index);
    animateBox(index); // Highlight the clicked box
    if (userSequence.length === sequence.length) {
      checkSequence(); // Check if the user's sequence matches the game's sequence
    }
  };

  // Function to handle keyboard events
  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      handleBoxClick(index);
    }
  };

  // Function to check if the user's sequence matches the game's sequence
  const checkSequence = () => {
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i] !== userSequence[i]) {
        endGame(); // End the game if the user's sequence does not match
        return;
      }
    }
    // If the sequence matches, proceed to the next round
    setTimeout(nextRound, 1500);
  };

  // Function to end the game
  const endGame = () => {
    isActive = false;
    showStartButton = true;
    alert('Game Over! You reached round ' + round);
  };
</script>

<Layout>
  <div class="game-container">
    <div class="game-board">
      {#each Array(gridSize * gridSize) as _, index}
        <div class="box" role="button" tabindex="0" on:click={() => handleBoxClick(index)} on:keydown={(e) => handleKeyDown(e, index)} aria-label="Box"></div>
      {/each}
    </div>
    {#if showStartButton}
      <div class="button-container">
        <button on:click={startGame}>Start Game</button>
      </div>
    {/if}
  </div>
</Layout>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .game-board {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    width: 400px;
    height: 400px;
  }

  .box {
    background-color: #ccc;
    border: 1px solid #888;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .box:hover {
    background-color: #ddd;
  }

  .button-container {
    margin-top: 20px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    background-color: #4caf50;
    color: #fff;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #388e3c;
  }
</style>
