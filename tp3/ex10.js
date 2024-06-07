import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {dat} from "./lib/dat.gui.min.js";
window.scene = new THREE.Scene();
import {Coordinates} from "./lib/Coordinates.js";

// Initialisation des variables globales
var spheres = [];
var sphereSpeeds = [];
const scene = new THREE.Scene();
function createCylinder(rotationAxis, angle, position) {
    var geometry = new THREE.CylinderGeometry(5, 5, 20, 32); // Rayon haut, rayon bas, hauteur, segments radiaux
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: false});
    var cylinder = new THREE.Mesh(geometry, material);

    // Appliquer la rotation
    if(rotationAxis === 'x') {
        cylinder.rotation.x = angle;
    } else if(rotationAxis === 'y') {
        cylinder.rotation.y = angle;
    } else if(rotationAxis === 'z') {
        cylinder.rotation.z = angle;
    }

    // Positionner le cylindre
    cylinder.position.set(position.x, position.y, position.z);

    scene.add(cylinder);
}


function init() {
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lumière directionnelle
	var ambientLight = new THREE.AmbientLight( 0x222222 );
	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );
	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );
	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

    // Création de 5 sphères avec des caractéristiques aléatoires
    for (let i = 0; i < 5; i++) {
        const radius = Math.random() * 5;
        const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = Math.random() * 20 - 10; // de -10 à 10
        sphere.position.y = 20; // Y fixe à 20
        sphere.position.z = Math.random() * 20 - 10; // de -10 à 10

        spheres.push(sphere);
        scene.add(sphere);

        // Vitesse aléatoire plus lente, de 0.1 à 0.3
        sphereSpeeds.push(Math.random() * 0.2 + 0.1);
    }

    // Animation des sphères
    function animate() {
        requestAnimationFrame(animate);

        spheres.forEach((sphere, index) => {
            sphere.position.y -= sphereSpeeds[index]; 
            const scale = Math.max(0, 1 - Math.abs(sphere.position.y / 20)); 
            sphere.scale.x = sphere.scale.z = scale;
            sphere.scale.z = sphere.scale.x = scale;
            sphere.scale.y = sphere.scale.y = scale
        });

        renderer.render(scene, camera);
    }
        
        animate();
}

init();

