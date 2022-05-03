import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Load external GLTF models from directory
let instaGalaxyMesh;    // mesh for insta galaxy
let fbGalaxyMesh;       // mesh for fb galaxy
let linkedinGalaxyMesh; // TODO: mesh for linkedin galaxy
let gitGalaxyMesh;      // TODO: mesh for git galaxy
let taroMesh;           // mesh for azathoth
const objLoader = new GLTFLoader();

// Azathoth
objLoader.load( './models/sleeping_taro2.gltf', ( gltf ) => {
  taroMesh = gltf.scene;
  taroMesh.scale.set(10, 10, 10);
  scene.add(taroMesh);
  taroMesh.position.x = 0;
  taroMesh.position.y = 0;
  taroMesh.position.z = 0;
  taroMesh.rotation.y = 3;
}, undefined, function ( error ) {
  console.error( error );
});

// Insta galaxy
objLoader.load( './models/insta_galaxy_obj2.gltf', ( gltf ) => {
  instaGalaxyMesh = gltf.scene;
  instaGalaxyMesh.scale.set(0.5, 0.5, 0.5);
  scene.add(instaGalaxyMesh);
  instaGalaxyMesh.position.x = -0.4;
  instaGalaxyMesh.position.y = 1.5;
  instaGalaxyMesh.position.z = 0;
  instaGalaxyMesh.rotation.y = -0.4;
  instaGalaxyMesh.rotation.z = 0.4;
}, undefined, function ( error ) {
  console.error( error );
});

// Facebook galaxy
objLoader.load( './models/fb_galaxy_obj1.gltf', ( gltf ) => {
  fbGalaxyMesh = gltf.scene;
  fbGalaxyMesh.scale.set(-0.7, -0.7, 0.7);
  scene.add(fbGalaxyMesh);
  fbGalaxyMesh.position.x = 0.8;
  fbGalaxyMesh.position.y = 0.9;
  fbGalaxyMesh.position.z = 0.2;
  fbGalaxyMesh.rotation.y = -0.8;
  fbGalaxyMesh.rotation.x = 0.7;
}, undefined, function ( error ) {
  console.error( error );
});

// Lighting

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(10,15,5);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);

scene.add(pointLight, ambientLight);

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper, gridHelper);

// Animation Loop

const controls = new OrbitControls(camera, renderer.domElement);

const animate = () => {
  requestAnimationFrame(animate);

  instaGalaxyMesh.rotateY(0.02);
  fbGalaxyMesh.rotateY(-0.01);

  controls.update();

  renderer.render(scene, camera);
}

animate();
