<!-- Toast.svelte -->
<script>
    export let message;
    export let type; // 'success' or 'error'
</script>
  
{#if message && message.trim() !== ''}
<div class="toast-container">
    <div class="toast {type}">
        <p class:success={type === 'success'} class:error={type === 'error'}>{message}</p>
    </div>
</div>
{/if}
  
<style>
.toast-container {
    position: absolute;
    top: calc(50% - 50px); /* Center vertically */
    left: calc(50% - 150px); /* Center horizontally */
    width: 300px; /* Adjust the width of the toast container */
}

.toast {
    padding: 20px;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent background */
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 1); /* Add shadow for depth */
}

.toast p {
    margin: 0;
}

.toast p.success {
    color: #4caf50; /* Green text color for success toast */
    font-weight: bold;
}

.toast p.error {
    color: #e02d20; /* Red text color for error toast */
    font-weight: bold;
}
</style>
