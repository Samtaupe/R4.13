"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
/*global THREE, window, document, $*/

import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import {dat} from './lib/dat.gui.min.js';

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

function fillScene() {
    scene = new THREE.Scene(); 

    // Triangle Mesh
    var material, geometry, mesh;
    material = new THREE.MeshBasicMaterial( { vertexColors: true, side : THREE.DoubleSide} );
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array([
        100, 0, 0,    
        0, 100, 0,    
        0, 0, 100     
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    var colors = new Float32Array([
        1, 0, 0, 
        0, 1, 0, 
        0, 0, 1   
    ]);

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.setIndex([0, 1, 2]); 

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
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
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 55, canvasRatio, 1, 4000 );
	camera.position.set( 100, 150, 130 );

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

}

function addToDOM() {
	var container = document.getElementById('webGL');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
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
	addToDOM();
	animate();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
