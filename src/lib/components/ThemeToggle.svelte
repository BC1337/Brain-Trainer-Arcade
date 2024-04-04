<!-- ThemeToggle.svelte -->
<script>
    import { onMount } from 'svelte';
    import Fa from 'svelte-fa';
    import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
  
    let isDarkMode = false;
  
    // Function to toggle dark mode
    function toggle() {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle('dark-mode');
    }
  
    // Function to handle client-side initialization
    function initialize() {
      // Check if running in the browser environment
      if (typeof document !== 'undefined') {
        // Attach event listener to the button
        const button = document.querySelector('button.theme-toggle');
        button.addEventListener('click', toggle);
      }
    }
  
    // Initialize the component on mount
    onMount(() => {
      initialize();
    });
  </script>
  
  <button class="theme-toggle" on:click={toggle}>
    <Fa icon={isDarkMode ? faMoon : faSun} size="2x" /> <!-- Change size here -->
  </button>
  
  <style>
    .theme-toggle {
      position: fixed;
      top: 62px;
      left: 20px;
      z-index: 9999;
      background-color: transparent;
      color: #f0a500; /* Icon color */
      border: none;
      border-radius: 50%; /* Make button round */
      padding: 10px; /* Adjust size */
      cursor: pointer;
    }

    :global(body.dark-mode) {
      background-color: #ffffff;
      color: #bfc2c7;
    }
  </style>
