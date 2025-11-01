import Airplane from './game/airplane.js';
import World from './game/world.js';
import Camera from './game/camera.js';
import HUD from './ui/hud.js';

export class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.airplane = new Airplane();
        this.world = new World();
        this.camera = new Camera();
        this.hud = new HUD();
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    initialize() {
        // any init logic if needed
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update(input) {
        if (input) {
            this.airplane.update(input);
        }
        this.world.update(); // Update world objects (clouds, birds, etc.)
        this.camera.update(this.airplane);
        this.hud.update(this.airplane.speed, this.airplane.position.y);
    }

    render() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render world with camera view matrix
        this.world.render(this.ctx, this.camera);
        
        // Render HUD on top
        this.hud.render(this.ctx);
    }
}

export default Engine;