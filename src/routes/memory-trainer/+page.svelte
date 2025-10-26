<!-- src/lib/VerbalMemoryTrainer.svelte -->
<script>
    import { onMount } from 'svelte';
    import Layout from '../../layouts/Layout.svelte';
    import Modal from '../../lib/components/Modal.svelte';
    import wordSets from './wordSets.js';

    let currentWordSet = {};
    let lives = 3;
    let correctGuesses = 0;
    let randomWord = '';
    let wordStatus = {};
    let wordColor = 'var(--primary-color)';
    let previousColor = '';
    let showModal = false;

    const selectRandomWordSet = () => {
        currentWordSet = wordSets[Math.floor(Math.random() * wordSets.length)];
    };

    const generateRandomWord = () => {
        randomWord = currentWordSet.words[Math.floor(Math.random() * currentWordSet.words.length)];
        wordColor = getRandomColor();
    };

    const handleClickSeen = () => {
        if (wordStatus[randomWord] === 'seen') {
            correctGuesses++;
        } else {
            lives--;
        }
        if (lives === 0) {
            showModal = true;
        } else {
            wordStatus[randomWord] = 'seen';
            generateRandomWord();
        }
    };

    const handleClickNew = () => {
        if (wordStatus[randomWord] !== 'seen') {
            correctGuesses++;
        } else {
            lives--;
        }
        if (lives === 0) {
            showModal = true;
        } else {
            wordStatus[randomWord] = 'seen';
            generateRandomWord();
        }
    };

    const getRandomColor = () => {
        const colors = [
            'var(--accent-pink)',
            'var(--accent-orange)',
            'var(--accent-purple)',
            'var(--accent-green)',
            'var(--accent-blue)',
            'var(--accent-yellow)',
        ];
        const index = colors.indexOf(previousColor);
        if (index !== -1) {
            colors.splice(index, 1);
        }
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        previousColor = newColor;
        return newColor;
    };

    onMount(() => {
        selectRandomWordSet();
        generateRandomWord();
        currentWordSet.words.forEach(word => {
            wordStatus[word] = 'new';
        });
    });
</script>

<head>
    <title>Verbal Memory Trainer - Boost Your Recall</title>
    <meta name="description" content="Sharpen your verbal memory with this engaging trainer. Test your recall with words and track your progress." />
    <meta name="keywords" content="verbal memory, memory game, word recall, cognitive training, brain exercise" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<Layout>
    <main class="content-wrapper" aria-labelledby="game-title">
        <h1 class="game-title" id="game-title">Verbal Memory Trainer</h1>
        <section class="description" aria-labelledby="how-to-play">
            <h2 id="how-to-play">How to Play</h2>
            <p>Test your memory by identifying whether each word is new or previously seen.</p>
        </section>

        <section class="game-container" aria-label="Word guessing game">
            <div class="memory-container">
                <div class="card">
                    <h3 class="random-word" style="color: {wordColor};" aria-live="polite">{randomWord}</h3>
                    <div class="button-container">
                        <button
                            on:click={handleClickSeen}
                            class="btn btn-seen"
                            aria-label="Mark word as seen"
                        >
                            Seen
                        </button>
                        <button
                            on:click={handleClickNew}
                            class="btn btn-new"
                            aria-label="Mark word as new"
                        >
                            New
                        </button>
                    </div>
                    <div class="stats">
                        <p class="lives" aria-label="Remaining lives">Lives: {lives}</p>
                        <p class="correct-guesses" aria-label="Correct guesses">Score: {correctGuesses}</p>
                    </div>
                </div>
            </div>
            {#if showModal}
                <Modal correctGuesses={correctGuesses} onClose={() => (showModal = false)} />
            {/if}
        </section>
    </main>
</Layout>

<style>
    :root {
        --background-color: var(--theme-background, #1a1a1a);
        --card-background: var(--theme-card, #2a2a2a);
        --text-color: var(--theme-text, #ffffff);
        --primary-color: #ff4d4d; /* Match AimTrainer's red accent */
        --accent-pink: #ff0066;
        --accent-orange: #ff6600;
        --accent-purple: #cc33ff;
        --accent-green: #33cc33;
        --accent-blue: #0099cc;
        --accent-yellow: #ffcc00;
        --shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        --transition: all 0.3s ease;
    }

    .content-wrapper {
        display: grid;
        gap: 2rem;
        max-width: 1000px; /* Match AimTrainer */
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .game-title {
        font-size: 2rem;
        font-weight: 600;
        color: var(--text-color);
        text-align: center;
    }

    .description {
        text-align: center;
        padding: 1.5rem;
        background: var(--card-background);
        border-radius: 12px;
        box-shadow: var(--shadow);
    }

    .description h2 {
        font-size: 1.75rem;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }

    .description p {
        font-size: 1rem;
        color: var(--text-color);
        opacity: 0.9;
    }

    .game-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
    }

    .memory-container {
        width: 100%;
        max-width: 600px; /* Cap for long words */
        min-width: 300px;
    }

    .card {
        background: var(--card-background);
        border-radius: 16px;
        box-shadow: var(--shadow);
        padding: 2rem;
        display: grid;
        gap: 1.5rem;
        text-align: center;
        transition: var(--transition);
        width: 100%;
    }

    .random-word {
        font-size: 2rem;
        font-weight: 600;
        transition: opacity 0.5s ease;
        animation: fadeIn 0.5s ease-in;
        word-break: break-word; /* Wrap long words */
        overflow-wrap: anywhere; /* Ensure wrapping */
        line-height: 1.2;
        margin: 0 auto;
        max-width: 100%; /* Prevent overflow */
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .button-container {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: var(--transition);
    }

    .btn-seen {
        background: var(--accent-pink);
        color: var(--text-color);
    }

    .btn-new {
        background: var(--accent-green);
        color: var(--text-color);
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow);
    }

    .btn:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }

    .stats {
        display: flex;
        justify-content: space-between;
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--text-color);
    }

    .lives,
    .correct-guesses {
        margin: 0;
    }

    @media (max-width: 600px) {
        .content-wrapper {
            margin: 1rem;
        }

        .game-title {
            font-size: 1.5rem;
        }

        .card {
            padding: 1.5rem;
            max-width: 90vw; /* Adjust for mobile */
        }

        .random-word {
            font-size: 1.5rem; /* Smaller font for long words on mobile */
        }

        .btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }

        .description {
            padding: 1rem;
        }

        .description h2 {
            font-size: 1.5rem;
        }

        .description p {
            font-size: 0.9rem;
        }
    }
</style>