<script>
  import Layout from '../../layouts/Layout.svelte';
  import Toast from '../../lib/components/Toast.svelte';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let username = '';  // We'll use this field for the username
  let emailValid = true;
  let passwordValid = true;
  let usernameValid = true; // Added validation for username
  let passwordsMatch = true;

  const toastMessage = writable({ message: '', type: '' });

  // Detect and apply theme on mount
  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || !savedTheme;
    document.body.classList.toggle('dark-mode', isDark);
  });

  // Validate the input fields
  const validate = () => {
    emailValid = !!email;
    passwordValid = !!password;
    usernameValid = !!username; // Validate username
    passwordsMatch = password === confirmPassword;
  };

  // Handle form submission
  const handleSubmit = async () => {
    validate();

    if (!emailValid || !passwordValid || !usernameValid || !passwordsMatch) {
      toastMessage.set({ message: 'Please fill in all fields correctly.', type: 'error' });
      setTimeout(() => toastMessage.set({ message: '', type: '' }), 1650);
      return;
    }

    toastMessage.set({ message: 'Signing up...', type: 'success' });

    // Send the form data to the API
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
  email,
  password,
  username
}),

      });

      const result = await response.json();

      if (response.ok) {
        toastMessage.set({ message: result.message, type: 'success' });
        // Optionally, redirect or auto-login user after successful signup
        // Example: window.location.href = "/login";
      } else {
        toastMessage.set({ message: result.message, type: 'error' });
      }

    } catch (error) {
      toastMessage.set({ message: 'An error occurred. Please try again.', type: 'error' });
    }

    setTimeout(() => toastMessage.set({ message: '', type: '' }), 1650);
  };
</script>

<Layout showThemeToggle={true}>
  <div class="signup-container">
    <div class="signup-box">
      <h2>Sign Up</h2>

      <div class="input-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          class="{!emailValid ? 'invalid' : ''}"
          placeholder="Enter your email"
        />
      </div>

      <div class="input-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          class="{!usernameValid ? 'invalid' : ''}" 
          placeholder="Enter your username"
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          class="{!passwordValid ? 'invalid' : ''}"
          placeholder="Enter your password"
        />
      </div>

      <div class="input-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          bind:value={confirmPassword}
          class="{!passwordsMatch ? 'invalid' : ''}"
          placeholder="Confirm your password"
        />
      </div>

      <button on:click={handleSubmit}>Sign Up</button>
    </div>
  </div>

  <Toast message={$toastMessage.message} type={$toastMessage.type} />
</Layout>

<style>
  .signup-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 1rem 1rem;
    transition: background-color 0.3s ease;
  }

  .signup-box {
    color: #000;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 28rem;
    background-color: #f0f0f0;
  }

  .signup-box h2 {
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

</style>
