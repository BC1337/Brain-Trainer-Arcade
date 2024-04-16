<script>
    import { onMount, onDestroy } from 'svelte';
    import Layout from '../../layouts/Layout.svelte';

    let letters = [];
    let currentIndex = 0;
    let timer = 5000; // Timer in milliseconds
    let interval;
    let gameActive = false;

    function startGame() {
        letters = generateLetters();
        currentIndex = 0;
        timer = 5000; // Reset timer to 5 seconds
        gameActive = true;
        interval = setInterval(() => {
            if (timer > 0) {
                timer -= 10; // Decrease timer by 10 milliseconds
            } else {
                clearInterval(interval);
                gameActive = false;
                // Handle game over
            }
        }, 10); // Update every 10 milliseconds
    }

    function generateLetters() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const generatedLetters = [];
        const numBoxes = Math.max(8, Math.min(17, Math.floor(Math.random() * 10) + 8)); 
        for (let i = 0; i < numBoxes; i++) {
            if (Math.random() < 0.35) {
                // Add numbers 1-9 with a 35% chance
                generatedLetters.push(Math.floor(Math.random() * 9) + 1);
            } else {
                // Add a random letter
                const randomIndex = Math.floor(Math.random() * alphabet.length);
                generatedLetters.push(alphabet[randomIndex]);
            }
        }
        return generatedLetters;
    }

    function handleKeyDown(event) {
        if (!gameActive) return; // Ignore key events if the game is not active
        const pressedKey = event.key.toUpperCase();
        const validKeys = [...letters.map(String), ...letters.map(String).map(c => c.toLowerCase())];
        if (validKeys.includes(pressedKey)) {
            if (pressedKey === validKeys[currentIndex]) {
                currentIndex++;
                if (currentIndex === letters.length) {
                    clearInterval(interval);
                    // Handle game won
                    alert("Congratulations! You've won!");
                    gameActive = false;
                }
            } else {
                // Handle incorrect input
                clearInterval(interval);
                gameActive = false;
                alert("Game over! You typed the wrong character.");
            }
        }
    }

    onMount(() => {
        // Only attach the keydown event listener in the browser
        if (typeof window !== 'undefined') {
            document.addEventListener('keydown', handleKeyDown);
        }
    });

    // Cleanup on component destruction
    onDestroy(() => {
        // Only remove the keydown event listener in the browser
        if (typeof window !== 'undefined') {
            document.removeEventListener('keydown', handleKeyDown);
        }
        clearInterval(interval);
    });
</script>

<head>
    <title>Type Racer - Test Your Typing Speed!</title>
    <meta name="description" content="Challenge your typing skills with Type Racer! Compete against others in real-time typing races. Improve your typing speed and accuracy as you race against the clock.">
    <meta name="keywords" content="type racer, typing game, typing speed test, typing competition, keyboard game, typing challenge, online game, typing skills, typing practice">
    <meta name="BC1337" content="BC">
    <!-- Add more meta tags as needed -->
</head>

<Layout>
<div class="container" role="main">
    <h1 class="text-4xl pb-5">Test your typing skills!</h1>
    <div class="card">
        <div class="type-racer">
            <div class="instructions">
                <p>Instructions: Type the letters or numbers as fast as you can!</p>
            </div>
            <div class="game-area" aria-live="assertive" aria-label="Type the following characters:">
                {#each letters as letter, index}
                <div
                    class="letter-box"
                    class:correct={index < currentIndex}
                    class:current={index === currentIndex}
                    class:incorrect={
                    index === currentIndex &&
                    letters[currentIndex] !== undefined &&
                    gameActive
                    }>
                    {letter}
                </div>
                {/each}
            </div>
            {#if !gameActive}
            <div class="input-area">
                <button on:click={startGame}>Start</button>
            </div>
            {/if}
            <div class="timer-bar" style="margin-top: 10px;">
                <div class="timer-progress" style="width: {((5000 - timer) / 50).toFixed(3)}%; background-color: {timer > 2000 ? 'green' : (timer > 1000 ? 'yellow' : 'red')}"></div>
            </div>
            <div class="timer" style="margin-top: 10px;">Time: {Math.floor(timer / 1000)}s {(timer % 1000).toString().padStart(2, '0')}ms</div>
        </div>
        
    </div>
</div>
</Layout>
<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .card {
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(57, 224, 239, 1.9);
        padding: 20px;
    }

    .type-racer {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        font-family: Arial, sans-serif;
    }

    h1{
        color: #f0a500;
    }

    .instructions {
        margin-bottom: 20px;
        color: #f0a500;
    }


    .game-area {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    .letter-box {
        width: 40px;
        height: 40px;
        background-color: #424242;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 20px;
    }

    .correct {
        background-color: lightgreen;
    }

    .incorrect {
        background-color: #ffcccc; /* Red background for incorrect letters */
    }

    .current {
        background-color: rgb(97, 178, 206); /* Light blue background for the current letter */
    }

    .timer-bar {
        width: 100%;
        height: 20px;
        background-color: #f2f2f2;
        border-radius: 5px;
        overflow: hidden;
    }

    .timer-progress {
        height: 100%;
        transition: width 1s linear; /* Smooth transition animation */
        border-radius: 5px;
    }

    .timer {
        font-size: 20px;
        color: #f0a500;
    }

    button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>