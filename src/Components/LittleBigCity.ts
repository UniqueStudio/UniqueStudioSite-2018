import * as THREE from "three";
import cityMTL from "../Assets/Model/city.mtl";
import cityOBJ from "../Assets/Model/city.obj"; // TODO: obj file need losing weight.

// FIXME: dirty code
(window as any).THREE = THREE;
require("three/examples/js/loaders/MTLLoader.js");
require("three/examples/js/loaders/OBJLoader.js");
require("three/examples/js/controls/OrbitControls.js");

// var mouseX = 0;
// var mouseY = 0;
// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
camera.position.z = 250;

// scene

const scene = new THREE.Scene();

scene.add(new THREE.AmbientLight(0xeeeeee, 1));

(function() {
  var geometry = new THREE.BoxGeometry(10, 10, 10);
  var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 100, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
})();
(function() {
  var geometry = new THREE.BoxGeometry(20, 20, 20);
  var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 160, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
})();

var light = new THREE.DirectionalLight(0xcccccc, 0.2);
light.position.set(0, 300, 0);
light.castShadow = true;

scene.add(light);
scene.add(new THREE.DirectionalLightHelper(light));

var controls = new THREE.OrbitControls(camera);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.update();

scene.add(camera);

const mtlLoader = new THREE.MTLLoader();
mtlLoader.load(cityMTL, function(materials) {
  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load(
    cityOBJ,
    function(object) {
      // object.position.y = -95;
      // object.translateY(100);
      // var pointLight = new THREE.DirectionalLight(0xffffff, 0.8);
      // pointLight.position.y = 100;
      // object.add(pointLight);

      object.castShadow = true;
      object.receiveShadow = true;

      scene.add(object);
    },
    () => {},
    () => {}
  );
});

const renderer = new THREE.WebGLRenderer();
renderer.shadowMapEnabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("littlebig-city")!.appendChild(renderer.domElement);

// document.addEventListener("mousemove", onDocumentMouseMove, false);
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  // windowHalfX = window.innerWidth / 2;
  // windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// function onDocumentMouseMove(event: MouseEvent) {
//   mouseX = (event.clientX - windowHalfX) / 2;
//   mouseY = (event.clientY - windowHalfY) / 2;
// }

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  // camera.position.x += (mouseX - camera.position.x) * 0.05;
  // camera.position.y += (-mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();
