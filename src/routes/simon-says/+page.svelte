<script>
    import { onMount } from 'svelte';
    import Layout from "../../layouts/Layout.svelte";
    import Modal from '../../lib/components/Modal.svelte';

    const gridSize = 5;
    const maxSoundIndex = 9;
    
    // Game State
    let sequence = [];
    let userSequence = [];
    let round = 0;
    let isActive = false;
    let showStartButton = true;
    let isMuted = false;
    let volumeLevel = 0.1;
    let activeBoxIndex = null;
    let showModal = false;
    let isStarting = false;

    // Audio References
    let correctSounds = [];
    let wrongSound;

    onMount(() => {
        // Initialize Audio only on the client to avoid SSR errors
        if (typeof window !== 'undefined') {
            correctSounds = Array.from({ length: maxSoundIndex }, (_, i) => {
                const audio = new Audio(`/GameSounds/game${i + 1}.mp3`);
                audio.preload = 'auto';
                return audio;
            });
            wrongSound = new Audio('/GameSounds/buzzer.mp3');
            wrongSound.preload = 'auto';
            updateVolumes();
        }
    });

    // Reactive statement to handle volume changes
    $: if (correctSounds.length > 0) {
        updateVolumes(isMuted, volumeLevel);
    }

    function updateVolumes(muted, vol) {
        const activeVol = muted ? 0 : vol;
        correctSounds.forEach(s => s.volume = activeVol);
        if (wrongSound) wrongSound.volume = activeVol;
    }

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const playStepSound = async (stepIndex) => {
        if (isMuted || !correctSounds.length) return;
        const soundIdx = stepIndex % maxSoundIndex;
        const sound = correctSounds[soundIdx];
        if (sound) {
            sound.currentTime = 0;
            try {
                await sound.play();
            } catch (e) {
                // Browsers block auto-play until user interacts
            }
        }
    };

    const animateBox = async (index, soundStep) => {
        activeBoxIndex = index;
        await playStepSound(soundStep);
        await wait(400); 
        activeBoxIndex = null;
    };

    const startGame = async () => {
        if (isStarting) return;
        isStarting = true;
        isActive = false;
        round = 0;
        sequence = [];
        userSequence = [];
        showStartButton = false;
        showModal = false;
        await wait(500);
        await nextRound();
        isStarting = false;
    };

    const nextRound = async () => {
        isActive = false; 
        round++;
        userSequence = [];
        sequence = [...sequence, Math.floor(Math.random() * (gridSize * gridSize))];
        
        await wait(600);
        
        for (let i = 0; i < sequence.length; i++) {
            await animateBox(sequence[i], i);
            await wait(100); 
        }
        
        isActive = true;
    };

    const handleBoxClick = async (index) => {
        if (!isActive || activeBoxIndex !== null) return;

        const expectedIndex = sequence[userSequence.length];
        
        if (index === expectedIndex) {
            userSequence.push(index);
            await animateBox(index, userSequence.length - 1);
            
            if (userSequence.length === sequence.length) {
                isActive = false;
                setTimeout(nextRound, 800);
            }
        } else {
            endGame();
        }
    };

    const endGame = () => {
        isActive = false;
        showStartButton = true;
        showModal = true;
        if (!isMuted && wrongSound) {
            wrongSound.currentTime = 0;
            wrongSound.play().catch(() => {});
        }
    };
</script>

<svelte:head>
    <title>Sequential Memory | Cognitive Lab</title>
</svelte:head>

<Layout>
    <main class="game-wrapper">
        <header class="game-header">
            <h1 class="title">Sequential Memory</h1>
            <p class="description">Repeat the sequence as it grows longer.</p>
            
            <div class="top-controls">
                <div class="stat-pill">
                    <span class="label">Round</span>
                    <span class="value">{round}</span>
                </div>
                
                <div class="audio-controls">
                    <button class="icon-btn" on:click={() => isMuted = !isMuted} type="button">
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                    <input 
                        type="range" min="0" max="0.5" step="0.01" 
                        bind:value={volumeLevel} 
                        class="vol-slider"
                    />
                </div>
            </div>
        </header>

        <section class="board-container">
            <div class="grid" style="grid-template-columns: repeat({gridSize}, 1fr);">
                {#each Array(gridSize * gridSize) as _, i}
                    <button
                        class="box"
                        class:active={activeBoxIndex === i}
                        on:click={() => handleBoxClick(i)}
                        disabled={!isActive && activeBoxIndex !== i}
                        type="button"
                    ></button>
                {/each}
            </div>

            {#if showStartButton}
                <div class="overlay">
                    <button class="start-btn" on:click={startGame} disabled={isStarting}>
                        {round === 0 ? 'Start Training' : 'Try Again'}
                    </button>
                </div>
            {/if}
        </section>

        {#if showModal}
            <Modal correctGuesses={round} onClose={() => showModal = false} onRestart={startGame} />
        {/if}
    </main>
</Layout>

<style>
    .game-wrapper {
        max-width: 500px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .title {
        font-size: 2.5rem;
        font-weight: 900;
        color: #f59e0b; /* Amber */
        text-align: center;
        margin-bottom: 0.25rem;
        letter-spacing: -1px;
    }

    .description {
        font-size: 1rem;
        color: #64748b;
        text-align: center;
        margin-bottom: 2rem;
        font-weight: 600;
    }

    .top-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        background: #1e293b;
        padding: 0.75rem 1.25rem;
        border-radius: 12px;
        color: white;
    }

    .stat-pill .label { font-size: 0.65rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; display: block; }
    .stat-pill .value { font-size: 1.5rem; font-weight: 900; line-height: 1; }

    .audio-controls { display: flex; align-items: center; gap: 0.8rem; }
    .icon-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0; }
    .vol-slider { width: 70px; accent-color: #3b82f6; cursor: pointer; }

    .board-container {
        position: relative;
        background: #f8fafc;
        border: 3px solid #cbd5e1;
        border-radius: 24px;
        padding: 1rem;
        aspect-ratio: 1 / 1;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .grid {
        display: grid;
        gap: 10px;
        height: 100%;
        width: 100%;
    }

    .box {
        background: #cbd5e1;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
    }

    .box:hover:not(:disabled) { background: #94a3b8; }
    
    .box.active {
        background: #3b82f6 !important;
        transform: scale(0.96);
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(5px);
        border-radius: 21px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }

    .start-btn {
        padding: 1.2rem 2.8rem;
        font-size: 1.3rem;
        font-weight: 800;
        background: #f59e0b;
        color: white;
        border: none;
        border-radius: 100px;
        cursor: pointer;
        box-shadow: 0 4px 0 #b45309;
        transition: transform 0.1s;
    }

    .start-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
    .start-btn:active { transform: translateY(2px); box-shadow: none; }

    @media (max-width: 500px) {
        .title { font-size: 2rem; }
        .grid { gap: 6px; }
    }
</style>