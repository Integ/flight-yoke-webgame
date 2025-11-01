class HUD {
    constructor() {
        this.speed = 0;
        this.altitude = 0;
        this.element = this.createHUD();
    }

    createHUD() {
        const hud = document.createElement('div');
        hud.style.position = 'absolute';
        hud.style.top = '10px';
        hud.style.left = '10px';
        hud.style.color = 'white';
        hud.style.fontSize = '20px';
        hud.style.pointerEvents = 'none';
        document.body.appendChild(hud);
        return hud;
    }

    update(speed, altitude) {
        this.speed = speed;
        this.altitude = altitude;
        this.render();
    }

    render() {
        this.element.innerHTML = `Speed: ${this.speed.toFixed(2)} knots<br>Altitude: ${this.altitude.toFixed(2)} feet`;
    }
}

export default HUD;