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

<div class="navbar">
  <div class="left-section">
    <div class="theme-toggle-wrapper">
      <ThemeToggle />
    </div>
    <a href="/" class="nav-brand">
      <p>Brain Trainer</p>
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

<style>
  .navbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    background-color: #222;
    padding: 1rem;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .navbar:hover {
    background-color: #333;
  }

  .left-section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .theme-toggle-wrapper {
    margin-right: 20px;
  }

  .nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: white;
  }

  .nav-items {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    /* spacing handled by gap */
  }

  .nav-link {
    text-decoration: none;
    color: white;
    transition: color 0.3s ease;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: #ff7f50;
  }

  @media (max-width: 500px) {
    .navbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .nav-items {
      justify-content: flex-start;
    }
  }
</style>
