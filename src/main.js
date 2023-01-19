import '../styles/main.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#c')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 4.8; // 2.8
camera.position.x = -0.8; // -1.5

// Load external GLTF models from directory
let instaGalaxyMesh;    // mesh for insta galaxy
let fbGalaxyMesh;       // mesh for fb galaxy
let linkedinGalaxyMesh; // mesh for linkedin galaxy
let gitGalaxyMesh;      // mesh for git galaxy
let taroMesh;           // mesh for azathoth
const objLoader = new GLTFLoader();

// Azathoth
objLoader.load( './assets/models/sleeping_taro2.gltf', ( gltf ) => {
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
objLoader.load( './assets/models/insta_galaxy_obj2.gltf', ( gltf ) => {
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
objLoader.load( './assets/models/fb_galaxy_obj1.gltf', ( gltf ) => {
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

// LinkedIn galaxy
objLoader.load( './assets/models/linkedin_galaxy_obj1.gltf', ( gltf ) => {
  linkedinGalaxyMesh = gltf.scene;
  linkedinGalaxyMesh.scale.set(1.1, 1.1, 1.1);
  scene.add(linkedinGalaxyMesh);
  linkedinGalaxyMesh.position.x = -0.3;
  linkedinGalaxyMesh.position.y = 0.4;
  linkedinGalaxyMesh.position.z = 0.1;
  linkedinGalaxyMesh.rotation.z = 0.3;
  linkedinGalaxyMesh.rotation.x = 0.3;
}, undefined, function ( error ) {
  console.error( error );
});

// GitHub galaxy
objLoader.load( './assets/models/git_galaxy_obj1.gltf', ( gltf ) => {
  gitGalaxyMesh = gltf.scene;
  gitGalaxyMesh.scale.set(-1, -1, 1);
  scene.add(gitGalaxyMesh);
  gitGalaxyMesh.position.x = -0.7;
  gitGalaxyMesh.position.y = 1.0;
  gitGalaxyMesh.position.z = -1.1;
  gitGalaxyMesh.rotation.z = -0.3;
  gitGalaxyMesh.rotation.x = -0.2;
}, undefined, function ( error ) {
  console.error( error );
});

// Stars
function addStar () {
  const geometry = new THREE.SphereGeometry(0.05, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread( 100 ) );

  star.position.set(x, y, z);
  scene.add(star);
};

Array(500).fill().forEach(addStar);

// Lighting

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(10,15,5);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);

scene.add(pointLight, ambientLight);

// Background

function setBackground(scene, backgroundImageWidth, backgroundImageHeight) {
  const windowSize = function(withScrollBar) {
    let wid = 0;
    let hei = 0;
    if (typeof window.innerWidth != "undefined") {
      wid = window.innerWidth;
      hei = window.innerHeight;
    }
    else {
      if (document.documentElement.clientWidth == 0) {
        wid = document.body.clientWidth;
        hei = document.body.clientHeight;
      }
      else {
        wid = document.documentElement.clientWidth;
        hei = document.documentElement.clientHeight;
      }
    }
    return { width: wid - (withScrollBar ? (wid - document.body.offsetWidth + 1) : 0), height: hei };
  };

  if (scene.background) {

    const size = windowSize(true);
    const factor = (backgroundImageWidth / backgroundImageHeight) / (size.width / size.height);

    scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
    scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;

    scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
    scene.background.repeat.y = factor > 1 ? 1 : factor;
  }
}

const backgroundImg = new Image();
backgroundImg.onload = function () {
  scene.background = new THREE.TextureLoader().load(backgroundImg.src);
  setBackground(scene, backgroundImg.width, backgroundImg.height);
};
backgroundImg.src = './assets/background/render5_1080.png';

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper, gridHelper);

// Camera controls

const controls = new OrbitControls(camera, renderer.domElement);
/*const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  
  camera.position.z = t * -0.01; 
  camera.position.x = t * -0.01;
};
*/

// Animation Loop

const animate = () => {
  requestAnimationFrame(animate);

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  instaGalaxyMesh.rotateY(0.02);
  fbGalaxyMesh.rotateY(-0.01);
  linkedinGalaxyMesh.rotateY(0.006);
  gitGalaxyMesh.rotateY(-0.008);

  //document.body.onscroll = moveCamera();
  controls.update();

  renderer.render(scene, camera);
}

animate();
