import * as THREE from "three";
import cityMTL from "../Assets/Model/city.mtl";
import cityOBJ from "../Assets/Model/city.obj";

(window as any).THREE = THREE;
require("three/examples/js/loaders/MTLLoader.js");
require("three/examples/js/loaders/OBJLoader.js");

var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
camera.position.z = 250;

// scene

const scene = new THREE.Scene();

var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 0.8);
camera.add(pointLight);
scene.add(camera);

const mtlLoader = new THREE.MTLLoader();
mtlLoader.load(cityMTL, function(materials) {
  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load(
    cityOBJ,
    function(object) {
      object.position.y = -95;
      scene.add(object);
    },
    () => {},
    () => {}
  );
});

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("littlebig-city")!.appendChild(renderer.domElement);

document.addEventListener("mousemove", onDocumentMouseMove, false);
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event: MouseEvent) {
  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();
