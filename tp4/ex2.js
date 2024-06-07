"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Clock hand rotation: rotate the hand into the proper orientation
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window, dat, $*/

import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {dat} from './lib/dat.gui.min.js';

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = true;
var ground = true;
window.scene = new THREE.Scene();
import {Coordinates} from './lib/Coordinates.js';

function createCone(top, bottom, material, radiusTop, radiusBottom, segmentsWidth, openEnded) {
    
    var height = top.clone().sub(bottom).length();
    var direction = top.clone().sub(bottom).normalize();
    var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segmentsWidth, 1, openEnded);
    var cone = new THREE.Mesh(geometry, material);
    
    makeLengthAngleAxisTransform(cone, direction, bottom);
    scene.add(cone);
}

function makeLengthAngleAxisTransform(obj, direction, position) {
    var axis = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    var angle = Math.acos(new THREE.Vector3(0, 1, 0).dot(direction));

    obj.quaternion.setFromAxisAngle(axis, angle);
    obj.position.copy(position.add(direction.multiplyScalar(0.5)));
}

function fillScene() {
	scene = new THREE.Scene();
    window.scene = scene;
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	var faceMaterial = new THREE.MeshPhongMaterial( { color: 0xFFECA9 } );
	var markMaterial = new THREE.MeshPhongMaterial( { color: 0x89581F } );
	var mark12Material = new THREE.MeshPhongMaterial( { color: 0xE6880E } );
	var handMaterial = new THREE.MeshPhongMaterial( { color: 0x226894 } );

    var top = new THREE.Vector3(0, 100, 0); // Point haut situé à 100 unités au-dessus de l'origine
    var bottom = new THREE.Vector3(0, 0, 0); // Point bas situé à l'origine

    // Définition du matériau du cône
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Matériau rouge

    // Définition des autres paramètres du cône
    var radiusTop = 1; // Rayon du haut du cône
    var radiusBottom = 30; // Rayon du bas du cône
    var segmentsWidth = 32; // Nombre de segments autour de la circonférence
    var openEnded = false; // Cône fermé à ses extrémités

    createCone(top, bottom, material, radiusTop, radiusBottom, segmentsWidth, openEnded);
}

function drawHelpers() {
	if (ground) {
		Coordinates.drawGround({size:10000});
	}
	if (gridX) {
		Coordinates.drawGrid({size:10000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"});
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
	}
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
	camera = new THREE.PerspectiveCamera( 30, canvasRatio, 1, 10000 );
	camera.position.set( -370, 420, 190 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

	fillScene();

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

	if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
	{
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
		drawHelpers();
	}
	renderer.render(scene, camera);
}

function setupGui() {

	effectController = {

		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes
	};

	var gui = new dat.GUI();
	gui.add( effectController, "newGridX").name("Show XZ grid");
	gui.add( effectController, "newGridY" ).name("Show YZ grid");
	gui.add( effectController, "newGridZ" ).name("Show XY grid");
	gui.add( effectController, "newGround" ).name("Show ground");
	gui.add( effectController, "newAxes" ).name("Show axes");
}


try {
	init();
	setupGui();
	drawHelpers();
	addToDOM();
	animate();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
