<script>
    import { onMount, onDestroy } from 'svelte';
    import Layout from '../../layouts/Layout.svelte';

    let gameMode = 'letters'; // 'letters' or 'paragraphs'
    let letters = [];
    let currentIndex = 0;
    let timer = 15000; // Default timer in milliseconds (15 seconds)
    let interval;
    let gameActive = false;
    let numCharacters = 10; // Default number of characters to type
    let roundLength = 15; // Default round length in seconds
    let includeLetters = true;
    let includeNumbers = true;
    let includeSymbols = false;
    let caseSensitive = true; // By default, case sensitivity is enabled
    let correctLetters = 0;
    let totalTyped = 0;
    let hiddenInput; // Reference to the hidden input field

    function startGame() {
        // Create and append the hidden input field
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'text';
            hiddenInput.style.position = 'absolute';
            hiddenInput.style.opacity = '0';
            hiddenInput.style.height = '0';
            hiddenInput.style.width = '0';
            hiddenInput.style.zIndex = '-1';
            hiddenInput.addEventListener('keypress', handleKeyPress);
            document.body.appendChild(hiddenInput);
        }
        
        // Focus on the hidden input field to trigger the keyboard on mobile
        hiddenInput.focus();
        
        if (gameMode === 'letters') {
            letters = generateLetters(numCharacters);
        }

        currentIndex = 0;
        timer = roundLength * 1000; // Convert round length to milliseconds
        correctLetters = 0;
        totalTyped = 0;
        gameActive = true;
        interval = setInterval(() => {
            if (timer > 0) {
                timer -= 10; // Decrease timer by 10 milliseconds
            } else {
                endGame("Time's up! Game over.");
            }
        }, 10); // Update every 10 milliseconds
    }

    function generateLetters(numCharacters) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '123456789';
        const symbols = '!@#$%^&*()_+';
        let characters = '';

        if (includeLetters) characters += alphabet;
        if (caseSensitive && includeLetters) characters += lowercaseAlphabet;
        if (includeNumbers) characters += numbers;
        if (includeSymbols) characters += symbols;

        if (!characters) {
            alert("Please select at least one character type.");
            return [];
        }

        const generatedLetters = [];
        for (let i = 0; i < numCharacters; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            generatedLetters.push(characters[randomIndex]);
        }
        return generatedLetters;
    }

    function handleKeyPress(event) {
        if (!gameActive) return; // Ignore key events if the game is not active

        let pressedKey = String.fromCharCode(event.charCode);
        if (!caseSensitive) {
            pressedKey = pressedKey.toUpperCase();
        }
        const validKeys = letters.map(String);
        if (!caseSensitive) {
            validKeys.push(...letters.map(c => c.toLowerCase()));
        }

        if (validKeys.includes(pressedKey)) {
            totalTyped++;
            if (pressedKey === validKeys[currentIndex]) {
                currentIndex++;
                correctLetters++;
                if (currentIndex === letters.length) {
                    endGame("Congratulations! You've won!");
                }
            } else {
                endGame("Game over! You typed the wrong character.");
            }
        }
        
        // Update hidden input value
        hiddenInput.value = validKeys[currentIndex] || '';
    }

    function endGame(message) {
        clearInterval(interval);
        gameActive = false;
        alert(message);
        if (hiddenInput) {
            hiddenInput.blur(); // Remove focus from the hidden input field
        }
    }

    onMount(() => {
        if (typeof window !== 'undefined') {
            document.addEventListener('keydown', handleKeyDown);
        }
    });

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            document.removeEventListener('keydown', handleKeyDown);
        }
        clearInterval(interval);
        if (hiddenInput) {
            hiddenInput.parentNode.removeChild(hiddenInput); // Clean up hidden input field
        }
    });
</script>

<head>
    <title>Type Racer - Test Your Typing Speed!</title>
    <meta name="description" content="Challenge your typing skills with Type Racer! Compete against others in real-time typing races. Improve your typing speed and accuracy as you race against the clock.">
    <meta name="keywords" content="type racer, typing game, typing speed test, typing competition, keyboard game, typing challenge, online game, typing skills, typing practice">
    <meta name="BC1337" content="BC">
</head>

<Layout>
    <div class="container" role="main">
        <div class="card">
            <div class="type-racer">
                <div class="settings">
                    <label for="game-mode">Game Mode:</label>
                    <select id="game-mode" bind:value={gameMode}>
                        <option value="letters">Letters</option>
                    </select>
                    
                    {#if gameMode === 'letters'}
                        <label for="num-characters">Number of Characters:</label>
                        <input type="number" id="num-characters" bind:value={numCharacters} min="1" max="30">
                    
                        <label>
                            <input type="checkbox" bind:checked={includeLetters}>
                            Include Letters
                        </label>
                        
                        <label>
                            <input type="checkbox" bind:checked={includeNumbers}>
                            Include Numbers
                        </label>

                        <label>
                            <input type="checkbox" bind:checked={includeSymbols}>
                            Include Symbols
                        </label>
                        
                        <label>
                            <input type="checkbox" bind:checked={caseSensitive}>
                            Case Sensitive
                        </label>
                    {/if}
                </div>
                <div class="instructions">
                    <p>Instructions: Type the {gameMode} as fast as you can!</p>
                </div>
                {#if gameMode === 'letters'}
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
                {/if}
                {#if !gameActive}
                    <div class="input-area">
                        <button on:click={startGame}>Start</button>
                    </div>
                {/if}
                <div class="timer-bar" style="margin-top: 10px;">
                    <div class="timer-progress" style="width: {((roundLength * 1000 - timer) / (roundLength * 10)).toFixed(3)}%; background-color: {timer > roundLength * 500 ? 'green' : (timer > roundLength * 250 ? 'yellow' : 'red')}"></div>
                </div>
                <div class="timer" style="margin-top: 10px;">Time: {Math.floor(timer / 1000)}s {(timer % 1000).toString().padStart(3, '0')}ms</div>
                <div class="stats" style="margin-top: 10px;">
                <div>Correct Letters: {correctLetters}</div>
                <div>Accuracy: {(totalTyped > 0 ? (correctLetters / totalTyped * 100).toFixed(2) : 0)}%</div>
                <div>Keys Per Minute: {(correctLetters / (roundLength / 60)).toFixed(2)}</div>
                </div>
                </div>
                </div>
                </div>
                </Layout>
                
                <style>
                    .container {
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .card {
                        width: 100%;
                        max-width: 600px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(57, 224, 239, 1.9);
                        padding: 20px;
                        margin: 0; /* Remove margin to ensure it's at the top */
                    }
                    
                    .type-racer {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                    
                    .settings {
                        margin-bottom: 20px;
                        color: #f0a500;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        background-color: #333;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    
                    .settings label {
                        margin-bottom: 5px;
                    }
                    
                    .settings input[type="number"], .settings input[type="checkbox"], .settings select {
                        margin-bottom: 10px;
                    }
                    
                    .settings input[type="number"] {
                        background-color: #666;
                        color: white;
                        border: 1px solid #ccc;
                        border-radius: 3px;
                        padding: 5px;
                    }
                    
                    .settings select {
                        background-color: #666;
                        color: white;
                        border: 1px solid #ccc;
                        border-radius: 3px;
                        padding: 5px;
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
                    
                    .stats {
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
