<!-- src/routes/ReactionTime.svelte -->
<script>
    import Layout from '../../layouts/Layout.svelte';
    import { onMount } from 'svelte';

    let gameState = 'preGame';
    let playAreaColor = 'red';
    let startTime;
    let endTime;
    let attempts = [];
    let highScores = [];
    let showEarlyClickAlert = false;
    let timerId;

    function startGame() {
        gameState = 'inGame';
        playAreaColor = 'red'; // Reset play area color
        startTime = null;
        endTime = null;
        attempts = [];
        showEarlyClickAlert = false; // Hide the alert
        clearTimeout(timerId); // Clear any existing timer
        timerId = setTimeout(() => {
            playAreaColor = 'green';
            startTime = Date.now(); // Start tracking response time
            console.log('Game started. Start time:', startTime);
        }, Math.random() * 5000 + 4000); // Random wait time between 4 to 9 seconds
    }

    function handleClick() {
        if (gameState === 'inGame' && playAreaColor === 'green') {
            endTime = Date.now();
            const responseTime = endTime - startTime;
            attempts = [...attempts, responseTime]; // Update attempts array
            highScores = [...highScores, responseTime]; // Update highScores array
            attempts = attempts.slice(-5); // Keep only the last 5 attempts
            highScores.sort((a, b) => a - b); // Sort the high scores in ascending order
            highScores = highScores.slice(0, 5); // Keep only the top 5 high scores
            gameState = 'preGame';
            console.log('Clicked. Response time:', responseTime);
        } else if (gameState === 'inGame' && playAreaColor === 'red') {
            showEarlyClickAlert = true; // Show the alert if clicked too early
            clearTimeout(timerId); // Reset the timer
            timerId = setTimeout(() => {
                playAreaColor = 'green'; // Restart the timer
                startTime = Date.now();
                console.log('Game started. Start time:', startTime);
                showEarlyClickAlert = false; // Hide the alert
            }, Math.random() * 5000 + 4000);
        }
    }

    onMount(() => {
        console.log('Component mounted');
    });
</script>

<head>
    <title>Reaction Timer!</title>
    <meta name="description" content="Test your reaction time with this online game. Click the button as quickly as possible when the countdown reaches zero. Challenge your friends and see who has the fastest reflexes!">
    <meta name="keywords" content="reaction timer, reaction game, reflex game, online game, timer game, reflex test, reaction speed, challenge game">
    <meta name="BC1337" content="BC">
    <!-- Add more meta tags as needed -->
  </head>  

  <Layout>
    <main aria-labelledby="game-title">
        <div class="center-container">
            <section class="game-container">
                <div class="game-title" id="game-title">
                    <h1>Reaction Trainer</h1>
                </div>
                <div class="game-description">
                    <p>Click start, wait for the red box to turn green and don't click too early!</p>
                </div>
                <div class="play-area-container">
                    {#if gameState === 'preGame'}
                        <div class="start-game-modal">
                            <button on:click={startGame}>Start Game</button>
                        </div>
                    {/if}
                    <canvas class="play-area" style="background-color: {playAreaColor}" on:click={handleClick}></canvas>
                    {#if showEarlyClickAlert}
                        <div class="early-click-alert" aria-live="assertive">
                            <p>You clicked too early! Wait for the green color.</p>
                        </div>
                    {/if}
                </div>
                <div class="timer-stats">
                    <div class="stats-container">
                        <div class="high-scores white" aria-labelledby="high-scores-title">
                            <h2 id="high-scores-title">High Scores:</h2>
                            <ol>
                                {#each highScores as score, index}
                                    <li>{index + 1}. {score} milliseconds</li>
                                {/each}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</Layout>


<style>
    .center-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 50px); /* Adjusted height */
    }

    .game-container {
        position: relative;
        display: flex; /* Make the game container flex */
        align-items: center; /* Center the contents vertically */
        flex-direction: column; /* Stack children vertically */
    }

    .game-title {
        margin-bottom: 20px;
        text-align: center;
        color: #fff;
    }

    .game-title h1 {
        margin: 0;
        font-size: 2em;
    }

    .game-description {
        margin-bottom: 20px;
        text-align: center;
        color: #fff;
    }

    .start-game-modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
    }

    .start-game-modal button {
        padding: 15px 25px;
        font-size: 1.5em;
        background-color: #3f51b5;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .start-game-modal button:hover {
        background-color: #303f9f;
    }

    .play-area-container {
        position: relative;
    }

    .play-area {
        width: 300px;
        height: 300px;
        border: 2px solid #3f51b5;
        cursor: pointer;
    }

    .timer-stats {
        flex: 1; /* Take up remaining space */
        padding: 10px;
    }

    .stats-container {
        display: flex;
        justify-content: space-between;
    }

    .high-scores {
        flex: 1;
    }

    .high-scores h2 {
        font-size: 1.5em;
        margin-bottom: 10px;
        color: #FFF;
    }

    .high-scores p {
        font-size: 1.2em;
        margin: 5px 0;
        color: #989191;
    }

    .early-click-alert {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #f44336;
        padding: 20px;
        border-radius: 10px;
        font-size: 1.2em;
        color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .early-click-alert p {
        margin: 0;
        font-weight: bold;
    }
    
    .white {
        color: #fff;
    }
</style>