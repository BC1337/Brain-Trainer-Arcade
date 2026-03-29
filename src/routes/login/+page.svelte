<script>
  import Layout from '../../layouts/Layout.svelte';
  import Toast from '../../lib/components/Toast.svelte';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  // State management
  let identifier = ''; 
  let password = '';
  let identifierValid = true;
  let passwordValid = true;
  let isLoading = false;

  const toastMessage = writable({ message: '', type: '' });

  // Theme Sync
  onMount(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
  });

  const validate = () => {
    identifierValid = !!identifier.trim();
    passwordValid = !!password.trim();
    return identifierValid && passwordValid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toastMessage.set({ message: 'Please enter your credentials.', type: 'error' });
      return;
    }

    isLoading = true;
    toastMessage.set({ message: 'Verifying...', type: 'success' });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We send the 'identifier' as 'email' to match common backend expectations
        body: JSON.stringify({ email: identifier, password })
      });

      const data = await res.json();

      if (!res.ok) {
        toastMessage.set({ message: data.error || data.message || 'Login failed', type: 'error' });
        isLoading = false;
        return;
      }

      // Successful login - persist session data
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('sessionUser', JSON.stringify(data.user));
        localStorage.setItem('username', data.user.username);
        
        toastMessage.set({ message: 'Redirecting to dashboard...', type: 'success' });
        
        // Small delay so they see the success toast
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (err) {
      console.error('Login Error:', err);
      toastMessage.set({ message: 'Server unreachable. Try again later.', type: 'error' });
    } finally {
      isLoading = false;
    }
  };
</script>

<Layout showThemeToggle={true}>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Login</h1>
        <p>Access your listings and progress</p>
      </div>

      <div class="form-body">
        <div class="input-field">
          <label for="id">Email or Username</label>
          <input
            type="text"
            id="id"
            bind:value={identifier}
            class:invalid={!identifierValid}
            placeholder="e.g. brettc or admin@site.com"
            autocomplete="username"
          />
        </div>

        <div class="input-field">
          <label for="pw">Password</label>
          <input
            type="password"
            id="pw"
            bind:value={password}
            class:invalid={!passwordValid}
            placeholder="••••••••"
            autocomplete="current-password"
            on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button class="submit-btn" on:click={handleSubmit} disabled={isLoading}>
          {#if isLoading}
            <span class="loader"></span>
          {:else}
            Sign In
          {/if}
        </button>
      </div>

      <div class="auth-footer">
        <p>Don't have an account? <a href="/signup">Create one</a></p>
      </div>
    </div>
  </div>

  <Toast message={$toastMessage.message} type={$toastMessage.type} />
</Layout>

<style>
  /* Container with clear color separation */
  .auth-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: #f3f4f6; /* Soft light gray */
    transition: background-color 0.3s ease;
  }

  :global(body.dark-mode) .auth-wrapper {
    background-color: #0d0d0d; /* Deep dark */
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    padding: 3rem 2.5rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  :global(body.dark-mode) .auth-card {
    background: #1a1a1a;
    border-color: #333;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  }

  .auth-header { text-align: center; margin-bottom: 2.5rem; }
  h1 { font-size: 2rem; color: #f0a500; margin: 0; font-weight: 800; letter-spacing: -0.5px; }
  .auth-header p { color: #6b7280; font-size: 0.95rem; margin-top: 0.5rem; }

  .input-field { margin-bottom: 1.5rem; }
  
  label { 
    display: block; 
    font-size: 0.85rem; 
    font-weight: 700; 
    margin-bottom: 0.6rem; 
    color: #374151; 
  }

  :global(body.dark-mode) label { color: #9ca3af; }

  input {
    width: 100%;
    padding: 0.9rem 1.1rem;
    border-radius: 10px;
    border: 2px solid #d1d5db;
    background: #ffffff;
    color: #111827; /* Dark text for light mode */
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  :global(body.dark-mode) input {
    background: #262626;
    border-color: #404040;
    color: #ffffff; /* White text for dark mode */
  }

  input:focus {
    border-color: #f0a500;
    outline: none;
    box-shadow: 0 0 0 4px rgba(240, 165, 0, 0.15);
  }

  input.invalid { border-color: #ef4444; }

  .submit-btn {
    width: 100%;
    padding: 1.1rem;
    background: #16a34a;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 800;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 1rem;
    transition: background 0.2s, transform 0.1s;
  }

  .submit-btn:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .auth-footer {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.95rem;
    color: #6b7280;
  }

  .auth-footer a { color: #f0a500; text-decoration: none; font-weight: 700; }
  .auth-footer a:hover { text-decoration: underline; }

  /* Simple loader for button */
  .loader {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    display: inline-block;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
</style>