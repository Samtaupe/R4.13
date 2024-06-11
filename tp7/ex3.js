import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { dat } from "./lib/dat.gui.min.js";
import { Coordinates } from "./lib/Coordinates.js";

window.scene = new THREE.Scene();

var camera, scene, renderer;
var cameraControls, effectController;

var clock = new THREE.Clock();

/* function SquareGeometry() {

    var triangle = new THREE.BufferGeometry();

    // generate vertices
    const vertices = new Float32Array([
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,

        0.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
    ]);

    // Change this array to select the number "1" part of the texture
    // Assuming that "1" is located at the third column of the second row in a 5x5 grid
    const gridSize = 4;
    const cellSize = 1 / gridSize;  // Size of each cell in the grid
    const u0 = 3 * cellSize; // Starting u coordinate (third column)
    const v0 = 1 - 2 * cellSize; // Starting v coordinate (second row)
    const u1 = u0 + cellSize; // Ending u coordinate
    const v1 = v0 - cellSize; // Ending v coordinate

    // Set the UV coordinates to select the cell containing the "1"
    const uv = new Float32Array([
        u0, v1,
        u1, v1,
        u1, v0,

        u0, v1,
        u1, v0,
        u0, v0,
    ]);

    triangle.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    triangle.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

    // done: return it.
    return triangle;
} */
function SquareGeometry() {

    var triangle = new THREE.BufferGeometry();

    // Generate vertices
    const vertices = new Float32Array([
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,

        0.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
    ]);

    // Calculate a random cell in the 4x4 grid
    const gridSize = 4;
    const cellSize = 1 / gridSize;  // Size of each cell in the grid
    const randomRow = Math.floor(Math.random() * gridSize);
    const randomCol = Math.floor(Math.random() * gridSize);
    
    const u0 = randomCol * cellSize; // Starting u coordinate
    const v0 = randomRow * cellSize; // Starting v coordinate
    const u1 = u0 + cellSize; // Ending u coordinate
    const v1 = v0 + cellSize; // Ending v coordinate

    // Set the UV coordinates to select the random cell
    const uv = new Float32Array([
        u0, 1 - v1,
        u1, 1 - v1,
        u1, 1 - v0,

        u0, 1 - v1,
        u1, 1 - v0,
        u0, 1 - v0,
    ]);

    triangle.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    triangle.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

    // Done: return it.
    return triangle;
}

function fillScene() {
    scene = new THREE.Scene();

    var myPolygon = new SquareGeometry();
    var myTexture = new THREE.TextureLoader().load('/../textures/lettergrid.png');
    var myPolygonMaterial = new THREE.MeshBasicMaterial({ map: myTexture });
    var polygonObject = new THREE.Mesh(myPolygon, myPolygonMaterial);
    scene.add(polygonObject);
}

function init() {
    var canvasWidth = 846;
    var canvasHeight = 494;
    var canvasRatio = canvasWidth / canvasHeight;

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0xFFFFFF, 1.0);

    // Camera: Y up, X right, Z up
    camera = new THREE.PerspectiveCamera(1, canvasRatio, 50, 150);
    camera.position.set(0.5, 0.5, 100);

    // CONTROLS
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0.5, 0.5, 0);
}

function addToDOM() {
    var container = document.getElementById('webGL');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}

function drawHelpers() {
    // Background grid and axes. Grid step size is 1, axes cross at 0, 0
    Coordinates.drawGrid({ size: 100, scale: 1, orientation: "z", offset: -0.01 });
    Coordinates.drawAxes({ axisLength: 2.1, axisOrientation: "x", axisRadius: 0.004, offset: -0.01 });
    Coordinates.drawAxes({ axisLength: 2.1, axisOrientation: "y", axisRadius: 0.004, offset: -0.01 });
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

function setupGui() {

    effectController = {

        alpha: 0.7,
        sred: 0xE5 / 255,
        sgreen: 0x33 / 255,
        sblue: 0x19 / 155,

        dred: 0xE5 / 255,
        dgreen: 0xE5 / 255,
        dblue: 0x66 / 255
    };

}

try {
    init();
    fillScene();
    setupGui();
    drawHelpers();
    addToDOM();
    animate();
} catch (e) {
    var errorReport = "Your program encountered an unrecoverable error, cannot draw on canvas. Error was:<br/><br/>";
    document.getElementById('webGL').innerHTML += errorReport + e;
}
