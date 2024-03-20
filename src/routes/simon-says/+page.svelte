<script>
  import { onMount } from 'svelte';
  import Layout from "../../layouts/Layout.svelte";

  let AudioConstructor;

  // Check if running in the browser environment
  if (typeof window !== 'undefined') {
    // Import the Audio constructor dynamically
    AudioConstructor = window.Audio;
  }

  // Continue with the rest of your component code
  // Define the game board size
  const gridSize = 5;
  const maxSoundIndex = 9; // Maximum sound index
  let currentSoundIndex = 1; // Initial sound index

  // Initialize variables
  let sequence = [];
  let userSequence = [];
  let round = 0;
  let isActive = false;
  let showStartButton = true;

  // Define sounds
  let correctSounds = [];
  let wrongSound;

  // Check if running in the browser environment
  if (typeof window !== 'undefined') {
    // Initialize sounds if running in the browser
    correctSounds = Array.from({ length: maxSoundIndex }, (_, i) => {
      const audio = new AudioConstructor(`/GameSounds/game${i + 1}.mp3`);
      audio.preload = 'auto'; // Preload audio files
      return audio;
    });
    wrongSound = new AudioConstructor('/GameSounds/buzzer.mp3');
    wrongSound.preload = 'auto'; // Preload the wrong sound file
    // Set initial volume for the buzzer sound
    wrongSound.volume = 0.5; // Adjust volume level here (0.5 means 50% volume)
  }

  // Rest of your component code...

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
    currentSoundIndex = 1; // Reset sound index to 1 for each new round
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
    await wait(530); // Wait for 0.5 seconds
    box.style.backgroundColor = '#ccc'; // Reset the color after a delay
  };

  // Function to handle box click
  const handleBoxClick = async (index) => {
  if (!isActive) return;
  userSequence.push(index);
  animateBox(index); // Highlight the clicked box
  await wait(33); // Add a slight delay before playing the sound
  playCorrectSound(); // Play correct sound
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
    wrongSound.play(); // Play wrong sound
    alert('Game Over! You reached round ' + round);
  };

  // Function to play the correct sound
  const playCorrectSound = () => {
    correctSounds[currentSoundIndex - 1].play(); // Play correct sound based on current sound index
    currentSoundIndex = (currentSoundIndex % maxSoundIndex) + 1; // Increment sound index and loop back to 1 if it exceeds maxSoundIndex
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
