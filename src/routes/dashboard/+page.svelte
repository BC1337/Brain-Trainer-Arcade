<script>
    import Layout from "../../layouts/Layout.svelte";
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let username = 'Player'; // default fallback
    let globalHighscores = [];
    let userScores = {};
    let globalAverages = {};
  
    const games = [
      { id: 1, name: 'Aim Trainer' },
      { id: 2, name: 'Chimp Test' },
      { id: 3, name: 'Reaction Time' },
      { id: 4, name: 'Memory Tiles' },
      { id: 5, name: 'Number Hunt' },
      { id: 6, name: 'Reflex Dash' },
    ];
  
    onMount(async () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
  
      if (!token) {
        goto('/login');
      }
  
      if (storedUsername) {
        username = storedUsername;
      }
  
      await loadGlobalHighscores(); // Fetch the global highscores when the dashboard loads
      await loadUserScores(); // Fetch the logged-in user's scores
      await calculateGlobalAverages(); // Calculate global averages for all games
    });
  
    async function loadGlobalHighscores() {
      try {
        const response = await fetch('/api/highscore/chimp');
        const data = await response.json();
  
        if (response.ok) {
          globalHighscores = data.highscores || [];
        } else {
          console.error('Failed to fetch global highscores:', data.error);
        }
      } catch (err) {
        console.error('Error loading global highscores:', err);
      }
    }
  
    async function loadUserScores() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/highscore', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        const data = await response.json();
  
        if (response.ok) {
          userScores = data.highscore || {};
        } else {
          console.error('Failed to fetch user highscore:', data.error);
        }
      } catch (err) {
        console.error('Error loading user highscore:', err);
      }
    }
  
    async function calculateGlobalAverages() {
      try {
        for (let game of games) {
          const response = await fetch(`/api/highscore/${game.name.toLowerCase()}/average`);
          const data = await response.json();
  
          if (response.ok) {
            globalAverages[game.name] = data.average || 0;
          } else {
            console.error(`Failed to fetch global average for ${game.name}:`, data.error);
          }
        }
      } catch (err) {
        console.error('Error calculating global averages:', err);
      }
    }
  </script>
  
  <Layout>
    <div class="p-6 max-w-4xl mx-auto text-black dark:text-white">
      <h1 class="text-3xl font-bold mb-6 text-orange-500">🎮 Welcome, {username}, to your Dashboard!</h1>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {#each games as game}
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-300 dark:border-gray-600">
            <h2 class="text-xl font-semibold mb-2">{game.name}</h2>
            <p><span class="font-bold text-orange-500">Your Highscore:</span> {userScores[game.name]?.rounds || '—'}</p>
            <p><span class="font-bold text-orange-500">Top Global Score:</span> {globalHighscores[game.name]?.rounds || '—'}</p>
            <p><span class="font-bold text-orange-500">Global Average:</span> {globalAverages[game.name] || '—'}</p>
          </div>
        {/each}
      </div>
  
      {#if globalHighscores.length > 0}
        <div class="highscore-board mt-10">
          <h2 class="text-2xl font-bold text-orange-500 mb-4">Global Top 10 – Chimp Test</h2>
          <ol>
            {#each globalHighscores as score}
              <li>{score.user.username} — {score.rounds} rounds</li>
            {/each}
          </ol>
        </div>
      {/if}
  
      <div class="mt-10">
        <h2 class="text-2xl font-bold mb-2 text-orange-500">📊 Stats Overview</h2>
        <div class="bg-orange-100 dark:bg-orange-900 text-black dark:text-white px-4 py-3 rounded shadow">
          <strong>📈 Coming Soon:</strong> Your gameplay stats and charts will appear here once you start earning scores!
        </div>
      </div>
    </div>
  </Layout>
  
  <style>
    .highscore-board {
      background: #1e1e1e;
      padding: 16px;
      border-radius: 10px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
      color: #fff;
    }
  
    .highscore-board h2 {
      font-size: 18px;
      margin-bottom: 12px;
      color: #f0a500;
    }
  
    .highscore-board ol {
      list-style: decimal;
      padding-left: 20px;
      text-align: left;
    }
  
    .highscore-board li {
      padding: 4px 0;
    }
  </style>
  