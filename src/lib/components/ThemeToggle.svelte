<script>
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

  let isDarkMode = false;

  // Function to toggle the theme
  function toggle() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);

    // Save the theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }

  // On mount, check if there's a saved theme preference
  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    isDarkMode = savedTheme === 'dark';
    document.body.classList.toggle('dark-mode', isDarkMode);
  });
</script>

<button class="theme-toggle" on:click={toggle}>
  <Fa icon={isDarkMode ? faMoon : faSun} size="2x" />
</button>

<style>
  .theme-toggle {
    z-index: 9999;
    background-color: transparent;
    color: #f0a500;
    border: none;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
  }

  :global(body.dark-mode) {
    background-color: rgb(255, 255, 255); /* Light background color for dark mode */
    color: #ffffff;
  }

  /* Add smooth transition for background color change */
  body {
    transition: background-color 0.3s ease, color 0.3s ease;
  }
</style>
