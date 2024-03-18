<!-- Modal.svelte -->
<script>
    export let correctGuesses;
    export let onClose;

    console.log("Correct Guesses in Modal:", correctGuesses); // Debugging statement
</script>

<div class="modal">
    <div class="modal-content">
        <h2><span style="color: red;">Game Over</span></h2>
        <p>Sorry, you have run out of lives. Your final score is {correctGuesses}.</p>
        <button on:click={onClose}>Close</button>
    </div>
</div>

<style>
    /* CSS */
    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    }

    .modal-content {
        background-color: #f8f9fa;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        color: #333; /* Update text color to black */
    }

    button {
        padding: 8px 16px;
        margin-top: 10px;
        border: 1px solid transparent;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: #007bff;
        color: #fff;
    }

    button:hover {
        border-color: #0056b3;
        background-color: #0056b3;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
</style>
