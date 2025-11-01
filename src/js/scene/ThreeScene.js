import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

export class ThreeScene {
    constructor(container) {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
        this.camera.position.set(0, 10, -20); // Start behind and above the plane
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        container.appendChild(this.renderer.domElement);

        // Lighting
        this.setupLighting();
        
        // Environment
        this.setupEnvironment();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        
        // Animation loop
        this.clock = new THREE.Clock();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Sun light
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.position.set(0, 100, 0);
        this.sunLight.castShadow = true;
        this.scene.add(this.sunLight);
    }

    setupEnvironment() {
        // Sky
        this.sky = new Sky();
        this.sky.scale.setScalar(450000);
        this.scene.add(this.sky);

        // Water
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: this.scene.fog !== undefined
        });
        this.water.rotation.x = -Math.PI / 2;
        this.water.position.y = -5;
        this.scene.add(this.water);

        // Fog for distance fade
        this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.00005);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateCamera(airplane) {
        // 固定相机偏移量（相对于飞机）
        const cameraOffset = new THREE.Vector3(0, 5, -5); // 后方15单位，上方5单位
        
        // 获取飞机的前向方向（基于当前旋转）
        const forward = new THREE.Vector3(-1, 0, 0);
        forward.applyQuaternion(airplane.quaternion);
        
        // 获取飞机的上方向
        const up = new THREE.Vector3(0, 1, 0);
        up.applyQuaternion(airplane.quaternion);
        
        // 计算相机位置
        const targetCameraPos = airplane.position.clone();
        targetCameraPos.add(forward.multiplyScalar(cameraOffset.z)); // 后移
        targetCameraPos.add(up.multiplyScalar(cameraOffset.y));      // 上移
        
        // 平滑移动相机到目标位置
        this.camera.position.lerp(targetCameraPos, 0.1);
        
        // 相机始终看向飞机位置的略前方
        const lookAtPoint = airplane.position.clone();
        const lookAheadDistance = 10; // 看向飞机前方10单位
        forward.normalize();
        lookAtPoint.sub(forward.multiplyScalar(lookAheadDistance));
        
        // 添加一点上方偏移，使视角略微向下
        lookAtPoint.y += 2;
        
        this.camera.lookAt(lookAtPoint);
        
        // 保持相机的上方向与世界坐标一致，防止翻滚时画面倾斜
        this.camera.up.set(0, 1, 0);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}