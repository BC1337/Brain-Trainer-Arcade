<script>
  import { goto } from '$app/navigation';
  export let games = [];
</script>

<div class="grid-container" role="list">
  {#each games as game}
    <div class="card-container" role="listitem" aria-label={game.gameName}>
      <div class="image-container">
        <img src={game.imageSrc} alt="" role="presentation">
      </div>
      <div class="description">
        <div class="game-title">
          <h2>{game.gameName}</h2>
        </div>
        <div class="card-description">
          <p>{game.gameDescription}</p>
        </div>
      </div>
      <button 
        on:click={() => goto(`/${game.gameName.toLowerCase().replace(/\s+/g, '-')}`)} 
        class="card-button" 
        aria-label={`Play ${game.gameName} Game`}>
        Play Game
      </button>
    </div>
  {/each}
</div>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.image-container {
  text-align: center;
  max-width: 100%;
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
}

.description {
  margin-top: 20px;
  flex-grow: 1;
}

.game-title h2 {
  color: #f0a500;
}

/* Perfect readability for dark & light mode */
.card-description p {
  color: #aaa; /* base color */
  text-shadow: 
    0 1px 1px rgba(0,0,0,0.25),  /* subtle shadow for dark mode */
    0 -1px 0 rgba(255,255,255,0.05); /* tiny lift for light mode */
}

.card-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #16a34a;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: center;
}

.card-button:hover {
  background-color: #15803d;
}
</style>
