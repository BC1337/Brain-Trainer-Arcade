<script>
    import Navbar from "../lib/components/Navbar.svelte";
    import '../routes/styles.css'
    import ThemeToggle from "../lib/components/ThemeToggle.svelte";
</script>

<Navbar />
<slot />
<ThemeToggle />