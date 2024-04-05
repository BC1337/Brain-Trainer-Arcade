<script>
    import Navbar from "../lib/components/Navbar.svelte";
    import '../routes/styles.css'
    import ThemeToggle from "../lib/components/ThemeToggle.svelte";
    import "../routes/styles.css";
</script>

<Navbar />
<ThemeToggle />
<slot />
