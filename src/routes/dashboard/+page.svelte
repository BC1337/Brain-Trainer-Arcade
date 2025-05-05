<script>
    import Layout from "../../layouts/Layout.svelte";
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

onMount(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if there's no token
    goto('/login');
  }
});

</script>

<Layout>
   <h1>Suprise motha fucka! :@ ... you just logged in!</h1>

</Layout>
