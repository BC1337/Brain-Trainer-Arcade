<!-- GameCard.svelte -->
<script>
  import { goto } from '$app/navigation';

  export let games = [];

  function handleClick(game) {
    console.log(`Clicked on ${game.gameTitle}`);
    // Dynamically generate the route based on the game data
    const route = `/${game.gameName.toLowerCase().replace(/\s+/g, '-')}`;
    // Navigate to the generated route
    goto(route);
  }
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
      <button on:click={() => handleClick(game)} class="card-button" aria-label={`Play ${game.gameName} Game`}>Play Game</button>
    </div>
  {/each}
</div>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjust minmax value as needed */
  gap: 20px;
}

.card-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.image-container {
  text-align: center;
  max-width: 100%;
  height: 200px; /* Fixed height for image container */
  overflow: hidden; /* Ensures image does not exceed container height */
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  max-width: 100%;
  max-height: 100%; /* Ensure the image fits within the container */
  border-radius: 5px;
}

.description {
  margin-top: 20px;
  flex-grow: 1; /* Ensures the description takes remaining space */
}

.game-title {
  font-weight: bold;
}

.card-description {
  color: #666;
}

.card-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: center;
}

.card-button:hover {
  background-color: #0056b3;
}
h2{
  color: #f0a500;
}
</style>
