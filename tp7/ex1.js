import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {dat} from "./lib/dat.gui.min.js";
window.scene = new THREE.Scene();
import {Coordinates} from "./lib/Coordinates.js";
var camera, scene, renderer;
var cameraControls;
"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Make a textured square
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document, window*/


var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

function fillScene() {
	scene = new THREE.Scene();

	var myPolygon = new SquareGeometry();
	// instantiate a loader
	var loader = new THREE.TextureLoader();
	var myTexture = loader.load( '/../textures/ash_uvgrid01.jpg' );
	var myPolygonMaterial = new THREE.MeshBasicMaterial( { map: myTexture } );
	var polygonObject = new THREE.Mesh( myPolygon, myPolygonMaterial );
	scene.add(polygonObject);
}

function SquareGeometry() {
	
	var triangle = new THREE.BufferGeometry();

	// student should add code within this method

	// generate vertices
	const vertices = new Float32Array( [
		0.0, 0.0,  0.0,
		1.0, 0.0, 0.0,
		1.0, 1.0,  0.0,
	] );

	const uv = new Float32Array( [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
	] );

	triangle.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	triangle.setAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );

	return triangle;
}

function drawHelpers() {
	// Background grid and axes. Grid step size is 1, axes cross at 0, 0
	Coordinates.drawGrid({size:100,scale:1,orientation:"z",offset:-0.01});
	Coordinates.drawAxes({axisLength:2.1,axisOrientation:"x",axisRadius:0.004,offset:-0.01});
	Coordinates.drawAxes({axisLength:2.1,axisOrientation:"y",axisRadius:0.004,offset:-0.01});
}

function addToDOM() {
	var container = document.getElementById('webGL');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xFFFFFF, 1.0 );

	// Camera: Y up, X right, Z up
	camera = new THREE.PerspectiveCamera( 1, canvasRatio, 50, 150 );
	camera.position.set( 0.5, 0.5, 100 );

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0.5,0.5,0);

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
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#webGL').append(errorReport+e);
}