<script>
    import { onMount } from 'svelte';
    import Layout from "../../layouts/Layout.svelte";
  
    let gameName = 'Aim Trainer';
    let gameDescription = 'How about testing that hand eye coordination';
    let imageSrc = 'https://images.pexels.com/photos/416832/pexels-photo-416832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  
    // Variables for game logic
    let playAreaWidth = 540; // Adjusted width of the play-area
    let playAreaHeight = 540; // Adjusted height of the play-area
    let targets = []; // Array to store target positions
    let gameStarted = false; // Flag to track if the game has started
  
    // Function to start the game
    const startGame = () => {
      targets = []; // Clear previous targets
      gameStarted = true; // Set game started flag
      generateTarget(); // Generate initial target
    };
  
    // Function to generate target
    const generateTarget = () => {
      const target = {
        x: Math.floor(Math.random() * (playAreaWidth - 50)),
        y: Math.floor(Math.random() * (playAreaHeight - 50))
      };
      targets.push(target);
    };
  
    // Function to handle target click
    const handleTargetClick = () => {
      targets.pop(); // Remove clicked target
      generateTarget(); // Generate new target
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
            <div class="target" style="top: {target.y}px; left: {target.x}px;" on:click={handleTargetClick}></div>
          {/each}
        </div>
      {/if}
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
      border: 2px solid white; /* Change border color to white */
      margin-top: 20px; /* Add margin at the top */
      margin-left: -40px; /* Move the play area 40px to the left */
      width: calc(100% + 80px); /* Increase width by 80px (40px on each side) */
      height: calc(100% + 40px); /* Increase height by 40px */
    }
  
    .target {
      position: absolute;
      width: 50px;
      height: 50px;
      background-color: red;
      border-radius: 50%;
      cursor: pointer;
    }
  
    .start-game-modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
