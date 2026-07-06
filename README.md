# Floppy Bird - Web Game

A modern, production-level Flappy Bird game built with vanilla HTML5, CSS3, and JavaScript. Play directly in your browser without any dependencies or installations.

## Features

- 🎮 **Smooth Gameplay** - Responsive flight mechanics with realistic gravity and physics
- 🎨 **Beautiful UI** - Modern gradient design with polished animations and particle effects
- 📱 **Fully Responsive** - Adapts seamlessly to desktop, tablet, and mobile screens
- 🏆 **High Score Tracking** - Persistent best score saved in browser localStorage
- ⚡ **Performance Optimized** - Lightweight and fast, runs smoothly on all devices
- 🎯 **Landscape Layout** - Wide gaming canvas for better visibility

## How to Play

1. **Open** `index.html` in your web browser
2. **Start** - Press Space, click, or tap the screen to flap
3. **Navigate** - Avoid the green pipes by flapping through the gaps
4. **Score** - Each pipe passed increases your score
5. **Game Over** - Hitting a pipe or the ground ends the game
6. **Restart** - Click the "Restart Game" button to play again

## Controls

- **Space Bar** - Flap / Restart
- **Mouse Click** - Flap / Restart
- **Touch** - Flap / Restart (Mobile)
- **Reset Button** - Restart the game

## Project Structure

```
flappy-bird-project/
├── index.html      # Game HTML structure
├── script.js       # Game logic and mechanics
├── styles.css      # Responsive styling
└── README.md       # Documentation
```

## Technical Details

### Canvas Resolution
- Landscape: 640 × 400 pixels
- Responsive scaling on all screen sizes

### Game Mechanics
- **Gravity**: 1800 px/s²
- **Flap Force**: -320 px/s
- **Max Fall Speed**: 620 px/s
- **Pipe Gap**: 186 pixels
- **Spawn Interval**: 1.35 seconds

### Technologies Used
- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript** - Game logic and physics
- **CSS3** - Responsive design with gradients and animations
- **localStorage API** - Persistent high score storage

## Features Breakdown

### Animation System
- Smooth gravity-based flight physics
- Wing flapping animations
- Particle burst effects on events
- Screen shake on collision
- Parallax scrolling clouds

### UI/UX
- Clean, modern header with score display
- High score tracking with localStorage
- Clear game instructions
- Prominent restart button
- Accessibility-friendly layout

### Responsiveness
- Mobile-first design approach
- Adapts to portrait and landscape modes
- Works on screens as small as 360px to 4K displays
- Touch-friendly button sizing

## Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Installation

No installation required! Simply:

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start playing!

```bash
git clone https://github.com/ananta224/floppy-bird-web.git
cd flappy-bird-project
# Open index.html in your browser
```

## File Descriptions

### index.html
- Game HTML structure
- Canvas element (640×400)
- Score and best score display
- Control instructions
- Restart button

### script.js
- Complete game logic and physics engine
- Event listeners for user input
- Game state management
- High score persistence
- Animation loop and timing

### styles.css
- Responsive grid and flexbox layout
- Gradient backgrounds and effects
- Media queries for mobile optimization
- Button styling and hover effects
- Canvas and control area styling

## High Score

Your best score is automatically saved and persists between sessions using the browser's localStorage API. It displays as "Best" in the top-right corner.

## Performance

- Optimized for 60 FPS gameplay
- Delta-time based frame updates for smooth motion
- Efficient collision detection
- Minimal memory footprint

## Game Tips

- **Tap Early** - Time your flaps to navigate through pipes smoothly
- **Focus** - Keep your eyes on the gaps, not the pipes
- **Rhythm** - Develop a consistent flapping pattern for better scores
- **Practice** - Each session helps you improve your timing

## License

This project is open source and available for personal and educational use.

## Author

Created as a modern, production-ready web game implementation.

---

**Enjoy the game! 🚀**
