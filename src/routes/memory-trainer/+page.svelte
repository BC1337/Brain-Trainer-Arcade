<script>
    import { onMount } from 'svelte';
    import Layout from '../../layouts/Layout.svelte';
    import Modal from '../../lib/components/Modal.svelte';
    import wordSets from './wordSets.js';

    let currentWordSet = { words: [] };
    let lives = 3;
    let correctGuesses = 0;
    let randomWord = '';
    let wordStatus = {};
    let showModal = false;
    let feedbackClass = ''; 

    const selectRandomWordSet = () => {
        currentWordSet = wordSets[Math.floor(Math.random() * wordSets.length)];
    };

    const generateRandomWord = () => {
        if (!currentWordSet.words.length) return;
        randomWord = currentWordSet.words[Math.floor(Math.random() * currentWordSet.words.length)];
    };

    const triggerFeedback = (isCorrect) => {
        feedbackClass = isCorrect ? 'flash-correct' : 'flash-wrong';
        setTimeout(() => (feedbackClass = ''), 400);
    };

    const handleClickSeen = () => {
        const isCorrect = wordStatus[randomWord] === 'seen';
        triggerFeedback(isCorrect);
        if (isCorrect) { correctGuesses++; } else { lives--; }
        handleTurnEnd();
    };

    const handleClickNew = () => {
        const isCorrect = wordStatus[randomWord] !== 'seen';
        triggerFeedback(isCorrect);
        if (isCorrect) { correctGuesses++; } else { lives--; }
        handleTurnEnd();
    };

    const handleTurnEnd = () => {
        if (lives <= 0) {
            showModal = true;
        } else {
            wordStatus[randomWord] = 'seen';
            generateRandomWord();
        }
    };

    onMount(() => {
        selectRandomWordSet();
        if (currentWordSet.words.length) {
            currentWordSet.words.forEach(word => { wordStatus[word] = 'new'; });
            generateRandomWord();
        }
    });
</script>

<Layout>
    <main class="game-wrapper">
        <header class="game-header">
            <h1 class="title">Verbal Memory</h1>
            <p class="description">Identify if you've seen the word before.</p>
            
            <div class="stats-bar">
                <div class="stat">
                    <span class="label">Lives</span>
                    <span class="value lives-val" class:low={lives === 1}>{lives}</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                    <span class="label">Score</span>
                    <span class="value score-val">{correctGuesses}</span>
                </div>
            </div>
        </header>

        <section class="game-stage {feedbackClass}">
            <div class="word-container">
                <h2 class="display-word">{randomWord}</h2>
            </div>

            <div class="action-area">
                <button on:click={handleClickSeen} class="btn btn-seen">Seen</button>
                <button on:click={handleClickNew} class="btn btn-new">New</button>
            </div>
        </section>
        
        {#if showModal}
            <Modal {correctGuesses} onClose={() => (showModal = false)} />
        {/if}
    </main>
</Layout>

<style>
    .game-wrapper {
        max-width: 650px; /* Tightened up to keep everything in view */
        margin: 1.5rem auto;
        padding: 0 1rem;
        font-family: system-ui, -apple-system, sans-serif;
    }

    /* HEADER COLORS: Using Orange/Amber for dark-mode and light-mode pop */
    .title {
        font-size: 2.5rem;
        font-weight: 900;
        color: #f59e0b; /* Amber/Orange - Pops on black OR white */
        text-align: center;
        margin-bottom: 0.25rem;
        letter-spacing: -1px;
    }

    .description {
        font-size: 1rem;
        font-weight: 600;
        color: #64748b; /* Medium Slate */
        text-align: center;
        margin-bottom: 2rem;
    }

    /* STATS BAR: Solid background ensures the text is ALWAYS white and readable */
    .stats-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #1e293b; /* Deep Slate */
        padding: 0.75rem 2rem;
        border-radius: 16px;
        gap: 2.5rem;
        width: fit-content;
        margin: 0 auto 2rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    .stat { text-align: center; }
    .stat .label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }
    .stat .value { font-size: 1.8rem; font-weight: 900; display: block; color: #ffffff; }
    
    .lives-val.low { color: #ef4444; } /* Red for danger */
    .stat-divider { width: 2px; height: 35px; background: #334155; }

    /* GAME STAGE: Slate-100 background ensures black text is always readable */
    .game-stage {
        background: #f8fafc; /* Very light slate card */
        border: 3px solid #cbd5e1;
        border-radius: 28px;
        padding: 3rem 1.5rem;
        text-align: center;
        transition: all 0.2s ease;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    .display-word {
        font-size: 3.5rem;
        font-weight: 900;
        color: #0f172a; /* Near-black Slate - Ultimate readability */
        margin: 0 0 2.5rem;
        letter-spacing: -1.5px;
    }

    .action-area { display: flex; gap: 1rem; justify-content: center; }

    .btn {
        padding: 1rem 3rem;
        font-size: 1.25rem;
        font-weight: 800;
        border-radius: 12px;
        cursor: pointer;
        border: none;
        color: white;
        transition: transform 0.1s, filter 0.2s;
    }

    .btn-seen { background: #3b82f6; } /* Royal Blue */
    .btn-new { background: #10b981; }  /* Emerald Green */

    .btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .btn:active { transform: scale(0.95); }

    /* FEEDBACK: Background tints for visual confirmation */
    .flash-correct { background: #dcfce7 !important; border-color: #10b981 !important; }
    .flash-wrong { background: #fee2e2 !important; border-color: #ef4444 !important; animation: shake 0.4s; }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }

    @media (max-width: 600px) {
        .title { font-size: 2rem; }
        .display-word { font-size: 2.5rem; }
        .action-area { flex-direction: column; width: 100%; max-width: 280px; margin: 0 auto; }
        .btn { padding: 0.8rem; width: 100%; }
    }
</style>