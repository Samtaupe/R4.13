import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Création de la scène et du renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7d8d9f);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('webGL-container'),
  antialias: true
});

// Chargement de l'image
const loader = new THREE.TextureLoader();
const texture = loader.load('images/background.jpg');
const imageTexture = loader.load('img.jpg');


// Création d'un plan avec la texture de l'image
const geometry = new THREE.PlaneGeometry(1000, 100);
const material =  new THREE.MeshBasicMaterial({ map: texture });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Création de la lumière
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
light.intensity = 2;
scene.add(light);

// Création de la caméra
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );


// Création des contrôles de mouvement
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();



// Ajout des événements de mouvement
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      camera.position.z -= 0.1;
      break;
      case 'ArrowDown':
        camera.position.z += 0.1;
        break;
        case 'ArrowLeft':
          camera.position.x -= 0.1;
          break;
          case 'ArrowRight':
            camera.position.x += 0.1;
            break;
  }
});
// Boucle de rendu
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Ajout du rendu à la page web
const canvas = document.getElementById('webGL-container');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
renderer.setSize(canvas.width, canvas.height);

animate();