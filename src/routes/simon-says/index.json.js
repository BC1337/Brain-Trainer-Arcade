// src/routes/simon-says/index.json.js

export function get() {
    return {
      body: {
        // Provide initial state here
        gridSize: 5,
        maxSoundIndex: 9,
        currentSoundIndex: 1,
        sequence: [],
        userSequence: [],
        round: 0,
        isActive: false,
        showStartButton: true,
      }
    };
  }
  