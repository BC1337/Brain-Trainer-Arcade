<script>
  import Navbar from "../lib/components/Navbar.svelte";
  import Footer from "../lib/components/Footer.svelte";
  import '../routes/styles.css';
</script>

<div class="page-wrapper">
  <Navbar />

  <main class="main-content">
    <slot />
  </main>

  <Footer />
</div>

<style>
  /* Use body variables directly, so dark/light toggle works */
  .page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    background: inherit; /* inherit from body */
    color: inherit; /* inherit from body */
    transition: background 0.3s ease, color 0.3s ease;
  }

  .main-content {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center; /* center your slot content */
    padding: 2rem 1rem;
  }

  /* Keep your max width for content */
  .main-content > * {
    max-width: 480px;
    width: 100%;
  }

  /* Footer stays at bottom */
  footer {
    width: 100%;
  }
</style>
