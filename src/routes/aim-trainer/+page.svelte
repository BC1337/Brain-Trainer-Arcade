<script>
  import Layout from "../../layouts/Layout.svelte";

  let playAreaWidth = 540;
  let playAreaHeight = 540;
  let targets = [];
  let gameStarted = false;
  let timer = 10;
  let successfulClicks = 0;
  let missedClicks = 0;
  let clickTimes = [];
  let gameEnded = false;
  let lastClickTime = null;

  const startGame = () => {
    targets = [];
    gameStarted = true;
    gameEnded = false;
    successfulClicks = 0;
    missedClicks = 0;
    clickTimes = [];
    timer = 10;
    lastClickTime = null;
    generateTarget();
    startTimer();
  };

  const generateTarget = () => {
    const target = {
      x: Math.floor(Math.random() * (playAreaWidth - 50)),
      y: Math.floor(Math.random() * (playAreaHeight - 50))
    };
    targets = [target];
  };

  const handleTargetClick = () => {
    if (lastClickTime !== null) {
      const currentTime = Date.now();
      const timeTaken = (currentTime - lastClickTime) / 1000;
      clickTimes.push(timeTaken);
    }
    lastClickTime = Date.now();
    successfulClicks++;
    generateTarget();
  };

  const handleMissedClick = (event) => {
    const { offsetX, offsetY } = event;
    let isMissedClick = true;

    // Check if the click is within any of the targets
    for (const target of targets) {
        const distance = Math.sqrt(
            (offsetX - target.x - 25) ** 2 + (offsetY - target.y - 25) ** 2
        );
        if (distance <= 25) {
            isMissedClick = false;
            break; // Exit loop if click is within target
        }
    }

    // Check if the click is within the play area but not within any of the targets (red area)
    if (isMissedClick && offsetX >= 0 && offsetY >= 0 && offsetX <= playAreaWidth && offsetY <= playAreaHeight) {
        const pixelData = ctx.getImageData(offsetX, offsetY, 1, 1).data; // Get the color of the clicked pixel
        const isBlack = pixelData[0] === 0 && pixelData[1] === 0 && pixelData[2] === 0; // Check if the color is black
        if (isBlack) {
            missedClicks++;
            updateMissedClicks();
        }
    }
};

const updateMissedClicks = () => {
    const missedClicksElement = document.getElementById('missed-clicks');
    if (missedClicksElement) {
        missedClicksElement.textContent = `Missed Clicks: ${missedClicks}`;
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
    // Clear the targets array to remove the last target
    targets = [];
    calculateStats();
  };

  const calculateStats = () => {
    const totalClicks = successfulClicks + missedClicks;
    const averageTime = clickTimes.reduce((acc, curr) => acc + curr, 0) / totalClicks;
    const modal = document.getElementById('game-modal');
    modal.style.display = 'block';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-content" style="color: black;">
          <h2>Game Stats</h2>
          <p style="color: black;">Successful Clicks: ${successfulClicks}</p>
          <p style="color: black;">Average: ${averageTime.toFixed(3)} ms</p>
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
      <div class="play-area" style="width: {playAreaWidth}px; height: {playAreaHeight}px;">
        {#each targets as target}
          <button
            class="target"
            style="top: {target.y}px; left: {target.x}px;"
            on:click={handleTargetClick}
            on:mouseout={handleMissedClick}
            on:blur={handleMissedClick}
          ></button>
        {/each}
      </div>
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
    position: relative;
    border: 2px solid white;
    margin-top: 20px;
    margin-left: -40px;
    width: calc(100% + 80px);
    height: calc(100% + 40px);
  }

  .target {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: red;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
  }

  .start-game-modal {
    position: absolute;
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
