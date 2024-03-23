<script>
    import { createEventDispatcher } from 'svelte';
    import { totalClicks } from '../../routes/aim-trainer/+page.svelte';
  
    // Define closeModal function
    const dispatch = createEventDispatcher();
    const closeModal = () => {
      dispatch('close');
    };
  </script>
  
  <div class="modal">
    <div class="modal-content">
      <h2>Game Stats</h2>
      <!-- Use totalClicks and accuracy here -->
      <p>Total Clicks: {$totalClicks}</p>
      <button on:click={closeModal}>Close</button>
    </div>
  </div>
  
  <style>
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
      color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      text-align: center;
      z-index: 9999; /* Ensure modal is on top of other content */
    }
  
    .modal-content {
      color: white;
    }
  
    button {
      background-color: #4caf50;
      color: white;
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    button:hover {
      background-color: #45a049;
    }
  </style>
  