import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        
        // Cloud parameters
        this.clouds = [];
        this.cloudCount = 100;
        this.cloudBounds = {
            x: { min: -5000, max: 5000 },
            y: { min: 500, max: 3000 },
            z: { min: -5000, max: 5000 }
        };
        
        // Birds parameters
        this.birds = [];
        this.birdCount = 50;
        this.birdBounds = {
            x: { min: -2000, max: 2000 },
            y: { min: 200, max: 1000 },
            z: { min: -2000, max: 2000 }
        };
        
        this.init();
    }
    
    init() {
        this.createClouds();
        this.createBirds();
        this.createTerrain();
    }
    
    createClouds() {
        // Create cloud material
        const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            opacity: 0.6,
            transparent: true,
            flatShading: true
        });
        
        // Create different cloud shapes
        const shapes = [
            new THREE.SphereGeometry(50, 8, 8),
            new THREE.BoxGeometry(80, 40, 40),
            new THREE.SphereGeometry(30, 8, 8)
        ];
        
        // Generate clouds
        for (let i = 0; i < this.cloudCount; i++) {
            const cloudGroup = new THREE.Group();
            
            // Create a random cloud formation using multiple shapes
            const numShapes = Math.floor(Math.random() * 4) + 2;
            for (let j = 0; j < numShapes; j++) {
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const cloud = new THREE.Mesh(shape, cloudMaterial);
                
                // Random position within the cloud group
                cloud.position.set(
                    Math.random() * 100 - 50,
                    Math.random() * 40 - 20,
                    Math.random() * 100 - 50
                );
                
                cloudGroup.add(cloud);
            }
            
            // Position the cloud group in the world
            cloudGroup.position.set(
                Math.random() * (this.cloudBounds.x.max - this.cloudBounds.x.min) + this.cloudBounds.x.min,
                Math.random() * (this.cloudBounds.y.max - this.cloudBounds.y.min) + this.cloudBounds.y.min,
                Math.random() * (this.cloudBounds.z.max - this.cloudBounds.z.min) + this.cloudBounds.z.min
            );
            
            // Add some random rotation
            cloudGroup.rotation.y = Math.random() * Math.PI * 2;
            
            this.clouds.push({
                mesh: cloudGroup,
                speed: Math.random() * 2 + 1, // Random speed for movement
                direction: new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize()
            });
            
            this.scene.add(cloudGroup);
        }
    }
    
    createBirds() {
        // Simple bird geometry
        const birdGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            0, 0, 0,    // center
            -2, 0, -1,  // left wing
            2, 0, -1,   // right wing
        ]);
        birdGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const birdMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        });
        
        // Create bird flocks
        const flocksCount = 5;
        const birdsPerFlock = Math.floor(this.birdCount / flocksCount);
        
        for (let f = 0; f < flocksCount; f++) {
            const flockCenter = new THREE.Vector3(
                Math.random() * (this.birdBounds.x.max - this.birdBounds.x.min) + this.birdBounds.x.min,
                Math.random() * (this.birdBounds.y.max - this.birdBounds.y.min) + this.birdBounds.y.min,
                Math.random() * (this.birdBounds.z.max - this.birdBounds.z.min) + this.birdBounds.z.min
            );
            
            for (let i = 0; i < birdsPerFlock; i++) {
                const bird = new THREE.Mesh(birdGeometry, birdMaterial);
                
                // Position around flock center
                bird.position.set(
                    flockCenter.x + Math.random() * 100 - 50,
                    flockCenter.y + Math.random() * 50 - 25,
                    flockCenter.z + Math.random() * 100 - 50
                );
                
                this.birds.push({
                    mesh: bird,
                    speed: Math.random() * 2 + 8,
                    flockCenter: flockCenter.clone(),
                    offset: bird.position.clone().sub(flockCenter),
                    phase: Math.random() * Math.PI * 2
                });
                
                this.scene.add(bird);
            }
        }
    }
    
    createTerrain() {
        // Create a large ground plane
        const groundGeometry = new THREE.PlaneGeometry(10000, 10000, 128, 128);
        
        // Modify vertices to create hills
        const vertices = groundGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            vertices[i + 1] = Math.sin(x / 500) * Math.cos(z / 500) * 100; // Height
        }
        groundGeometry.computeVertexNormals();
        
        // Ground material with grass texture
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x228B22,
            shininess: 0
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    update(deltaTime) {
        // Update clouds
        this.clouds.forEach(cloud => {
            cloud.mesh.position.add(cloud.direction.clone().multiplyScalar(cloud.speed * deltaTime));
            
            // Wrap clouds around bounds
            if (cloud.mesh.position.x > this.cloudBounds.x.max) cloud.mesh.position.x = this.cloudBounds.x.min;
            if (cloud.mesh.position.x < this.cloudBounds.x.min) cloud.mesh.position.x = this.cloudBounds.x.max;
            if (cloud.mesh.position.z > this.cloudBounds.z.max) cloud.mesh.position.z = this.cloudBounds.z.min;
            if (cloud.mesh.position.z < this.cloudBounds.z.min) cloud.mesh.position.z = this.cloudBounds.z.max;
        });
        
        // Update birds
        this.birds.forEach(bird => {
            // Update bird's phase for wing flapping
            bird.phase += deltaTime * 10;
            bird.mesh.rotation.z = Math.sin(bird.phase) * 0.2;
            
            // Move flock center
            bird.flockCenter.x += Math.sin(bird.phase * 0.1) * bird.speed * deltaTime;
            bird.flockCenter.z += Math.cos(bird.phase * 0.1) * bird.speed * deltaTime;
            
            // Keep birds with their flock
            bird.mesh.position.copy(bird.flockCenter).add(bird.offset);
            
            // Wrap birds around bounds
            if (bird.mesh.position.x > this.birdBounds.x.max) {
                bird.mesh.position.x = this.birdBounds.x.min;
                bird.flockCenter.x = this.birdBounds.x.min;
            }
            if (bird.mesh.position.x < this.birdBounds.x.min) {
                bird.mesh.position.x = this.birdBounds.x.max;
                bird.flockCenter.x = this.birdBounds.x.max;
            }
            if (bird.mesh.position.z > this.birdBounds.z.max) {
                bird.mesh.position.z = this.birdBounds.z.min;
                bird.flockCenter.z = this.birdBounds.z.min;
            }
            if (bird.mesh.position.z < this.birdBounds.z.min) {
                bird.mesh.position.z = this.birdBounds.z.max;
                bird.flockCenter.z = this.birdBounds.z.max;
            }
        });
    }
}