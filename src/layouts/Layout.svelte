<script>
  import Navbar from "../lib/components/Navbar.svelte";
  import '../routes/styles.css';
  import Footer from "../lib/components/Footer.svelte";
</script>

<div class="page-wrapper">
  <Navbar />

  <main class="main-content">
    <slot />
  </main>

  <div class="footer-separator"></div>
  <Footer />
</div>

<style>
  .page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--background); /* Uses your theme variable */
    color: var(--text); /* Also theme-aware */
  }

  .main-content {
    flex: 1;
  }

  .footer-separator {
    width: 100%;
    height: 2px;
    background-color: #f0a500;
    margin-top: 60px;
  }
</style>
