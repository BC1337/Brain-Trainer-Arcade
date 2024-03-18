<script>
    import Layout from "../layouts/Layout.svelte";
    import '../routes/styles.css'

    import { goto } from '$app/navigation';

     // Function to handle button click event and navigate to /games
     function startPlaying() {
        goto('/games');
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #1f2532; /* Dark blue background */
        color: #fff; /* White text color */
        text-align: center;
    }

    h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-family: 'Arial Black', sans-serif; /* Use a bold font */
    
    }

    p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        line-height: 1.5;
    }

    .highlight {
        font-weight: bold; /* Make the text bold */
        color: #f0a500; /* Match the color of the heading */
    }

    .button {
        background-color: #4caf50; /* Green button */
        color: #fff; /* White text color */
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .button:hover {
        background-color: #388e3c; /* Darker green on hover */
    }
</style>

<Layout>
    <div class="container">
        <h1>Welcome to <span class="highlight">Brain Trainer</span> Arcade!</h1>
        <p>Get ready to <span class="highlight">challenge your mind</span> and have a blast with our collection of <span class="highlight">brain-teasing</span> games! Whether you want to <span class="highlight">sharpen your memory</span>, <span class="highlight">boost your focus</span>, or just have some <span class="highlight">fun</span>, we've got you covered.</p>
        <p>Challenge yourself with a variety of games designed to keep your brain engaged and entertained. It's not just <span class="highlight">entertainment</span> – it's <span class="highlight">beneficial for your cognitive health</span> too!</p>
        <button class="button" on:click={startPlaying}>Start Playing</button>
    </div>
</Layout>
