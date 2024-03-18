<script>
    // Import necessary libraries and define variables
    import { onMount } from 'svelte';
    import Layout from "../../layouts/Layout.svelte";
    import Modal from '../../lib/components/Modal.svelte';

    let words = [
        "apple", "banana", "orange", "grape", "pineapple", "strawberry", "kiwi", "watermelon", "melon", "peach",
        "plum", "apricot", "blueberry", "blackberry", "raspberry", "pear", "cherry", "mango", "pomegranate", "lemon",
        "lime", "coconut", "fig", "avocado", "nectarine", "cranberry", "cantaloupe", "papaya", "guava", "dragonfruit",
        "passionfruit", "kiwifruit", "tangerine", "lychee", "grapefruit", "starfruit", "persimmon", "boysenberry", "durian",
        "mulberry", "apricot", "gooseberry", "jackfruit", "kumquat", "quince", "rhubarb", "soursop", "ugli fruit", "ackee",
        "breadfruit", "cherimoya", "feijoa", "longan", "mangosteen", "rambutan", "salak", "saskatoonberry", "tamarillo",
        "wolfberry", "aronia", "currant", "elderberry", "loquat", "barberry", "carambola", "sugar-apple", "custard-apple",
        "plantain", "lychee", "persimmon"
    ];

    let lives = 3;
    let correctGuesses = 0;
    let randomWord = "";
    let wordStatus = {}; // Track the status of each word
    let wordColor = "white"; // Initial color of the word
    let previousColor = ""; // Store the previously used color

    const generateRandomWord = () => {
        const reuseWordProbability = 0.25; // 25% chance of reusing a word
        const reuseWord = Math.random() < reuseWordProbability;

        if (reuseWord) {
            const usedWords = Object.keys(wordStatus).filter(word => wordStatus[word] === "seen");
            randomWord = usedWords[Math.floor(Math.random() * usedWords.length)];
        } else {
            do {
                randomWord = words[Math.floor(Math.random() * words.length)];
            } while (randomWord === undefined || randomWord === null);
        }
        // Change the color of the word
        wordColor = getRandomColor();
    };

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

    const handleClickNew = () => {
        if (wordStatus[randomWord] === "new") {
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

    onMount(() => {
        generateRandomWord();
        words.forEach(word => {
            wordStatus[word] = "new";
        });
    });

    let showModal = false;
</script>

<Layout>
    <!-- Memory Game content -->
    <h1 style="color: white; text-align: center;">Memory Game</h1>
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
</Layout>

<style>
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

    h1 {
        text-align: center;
        margin-bottom: 20px;
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
