<script>
  import Navbar from "../lib/components/Navbar.svelte";
  import '../routes/styles.css';
  import Footer from "../lib/components/Footer.svelte";
</script>

<Navbar />
<slot />

<!-- Separator line between content and footer -->
<div class="footer-separator"></div>

<Footer />

<style>
  .footer-separator {
    width: 100%;
    height: 2px;
    background-color: #f0a500; /* your orange accent */
    margin-top: 60px;
  }
</style>
