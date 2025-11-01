import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Airplane {
    constructor(scene) {
        this.scene = scene;
        this.position = new THREE.Vector3(0, 100, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.quaternion = new THREE.Quaternion();
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        
        // Physics parameters
        this.mass = 1000; // kg
        this.dragCoefficient = 0.1;
        this.liftCoefficient = 2.0;
        this.engineForce = 10000; // N
        
        this.loadModel();
    }

    async loadModel() {
        const loader = new GLTFLoader();
        
        try {
            // Load a simple airplane model (you'll need to provide the actual model)
            const gltf = await loader.loadAsync('models/airplane/cessna.glb');
            this.model = gltf.scene;
            this.model.scale.set(0.1, 0.1, 0.1); // Adjust scale as needed
            this.scene.add(this.model);
            
            // Add a simple collision box
            const geometry = new THREE.BoxGeometry(5, 2, 5);
            const material = new THREE.MeshBasicMaterial({ visible: false });
            this.collider = new THREE.Mesh(geometry, material);
            this.scene.add(this.collider);
        } catch (error) {
            console.error('Error loading airplane model:', error);
            // Fallback to a simple airplane shape
            this.createSimpleAirplane();
        }
    }

    createSimpleAirplane() {
        const group = new THREE.Group();

        // Materials
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4A90E2,  // 太空蓝色
            shininess: 50,
            emissive: 0x001122,  // 轻微发光效果
            emissiveIntensity: 0.1
        });

        // 头部 - 圆锥形
        const headGeom = new THREE.ConeGeometry(0.4, 6, 16);
        const head = new THREE.Mesh(headGeom, bodyMaterial);
        head.rotation.z = Math.PI / 2;  // 旋转使尖端指向前方（X轴负方向）
        head.position.set(-3, 0, 0);
        group.add(head);

        // 身体 - 圆柱体
        const bodyGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
        const body = new THREE.Mesh(bodyGeom, bodyMaterial);
        body.rotation.z = Math.PI / 2;  // 旋转使圆柱体沿X轴方向
        body.position.set(-1, 0, 0);
        group.add(body);

        // 尾部 - 渐扩圆柱体
        const tailGeom = new THREE.CylinderGeometry(0.6, 0.5, 2, 16);
        const tail = new THREE.Mesh(tailGeom, bodyMaterial);
        tail.rotation.z = Math.PI / 2;  // 旋转使圆柱体沿X轴方向
        tail.position.set(0.5, 0, 0);
        group.add(tail);

        // Scale the entire model
        group.scale.set(0.6, 0.6, 0.6);

        this.model = group;
        this.scene.add(this.model);
        
        // Add collider - 调整为适合飞船的尺寸
        const colliderGeom = new THREE.BoxGeometry(6, 3, 3);
        const colliderMaterial = new THREE.MeshBasicMaterial({ visible: false });
        this.collider = new THREE.Mesh(colliderGeom, colliderMaterial);
        this.scene.add(this.collider);
    }

    update(input, deltaTime) {
        // Convert yoke input to control forces
        const pitch = input.pitch * Math.PI / 4; // Convert to radians
        const roll = input.roll * Math.PI / 4;
        const yaw = input.yaw * Math.PI / 4;
        const throttle = input.throttle; // Throttle is already 0-1

        // Apply engine force
        const engineForce = new THREE.Vector3(-this.engineForce * throttle, 0, 0);
        engineForce.applyQuaternion(this.quaternion);
        
        // Calculate lift based on velocity and angle of attack
        const velocity = this.velocity.length();
        const lift = this.liftCoefficient * velocity * velocity;
        const liftForce = new THREE.Vector3(0, lift, 0);
        liftForce.applyQuaternion(this.quaternion);

        // Apply drag
        const drag = this.dragCoefficient * velocity * velocity;
        const dragForce = this.velocity.clone().normalize().multiplyScalar(-drag);

        // Calculate total force
        const totalForce = new THREE.Vector3()
            .add(engineForce)
            .add(liftForce)
            .add(dragForce);

        // Update velocity (F = ma)
        const acceleration = totalForce.divideScalar(this.mass);
        this.velocity.add(acceleration.multiplyScalar(deltaTime));

        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // Update rotation
        this.rotation.x += pitch * deltaTime;
        this.rotation.y += yaw * deltaTime;
        this.rotation.z += roll * deltaTime;
        
        // Convert Euler rotation to Quaternion
        this.quaternion.setFromEuler(this.rotation);

        // Update model and collider positions
        if (this.model) {
            this.model.position.copy(this.position);
            this.model.quaternion.copy(this.quaternion);
        }
        if (this.collider) {
            this.collider.position.copy(this.position);
            this.collider.quaternion.copy(this.quaternion);
        }
    }

    getPosition() {
        return this.position;
    }

    getRotation() {
        return this.rotation;
    }
}

export default Airplane;