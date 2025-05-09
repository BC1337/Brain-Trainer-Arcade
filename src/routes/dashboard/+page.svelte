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
    const storedUsername = localStorage.getItem('username');

    if (!token) goto('/login');
    if (storedUsername) username = storedUsername;

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
  <div class="p-6 max-w-7xl mx-auto text-black dark:text-white space-y-12">

    <!-- Hero -->
    <section class="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 px-6 py-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          🎮 Welcome, <span class="text-orange-500">{username}</span>
        </h1>
        <p class="mt-1 text-gray-700 dark:text-gray-300 text-base">
          Your brain training performance, all in one place.
        </p>
      </div>
      <div class="flex flex-col items-start md:items-end text-sm text-gray-700 dark:text-gray-300 space-y-1 md:text-right">
        <p><span class="font-medium text-gray-900 dark:text-white">🧠 Focus Game:</span> Chimp Test</p>
        <p><span class="font-medium text-gray-900 dark:text-white">📅 Last Login:</span> May 9, 2025</p>
        <p><span class="font-medium text-gray-900 dark:text-white">🔥 Streak:</span> 3 days</p>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-900 px-6 py-8 rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold text-orange-500 mb-6">🕹️ Game Highlights</h2>
    
      <!-- Grid of Resizable Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each games as game}
          <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md shadow-gray-400 dark:shadow-gray-700 border-t-2 border-orange-400 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-gray-500 dark:hover:shadow-gray-800">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">{game.name}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {#if game.key === 'chimp'}
                    Train memory and focus with sequences.
                  {:else if game.key === 'aim'}
                    Improve precision with target practice.
                  {:else if game.key === 'reaction'}
                    Test your speed and reaction time.
                  {:else if game.key === 'memory'}
                    Challenge your short-term memory skills.
                  {:else if game.key === 'verbal'}
                    Boost your verbal memory with word recall.
                  {/if}
                </p>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-800 dark:text-gray-300 mt-4 sm:mt-0">
                <div class="mb-2 sm:mb-0">
                  <span class="font-medium text-orange-500">Your Score:</span>
                  <span class="ml-1">{userScores[game.key]?.rounds ?? '—'}</span>
                </div>
                <div class="mb-2 sm:mb-0">
                  <span class="font-medium text-orange-500">Global Best:</span>
                  <span class="ml-1">
                    {#if globalHighscores[game.key]}
                      {globalHighscores[game.key].rounds}
                      <span class="text-gray-500 dark:text-gray-400">({globalHighscores[game.key].user?.username || 'Unknown'})</span>
                    {:else}
                      —
                    {/if}
                  </span>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
    
    
    <!-- Stats Overview -->
    <section class="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 px-6 py-8 rounded-2xl shadow-md">
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
        <h2 class="text-2xl font-bold text-orange-500 mb-6">📊 Stats Overview</h2>
        <div class="space-y-6">
          <div>
            <p class="text-lg font-medium text-gray-800 dark:text-white mb-1">Total Games Played</p>
            <div class="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
              <div class="bg-orange-500 h-3 rounded-full" style="width: 70%"></div>
            </div>
          </div>
          <div>
            <p class="text-lg font-medium text-gray-800 dark:text-white mb-1">Highscore Progress</p>
            <div class="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
              <div class="bg-green-500 h-3 rounded-full" style="width: 55%"></div>
            </div>
          </div>
        </div>
        <p class="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Your gameplay stats and charts will appear here once you start earning scores!
        </p>
      </div>
    </section>
  </div>
</Layout>
