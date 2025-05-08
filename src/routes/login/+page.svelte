<script>
  import Layout from '../../layouts/Layout.svelte';
  import Toast from '../../lib/components/Toast.svelte';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let emailValid = true;
  let passwordValid = true;

  const toastMessage = writable({ message: '', type: '' });

  onMount(() => {
    if (!localStorage.getItem('theme')) {
      document.body.classList.add('dark-mode');
    }
  });

  const validate = () => {
    emailValid = !!email;
    passwordValid = !!password;
  };

  const handleSubmit = async () => {
    validate();

    if (!emailValid || !passwordValid) {
      toastMessage.set({ message: 'Please fill in all fields.', type: 'error' });
      setTimeout(() => toastMessage.set({ message: '', type: '' }), 1650);
      return;
    }

    toastMessage.set({ message: 'Logging in...', type: 'success' });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        toastMessage.set({ message: data.error || 'Login failed', type: 'error' });
        setTimeout(() => toastMessage.set({ message: '', type: '' }), 1650);
        return;
      }

      // ✅ Store token and username (fallback to email if username not sent)
      localStorage.setItem('token', data.token);
      localStorage.setItem('sessionUser', JSON.stringify(data.user));


      // ✅ Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login request error:', err);
      toastMessage.set({ message: 'Something went wrong', type: 'error' });
      setTimeout(() => toastMessage.set({ message: '', type: '' }), 1650);
    }
  };
</script>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 1rem 1rem;
    transition: background-color 0.3s ease;
  }

  .login-box {
    color: #000;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 28rem;
    background-color: #f0f0f0;
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
    transition: border 0.3s ease;
  }

  input:focus {
    border-color: #f0a500;
    box-shadow: 0 0 0 2px rgba(240, 165, 0, 0.2);
  }

  input.invalid {
    border-color: #dc2626;
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
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
    color: #dc2626;
    font-size: 0.875rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  /* Dark Mode Styles */
  body.dark-mode .login-container {
    background-color: #111;
  }

  body.dark-mode .login-box {
    background-color: #222;
    color: #fff;
  }

  body.dark-mode input {
    background-color: #333;
    color: #fff;
    border-color: #555;
  }

  body.dark-mode input:focus {
    border-color: #f0a500;
    box-shadow: 0 0 0 2px rgba(240, 165, 0, 0.5);
  }

  body.dark-mode input.invalid {
    border-color: #dc2626;
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.5);
  }
</style>

<Layout showThemeToggle={true}>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>

      <div class="input-group">
        <label for="email">Email or Username</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          class:invalid={!emailValid}
          placeholder="Enter your alias"
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          class:invalid={!passwordValid}
          placeholder="Enter your password"
        />
      </div>

      <button on:click={handleSubmit}>Login</button>
    </div>
  </div>

  <Toast message={$toastMessage.message} type={$toastMessage.type} />
</Layout>
