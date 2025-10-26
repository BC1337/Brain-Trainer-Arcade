<!-- SequentialMemoryGame.svelte -->
<script>
  import { onMount } from 'svelte';
  import Layout from "../../layouts/Layout.svelte";
  import Modal from '../../lib/components/Modal.svelte';

  let AudioConstructor;
  if (typeof window !== 'undefined') {
    AudioConstructor = window.Audio;
  }

  const gridSize = 5;
  const maxSoundIndex = 9;
  let currentSoundIndex = 1;
  let sequence = [];
  let userSequence = [];
  let round = 0;
  let isActive = false;
  let showStartButton = true;
  let isMuted = false;
  let volumeLevel = 0.05;
  let activeBoxIndex = null;
  let showModal = false;
  let isStarting = false;

  let correctSounds = [];
  let wrongSound;

  if (typeof window !== 'undefined') {
    correctSounds = Array.from({ length: maxSoundIndex }, (_, i) => {
      const audio = new AudioConstructor(`/GameSounds/game${i + 1}.mp3`);
      audio.preload = 'auto';
      audio.volume = volumeLevel;
      return audio;
    });
    wrongSound = new AudioConstructor('/GameSounds/buzzer.mp3');
    wrongSound.preload = 'auto';
    wrongSound.volume = volumeLevel;
  }

  const startGame = async () => {
    if (isStarting) return;
    isStarting = true;
    stopAllSounds();
    isActive = true;
    round = 0;
    sequence = [];
    userSequence = [];
    currentSoundIndex = 1;
    showStartButton = false;
    showModal = false;
    await wait(1000);
    nextRound();
    isStarting = false;
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const generateRandomBoxIndex = () => Math.floor(Math.random() * gridSize * gridSize);

  const nextRound = async () => {
    round++;
    currentSoundIndex = 1;
    sequence.push(generateRandomBoxIndex());
    for (const boxIndex of sequence) {
      await animateBox(boxIndex);
      await wait(50);
    }
    currentSoundIndex = 1;
    isActive = true;
    userSequence = [];
  };

  const animateBox = async (index) => {
    activeBoxIndex = index;
    if (!isMuted) {
      try {
        const sound = correctSounds[currentSoundIndex - 1];
        sound.currentTime = 0;
        await sound.play();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
    await wait(400);
    activeBoxIndex = null;
    currentSoundIndex = (currentSoundIndex % maxSoundIndex) + 1;
  };

  const stopAllSounds = () => {
    correctSounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    wrongSound.pause();
    wrongSound.currentTime = 0;
  };

  const handleBoxClick = async (index) => {
    if (!isActive) return;
    userSequence.push(index);
    await animateBox(index);
    if (userSequence.length === sequence.length) {
      checkSequence();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleBoxClick(index);
    }
  };

  const checkSequence = () => {
    stopAllSounds();
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i] !== userSequence[i]) {
        endGame();
        return;
      }
    }
    setTimeout(nextRound, 1000);
  };

  const endGame = () => {
    console.log('Ending game, round:', round); // Debug log
    stopAllSounds();
    isActive = false;
    showStartButton = true;
    showModal = true;
    if (!isMuted) {
      try {
        wrongSound.currentTime = 0;
        wrongSound.play();
      } catch (error) {
        console.error('Error playing wrong sound:', error);
      }
    }
  };

  const closeModal = () => {
    showModal = false;
    stopAllSounds();
  };

  const toggleMute = () => {
    isMuted = !isMuted;
    correctSounds.forEach(sound => sound.muted = isMuted);
    wrongSound.muted = isMuted;
  };

  const handleVolumeChange = (event) => {
    volumeLevel = event.target.value;
    correctSounds.forEach(sound => sound.volume = volumeLevel);
    wrongSound.volume = volumeLevel;
  };
</script>

<head>
  <title>Sequential Memory Challenge</title>
  <meta name="description" content="Test your memory and reflexes in this engaging sequence game. Repeat the pattern of lights and sounds to beat your high score!">
  <meta name="keywords" content="memory game, sequence game, pattern game, brain training, reflex game, audio game, online game">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<Layout>
  <main class="content-wrapper">
    <h1 class="game-title">Sequential Memory Challenge</h1>
    <section class="game-container" aria-label="Sequential memory game">
      <div class="game-controls" aria-label="Game controls">
        <div class="volume-control">
          <label for="volume-slider" class="sr-only">Volume control</label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volumeLevel}
            on:input={handleVolumeChange}
            aria-label="Adjust volume"
          />
        </div>
        <button class="mute-button" on:click={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
          {#if isMuted}
            <span class="icon">🔇</span>
          {:else}
            <span class="icon">🔊</span>
          {/if}
        </button>
      </div>
      <p class="round-info" aria-live="polite">Round: {round}</p>
      <div class="game-board" role="grid" aria-label="Game board">
        <div class="box-container">
          {#each Array(gridSize * gridSize) as _, index}
            <div
              class="box"
              class:active={activeBoxIndex === index}
              role="button"
              tabindex="0"
              on:click={() => handleBoxClick(index)}
              on:keydown={(e) => handleKeyDown(e, index)}
              aria-label={`Box ${index + 1}`}
            ></div>
          {/each}
        </div>
      </div>
      {#if showStartButton}
        <div class="button-container">
          <button class="btn btn-start" on:click={startGame} aria-label="Start game" disabled={isStarting}>Start Game</button>
        </div>
      {/if}
      {#if showModal}
        <Modal correctGuesses={round || 0} onClose={closeModal} onRestart={startGame} />
      {/if}
    </section>
  </main>
</Layout>

<style>
  :root {
    --background-color: var(--theme-background, #1a1a1a);
    --card-background: var(--theme-card, #2a2a2a);
    --text-color: var(--theme-text, #ffffff);
    --accent-color: #ff4d4d;
    --shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    --transition: all 0.3s ease;
  }

  .content-wrapper {
    display: grid;
    gap: 2rem;
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .game-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-color);
    text-align: center;
  }

  .game-container {
    display: grid;
    gap: 1.5rem;
    justify-items: center;
    padding: 1.5rem;
    background: var(--card-background);
    border-radius: 16px;
    box-shadow: var(--shadow);
  }

  .game-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .volume-control {
    width: 100px;
  }

  .volume-control input {
    width: 100%;
    accent-color: var(--text-color);
  }

  .mute-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-color);
    transition: var(--transition);
  }

  .mute-button:hover,
  .mute-button:focus {
    transform: scale(1.1);
  }

  .mute-button:focus {
    outline: 2px solid var(--text-color);
    outline-offset: 2px;
  }

  .round-info {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--text-color);
  }

  .game-board {
    width: 100%;
    max-width: 400px;
  }

  .box-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    width: 100%;
  }

  .box {
    background: #4a4a4a;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
    width: 100%;
    padding-top: 100%;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  }

  .box:hover {
    background: #5a5a5a;
  }

  .box:focus-visible {
    outline: 2px solid var(--text-color);
    outline-offset: 2px;
  }

  .box.active {
    background: var(--accent-color);
    box-shadow: 0 0 10px var(--accent-color);
    animation: pulse 0.4s ease;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .button-container {
    margin-top: 1rem;
  }

  .btn-start {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    background: var(--text-color);
    color: var(--card-background);
    cursor: pointer;
    transition: var(--transition);
  }

  .btn-start:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  .btn-start:focus {
    outline: 2px solid var(--text-color);
    outline-offset: 2px;
  }

  .btn-start:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  @media (max-width: 600px) {
    .content-wrapper {
      margin: 1rem;
    }

    .game-title {
      font-size: 1.5rem;
    }

    .game-container {
      padding: 1rem;
    }

    .game-board {
      max-width: 300px;
    }

    .box-container {
      gap: 0.3rem;
    }

    .btn-start {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
</style>