import * as THREE from 'three';
import WebGL from './WebGL';
import { buildPendeloque } from './pendeloque.js';
import OrbitControls from 'orbit-controls-es6';

// SETUP ------------------------------------------
var scene = new THREE.Scene();
const fov = 60;
const aspect = window.innerWidth/window.innerHeight;
const near = 0.1;
const far = 1000;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(8, 8, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const controls = new OrbitControls(camera);
controls.minDistance = 10;
controls.maxDistance = 10;
controls.enableKeys = false;
controls.enablePan = false;
controls.rotateSpeed = 0.5;
controls.enableRotate = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

// ENVIRONMENT ------------------------------------------
const cubeMap = new THREE.CubeTextureLoader()
	.setPath('http://127.0.0.1:8080/')
	.load( [
		'posx.blur.png',
		'negx.blur.png',
		'posy.blur.png',
		'negy.blur.png',
		'posz.blur.png',
		'negz.blur.png'
  ]);

// GEOMETRY ------------------------------------------
const pdlq = buildPendeloque();
const material = new THREE.MeshPhysicalMaterial({
  color: 0x333333,
  side: THREE.DoubleSide,
  opacity: 0.2,
  flatShading: true,
  roughness: 0.3,
  envMap: cubeMap,
  refractionRatio: 0.8,
  reflectivity: 1.5,
});
var mesh = new THREE.Mesh(pdlq.geometry, material);
mesh.rotation.x = -45;
scene.add(mesh);

var texture = new THREE.TextureLoader().load('http://127.0.0.1:8080/background.png');
// scene.background = texture;


/// Debugging
// const innerMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
// const outerMaterial = new THREE.MeshBasicMaterial( { color: 0x00aaff } );
// const centerMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const geo = new THREE.IcosahedronBufferGeometry(0.05);
// pdlq.positions.map((p, i) => {
//   console.log(`point ${i}: ${Math.round(p[0])}/${Math.round(p[1])}/${Math.round(p[2])}`);
//   if (i < 7) {
//     let mesh = new THREE.Mesh(geo, innerMaterial);
//     mesh.position.x = p[0];
//     mesh.position.y = p[1];
//     mesh.position.z = p[2];
//     scene.add(mesh);
//   }
//   if (i >= 7 && i < 13) {
//     let mesh = new THREE.Mesh(geo, outerMaterial);
//     mesh.position.x = p[0];
//     mesh.position.y = p[1];
//     mesh.position.z = p[2];
//     scene.add(mesh);
//   }
//   if (i >= 13 && i < 19) {
//     let mesh = new THREE.Mesh(geo, centerMaterial);
//     mesh.position.x = p[0];
//     mesh.position.y = p[1];
//     mesh.position.z = p[2];
//     scene.add(mesh);
//   }
// });

// LIGHTS ------------------------------------------
const light1 = new THREE.DirectionalLight({
  color: 0xff0000,
  intensity: 0.3
});
light1.position.set(0, 5, 0);
scene.add(light1);

var light2 = new THREE.DirectionalLight({
  color: 0xff0000,
  intensity: 0.5
});
light2.position.set(0, -5, 0);
scene.add(light2);

// var light3 = new THREE.DirectionalLight({
//   color: 0xffffff,
//   intensity: 5.0
// });
// light3.position.set(0, -10, 0);
// scene.add(light3);

// RENDER ------------------------------------------
let step = 0;
let radius = 10.0;
var animate = function () {
	requestAnimationFrame(animate);

  light1.position.x = radius * Math.sin(step);
  light1.position.z = radius * Math.cos(step);
  step += 0.002;

  light2.position.x = radius * Math.sin(step + 1.5);
  light2.position.z = radius * Math.cos(step + 1.5);
  step += 0.005;

  mesh.rotation.z = step / 100.0;

	renderer.render(scene, camera);
  controls.update();
};

animate();
