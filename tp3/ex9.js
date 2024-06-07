////////////////////////////////////////////////////////////////////////////////

/*global THREE, Coordinates, document, window, dat*/
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {dat} from "./lib/dat.gui.min.js";
window.scene = new THREE.Scene();
import {Coordinates} from "./lib/Coordinates.js";

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = false;
var arm, forearm;

function ajouter(){
		var nb = Math.floor(Math.random()*5);
	
		for(var i = 0; i < nb; i++){
			var forme = Math.random();
			var dim = Math.floor(Math.random()*5) + 1;
			var couleurr = Math.random();
			var couleurg = Math.random();
			var couleurb = Math.random();
			var posx = Math.floor(Math.random()*20) - 10;
			var posy = Math.floor(Math.random()*20) - 10;
			var posz = Math.floor(Math.random()*20) - 10;
	
			var couleurAlea = new THREE.MeshLambertMaterial();
			couleurAlea.color.r = couleurr;
			couleurAlea.color.g = couleurg;
			couleurAlea.color.b = couleurb;
			if(forme >= 0.5){
				var sphere = new THREE.Mesh( 
					new THREE.SphereGeometry( dim, 50, 50), couleurAlea );
					sphere.position.x = posx;
					sphere.position.y = posy;
					sphere.position.z = posz;
				scene.add( sphere );
			}else{
				var cube = new THREE.Mesh( 
					new THREE.BoxGeometry( dim, dim, dim), couleurAlea );
					cube.position.x = posx;
					cube.position.y = posy;
					cube.position.z = posz;
				scene.add( cube );
			}
}
}

function fillScene() {
	scene = new THREE.Scene();
    window.scene = scene;
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );

	var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
	light.position.set( 200, 400, 500 );
	
	var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
	light2.position.set( -500, 250, -200 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

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
	var nb = Math.floor(Math.random()*5);
	
	for(var i = 0; i < nb; i++){
		var forme = Math.random();
		var dim = Math.floor(Math.random()*5) + 1;
		var couleurr = Math.random();
		var couleurg = Math.random();
		var couleurb = Math.random();
		var posx = Math.floor(Math.random()*20) - 10;
		var posy = Math.floor(Math.random()*20) - 10;
		var posz = Math.floor(Math.random()*20) - 10;

		var couleurAlea = new THREE.MeshLambertMaterial();
		couleurAlea.color.r = couleurr;
		couleurAlea.color.g = couleurg;
		couleurAlea.color.b = couleurb;
		if(forme >= 0.5){
			var sphere = new THREE.Mesh( 
				new THREE.SphereGeometry( dim, 50, 50), couleurAlea );
				sphere.position.x = posx;
				sphere.position.y = posy;
				sphere.position.z = posz;
			scene.add( sphere );
		}else{
			var cube = new THREE.Mesh( 
				new THREE.BoxGeometry( dim, dim, dim), couleurAlea );
				cube.position.x = posx;
				cube.position.y = posy;
				cube.position.z = posz;
			scene.add( cube );
			}
	}
	
	
	

}
function init() {
    var button = document.getElementById("btnAdd");
    button.addEventListener('click', ajouter);

	var canvasWidth = 500;
	var canvasHeight = 500;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );


	var container = document.getElementById('webGL');
	container.appendChild( renderer.domElement );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 30, canvasRatio, 1, 10000 );
	camera.position.set( 0, 50, 50 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);
	
	fillScene();

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
		newAxes: axes,
		
		uy: 70.0,
		uz: -15.0,

		fy: 10.0,
		fz: 60.0
	};

	var gui = new dat.GUI();
	var h = gui.addFolder("Grid display");
	h.add( effectController, "newGridX").name("Show XZ grid");
	h.add( effectController, "newGridY" ).name("Show YZ grid");
	h.add( effectController, "newGridZ" ).name("Show XY grid");
	h.add( effectController, "newGround" ).name("Show ground");
	h.add( effectController, "newAxes" ).name("Show axes");
}

init();
setupGui();
animate();

