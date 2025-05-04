<script>
    import Layout from '../../layouts/Layout.svelte';
    import Toast from '../../lib/components/Toast.svelte';
    import { writable } from 'svelte/store';
  
    let username = '';
    let password = '';
    let confirmPassword = '';
  
    let usernameValid = true;
    let passwordValid = true;
    let confirmValid = true;
  
    const toastMessage = writable({ message: '', type: '' });
  
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
  
    const validate = () => {
      usernameValid = !!username;
      passwordValid = passwordRegex.test(password);
      confirmValid = password === confirmPassword && !!confirmPassword;
    };
  
    const handleSubmit = () => {
      validate();
  
      if (!usernameValid || !passwordValid || !confirmValid) {
        toastMessage.set({ message: 'Please correct the highlighted fields.', type: 'error' });
        setTimeout(() => toastMessage.set({ message: '', type: '' }), 1650);
        return;
      }
  
      toastMessage.set({ message: 'Signing up...', type: 'success' });
      console.log('Form submitted:', { username, password });
  
      setTimeout(() => toastMessage.set({ message: '', type: '' }), 1650);
    };
  </script>
  
  <style>
    .signup-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
      padding: 6rem 1rem 1rem;
      transition: background-color 0.3s ease;
    }
  
    .signup-box {
      background-color: #f0f0f0;
      color: #000;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 28rem;
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
  
    .already-signed-up {
      text-align: center;
      margin-top: 1.5rem;
    }
  
    .already-signed-up a {
      color: #f0a500;
      text-decoration: none;
    }
  
    .already-signed-up a:hover {
      color: #ff6347;
    }
  
    :global(body.dark-mode) .signup-container {
      background-color: #111;
    }
  
    :global(body.dark-mode) .signup-box {
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
  box-shadow: 0 0 0 2px rgba(240, 165, 0, 0.5); /* More visible focus ring */
}

:global(body.dark-mode) input.invalid {
  border-color: #dc2626;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.5); /* Brighter red error ring */
}
  </style>
  
  <Layout showThemeToggle={true}>
    <div class="signup-container">
      <div class="signup-box">
        <h2>Sign Up</h2>
  
        <div class="input-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            class:invalid={!usernameValid}
            placeholder="Enter your username"
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
  
        <div class="input-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            bind:value={confirmPassword}
            class:invalid={!confirmValid}
            placeholder="Confirm your password"
          />
        </div>
  
        <button on:click={handleSubmit}>Sign Up</button>
  
        <div class="already-signed-up">
          <p>Already signed up? <a href="/login">Click here to sign in</a></p>
        </div>
      </div>
    </div>
  
    <Toast message={$toastMessage.message} type={$toastMessage.type} />
  </Layout>
  