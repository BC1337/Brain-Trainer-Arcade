<!-- src/lib/components/Modal.svelte -->
<script>
  export let correctGuesses = 0;
  export let onClose = () => {};
  export let onRestart = () => {};

  console.log("Correct Guesses in Modal:", correctGuesses); // Debugging statement

  function handleRestart() {
    onClose();
    onRestart();
  }
</script>

<div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <div class="modal-content">
    <h2 id="modal-title"><span style="color: var(--accent-color, #ff4d4d);">Game Over</span></h2>
    <p>You reached round {correctGuesses || 0}.</p>
    <div class="modal-buttons">
      <button class="btn btn-restart" on:click={handleRestart} aria-label="Restart game">Restart</button>
      <button class="btn btn-close" on:click={onClose} aria-label="Close modal">Close</button>
    </div>
  </div>
</div>

<style>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
  }

  .modal-content {
    background-color: var(--card-background, #2a2a2a);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    color: var(--text-color, #ffffff);
    max-width: 400px;
    width: 90%;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    font-weight: 500;
  }

  .btn-restart {
    background-color: var(--accent-color, #ff4d4d);
    color: #fff;
  }

  .btn-close {
    background-color: var(--text-color, #ffffff);
    color: var(--card-background, #2a2a2a);
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }

  .btn:focus {
    outline: 2px solid var(--text-color, #ffffff);
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    .modal-content {
      padding: 15px;
    }

    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }

    .btn {
      padding: 6px 12px;
      font-size: 0.9rem;
    }
  }
</style>