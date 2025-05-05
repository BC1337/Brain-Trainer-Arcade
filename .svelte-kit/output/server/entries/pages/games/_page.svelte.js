import { c as create_ssr_component, d as each, b as add_attribute, e as escape, v as validate_component } from "../../../chunks/ssr.js";
import { L as Layout } from "../../../chunks/Layout.js";
import "../../../chunks/client2.js";
const css$1 = {
  code: ".grid-container.svelte-1oixgze.svelte-1oixgze{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:20px}.card-container.svelte-1oixgze.svelte-1oixgze{border:1px solid #ccc;border-radius:5px;box-shadow:0 0 5px rgba(0, 0, 0, 0.1);padding:20px;display:flex;flex-direction:column}.image-container.svelte-1oixgze.svelte-1oixgze{text-align:center;max-width:100%;height:200px;overflow:hidden;display:flex;justify-content:center;align-items:center}.image-container.svelte-1oixgze img.svelte-1oixgze{max-width:100%;max-height:100%;border-radius:5px}.description.svelte-1oixgze.svelte-1oixgze{margin-top:20px;flex-grow:1}.game-title.svelte-1oixgze.svelte-1oixgze{font-weight:bold}.card-description.svelte-1oixgze.svelte-1oixgze{color:#666}.card-button.svelte-1oixgze.svelte-1oixgze{margin-top:10px;padding:5px 10px;background-color:#16a34a;color:#fff;border:none;border-radius:5px;cursor:pointer;align-self:center}.card-button.svelte-1oixgze.svelte-1oixgze:hover{background-color:#15803d}h2.svelte-1oixgze.svelte-1oixgze{color:#f0a500}",
  map: '{"version":3,"file":"Gamecard.svelte","sources":["Gamecard.svelte"],"sourcesContent":["<!-- GameCard.svelte -->\\n<script>\\n  import { goto } from \'$app/navigation\';\\n\\n  export let games = [];\\n\\n  function handleClick(game) {\\n    console.log(`Clicked on ${game.gameTitle}`);\\n    // Dynamically generate the route based on the game data\\n    const route = `/${game.gameName.toLowerCase().replace(/\\\\s+/g, \'-\')}`;\\n    // Navigate to the generated route\\n    goto(route);\\n  }\\n<\/script>\\n\\n<div class=\\"grid-container\\" role=\\"list\\">\\n  {#each games as game}\\n    <div class=\\"card-container\\" role=\\"listitem\\" aria-label={game.gameName}>\\n      <div class=\\"image-container\\">\\n        <img src={game.imageSrc} alt=\\"\\" role=\\"presentation\\">\\n      </div>\\n      <div class=\\"description\\">\\n        <div class=\\"game-title\\">\\n          <h2>{game.gameName}</h2>\\n        </div>\\n        <div class=\\"card-description\\">\\n          <p>{game.gameDescription}</p>\\n        </div>\\n      </div>\\n      <button on:click={() => handleClick(game)} class=\\"card-button\\" aria-label={`Play ${game.gameName} Game`}>Play Game</button>\\n    </div>\\n  {/each}\\n</div>\\n\\n<style>\\n.grid-container {\\n  display: grid;\\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjust minmax value as needed */\\n  gap: 20px;\\n}\\n\\n.card-container {\\n  border: 1px solid #ccc;\\n  border-radius: 5px;\\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);\\n  padding: 20px;\\n  display: flex;\\n  flex-direction: column;\\n}\\n\\n.image-container {\\n  text-align: center;\\n  max-width: 100%;\\n  height: 200px; /* Fixed height for image container */\\n  overflow: hidden; /* Ensures image does not exceed container height */\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n}\\n\\n.image-container img {\\n  max-width: 100%;\\n  max-height: 100%; /* Ensure the image fits within the container */\\n  border-radius: 5px;\\n}\\n\\n.description {\\n  margin-top: 20px;\\n  flex-grow: 1; /* Ensures the description takes remaining space */\\n}\\n\\n.game-title {\\n  font-weight: bold;\\n}\\n\\n.card-description {\\n  color: #666;\\n}\\n\\n.card-button {\\n  margin-top: 10px;\\n  padding: 5px 10px;\\n  background-color: #16a34a;\\n  color: #fff;\\n  border: none;\\n  border-radius: 5px;\\n  cursor: pointer;\\n  align-self: center;\\n}\\n\\n.card-button:hover {\\n  background-color: #15803d;\\n}\\nh2{\\n  color: #f0a500;\\n}\\n</style>\\n"],"names":[],"mappings":"AAmCA,6CAAgB,CACd,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,QAAQ,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CAC3D,GAAG,CAAE,IACP,CAEA,6CAAgB,CACd,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CACtB,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtC,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAClB,CAEA,8CAAiB,CACf,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,KAAK,CACb,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MACf,CAEA,+BAAgB,CAAC,kBAAI,CACnB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,CAChB,aAAa,CAAE,GACjB,CAEA,0CAAa,CACX,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,CACb,CAEA,yCAAY,CACV,WAAW,CAAE,IACf,CAEA,+CAAkB,CAChB,KAAK,CAAE,IACT,CAEA,0CAAa,CACX,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,gBAAgB,CAAE,OAAO,CACzB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,MACd,CAEA,0CAAY,MAAO,CACjB,gBAAgB,CAAE,OACpB,CACA,gCAAE,CACA,KAAK,CAAE,OACT"}'
};
const Gamecard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { games = [] } = $$props;
  if ($$props.games === void 0 && $$bindings.games && games !== void 0) $$bindings.games(games);
  $$result.css.add(css$1);
  return `  <div class="grid-container svelte-1oixgze" role="list">${each(games, (game) => {
    return `<div class="card-container svelte-1oixgze" role="listitem"${add_attribute("aria-label", game.gameName, 0)}><div class="image-container svelte-1oixgze"><img${add_attribute("src", game.imageSrc, 0)} alt="" role="presentation" class="svelte-1oixgze"></div> <div class="description svelte-1oixgze"><div class="game-title svelte-1oixgze"><h2 class="svelte-1oixgze">${escape(game.gameName)}</h2></div> <div class="card-description svelte-1oixgze"><p>${escape(game.gameDescription)}</p> </div></div> <button class="card-button svelte-1oixgze"${add_attribute("aria-label", `Play ${game.gameName} Game`, 0)}>Play Game</button> </div>`;
  })} </div>`;
});
const css = {
  code: "h1.svelte-1bofsfo{margin-top:50px;text-align:center}.highlight.svelte-1bofsfo{color:#f0a500;padding:0 5px}span.svelte-1bofsfo{color:grey}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n  import Layout from \\"../../layouts/Layout.svelte\\";\\n  import GameCard from \\"../../lib/components/Gamecard.svelte\\";\\n  \\n  // Array of game objects\\n  let games = [\\n      {\\n          gameName: 'Chimp test',\\n          gameDescription: 'Are you a monkey\\\\'s uncle...? The results will speak for themselves.',\\n          imageSrc: 'https://images.pexels.com/photos/1123771/pexels-photo-1123771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'\\n      },\\n      {\\n          gameName: 'Type Racer',\\n          gameDescription: 'Put your typing skills to the test',\\n          imageSrc: 'https://images.pexels.com/photos/373072/pexels-photo-373072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'\\n      },\\n      {\\n          gameName: 'Memory Trainer',\\n          gameDescription: 'Flex your mental muscles to go the distance in this game.',\\n          imageSrc: 'https://images.pexels.com/photos/577513/pexels-photo-577513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'\\n      },\\n      {\\n          gameName: 'Simon Says',\\n          gameDescription: 'Test your short term memory with this classic',\\n          imageSrc: '/simon-says.jpg'\\n      },\\n      {\\n          gameName: 'Aim Trainer',\\n          gameDescription: 'How about testing that hand eye coordination',\\n          imageSrc: 'https://images.pexels.com/photos/416832/pexels-photo-416832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'\\n      },\\n      {\\n          gameName: 'Reaction Timer',\\n          gameDescription: 'Wait for the light to turn from red to green and see how fast you click!',\\n          imageSrc: 'https://images.pexels.com/photos/1727004/pexels-photo-1727004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'\\n      },\\n\\n      // Add more game objects as needed\\n  ];\\n<\/script>\\n\\n<head>\\n  <title>Games Hub - Play Free Online Games!</title>\\n  <meta name=\\"description\\" content=\\"Welcome to the Games Hub! Play a wide variety of free online games including puzzles, strategy games, action games, arcade classics, and more. Challenge your friends, test your skills, and have fun!\\">\\n  <meta name=\\"keywords\\" content=\\"online games, free games, browser games, puzzle games, strategy games, action games, arcade games, multiplayer games, single player games, casual games, fun games\\">\\n  <meta name=\\"BC1337\\" content=\\"BC\\">\\n  <!-- Add more meta tags as needed -->\\n</head>\\n\\n<Layout>\\n  <main aria-label=\\"Games Hub\\">\\n    <h1>\\n        <span class=\\"highlight\\">Enjoy</span>\\n        <span>some</span>\\n        <span>Brain</span>\\n        <span class=\\"highlight\\">Games</span>\\n        <span>and</span>\\n        <span>continue to</span>\\n        <span class=\\"highlight\\">Level up</span>\\n        <span>!</span>\\n    </h1>\\n    <br>\\n      <GameCard games={games} />\\n  </main>\\n</Layout>\\n\\n<style>\\n  h1 {\\n        margin-top: 50px;\\n        text-align: center; /* Center the text */\\n    }\\n\\n    .highlight {\\n        color: #f0a500; /* Orange color */\\n        padding: 0 5px; /* Add spacing */\\n    }\\n    span{\\n        color: grey;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAmEE,iBAAG,CACG,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,MAChB,CAEA,yBAAW,CACP,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,CAAC,CAAC,GACf,CACA,mBAAI,CACA,KAAK,CAAE,IACX"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let games = [
    {
      gameName: "Chimp test",
      gameDescription: "Are you a monkey's uncle...? The results will speak for themselves.",
      imageSrc: "https://images.pexels.com/photos/1123771/pexels-photo-1123771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      gameName: "Type Racer",
      gameDescription: "Put your typing skills to the test",
      imageSrc: "https://images.pexels.com/photos/373072/pexels-photo-373072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      gameName: "Memory Trainer",
      gameDescription: "Flex your mental muscles to go the distance in this game.",
      imageSrc: "https://images.pexels.com/photos/577513/pexels-photo-577513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      gameName: "Simon Says",
      gameDescription: "Test your short term memory with this classic",
      imageSrc: "/simon-says.jpg"
    },
    {
      gameName: "Aim Trainer",
      gameDescription: "How about testing that hand eye coordination",
      imageSrc: "https://images.pexels.com/photos/416832/pexels-photo-416832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      gameName: "Reaction Timer",
      gameDescription: "Wait for the light to turn from red to green and see how fast you click!",
      imageSrc: "https://images.pexels.com/photos/1727004/pexels-photo-1727004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  $$result.css.add(css);
  return `<head data-svelte-h="svelte-1c5nwn3"><title>Games Hub - Play Free Online Games!</title> <meta name="description" content="Welcome to the Games Hub! Play a wide variety of free online games including puzzles, strategy games, action games, arcade classics, and more. Challenge your friends, test your skills, and have fun!"> <meta name="keywords" content="online games, free games, browser games, puzzle games, strategy games, action games, arcade games, multiplayer games, single player games, casual games, fun games"> <meta name="BC1337" content="BC"> </head> ${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<main aria-label="Games Hub"><h1 class="svelte-1bofsfo" data-svelte-h="svelte-15kvq4u"><span class="highlight svelte-1bofsfo">Enjoy</span> <span class="svelte-1bofsfo">some</span> <span class="svelte-1bofsfo">Brain</span> <span class="highlight svelte-1bofsfo">Games</span> <span class="svelte-1bofsfo">and</span> <span class="svelte-1bofsfo">continue to</span> <span class="highlight svelte-1bofsfo">Level up</span> <span class="svelte-1bofsfo">!</span></h1> <br> ${validate_component(Gamecard, "GameCard").$$render($$result, { games }, {}, {})}</main>`;
    }
  })}`;
});
export {
  Page as default
};
