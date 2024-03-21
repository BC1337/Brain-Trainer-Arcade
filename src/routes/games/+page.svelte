<script>
    import Layout from "../../layouts/Layout.svelte";
    import GameCard from "../../lib/components/Gamecard.svelte";
 // Array of game objects
 let games = [
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
      gameName: 'Aim Trainer',
      gameDescription: 'How about testing that hand eye coordination',
      imageSrc: 'https://images.pexels.com/photos/416832/pexels-photo-416832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    // Add more game objects as needed
  ];
</script>

<Layout>
  <h1>Enjoy some brain games and continue to level up!</h1>
  <GameCard games={games} />
</Layout>

<style>

</style>
