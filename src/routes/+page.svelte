<script>
    import Layout from "../layouts/Layout.svelte";
    import { goto } from '$app/navigation';

    // Function to handle button click event and navigate to /games
    function startPlaying() {
        goto('/games');
    }
</script>

<style>
    /* CSS Reset */
     h1, p, button {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        box-sizing: border-box;
    }

    /* Container Styles */
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 0 20px;
    }

    /* Adjust the position only for smaller screens */
    @media screen and (max-width: 600px) {
        .container {
            margin-top: 50px;
        }
    }

    /* Header Styles */
    h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: bold;
        color: #888; /* Dark color for better contrast */
        text-align: center;
        animation: fadeInUp 1s ease;
    }

    /* Paragraph Styles */
    p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        line-height: 1.5;
        text-align: center;
        animation: fadeInUp 1s ease;
        animation-delay: 0.5s;
        color: #888; /* Medium color for better contrast */
    }

    /* Highlighted Text Styles */
    .highlight {
        color: #f0a500; /* Highlight color */
    }

    /* Button Styles */
    .button {
        background-color: #4caf50;
        color: #fff;
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        animation: fadeInUp 1s ease;
        animation-delay: 1s;
    }

    .button:hover {
        background-color: #388e3c;
    }

    /* Animation keyframes */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>

<head>
    <title>Brain Trainer - Improve Cognitive Function</title>
    <meta name="description" content="Train your brain with a variety of challenging exercises! Improve memory, attention, and problem-solving skills. Sharpen your mind with fun and engaging puzzles and games.">
    <meta name="keywords" content="brain trainer, cognitive training, memory improvement, attention exercises, problem-solving games, mental agility, brain games, puzzle games, memory games">
    <meta name="BC1337" content="BC">
    <!-- Add more meta tags as needed -->

    <!-- Content Security Policy (CSP) Headers -->
    <!-- Example: <meta http-equiv="Content-Security-Policy" content="default-src 'self'"> -->
</head>

<Layout>
    <div class="container">
        <h1>Welcome to <span class="highlight">Brain Trainer Arcade!</span></h1>
        <p>Get ready to <span class="highlight">challenge your mind</span> and have a blast with our collection of <span class="highlight">brain-teasing games</span>!</p>
        <p>Whether you want to <span class="highlight">sharpen your memory</span>, <span class="highlight">boost your focus</span>, or just have some <span class="highlight">fun</span>, we've got you covered.</p>
        <p>Challenge yourself with a variety of games designed to keep your brain engaged and entertained. It's not just <span class="highlight">entertainment</span> – it's <span class="highlight">beneficial for your cognitive health</span> too!</p>
        <button class="button" on:click={startPlaying}>Start Playing</button>
    </div>
</Layout>
