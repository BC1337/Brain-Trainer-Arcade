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

  let canvas;

  onMount(() => {
    canvas = document.getElementById('play-area');
  });

  const startGame = () => {
    gameStarted = true;
    gameEnded = false;
    successfulClicks = 0;
    missedClicks = 0;
    totalClicks = 0;
    clickTimes = [];
    timer = 10;
    lastClickTime = null;
    startTimer();
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      generateTarget(ctx);
    }, 100);
  };

  const generateTarget = (ctx) => {
    if (gameStarted && ctx) {
      targetX = Math.random() * (playAreaWidth - 50);
      targetY = Math.random() * (playAreaHeight - 50);

      console.log('Target Coordinates:', targetX, targetY);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(targetX, targetY, 25, 0, 2 * Math.PI);
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

      if (distance <= 25) {
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
};

  const calculateStats = () => {
    const totalClicksCount = successfulClicks + missedClicks;
    const accuracy = totalClicksCount > 0 ? (successfulClicks / totalClicksCount) * 100 : 0;
    const modal = document.getElementById('game-modal');
    modal.style.display = 'block';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-content" style="color: black;">
          <h2>Game Stats</h2>
          <p style="color: black;">Successful Clicks: ${successfulClicks}</p>
          <p style="color: black;">Total Clicks: ${totalClicksCount}</p>
          <p style="color: black;">Accuracy: ${accuracy.toFixed(2)}%</p>
          <button style="background-color: #4caf50; color: white; padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;" on:click={startGame}>Play Again</button>
        </div>
      </div>`;
  };
</script>

<Layout>
  <div class="wrapper">
    {#if !gameStarted}
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
  }

  .play-area {
    border: 2px solid white;
    margin-top: 20px;
    margin-left: -40px;
  }

  .start-game-modal {
    position : absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
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
</style>

