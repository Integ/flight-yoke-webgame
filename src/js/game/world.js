class World {
    constructor() {
        // World bounds
        this.bounds = {
            x: { min: -10000, max: 10000 },
            y: { min: 0, max: 5000 },
            z: { min: -10000, max: 10000 }
        };

        // Generate world features
        this.terrain = this.generateTerrain();
        this.clouds = this.generateClouds(100); // Generate 100 clouds
        this.birds = this.generateBirds(50);    // Generate 50 birds
        this.trees = this.generateTrees(200);   // Generate 200 trees
        this.mountains = this.generateMountains(20); // Generate 20 mountains
        this.otherPlanes = this.generateOtherPlanes(5); // Generate 5 AI planes

        // Colors
        this.skyColor = '#87CEEB';
        this.groundColor = '#228B22';
        this.waterColor = '#1E90FF';
        this.mountainColor = '#8B4513';
    }

    generateClouds(count) {
        const clouds = [];
        for (let i = 0; i < count; i++) {
            clouds.push({
                position: {
                    x: Math.random() * (this.bounds.x.max - this.bounds.x.min) + this.bounds.x.min,
                    y: Math.random() * 3000 + 1000, // Clouds between 1000 and 4000 units high
                    z: Math.random() * (this.bounds.z.max - this.bounds.z.min) + this.bounds.z.min
                },
                size: Math.random() * 200 + 100, // Cloud size between 100 and 300
                speed: Math.random() * 2 - 1, // Cloud movement
                type: Math.floor(Math.random() * 3) // Different cloud shapes
            });
        }
        return clouds;
    }

    generateBirds(count) {
        const birds = [];
        for (let i = 0; i < count; i++) {
            birds.push({
                position: {
                    x: Math.random() * (this.bounds.x.max - this.bounds.x.min) + this.bounds.x.min,
                    y: Math.random() * 1000 + 500, // Birds between 500 and 1500 units high
                    z: Math.random() * (this.bounds.z.max - this.bounds.z.min) + this.bounds.z.min
                },
                rotation: Math.random() * Math.PI * 2,
                speed: Math.random() * 5 + 5,
                flockIndex: Math.floor(i / 5) // Group birds into small flocks
            });
        }
        return birds;
    }

    generateTrees(count) {
        const trees = [];
        for (let i = 0; i < count; i++) {
            trees.push({
                position: {
                    x: Math.random() * (this.bounds.x.max - this.bounds.x.min) + this.bounds.x.min,
                    y: 0, // Trees are on the ground
                    z: Math.random() * (this.bounds.z.max - this.bounds.z.min) + this.bounds.z.min
                },
                height: Math.random() * 30 + 20, // Tree height between 20 and 50 units
                type: Math.floor(Math.random() * 3) // Different tree types
            });
        }
        return trees;
    }

    generateMountains(count) {
        const mountains = [];
        for (let i = 0; i < count; i++) {
            mountains.push({
                position: {
                    x: Math.random() * (this.bounds.x.max - this.bounds.x.min) + this.bounds.x.min,
                    y: 0,
                    z: Math.random() * (this.bounds.z.max - this.bounds.z.min) + this.bounds.z.min
                },
                height: Math.random() * 1000 + 500, // Mountain height between 500 and 1500 units
                radius: Math.random() * 1000 + 500, // Mountain base radius
                type: Math.floor(Math.random() * 3) // Different mountain shapes
            });
        }
        return mountains;
    }

    generateOtherPlanes(count) {
        const planes = [];
        for (let i = 0; i < count; i++) {
            planes.push({
                position: {
                    x: Math.random() * (this.bounds.x.max - this.bounds.x.min) + this.bounds.x.min,
                    y: Math.random() * 2000 + 1000,
                    z: Math.random() * (this.bounds.z.max - this.bounds.z.min) + this.bounds.z.min
                },
                rotation: {
                    pitch: 0,
                    yaw: Math.random() * Math.PI * 2,
                    roll: 0
                },
                speed: Math.random() * 10 + 20,
                type: Math.floor(Math.random() * 3) // Different plane types
            });
        }
        return planes;
    }

    generateTerrain() {
        // Simple height map for demonstration
        const gridSize = 100;
        const terrain = [];
        for (let x = 0; x < gridSize; x++) {
            terrain[x] = [];
            for (let z = 0; z < gridSize; z++) {
                const wx = (x / gridSize) * (this.bounds.x.max - this.bounds.x.min) + this.bounds.x.min;
                const wz = (z / gridSize) * (this.bounds.z.max - this.bounds.z.min) + this.bounds.z.min;
                // Use Perlin noise or similar for better terrain
                terrain[x][z] = Math.sin(wx/1000) * Math.cos(wz/1000) * 200;
            }
        }
        return terrain;
    }

    update() {
        // Update clouds
        this.clouds.forEach(cloud => {
            cloud.position.x += cloud.speed;
            if (cloud.position.x > this.bounds.x.max) cloud.position.x = this.bounds.x.min;
            if (cloud.position.x < this.bounds.x.min) cloud.position.x = this.bounds.x.max;
        });

        // Update birds
        this.birds.forEach(bird => {
            bird.position.x += Math.cos(bird.rotation) * bird.speed;
            bird.position.z += Math.sin(bird.rotation) * bird.speed;
            // Keep birds within bounds
            if (bird.position.x > this.bounds.x.max) bird.position.x = this.bounds.x.min;
            if (bird.position.x < this.bounds.x.min) bird.position.x = this.bounds.x.max;
            if (bird.position.z > this.bounds.z.max) bird.position.z = this.bounds.z.min;
            if (bird.position.z < this.bounds.z.min) bird.position.z = this.bounds.z.max;
        });

        // Update other planes
        this.otherPlanes.forEach(plane => {
            plane.position.x += Math.cos(plane.rotation.yaw) * plane.speed;
            plane.position.z += Math.sin(plane.rotation.yaw) * plane.speed;
            // Keep planes within bounds
            if (plane.position.x > this.bounds.x.max) plane.position.x = this.bounds.x.min;
            if (plane.position.x < this.bounds.x.min) plane.position.x = this.bounds.x.max;
            if (plane.position.z > this.bounds.z.max) plane.position.z = this.bounds.z.min;
            if (plane.position.z < this.bounds.z.min) plane.position.z = this.bounds.z.max;
        });
    }

    render(ctx, camera) {
        const view = camera.getViewMatrix();
        
        // Clear canvas
        ctx.fillStyle = this.skyColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Helper function to transform 3D point to 2D screen coordinates
        const transformToScreen = (point) => {
            const transformed = view.transform(point);
            if (!transformed.visible) return null;
            return {
                x: ctx.canvas.width/2 + transformed.x,
                y: ctx.canvas.height/2 - transformed.y,
                z: transformed.z
            };
        };

        // Render mountains (background)
        this.mountains.forEach(mountain => {
            const base = transformToScreen(mountain.position);
            if (base) {
                // Simple triangle for mountain
                ctx.fillStyle = this.mountainColor;
                ctx.beginPath();
                ctx.moveTo(base.x, base.y);
                ctx.lineTo(base.x - mountain.radius/2, base.y + mountain.height/2);
                ctx.lineTo(base.x + mountain.radius/2, base.y + mountain.height/2);
                ctx.closePath();
                ctx.fill();
            }
        });

        // Render clouds
        this.clouds.forEach(cloud => {
            const pos = transformToScreen(cloud.position);
            if (pos) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, cloud.size / pos.z * 100, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Render birds
        this.birds.forEach(bird => {
            const pos = transformToScreen(bird.position);
            if (pos) {
                ctx.fillStyle = '#000';
                // Simple V shape for birds
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(pos.x - 10, pos.y + 10);
                ctx.lineTo(pos.x + 10, pos.y + 10);
                ctx.closePath();
                ctx.fill();
            }
        });

        // Render other planes
        this.otherPlanes.forEach(plane => {
            const pos = transformToScreen(plane.position);
            if (pos) {
                ctx.fillStyle = '#FF0000';
                // Simple airplane shape
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y - 10);
                ctx.lineTo(pos.x - 5, pos.y + 10);
                ctx.lineTo(pos.x + 5, pos.y + 10);
                ctx.closePath();
                ctx.fill();
            }
        });

        // Render ground grid
        ctx.strokeStyle = this.groundColor;
        ctx.lineWidth = 1;
        const gridSize = 1000;
        const gridStep = 100;

        for (let x = -gridSize; x <= gridSize; x += gridStep) {
            for (let z = -gridSize; z <= gridSize; z += gridStep) {
                const p1 = transformToScreen({x: x, y: 0, z: z});
                const p2 = transformToScreen({x: x + gridStep, y: 0, z: z});
                const p3 = transformToScreen({x: x, y: 0, z: z + gridStep});
                
                if (p1 && p2) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
                
                if (p1 && p3) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p3.x, p3.y);
                    ctx.stroke();
                }
            }
        }
    }
}

export default World;