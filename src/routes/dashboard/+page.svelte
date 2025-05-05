<script>
    import Layout from "../../layouts/Layout.svelte";
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let username = 'Player'; // default fallback
  
    const games = [
      { id: 1, name: 'Aim Trainer' },
      { id: 2, name: 'Chimp Test' },
      { id: 3, name: 'Reaction Time' },
      { id: 4, name: 'Memory Tiles' },
      { id: 5, name: 'Number Hunt' },
      { id: 6, name: 'Reflex Dash' },
    ];
  
    onMount(() => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
  
      if (!token) {
        goto('/login');
      }
  
      if (storedUsername) {
        username = storedUsername;
      }
    });
  </script>
  
  <Layout>
    <div class="p-6 max-w-4xl mx-auto text-black dark:text-white">
      <h1 class="text-3xl font-bold mb-6 text-orange-500">🎮 Welcome, {username}, to your Dashboard!</h1>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {#each games as game}
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-300 dark:border-gray-600">
            <h2 class="text-xl font-semibold mb-2">{game.name}</h2>
            <p><span class="font-bold text-orange-500">Your Highscore:</span> —</p>
            <p><span class="font-bold text-orange-500">Top Global Score:</span> —</p>
            <div class="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">Graph coming soon...</div>
          </div>
        {/each}
      </div>
  
      <div class="mt-10">
        <h2 class="text-2xl font-bold mb-2 text-orange-500">📊 Stats Overview</h2>
        <div class="bg-orange-100 dark:bg-orange-900 text-black dark:text-white px-4 py-3 rounded shadow">
          <strong>📈 Coming Soon:</strong> Your gameplay stats and charts will appear here once you start earning scores!
        </div>
      </div>
    </div>
  </Layout>
  