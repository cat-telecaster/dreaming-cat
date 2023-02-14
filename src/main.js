import * as THREE from 'three';

let camera, scene, renderer;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
  camera.position.z = 50;

  scene = new THREE.Scene();

  const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
  const material = new THREE.MeshNormalMaterial();

  for ( let i = 0; i < 150; i ++ ) {

    const object = new THREE.Mesh( geometry, material );
    object.position.x = Math.random() * 80 - 40;
    object.position.y = Math.random() * 80 - 40;
    object.position.z = Math.random() * 80 - 40;
    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;
    scene.add( object );

  }

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'wheel', onMouseWheel, false );
  window.addEventListener( 'resize', onResize, false );

}

function onMouseMove( event ) {

  mouse.x = ( event.clientX - windowHalf.x );
  mouse.y = ( event.clientY - windowHalf.x );

}

function onMouseWheel( event ) {

  camera.position.z += event.deltaY * 0.01; // move camera along z-axis

}

function onResize( event ) {

  const width = window.innerWidth;
  const height = window.innerHeight;

  windowHalf.set( width / 2, height / 2 );

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );

}

function animate() {

  target.x = ( 1 - mouse.x ) * 0.0002;
  target.y = ( 1 - mouse.y ) * 0.0002;

  camera.rotation.x += 0.05 * ( target.y - camera.rotation.x );
  camera.rotation.y += 0.05 * ( target.x - camera.rotation.y );

  requestAnimationFrame( animate );
  renderer.render( scene, camera );

}