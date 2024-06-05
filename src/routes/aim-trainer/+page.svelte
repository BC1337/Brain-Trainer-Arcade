<script>
  import { onMount, onDestroy } from "svelte";
  import Layout from "../../layouts/Layout.svelte";

  let playAreaWidth;
  let playAreaHeight;
  const minWidth = 365; // Minimum width for play area
  const maxWidth = 1000; // Maximum width for play area
  const screenHeightPercentage = 0.75; // Adjust the screen height percentage as needed
  const minHeight = 0; // Minimum height for play area

  let gameStarted = false;
  let timer = 10;
  let successfulClicks = 0;
  let missedClicks = 0;
  let totalClicks = 0;
  let accuracy = 0;
  let gameEnded = false;
  let lastClickTime = null;
  let targetX;
  let targetY;
  let targetSize = 25; // Default target size
  let roundLength = 10; // Default round length

  let canvas;

  const isBrowser = typeof window !== 'undefined';

  onMount(() => {
    if (isBrowser) {
      canvas = document.getElementById('play-area');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }
    return () => {
      if (isBrowser) {
        window.removeEventListener('resize', resizeCanvas);
      }
    };
  });

  onDestroy(() => {
    if (isBrowser) {
      window.removeEventListener('resize', resizeCanvas);
    }
  });

  const resizeCanvas = () => {
    playAreaWidth = Math.max(minWidth, Math.min(window.innerWidth * 0.9, maxWidth));
    playAreaHeight = Math.max(window.innerHeight * screenHeightPercentage, minHeight);
    if (canvas) {
      canvas.width = playAreaWidth;
      canvas.height = playAreaHeight;
      if (gameStarted) {
        const ctx = canvas.getContext('2d');
        generateTarget(ctx);
      }
    }
  };

  const startGame = () => {
    hideModal();
    gameStarted = true;
    gameEnded = false;
    successfulClicks = 0;
    missedClicks = 0;
    totalClicks = 0;
    timer = roundLength;
    lastClickTime = null;
    startTimer();
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      generateTarget(ctx);
    }, 100);
    const gameControlsContainer = document.querySelector('.game-controls-container');
    gameControlsContainer.classList.add('game-controls-hidden');
  };

  const hideModal = () => {
    const modal = document.getElementById('game-modal');
    modal.style.display = 'none';
  };

  const generateTarget = (ctx) => {
    if (gameStarted && ctx) {
      targetX = Math.random() * (playAreaWidth - targetSize * 2);
      targetY = Math.random() * (playAreaHeight - targetSize * 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetSize, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    }
  };

  const handleTargetClick = (event) => {
    if (gameStarted && canvas) {
      const ctx = canvas.getContext('2d');
      const { offsetX, offsetY } = event;
      const distance = Math.sqrt((offsetX - targetX) ** 2 + (offsetY - targetY) ** 2);
      totalClicks++;
      if (distance <= targetSize) {
        successfulClicks++;
        generateTarget(ctx);
      } else {
        missedClicks++;
      }
      accuracy = (successfulClicks / totalClicks) * 100 || 0;
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
    gameStarted = false; // Reset game state
    successfulClicks = 0;
    missedClicks = 0;
    totalClicks = 0;
    accuracy = 0;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    calculateStats();
    showSettings = true; // Show settings popup after game ends
  };

  const calculateStats = () => {
    showSettings = !showSettings; // Toggle settings panel visibility
  };

  let showSettings = false;

  const toggleSettings = () => {
    showSettings = !showSettings;
  };

  const applySettings = () => {
    // Apply settings logic here
    showSettings = false;
  };
</script>
<Layout>
  <div class="wrapper">
    <div class="settings-container {gameStarted ? 'settings-hidden' : ''}">
      <div class="game-controls-container game-controls-visible">
        <label for="target-size">Target Size:</label>
        <input type="range" id="target-size" min="10" max="50" bind:value={targetSize}>
        <label for="round-length">Round Length:</label>
        <input type="range" id="round-length" min="5" max="60" bind:value={roundLength}>
        <p>Game Time Left: {timer}s</p>
        <button class="start-game-button" on:click={startGame}>Start Game</button>
      </div>
    </div>
    <canvas id="play-area" class="play-area" on:click={handleTargetClick}></canvas>
    <div id="game-modal" class="modal">
      <div class="modal-content">
        <div class="settings-popup {showSettings ? 'settings-visible' : ''}">
          <h2>Game Stats</h2>
          <p>Successful Clicks: {successfulClicks}</p>
          <p>Total Clicks: {totalClicks}</p>
          <p>Accuracy: {accuracy.toFixed(2)}%</p>
          <label for="modal-target-size">Target Size:</label>
          <input type="range" id="modal-target-size" min="10" max="50" bind:value={targetSize}>
          <label for="modal-round-length">Round Length:</label>
          <input type="range" id="modal-round-length" min="5" max="60" bind:value={roundLength}>
          <button class="apply-settings-button" on:click={applySettings}>Apply Settings</button>
        </div>
      </div>
    </div>
  </div>
</Layout>

<style>
  .settings-popup {
    display: none;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 5px;
    padding: 10px;
  }

  .settings-popup.settings-visible {
    display: block;
  }

  .wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #1a1a1a;
    color: #fff;
  }

  .settings-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2; /* Ensure settings container is on top */
    background-color: rgba(0, 0, 0, 0.8); /* Adjust the background color and opacity as needed */
    color: #fff;
    border-radius: 5px;
    padding: 10px;
  }

  .settings-hidden {
    display: none;
  }

  .play-area {
    border: 2px solid white;
    cursor: pointer;
    width: 100%;
    height: 100%;
    max-width: 1000px;
    min-width: 365px;
    max-height: 75vh; /* Adjusted height */
    position: relative;
  }

  .start-game-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    background-color: #4caf50; /* Green color */
    color: #fff;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    margin-top: 10px;
  }

  .start-game-button:hover {
    background-color: #45a049;
  }

  .modal {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 10px;
  }

  .modal-content {
    text-align: center;
  }

  .play-again-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    background-color: #4caf50; /* Green color */
    color: #fff;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .play-again-button:hover {
    background-color: #45a049;
  }
</style>
