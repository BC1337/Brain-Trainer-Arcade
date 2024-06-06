<script>
  import { onMount, onDestroy } from "svelte";
  import Layout from "../../layouts/Layout.svelte";

  let playAreaWidth;
  let playAreaHeight;
  const minWidth = 365;
  const maxWidth = 1000;
  const screenHeightPercentage = 0.75;
  const minHeight = 0;

  let gameStarted = false;
  let firstGameStarted = false;  // New flag to track if the first game has started
  let timer = 10;
  let successfulClicks = 0;
  let missedClicks = 0;
  let totalClicks = 0;
  let accuracy = 0;
  let gameEnded = false;
  let targetX;
  let targetY;
  let targetSize = 25;
  let roundLength = 10;

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
    gameStarted = true;
    firstGameStarted = true;  // Mark the first game as started
    gameEnded = false;
    successfulClicks = 0;
    missedClicks = 0;
    totalClicks = 0;
    accuracy = 0;
    timer = roundLength;
    hideModal();
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
    gameStarted = false;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showStats();
  };

  const showStats = () => {
    const modal = document.getElementById('game-modal');
    modal.style.display = 'block';
  };

  const applySettings = () => {
    startGame();
  };
</script>

<Layout>
  <div class="wrapper">
    <div class="play-area-wrapper">
      <div class="play-area-controls">
        <div class="settings-container {gameStarted || firstGameStarted ? 'settings-hidden' : ''}">
          <button class="start-game-button" on:click={startGame}>Start Game</button>
        </div>
      </div>
      <canvas id="play-area" class="play-area" on:click={handleTargetClick}></canvas>
    </div>
    <div id="game-modal" class="modal">
      <div class="modal-content">
        <div class="settings-popup settings-visible">
          <h2>Game Stats</h2>
          <p>Successful Clicks: {successfulClicks}</p>
          <p>Total Clicks: {totalClicks}</p>
          <p>Accuracy: {accuracy.toFixed(2)}%</p>
          <label for="modal-target-size">Target Size:</label>
          <input type="range" id="modal-target-size" min="10" max="50" bind:value={targetSize}>
          <label for="modal-round-length">Round Length:</label>
          <input type="range" id="modal-round-length" min="5" max="60" bind:value={roundLength}>
          <button class="apply-settings-button" on:click={applySettings}>Play Again?</button>
        </div>
      </div>
    </div>
  </div>
</Layout>

<style>
  .wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #1a1a1a;
    color: #fff;
  }

  .play-area-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .play-area-controls {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  .settings-container {
    color: #fff;
    border-radius: 5px;
    padding: 20px;
  }

  .settings-hidden {
    display: none;
  }

  .play-area {
    border: 2px solid white;
    cursor: pointer;
    max-width: 1000px;
    min-width: 365px;
    max-height: 75vh;
    margin-top: 20px;
  }

  .start-game-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    background-color: #4caf50;
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

.settings-popup {
  display: block;
}

.apply-settings-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.apply-settings-button:hover {
  background-color: #45a049;
}


</style>
