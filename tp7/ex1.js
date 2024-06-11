import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Coordinates } from "./lib/Coordinates.js";
import { dat } from "./lib/dat.gui.min.js";

window.scene = new THREE.Scene();

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

function fillScene() {
    scene = new THREE.Scene();

    // Create the square
    var squareGeometry = new SquareGeometry();
    var loader = new THREE.TextureLoader();
    var myTexture = loader.load('/../textures/ash_uvgrid01.jpg');
    var squareMaterial = new THREE.MeshBasicMaterial({ map: myTexture });
    var squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
    scene.add(squareMesh);

    // Create the triangle for the house roof
    var houseRoofGeometry = new HouseRoofGeometry();
    var houseRoofMesh = new THREE.Mesh(houseRoofGeometry, squareMaterial);
    scene.add(houseRoofMesh);
}

function SquareGeometry() {
    var geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ]);

    const uv = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);

    const indices = new Uint16Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    return geometry;
}

function HouseRoofGeometry() {
    var geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        0.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        0.5, 1.5, 0.0
    ]);

    const uv = new Float32Array([
        0.0, 1.0,
        1.0, 1.0,
        0.5, 0.0
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

    return geometry;
}

function drawHelpers() {
    Coordinates.drawGrid({ size: 100, scale: 1, orientation: "z", offset: -0.01 });
    Coordinates.drawAxes({ axisLength: 2.1, axisOrientation: "x", axisRadius: 0.004, offset: -0.01 });
    Coordinates.drawAxes({ axisLength: 2.1, axisOrientation: "y", axisRadius: 0.004, offset: -0.01 });
}

function addToDOM() {
    var container = document.getElementById('webGL');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}

function init() {
    var canvasWidth = 846;
    var canvasHeight = 494;
    var canvasRatio = canvasWidth / canvasHeight;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0xFFFFFF, 1.0);

    camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 4000);
    camera.position.set(0.5, 0.5, 3);

    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0.5, 0.5, 0);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}

try {
    init();
    fillScene();
    drawHelpers();
    addToDOM();
    animate();
} catch (e) {
    var errorReport = "Your program encountered an unrecoverable error, cannot draw on canvas. Error was:<br/><br/>";
    document.getElementById('webGL').innerHTML += errorReport + e;
}
