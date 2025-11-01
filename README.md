# Flight Yoke Web Game

## Overview
The Flight Yoke Web Game is a simple web-based flight simulator that allows players to control a small airplane using the Logitech Flight Yoke system. Players can explore a vast sky from a first-person perspective, experiencing the thrill of flying.

## Project Structure
```
flight-yoke-webgame
├── src
│   ├── index.html          # Main HTML document for the game
│   ├── styles
│   │   └── main.css       # CSS styles for the game
│   ├── js
│   │   ├── main.js        # Entry point for the JavaScript code
│   │   ├── engine.js      # Game engine logic
│   │   ├── game
│   │   │   ├── airplane.js # Airplane class for controlling movement
│   │   │   ├── world.js    # World class for managing the environment
│   │   │   └── camera.js   # Camera class for first-person view
│   │   ├── input
│   │   │   └── flightYoke.js # Input handling for the Flight Yoke system
│   │   └── ui
│   │       └── hud.js      # Heads-up display management
│   └── types
│       └── index.d.ts      # TypeScript type definitions
├── public
│   └── manifest.json       # Web app manifest
├── package.json            # npm configuration file
├── .gitignore              # Files to ignore in version control
├── .vscode
│   └── launch.json         # Debugging configuration
└── README.md               # Project documentation
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies using npm:
   ```
   npm install
   ```
4. Open `src/index.html` in a web browser to start the game.

## Gameplay
- Use the Logitech Flight Yoke to control the airplane.
- Explore the sky and enjoy the immersive flying experience.
- The heads-up display (HUD) will show your speed and altitude.

## Contributing
Feel free to submit issues or pull requests to improve the game!