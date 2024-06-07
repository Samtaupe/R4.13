"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Drinking Bird Model exercise                                               //
// Your task is to complete the model for the drinking bird                   //
// Please work from the formal blueprint dimensions and positions shown at    //
// https://www.udacity.com/wiki/cs291/notes                                   //
//                                                                            //
// The following materials should be used:                                    //
// Hat and spine: cylinderMaterial (blue)                                     //
// Head and bottom body: sphereMaterial (red)                                 //
// Rest of body: cubeMaterial (orange)                                        //
//                                                                            //
// So that the exercise passes, and the spheres and cylinders look good,      //
// all SphereGeometry calls should be of the form:                            //
//     SphereGeometry( radius, 32, 16 );                                      //
// and CylinderGeometry calls should be of the form:                          //
//     CylinderGeometry( radiusTop, radiusBottom, height, 32 );               //
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document, window, dat*/

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
var axes = false;
var ground = true;
window.scene = new THREE.Scene();
import {Coordinates} from './lib/Coordinates.js';

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
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 40000 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);

	camera.position.set( -480, 659, -619 );
	cameraControls.target.set(4,301,92);

	fillScene();
	
}

// Supporting frame for the bird - base + legs + feet
function createSupport() {

	var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xF07020 } );
	// base
	var cube;
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 20+64+110, 4, 2*77 ), cubeMaterial );
	cube.position.x = -45;
	cube.position.y = 4/2;	
	cube.position.z = 0;	
	scene.add( cube );

	// left foot
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 20+64+110, 52, 6 ), cubeMaterial );
	cube.position.x = -45;	
	cube.position.y = 52/2;	
	cube.position.z = 77 + 6/2;	
	scene.add( cube );

	// left leg
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 64, 334+52, 6 ), cubeMaterial );
	cube.position.x = 0;	
	cube.position.y = (334+52)/2;
	cube.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	scene.add( cube );

	// right foot
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 20+64+110, 52, 6 ), cubeMaterial );
	cube.position.x = -45;	
	cube.position.y = 52/2;	
	cube.position.z = -77 - 6/2;	
	scene.add( cube );
	// right leg
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 64, 334+52, 6 ), cubeMaterial );
	cube.position.x = 0;	
	cube.position.y = (334+52)/2;
	cube.position.z = -77 - 6/2;	// offset 77 + half of depth 6/2
	scene.add( cube );
}

// Body of the bird - body and the connector of body and head
function createBody() {
    // Création du corps
    var body = new THREE.Mesh(
        new THREE.SphereGeometry(116/2, 32, 16),
        new THREE.MeshLambertMaterial({color: 0xA00000}) 
    );
    body.position.set(0, 160, 0);
    scene.add(body);

    var neck = new THREE.Mesh(
        new THREE.CylinderGeometry(24, 24, 390, 32),
        new THREE.MeshLambertMaterial({color: 0x0000D0}) 
    );
    neck.position.set(0, 390/2+160, 0);
    scene.add(neck);
}

function createHead() {
    // Création de la tête
    var head = new THREE.Mesh(
        new THREE.SphereGeometry(104/2, 32, 16),
        new THREE.MeshLambertMaterial({color: 0xA00000}) // Rouge
    );
    head.position.set(0, 160+390, 0);
    scene.add(head);

    // Création du chapeau
    var hat = new THREE.Mesh(
        new THREE.CylinderGeometry(142/2, 142/2, 10, 32),
        new THREE.MeshLambertMaterial({color: 0x0000D0}) // Bleu
    );
    hat.position.set(0, (160+390+104/2)-10, 0);
    scene.add(hat);
	var hat = new THREE.Mesh(
        new THREE.CylinderGeometry(80/2, 80/2, 70, 32),
        new THREE.MeshLambertMaterial({color: 0x0000D0}) // Bleu
    );
    hat.position.set(0, 160+390+104/2+20, 0);
    scene.add(hat);
}


function createDrinkingBird() {

	// MODELS
	// base + legs + feet
	createSupport();

	// body + body/head connector
	createBody();

	// head + hat
	createHead();
}

function fillScene() {
	// SCENE
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );
	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );
	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -400, 200, -300 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

    if (ground) {
        Coordinates.drawGround({size:1000});
    }
    if (gridX) {
        Coordinates.drawGrid({size:1000,scale:0.01});
    }
    if (gridY) {
        Coordinates.drawGrid({size:1000,scale:0.01, orientation:"y"});
    }
    if (gridZ) {
        Coordinates.drawGrid({size:1000,scale:0.01, orientation:"z"});
    }
    if (axes) {
        Coordinates.drawAllAxes({axisLength:300,axisRadius:2,axisTess:50});
    }
	createDrinkingBird();
}
//
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
	gui.add(effectController, "newGridX").name("Show XZ grid");
	gui.add( effectController, "newGridY" ).name("Show YZ grid");
	gui.add( effectController, "newGridZ" ).name("Show XY grid");
	gui.add( effectController, "newGround" ).name("Show ground");
	gui.add( effectController, "newAxes" ).name("Show axes");

}

try {
	init();
	setupGui();
	addToDOM();
	animate();
} catch(e) {
}