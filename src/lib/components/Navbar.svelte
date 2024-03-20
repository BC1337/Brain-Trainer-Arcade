<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222; /* Dark gray background */
  padding: 1rem;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Subtle shadow effect */
  transition: background-color 0.3s ease;
}

.navbar:hover {
  background-color: #333; /* Slightly darker background on hover */
}

.nav-brand {
  font-size: 1.8rem; /* Larger font size */
  font-weight: bold;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center; /* Align the text and neon effect vertically */
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
