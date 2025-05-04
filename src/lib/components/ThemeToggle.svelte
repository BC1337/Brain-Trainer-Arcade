<!-- ThemeToggle.svelte -->
<script>
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

  let isDarkMode = false;

  function toggle() {
    // all pages other than aim trainer use this code
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');

    // Below comment is all to do with aim trainer game specifically.
    const wrapper = document.querySelector('.wrapper');
    const playArea = document.getElementById('play-area');
    if (!isDarkMode) {
        wrapper.style.backgroundColor = '#000'; // Dark background color
        playArea.style.borderColor = '#FFF'; // Dark border color
    } else {
        wrapper.style.backgroundColor = '#fff'; // Light background color
        playArea.style.borderColor = '#000'; // Light border color
    }
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
    z-index: 9999;
    background-color: transparent;
    color: #f0a500; /* Icon color */
    border: none;
    border-radius: 50%; /* Make button round */
    padding: 10px; /* Adjust size */
    cursor: pointer;
  }

  :global(body.dark-mode) {
    background-color: rgb(255, 255, 255); /* Change background color for dark mode */
    color: #ffffff; /* Change text color for dark mode */
  }

</style>
