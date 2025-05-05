<script>
  import { onMount } from 'svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  let token = null;

  onMount(() => {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
  });

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      token = null;
    }
  };
</script>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #222;
    padding: 1rem;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease;
  }

  .navbar:hover {
    background-color: #333;
  }

  .left-section {
    display: flex;
    align-items: center;
  }

  .theme-toggle-wrapper {
    margin-right: 25px;
  }

  .nav-brand {
    font-size: 1.8rem;
    font-weight: bold;
    text-decoration: none;
    color: white;
    display: flex;
    align-items: center;
  }

  .nav-items {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    margin-left: 2rem;
  }

  .nav-link {
    text-decoration: none;
    color: white;
    transition: color 0.3s ease;
  }

  .nav-link:hover {
    color: #ff7f50;
  }
</style>

<div class="navbar">
  <div class="left-section">
    <div class="theme-toggle-wrapper">
      <ThemeToggle />
    </div>
    <a href="/" class="nav-brand">
      <p> Bain Trainer </p>
    </a>
  </div>

  <ul class="nav-items">
    <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="/games" class="nav-link">Games</a></li>

    {#if token}
      <li class="nav-item"><a href="/profile" class="nav-link">Profile</a></li>
      <li class="nav-item"><a href="#" class="nav-link" on:click={logout}>Logout</a></li>
    {:else}
      <li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
      <li class="nav-item"><a href="/signup" class="nav-link">Sign Up</a></li>
    {/if}
  </ul>
</div>
