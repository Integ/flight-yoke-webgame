class Camera {
    constructor() {
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { pitch: 0, yaw: 0, roll: 0 };
        this.targetOffset = { x: 0, y: 2, z: -10 }; // Camera offset from airplane
        this.smoothing = 0.1; // Camera movement smoothing factor
    }

    update(airplane) {
        // Calculate desired camera position behind and slightly above the airplane
        const targetX = airplane.position.x - Math.sin(airplane.rotation.yaw) * this.targetOffset.z;
        const targetY = airplane.position.y + this.targetOffset.y;
        const targetZ = airplane.position.z - Math.cos(airplane.rotation.yaw) * this.targetOffset.z;

        // Smooth camera movement
        this.position.x += (targetX - this.position.x) * this.smoothing;
        this.position.y += (targetY - this.position.y) * this.smoothing;
        this.position.z += (targetZ - this.position.z) * this.smoothing;

        // Update camera rotation with some lag for more natural following
        this.rotation.pitch += (airplane.rotation.pitch - this.rotation.pitch) * this.smoothing;
        this.rotation.yaw += (airplane.rotation.yaw - this.rotation.yaw) * this.smoothing;
        this.rotation.roll += (airplane.rotation.roll - this.rotation.roll) * this.smoothing;
    }

    getViewMatrix() {
        // Transform world coordinates based on camera position and rotation
        return {
            position: { ...this.position },
            rotation: { ...this.rotation },
            transform: (point) => {
                // Translate point relative to camera
                const dx = point.x - this.position.x;
                const dy = point.y - this.position.y;
                const dz = point.z - this.position.z;
                
                // Rotate point around camera (simplified - you might want to use a proper matrix)
                const cosYaw = Math.cos(this.rotation.yaw);
                const sinYaw = Math.sin(this.rotation.yaw);
                const cosPitch = Math.cos(this.rotation.pitch);
                const sinPitch = Math.sin(this.rotation.pitch);
                const cosRoll = Math.cos(this.rotation.roll);
                const sinRoll = Math.sin(this.rotation.roll);
                
                // Apply rotations (yaw -> pitch -> roll)
                const x = dx * cosYaw + dz * sinYaw;
                const y = dy * cosPitch - (dx * sinYaw - dz * cosYaw) * sinPitch;
                const z = dy * sinPitch + (dx * sinYaw - dz * cosYaw) * cosPitch;
                
                // Project to screen space (simplified perspective projection)
                const scale = 1000 / (z + 1000); // Perspective divide (1000 = arbitrary far plane)
                return {
                    x: x * scale + this.position.x,
                    y: y * scale + this.position.y,
                    z: z,
                    visible: z > 0 // Only show objects in front of camera
                };
            }
        };
    }
}

export default Camera;