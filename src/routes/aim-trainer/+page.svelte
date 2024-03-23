<script>
  import { onMount } from "svelte";
  import Layout from "../../layouts/Layout.svelte";

  let playAreaWidth = 540;
  let playAreaHeight = 540;
  let gameStarted = false;
  let timer = 10;
  let successfulClicks = 0;
  let missedClicks = 0;
  let totalClicks = 0;
  let clickTimes = [];
  let gameEnded = false;
  let lastClickTime = null;
  let targetX;
  let targetY;
  let targetSize = 25; // Default target size
  let roundLength = 10; // Default round length

  let canvas;

  onMount(() => {
    canvas = document.getElementById('play-area');
  });

  const startGame = () => {
    hideModal(); // Hide the modal before starting the game
    gameStarted = true;
    gameEnded = false;
    successfulClicks = 0;
    missedClicks = 0;
    totalClicks = 0;
    clickTimes = [];
    timer = roundLength; // Set round length
    lastClickTime = null;
    startTimer();
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      generateTarget(ctx);
    }, 100);
  };

  const hideModal = () => {
    const modal = document.getElementById('game-modal');
    modal.style.display = 'none';
  };

  const generateTarget = (ctx) => {
    if (gameStarted && ctx) {
      targetX = Math.random() * (playAreaWidth - targetSize * 2);
      targetY = Math.random() * (playAreaHeight - targetSize * 2);

      console.log('Target Coordinates:', targetX, targetY);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetSize, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    } else {
      console.log("Game not started or context not available");
    }
  };

  const handleTargetClick = (event) => {
    if (gameStarted && canvas) {
      const ctx = canvas.getContext('2d');
      const { offsetX, offsetY } = event;

      const distance = Math.sqrt(
        (offsetX - targetX) ** 2 + (offsetY - targetY) ** 2
      );

      totalClicks++; // Increment total clicks regardless of hitting the target or not

      if (distance <= targetSize) {
        successfulClicks++;
        generateTarget(ctx);
      } else {
        missedClicks++;
      }
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      if (timer > 0) {
        timer--;
      } else {
        clearInterval(interval);
        endGame();
      }
    }, 1000);
  };

  const endGame = () => {
    gameEnded = true;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    calculateStats();

    // Show game controls when the game ends
    const gameControlsContainer = document.querySelector('.game-controls-container');
    gameControlsContainer.classList.remove('game-controls-hidden');
    gameControlsContainer.classList.add('game-controls-visible');
};
const calculateStats = () => {
    const totalClicksCount = successfulClicks + missedClicks;
    const accuracy = totalClicksCount > 0 ? (successfulClicks / totalClicksCount) * 100 : 0;
    const modal = document.getElementById('game-modal');
    modal.style.display = 'block';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-content" style="color: white;">
          <h2>Game Stats</h2>
          <p style="color: white;">Successful Clicks: ${successfulClicks}</p>
          <p style="color: white;">Total Clicks: ${totalClicksCount}</p>
          <p style="color: white;">Accuracy: ${accuracy.toFixed(2)}%</p>
          <button id="play-again-button" style="background-color: #4caf50; color: white; padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;">Play Again</button>
        </div>
      </div>`;

    // Add event listener separately
    const playAgainButton = document.getElementById('play-again-button');
    playAgainButton.addEventListener('click', startGame);

    // Show game controls if the game has ended
    const gameControlsContainer = document.querySelector('.game-controls-container');
    gameControlsContainer.classList.remove('game-controls-hidden');
    gameControlsContainer.classList.add('game-controls-visible');
};


</script>

<Layout>
  <div class="wrapper">
    {#if !gameStarted}
      <div class="game-controls-container {gameEnded ? 'game-controls-hidden' : 'game-controls-visible'}">
        <h2>Game Controls</h2>
        <label for="round-length">Round Length:</label>
        <input type="range" id="round-length" min="5" max="30" bind:value={roundLength} />
        <p>Round Length: {roundLength} seconds</p>
        <label for="target-size">Target Size:</label>
        <input type="range" id="target-size" min="10" max="50" bind:value={targetSize} />
        <p>Target Size: {targetSize}px</p>
      </div>
      <div class="start-game-modal">
        <button on:click={startGame}>Start Game</button>
      </div>
    {:else}
      <canvas bind:this={canvas} id="play-area" class="play-area" width={playAreaWidth} height={playAreaHeight} on:click={handleTargetClick}></canvas>
    {/if}
    <div id="game-modal" class="modal" style="display: none;"></div>
  </div>
</Layout>


<style>
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
    background-color: #1a1a1a; /* Dark background color */
    color: #fff; /* Light text color */
  }

  .play-area {
    border: 2px solid white;
    margin-top: 20px;
    margin-left: -40px;
  }

  .start-game-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 50px; /* Add some top margin to separate from the center */
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #1a1a1a; /* Dark background color */
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); /* Lighter shadow color */
    text-align: center;
    color: #fff; /* Light text color */
  }

  .game-controls-visible {
    display: block;
    transform: translateY(-50%);
    background-color: #2c2c2c; /* Darker background color */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); /* Lighter shadow color */
    color: #fff; /* Light text color */
  }

  .game-controls-hidden {
    display: none;
  }
  
  .start-game-modal button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    background-color: #4caf50; /* Green color for button */
    color: #fff; /* Light text color */
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .start-game-modal button:hover {
    background-color: #45a049; /* Darker green color on hover */
  }

  /* Additional styling for game settings */
  .game-controls-container {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translateY(-50%);
    margin-right: 20%; /* Adjust as needed for separation */
  }
  .game-controls-container label {
    font-weight: bold;
    margin-bottom: 10px;
    display: block;
  }

  .game-controls-container input[type="range"] {
    width: 100%;
    margin-bottom: 10px;
    background-color: #555; /* Darker background color for range input */
    border: none;
    border-radius: 5px;
    -webkit-appearance: none; /* Remove default appearance */
  }

  .game-controls-container input[type="range"]:focus {
    outline: none; /* Remove focus outline */
  }

  .game-controls-container input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; /* Remove default appearance */
    width: 15px;
    height: 15px;
    background-color: #4caf50; /* Green color for thumb */
    border-radius: 50%; /* Rounded shape */
    cursor: pointer;
  }

  .game-controls-container p {
    margin-bottom: 10px;
  }
</style>
