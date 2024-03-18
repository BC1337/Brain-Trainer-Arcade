<style>
  /* Navbar styles */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    padding: 1rem;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease;
  }

  .navbar:hover {
    background-color: rgba(0, 0, 0, 0.7); /* Darker background on hover */
  }

  .nav-brand {
    font-size: 1.8rem; /* Larger font size */
    font-weight: bold;
    text-decoration: none;
    color: white;
    display: flex;
    align-items: center; /* Align the neon effect vertically */
  }

  .neon-letter {
    color: #00ffff; /* Neon blue color */
    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; /* Neon glow effect */
    transition: transform 0.3s ease; /* Smooth transition for transform property */
  }

  .nav-brand:hover .neon-letter {
    transform: translateY(-10px); /* Move the neon letter up when hovered */
  }

  .nav-items {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    margin-left: 2rem; /* Increased spacing between items */
  }

  .nav-link {
    text-decoration: none;
    color: white;
    transition: color 0.3s ease;
  }

  .nav-link:hover {
    color: #ff7f50; /* Change to your preferred hover color */
  }

  /* Animation for "C1337" */
  @keyframes dropAndBounce {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    50% {
      opacity: 1;
      transform: translateY(0);
    }
    75% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }

</style>

<div class="navbar">
  <a href="/" class="nav-brand">
    <span class="neon-letter">B</span>rain Trainer
  </a>
  <ul class="nav-items">
    <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="/games" class="nav-link">Games</a></li>
    <!-- Add more navigation items here -->
  </ul>
</div>
