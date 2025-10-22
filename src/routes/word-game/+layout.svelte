<script>
  // Remove the Header import entirely if you don't want it
  import './app.css'; // make sure this path points to your global CSS
</script>

<main>
  <slot />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 2rem 1rem;
    box-sizing: border-box;
  }
</style>
