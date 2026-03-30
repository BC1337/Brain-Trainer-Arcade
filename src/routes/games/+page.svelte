<script>
  import Layout from "../../layouts/Layout.svelte";
  import GameCard from "../../lib/components/Gamecard.svelte";

  let games = [
      {
          gameName: 'Chimp test',
          gameDescription: 'Are you a monkey\'s uncle...? The results will speak for themselves.',
          imageSrc: 'https://images.pexels.com/photos/1123771/pexels-photo-1123771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
          gameName: 'Word-Game',
          gameDescription: 'This is a completely orginal game that is totally not a wordle clone. Unless your a lawyer, then yes its a wordle clone',
          imageSrc: 'https://cdn.pixabay.com/photo/2017/06/06/19/39/scrabble-2378253_960_720.jpg'
      },
      {
          gameName: 'Aim Trainer',
          gameDescription: 'How about testing that hand eye coordination',
          imageSrc: 'https://images.pexels.com/photos/416832/pexels-photo-416832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
          gameName: 'Connections',
          gameDescription: 'Play Connections: Group 16 words into 4 themed categories. A daily word puzzle inspired by The New York Times.',
          imageSrc: 'https://cdn.pixabay.com/photo/2020/04/22/09/38/circuits-5076887_960_720.png'
      },
      {
          gameName: 'Type Racer',
          gameDescription: 'Put your typing skills to the test',
          imageSrc: 'https://images.pexels.com/photos/373072/pexels-photo-373072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
          gameName: 'Memory Trainer',
          gameDescription: 'Flex your mental muscles to go the distance in this game.',
          imageSrc: 'https://images.pexels.com/photos/577513/pexels-photo-577513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
          gameName: 'Simon Says',
          gameDescription: 'Test your short term memory with this classic',
          imageSrc: '/simon-says.jpg'
      },
      {
          gameName: 'Reaction Timer',
          gameDescription: 'Wait for the light to turn from red to green and see how fast you click!',
          imageSrc: 'https://images.pexels.com/photos/1727004/pexels-photo-1727004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
  ];
</script>

<head>
  <title>Games Hub - Play Free Online Games!</title>
  <meta name="description" content="Welcome to the Games Hub! Play a wide variety of free online games including puzzles, strategy games, action games, arcade classics, and more. Challenge your friends, test your skills, and have fun!">
  <meta name="keywords" content="online games, free games, browser games, puzzle games, strategy games, action games, arcade games, multiplayer games, single player games, casual games, fun games">
  <meta name="BC1337" content="BC">
</head>

<Layout>
  <main aria-label="Games Hub">
    <h1>
        <span class="highlight">Enjoy</span>
        <span>some</span>
        <span>Brain</span>
        <span class="highlight">Games</span>
        <span>and</span>
        <span>continue to</span>
        <span class="highlight">Level up</span>
        <span>!</span>
    </h1>
    <br>
    <GameCard {games} />
  </main>
</Layout>

<style>
h1 {
  margin-top: 50px;
  text-align: center;
}
.highlight {
  color: #f0a500;
  padding: 0 5px;
}
span {
  color: grey;
}
</style>
