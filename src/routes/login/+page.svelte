<script>
  import Layout from '../../layouts/Layout.svelte';
  import Toast from '../../lib/components/Toast.svelte';
  import { writable } from 'svelte/store';

  let email = '';
  let password = '';
  let errorMessage = '';

  const toastMessage = writable({ message: '', type: '' });

  const handleSubmit = () => {
    if (!email || !password) {
      errorMessage = 'Please fill in all fields.';
      toastMessage.set({ message: errorMessage, type: 'error' });
    } else {
      errorMessage = '';
      toastMessage.set({ message: 'Logging in...', type: 'success' });
      console.log('Form submitted:', { email, password });

      setTimeout(() => {
        toastMessage.set({ message: '', type: '' });
      }, 1650);
    }
  };
</script>

<style>
  /* LIGHT MODE (default) */
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    padding: 6rem 1rem 1rem;
    transition: background-color 0.3s ease;
  }

  .login-box {
    background-color: #f0f0f0;
    color: #000;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 28rem;
  }

  .login-box h2 {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #000;
    outline: none;
  }

  input:focus {
    border-color: #f0a500;
    box-shadow: 0 0 0 2px rgba(240, 165, 0, 0.2);
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #16a34a;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  button:hover {
    background-color: #15803d;
  }

  .error-text {
    color: red;
    font-size: 0.875rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  /* DARK MODE based on body.dark-mode */
  :global(body.dark-mode) .login-container {
    background-color: #111;
  }

  :global(body.dark-mode) .login-box {
    background-color: #222;
    color: #fff;
  }

  :global(body.dark-mode) input {
    background-color: #333;
    color: #fff;
    border-color: #555;
  }

  :global(body.dark-mode) input:focus {
    border-color: #f0a500;
  }
</style>

<Layout showThemeToggle={true}>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>

      {#if errorMessage}
        <div class="error-text">{errorMessage}</div>
      {/if}

      <div class="input-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="Enter your email"
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
        />
      </div>

      <button on:click={handleSubmit}>Login</button>
    </div>
  </div>

  <Toast message={$toastMessage.message} type={$toastMessage.type} />
</Layout>
