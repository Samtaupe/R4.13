import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();

function init() {
    const canvasWidth = 846;
    const canvasHeight = 494;
    const aspectRatio = canvasWidth / canvasHeight;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x808080, 1.0);
    document.getElementById('webGL').appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 10, 10000);
    camera.position.set(0, 0, 1000);

    // Controls
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);

    // Scene
    scene = new THREE.Scene();

    // Lights
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light1.position.set(200, 400, 500);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light2.position.set(-400, 200, -300);
    scene.add(light2);

    // Walls
    const wallTexture = new THREE.TextureLoader().load('textures/wood.jpg');
    const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(1500, 1500, 0), wallMaterial);
    backWall.position.set(0, 0, -750);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0, 1500, 1500), wallMaterial);
    leftWall.position.set(-750, 0, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0, 1500, 1500), wallMaterial);
    rightWall.position.set(750, 0, 0);
    scene.add(rightWall);

    const ground = new THREE.Mesh(new THREE.BoxGeometry(1500, 0, 1500), wallMaterial);
    ground.position.set(0, -750, 0);
    scene.add(ground);

    // Animated Textures
    const videoFiles = [
        'textures/fire.mp4', 
        'textures/jukebox.mp4', 
        'textures/saturdayNightFever.mp4', 
        'textures/window.mp4', 
        'textures/window2.mp4'
    ];

    const dimensions = [
        { width: 480, height: 360, position: [-300, -400, -749] },
        { width: 508, height: 694, position: [400, -400, -749] },
        { width: 500, height: 272, position: [-300, 0, -749] },
        { width: 278, height: 402, position: [-749, 0, -500], rotateY: true },
        { width: 400, height: 320, position: [400, 300, -749] }
    ];

    for (let i = 0; i < videoFiles.length; i++) {
        const video = document.createElement('video');
        video.src = videoFiles[i];
        video.loop = true;
        video.muted = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);
        const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(dimensions[i].width, dimensions[i].height), videoMaterial);
        plane.position.set(...dimensions[i].position);

		if(dimensions[i].rotateY){
			plane.rotation.y = Math.PI/2;
		}

        scene.add(plane);
    }

    animate();
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    const delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}

init();
