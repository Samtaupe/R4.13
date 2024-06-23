import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let container, stats;
let camera, scene, renderer;
let controls, water, sun, mesh, sunLight;
let appleObject;  // Référence pour le modèle de la pomme

init();

function init() {
    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(30, 30, 100);

    sun = new THREE.Vector3();

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('textures/water.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
        }
    );
    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 0
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sceneEnv = new THREE.Scene();

    let renderTarget;

    sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 512;
    sunLight.shadow.mapSize.height = 512;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    scene.add(sunLight);

    function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();

        sunLight.position.copy(sun).multiplyScalar(100);

        sceneEnv.add(sky);
        renderTarget = pmremGenerator.fromScene(sceneEnv);
        scene.add(sky);

        scene.environment = renderTarget.texture;
    }

    updateSun();

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('skybox/mud_road_puresky_1k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
        const skyboxMat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });

        const skybox = new THREE.Mesh(skyboxGeo, skyboxMat);
        scene.add(skybox);

        scene.background = texture;
    });

    const floor = new THREE.BoxGeometry(100, 1, 50);
    const material = new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 0,
        shadowSide: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(floor, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const wall = new THREE.BoxGeometry(100, 50, 10);
    const textureWall = new THREE.TextureLoader().load("textures/wall_brick.png");
    textureWall.wrapS = THREE.RepeatWrapping;
    textureWall.wrapT = THREE.RepeatWrapping;

    const wallMaterial = new THREE.MeshStandardMaterial({
        map: textureWall,
        roughness: 0,
        metalness: 0,
        shadowSide: THREE.DoubleSide
    });
    mesh = new THREE.Mesh(wall, wallMaterial);
    mesh.position.set(0, 0, -30);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const mtlLoader = new MTLLoader();
    mtlLoader.load('model/apple/Green_Apple_OBJ.mtl', (materials) => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('model/apple/Green_Apple_OBJ.obj', (object) => {
            object.scale.set(0.05, 0.05, 0.05); 
            object.position.set(0, 47, 0); 
            object.castShadow = true;
            object.receiveShadow = true;
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material.color.set(0xff0000);
                }
            });
            appleObject = object;  // Sauvegarder la référence pour la pomme

            scene.add(object);
        }, undefined, (error) => {
            console.error(error);
        });
    });

    const fbxLoader = new FBXLoader();
    fbxLoader.load('model/Slender_Man_Lores.fbx', (object) =>{
        object.scale.set(0.3, 0.3, 0.3); 
        object.position.set(0, 0, -6); 
        object.castShadow = true;
        object.receiveShadow = true;
        object.traverse((child => {
            if(child.isMesh){
                child.material.color.set(0xf9E4B7);
            }
        }))
        scene.add(object);
    }, undefined, (error) => {
        console.error(error);
    });

    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    stats = new Stats();
    container.appendChild(stats.dom);

    const gui = new GUI();
    const folderSky = gui.addFolder('Sky');
    folderSky.add(parameters, 'elevation', 1, 90, 0.1).onChange(updateSun);
    folderSky.add(parameters, 'azimuth', -180, 180, 0.1).onChange(updateSun);
    folderSky.open();

    const fogParams = {
        color: 0xffffff,
        near: 1,
        far: 10000
    };

    var fog = new THREE.Fog(fogParams.color, fogParams.near, fogParams.far);
    scene.fog = fog;

    const folderFog = gui.addFolder('Fog');
    folderFog.addColor(fogParams, 'color').onChange((value) => {
        fog.color.set(value);
    });
    folderFog.add(fogParams, 'near', 1, 1000).onChange((value) => {
        fog.near = value;
    });
    folderFog.add(fogParams, 'far', 1000, 10000).onChange((value) => {
        fog.far = value;
    });
    folderFog.open();

    const appleParams = {
        transparent: false
    };

    const folderApple = gui.addFolder('Apple');
    folderApple.add(appleParams, 'transparent').onChange((value) => {
        if (appleObject) {
            appleObject.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = value;
                    child.material.opacity = value ? 0.5 : 1.0;
                }
            });
        }
    });
    folderApple.open();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    render();
    stats.update();
}

function render() {
    water.material.uniforms['time'].value += 1.0 / 60.0;
    renderer.render(scene, camera);
}
