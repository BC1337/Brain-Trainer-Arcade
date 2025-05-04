<script>
    // Future logic can go here
  </script>
  
  <footer>
    <div class="footer-content">
      <p>&copy;Brain Trainer Arcade 2025 All rights reserved.</p>
      <p>
        Crafted by <a href="https://github.com/bc1337" target="_blank" rel="noopener noreferrer" class="bc1337">BC1337</a>
      </p>
  
      <div class="social-links">
        <a href="https://github.com/bc1337" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="BrainTrainerArcade@proton.me">Contact</a>
      </div>
    </div>
  </footer>
  
  <style>
    footer {
      background: linear-gradient(to top, #111, #1a1a1a); /* Dark gradient */
      color: #fff;
      padding: 30px 20px;
      text-align: center;
      font-size: 14px;
      border-top: 1px solid #333;
    }
  
    .footer-content a {
      color: #fff;
      text-decoration: none;
      font-weight: 500;
      position: relative;
    }
  
    .footer-content a::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 2px;
      background-color: transparent;
      transition: background-color 0.2s ease;
    }
  
    .footer-content a:hover::after {
      background-color: #f0a500; /* Orange underline */
    }
  
    .social-links a {
      margin: 0 10px;
      color: #fff;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
      position: relative;
    }
  
    .social-links a::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 2px;
      background-color: transparent;
      transition: background-color 0.2s ease;
    }
  
    .social-links a:hover::after {
      background-color: #f0a500; /* Orange underline */
    }
  
    .bc1337 {
      color: #f0a500; /* Orange text for BC1337 */
    }
  
    footer p {
      margin-bottom: 10px;
      color: #ccc;
    }
  
    footer p:first-child::after {
      content: '';
      display: block;
      width: 50px;
      height: 2px;
      background-color: #f0a500; /* Orange line under copyright */
      margin: 8px auto 0;
    }
  </style>
  