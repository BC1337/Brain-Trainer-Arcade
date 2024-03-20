<script>
    // Import necessary libraries and define variables
    import { onMount } from 'svelte';
    import Layout from "../../layouts/Layout.svelte";
    import Modal from '../../lib/components/Modal.svelte';
    import wordSets from './wordSets.js';

    // Initialize variables
    let currentWordSet = {};
    let lives = 3;
    let correctGuesses = 0;
    let randomWord = "";
    let wordStatus = {}; // Track the status of each word
    let wordColor = "white"; // Initial color of the word
    let previousColor = ""; // Store the previously used color
    let showModal = false;

    // Function to select a random word set
    const selectRandomWordSet = () => {
        currentWordSet = wordSets[Math.floor(Math.random() * wordSets.length)];
    };

    // Function to generate a random word from the selected word set
    const generateRandomWord = () => {
        randomWord = currentWordSet.words[Math.floor(Math.random() * currentWordSet.words.length)];
        // Change the color of the word
        wordColor = getRandomColor();
    };

    // Function to handle click on "Seen" button
    const handleClickSeen = () => {
        if (wordStatus[randomWord] === "seen") {
            correctGuesses++;
        } else {
            lives--;
        }
        if (lives === 0) {
            showModal = true;
        } else {
            wordStatus[randomWord] = "seen";
            generateRandomWord();
        }
    };

    // Function to handle click on "New" button
    const handleClickNew = () => {
        if (wordStatus[randomWord] !== "seen") {
            correctGuesses++;
        } else {
            lives--;
        }
        if (lives === 0) {
            showModal = true;
        } else {
            wordStatus[randomWord] = "seen";
            generateRandomWord();
        }
    };

    // Function to get a random color for the word
    const getRandomColor = () => {
        const colors = ["#ff0066", "#ff6600", "#cc33ff", "#33cc33", "#0099cc", "#ffcc00"];
        // Remove the previous color from the array if it exists
        const index = colors.indexOf(previousColor);
        if (index !== -1) {
            colors.splice(index, 1);
        }
        // Select a random color from the modified array
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        // Update the previous color for the next iteration
        previousColor = newColor;
        return newColor;
    };

    // Call the function to select a random word set on mount
    onMount(() => {
        selectRandomWordSet();
        generateRandomWord();
        currentWordSet.words.forEach(word => {
            wordStatus[word] = "new";
        });
    });
</script>

<Layout>
    <div class="content-wrapper">
        <!-- Description -->
        <div class="description">
            <p>How to play:</p>
            <p>Remember the name of the word displayed and make the correct choices.</p>
      
        </div>
    
        <!-- Memory Game content -->
        <div class="game-container">
            <div class="memory-container">
                <div class="card">
                    <!-- Apply the color style directly to the random word -->
                    <div class="random-word" style="color: {wordColor}; text-shadow: 0 0 10px {wordColor};">
                        {randomWord}
                    </div>
                    <div class="button-container">
                        <button on:click={handleClickSeen} class="seen">Seen</button>
                        <button on:click={handleClickNew} class="new">New</button>
                    </div>
                    <div class="lives" style="color: white;">
                        Lives: {lives}
                    </div>
                    <div class="correct-guesses" style="color: white;">
                        Correct Guesses: {correctGuesses}
                    </div>
                </div>
            </div>
            {#if showModal}
                <Modal correctGuesses={correctGuesses} onClose={() => showModal = false}/>
            {/if}
        </div>
    </div>
</Layout>

<style>
.content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px; /* Adjust the margin to move the content down */
}

.description {
    text-align: center;
    max-width: 600px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    margin-bottom: -100px; /* Add margin bottom to create space between description and game */
}

.description p:first-child {
    font-size: 24px;
    margin-bottom: 10px;
}

.description p:last-child {
    font-size: 16px;
}

.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px; /* Add margin bottom to create space between description and game */
}

.memory-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.card {
    width: 450px;
    height: 300px;
    background-color: #333;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
}

.random-word {
    font-size: 24px;
    font-weight: bold;
    margin-top: auto;
    margin-bottom: 20px;
    text-align: center;
}

.button-container {
    margin-top: auto;
    display: flex;
}

button {
    padding: 8px 16px;
    margin: 5px;
    border: 1px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button.seen {
    background-color: rgba(188, 22, 22, 0.7);
    color: #fff;
}

button.new {
    background-color: rgba(3, 139, 3, 0.7);
    color: #fff;
}

button:hover {
    border-color: #ccc;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.lives {
    margin-top: auto;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}

.correct-guesses {
    margin-top: auto;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}

</style>
