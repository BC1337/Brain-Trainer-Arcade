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
      // Force a reload or redirect to clear state across the app
      window.location.href = '/';
    }
  };
</script>

<div class="navbar">
  <div class="left-section">
    <div class="theme-toggle-wrapper">
      <ThemeToggle />
    </div>
    <a href="/" class="nav-brand">
      <span class="orange">Brain</span> <span class="green">Trainer</span>
    </a>
  </div>

  <ul class="nav-items">
    <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="/games" class="nav-link">Games</a></li>
    
    <li class="nav-item"><a href="/dashboard" class="nav-link">Dashboard</a></li>

    {#if token}
      <li class="nav-item">
        <a href="/" class="nav-link logout-text" on:click|preventDefault={logout}>Logout</a>
      </li>
    {:else}
      <li class="nav-item"><a href="/login" class="nav-link">Login</a></li>
      <li class="nav-item">
        <a href="/signup" class="nav-link signup-highlight">Sign Up</a>
      </li>
    {/if}
  </ul>
</div>

<style>
  .navbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    background-color: #0a0a0c; /* Matching your dashboard dark theme */
    padding: 1rem 2rem;
    color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid #26262b;
    width: 100%;
    box-sizing: border-box;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-brand {
    font-size: 1.5rem;
    font-weight: 900;
    text-decoration: none;
    color: white;
    letter-spacing: -1px;
  }

  .orange { color: #FF8C00; }
  .green { color: #16a34a; }

  .nav-items {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    text-decoration: none;
    color: #94a3b8;
    font-weight: 800;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: #FF8C00;
  }

  .signup-highlight {
    background: #16a34a;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
  }

  .signup-highlight:hover {
    background: #18b653;
    color: white;
    transform: translateY(-1px);
  }

  .logout-text {
    color: #ef4444;
  }

  @media (max-width: 600px) {
    .navbar {
      padding: 1rem;
    }
    .nav-items {
      gap: 0.8rem;
    }
    .nav-link {
      font-size: 0.75rem;
    }
  }
</style>