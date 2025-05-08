<script>
  import Layout from '../../layouts/Layout.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let username = 'Player';  // Default fallback
  let userScores = {};
  let globalHighscores = {};

  const games = [
    { key: 'chimp', name: 'Chimp Test' },
    { key: 'aim', name: 'Aim Trainer' },
    { key: 'reaction', name: 'Reaction Time' },
    { key: 'memory', name: 'Memory Matrix' },
    { key: 'verbal', name: 'Verbal Memory' }
  ];

  onMount(async () => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');  // Get username from localStorage

    if (!token) goto('/login');  // Redirect to login if no token
    if (storedUsername) username = storedUsername;  // Set username from localStorage

    await Promise.all(games.map(async ({ key }) => {
      if (key === 'chimp') {
        await loadGlobalHighscore(key);
        await loadUserScore(key);
      } else {
        globalHighscores[key] = null;
        userScores[key] = null;
      }
    }));
  });

  async function loadGlobalHighscore(gameKey) {
    try {
      const res = await fetch(`/api/highscore/${gameKey}`);
      const data = await res.json();
      if (res.ok) {
        globalHighscores[gameKey] = data.highscores?.[0] || null;
      } else {
        console.error(`Failed to fetch global score for ${gameKey}:`, data.error);
      }
    } catch (err) {
      console.error(`Error loading global highscore for ${gameKey}:`, err);
    }
  }

  async function loadUserScore(gameKey) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/user/highscore/${gameKey}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await res.json();
      if (res.ok) {
        userScores[gameKey] = data.highscore || null;
      } else {
        console.error(`Failed to fetch user score for ${gameKey}:`, data.error);
      }
    } catch (err) {
      console.error(`Error loading user highscore for ${gameKey}:`, err);
    }
  }
</script>

<Layout>
  <div class="p-6 max-w-5xl mx-auto text-black dark:text-white">
    <h1 class="text-4xl font-extrabold mb-8 text-orange-500">🎮 Welcome, {username}!</h1>

    <!-- Game Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each games as game}
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{game.name}</h2>

          <div class="text-lg space-y-1">
            <p>
              <span class="font-medium text-orange-500">Your Highscore:</span>
              <span class="ml-2">{userScores[game.key]?.rounds ?? '—'}</span>
            </p>
            <p>
              <span class="font-medium text-orange-500">Top Global:</span>
              {#if globalHighscores[game.key]}
                <span class="ml-2">{globalHighscores[game.key].rounds}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">(by {globalHighscores[game.key].user?.username || 'Unknown'})</span>
              {:else}
                <span class="ml-2">—</span>
              {/if}
            </p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Stats Overview -->
    <div class="mt-12">
      <h2 class="text-3xl font-bold mb-4 text-orange-500">📊 Stats Overview</h2>
      <div class="bg-orange-100 dark:bg-orange-900 text-black dark:text-white px-6 py-4 rounded-xl shadow-sm">
        <strong class="text-lg">📈 Coming Soon:</strong>
        <p class="mt-1 text-base">Your gameplay stats and charts will appear here once you start earning scores!</p>
      </div>
    </div>
  </div>
</Layout>
