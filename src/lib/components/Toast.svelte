<!-- Toast.svelte -->
<script>
    export let message;
    export let type; // 'success' or 'error'
  </script>
  
  {#if message && message.trim() !== ''}
    <div class="toast-container {type}">
      <p>{message}</p>
    </div>
  {/if}
  
  <style>
  .toast-container {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    max-width: 90%;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: white;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    background-color: rgba(0, 0, 0, 0.85);
    transition: opacity 0.3s ease-in-out;
  }
  
  .toast-container.success {
    background-color: #16a34a;
  }
  
  .toast-container.error {
    background-color: #dc2626;
  }
  
  .toast-container p {
    margin: 0;
    font-weight: bold;
    text-align: center;
  }
  </style>
  