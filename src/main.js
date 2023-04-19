import '../styles/main.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

let camera, scene, raycaster, renderer, objLoader;

let clickableObjects = [];

// Load external GLTF models from directory
let instaGalaxyMesh;    // mesh for insta galaxy
let fbGalaxyMesh;       // mesh for fb galaxy
let linkedinGalaxyMesh; // mesh for linkedin galaxy
let gitGalaxyMesh;      // mesh for git galaxy
let taroMesh;           // mesh for azathoth

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

let mouseWheelY = 0;
let translatedMouseWheelY = 75; // Initial position for camera.position.y

let scrollY = window.scrollY;
let currentSection = 0;
let lastScrollTop = 0;

// GSAP Animations

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({
    ease: "power2.out", 
    duration: 1
});

const sections = document.querySelectorAll('.section');
const testText = new SplitType('#test-text')
gsap.to('.char', {
    y: 0,
    stagger: 0.05,
    delay: 0.2,
    duration: 0.1,
});
gsap.to('h2', {
    y: 0,
    // stagger: 0.05,
    delay: 0.1,
    duration: 0.1,
    scrollTrigger: {
        trigger: sections[1],
    },
});

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.8; // 2.8
    camera.position.x = 0.3; // -1.5

    scene = new THREE.Scene();

    objLoader = new GLTFLoader();

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
        instaGalaxyMesh.userData = {
            URL: 'https://www.instagram.com/kayc.jpg'
        };
        clickableObjects.push(instaGalaxyMesh);
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
        fbGalaxyMesh.userData = {
            URL: 'https://www.facebook.com/crunchtofu'
        };
        clickableObjects.push(fbGalaxyMesh);
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
        linkedinGalaxyMesh.userData = {
            URL: 'https://www.linkedin.com/in/kayconnect'
        };
        clickableObjects.push(linkedinGalaxyMesh);
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
        gitGalaxyMesh.userData = {
            URL: 'https://github.com/cat-telecaster'
        };
        clickableObjects.push(gitGalaxyMesh);
    }, undefined, function ( error ) {
        console.error( error );
    });

    // Stars
    function addStar () {
        const geometry = new THREE.SphereGeometry(0.05, 24, 24);
        const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
        const star = new THREE.Mesh( geometry, material );

        const [x, y, z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread( 200 ) );

        star.position.set(x, y, z);
        scene.add(star);
    };

    Array(5000).fill().forEach(addStar);

    // Lighting

    const pointLight = new THREE.PointLight(0xCFCFCF);
    pointLight.position.set(-50,22,25);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF);

    scene.add(pointLight, ambientLight);

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

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#c'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('wheel', onMouseWheel, false);
    document.addEventListener('click', onMouseClick, false);
    window.addEventListener('resize', onResize, false);
    window.addEventListener('scroll', onScroll, false);
}

function onMouseMove(event) {

    mouse.x = (event.clientX - windowHalf.x);
    mouse.y = (event.clientY - windowHalf.y);

}

function onMouseWheel(event) {

    mouseWheelY = event.deltaY * 0.0007;

}

function onMouseClick(event) {
    event.preventDefault();
    mouse.x = ((event.clientX / window.innerWidth) * 2 - 1);
    mouse.y = (-(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObjects(clickableObjects);
    if (intersects.length > 0) {
        const { URL } = intersects[0].object.parent.userData;
        window.open(URL, '_blank');
    }
}

function onResize(event) {

    const width = window.innerWidth;
    const height = window.innerHeight;

    windowHalf.set(width / 2, height / 2);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

}

function onScroll(event) {

    scrollY = window.scrollY;

}

function animate() {

    requestAnimationFrame(animate);

    raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObjects(clickableObjects);
    if (intersects.length > 0) {
        document.documentElement.style.cursor = "pointer";
    } else {
        document.documentElement.style.cursor = "initial";
    }

    translatedMouseWheelY = - scrollY / window.innerHeight + 5 * 0.6;
    translatedMouseWheelY *= 10

    camera.position.y = translatedMouseWheelY;

    target.x = (1 - mouse.x) * 0.0002;
    target.y = (1 - mouse.y) * 0.0002;

    if (instaGalaxyMesh) instaGalaxyMesh.rotateY(0.02);
    if (fbGalaxyMesh) fbGalaxyMesh.rotateY(-0.01);
    if (linkedinGalaxyMesh) linkedinGalaxyMesh.rotateY(0.006);
    if (gitGalaxyMesh) gitGalaxyMesh.rotateY(-0.008);

    camera.rotation.x += 0.05 * (target.y - camera.rotation.x);
    camera.rotation.y += 0.05 * (target.x - camera.rotation.y);

    renderer.render(scene, camera);

}

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
