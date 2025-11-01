import { readFlightYokeInput, initFlightYoke, getFlightYokeStatus } from './input/flightYoke.js';
import { ThreeScene } from './scene/ThreeScene.js';
import { Airplane } from './game/Airplane.js';
import { Environment } from './game/Environment.js';

class Game {
    constructor() {
        // Initialize Three.js scene
        this.container = document.createElement('div');
        this.container.style.width = '100vw';
        this.container.style.height = '100vh';
        document.body.appendChild(this.container);
        
        this.scene = new ThreeScene(this.container);
        this.airplane = new Airplane(this.scene.scene);
        this.environment = new Environment(this.scene.scene);
        
        // Initialize yoke detection
        initFlightYoke({ debug: true });
        
        // Create status panel
        this.createStatusPanel();
        
        // Start game loop
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    createStatusPanel() {
        this.status = document.createElement('div');
        this.status.id = 'yoke-status';
        this.status.style.position = 'fixed';
        this.status.style.right = '12px';
        this.status.style.top = '12px';
        this.status.style.minWidth = '220px';
        this.status.style.padding = '8px 10px';
        this.status.style.background = 'rgba(0,0,0,0.6)';
        this.status.style.color = '#fff';
        this.status.style.fontFamily = 'monospace';
        this.status.style.fontSize = '12px';
        this.status.style.borderRadius = '6px';
        this.status.style.zIndex = 1000;
        this.status.innerHTML = '<strong>Flight Yoke</strong><br>status: initializing...';
        document.body.appendChild(this.status);
    }
    
    formatConnected(connected) {
        if (!connected || connected.length === 0) return 'none';
        return connected.map(c => `${c.index}: ${c.id} (axes:${c.axes} btns:${c.buttons})`).join('<br>');
    }
    
    updateStatusPanel(input) {
        const st = getFlightYokeStatus();
        const deviceName = st.detectedId || 'Not detected';
        const connectedHtml = this.formatConnected(st.connected);
        const axesHtml = `roll: ${input.roll.toFixed(3)}<br>pitch: ${input.pitch.toFixed(3)}<br>yaw: ${input.yaw.toFixed(3)}<br>throttle: ${input.throttle.toFixed(3)}`;
        const pos = this.airplane.getPosition();
        const posHtml = `x: ${pos.x.toFixed(0)}<br>y: ${pos.y.toFixed(0)}<br>z: ${pos.z.toFixed(0)}`;
        
        this.status.innerHTML = `
            <strong>Flight Yoke</strong><br>
            device: ${deviceName}<br><br>
            <strong>Axes</strong><br>
            ${axesHtml}<br><br>
            <strong>Position</strong><br>
            ${posHtml}<br><br>
            <strong>Connected</strong><br>
            ${connectedHtml}
        `;
    }
    
    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Read input
        const input = readFlightYokeInput() || { throttle: 0, pitch: 0, roll: 0, yaw: 0 };
        
        // Update game state
        this.airplane.update(input, deltaTime);
        this.environment.update(deltaTime);
        
        // Update camera to follow airplane
        this.scene.updateCamera(this.airplane);
        
        // Render scene
        this.scene.render();
        
        // Update status panel
        this.updateStatusPanel(input);
        
        // Continue game loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when page loads
window.onload = () => {
    new Game();
};