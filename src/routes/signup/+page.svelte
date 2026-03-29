<script>
  import Layout from '../../layouts/Layout.svelte';
  import Toast from '../../lib/components/Toast.svelte';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  // Form State
  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';
  
  // Validation State
  let errors = { email: '', username: '', password: '', confirm: '' };
  let isLoading = false;

  const toastMessage = writable({ message: '', type: '' });

  onMount(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
  });

  const validate = () => {
    let valid = true;
    errors = { email: '', username: '', password: '', confirm: '' };

    if (!email.includes('@') || email.length < 5) {
      errors.email = "Please enter a valid email address.";
      valid = false;
    }
    if (username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
      valid = false;
    }
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      valid = false;
    }
    if (password !== confirmPassword) {
      errors.confirm = "Passwords do not match.";
      valid = false;
    }
    
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toastMessage.set({ message: 'Please fix the errors below.', type: 'error' });
      return;
    }

    isLoading = true;

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toastMessage.set({ message: 'Success! Logging you in...', type: 'success' });
        
        // Persist session
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.username);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        // If the server sends an error (like "User already exists"), show it
        toastMessage.set({ message: result.error || 'Signup failed', type: 'error' });
      }
    } catch (error) {
      toastMessage.set({ message: 'Network error. Is the server running?', type: 'error' });
    } finally {
      isLoading = false;
    }
  };
</script>

<Layout showThemeToggle={true}>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Create Account</h1>
        <p>Join the maintenance & dev portal</p>
      </div>

      <div class="form-body">
        <div class="input-field">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            class:invalid={errors.email}
            placeholder="brett@example.com"
          />
          {#if errors.email}<span class="err-text">{errors.email}</span>{/if}
        </div>

        <div class="input-field">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            class:invalid={errors.username}
            placeholder="Choose a display name"
          />
          {#if errors.username}<span class="err-text">{errors.username}</span>{/if}
        </div>

        <div class="input-field">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            class:invalid={errors.password}
            placeholder="Min. 6 characters"
          />
          {#if errors.password}<span class="err-text">{errors.password}</span>{/if}
        </div>

        <div class="input-field">
          <label for="confirm">Confirm Password</label>
          <input
            type="password"
            id="confirm"
            bind:value={confirmPassword}
            class:invalid={errors.confirm}
            placeholder="Repeat your password"
            on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {#if errors.confirm}<span class="err-text">{errors.confirm}</span>{/if}
        </div>

        <button class="submit-btn" on:click={handleSubmit} disabled={isLoading}>
          {#if isLoading}
            <span class="loader"></span>
          {:else}
            Register Now
          {/if}
        </button>
      </div>

      <div class="auth-footer">
        <p>Already have an account? <a href="/login">Sign In</a></p>
      </div>
    </div>
  </div>

  <Toast message={$toastMessage.message} type={$toastMessage.type} />
</Layout>

<style>
  .auth-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: #f3f4f6;
  }

  :global(body.dark-mode) .auth-wrapper { background-color: #0d0d0d; }

  .auth-card {
    width: 100%;
    max-width: 440px;
    background: #ffffff;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  :global(body.dark-mode) .auth-card {
    background: #1a1a1a;
    border-color: #333;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  }

  .auth-header { text-align: center; margin-bottom: 2rem; }
  h1 { font-size: 2rem; color: #16a34a; margin: 0; font-weight: 800; }
  .auth-header p { color: #6b7280; font-size: 0.9rem; margin-top: 0.4rem; }

  .input-field { margin-bottom: 1.25rem; position: relative; }
  label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.4rem; color: #374151; text-transform: uppercase; }
  :global(body.dark-mode) label { color: #9ca3af; }

  input {
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    border: 2px solid #d1d5db;
    background: #ffffff;
    color: #111827;
    font-size: 1rem;
  }

  :global(body.dark-mode) input { background: #262626; border-color: #404040; color: #ffffff; }
  input:focus { border-color: #16a34a; outline: none; }
  input.invalid { border-color: #ef4444; }

  .err-text {
    color: #ef4444;
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.25rem;
    display: block;
  }

  .submit-btn {
    width: 100%;
    padding: 1.1rem;
    background: #16a34a;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 800;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .submit-btn:disabled { opacity: 0.6; }

  .auth-footer { margin-top: 1.8rem; text-align: center; color: #6b7280; }
  .auth-footer a { color: #16a34a; text-decoration: none; font-weight: 700; }

  .loader {
    width: 18px;
    height: 18px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    display: inline-block;
    animation: spin 1s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
</style>