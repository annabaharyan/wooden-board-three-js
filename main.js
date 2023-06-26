import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  cameraPosition,
  fitSizeOfViewPort,
  getValuesForCuboId,
  repeatWrapping,
} from "./helpers";

const canvasPart = document.querySelector(".canvas");
const buttonSet = document.querySelector(".btn-set");
const btnCameraLeft = document.querySelector(".left");
const btnCameraFront = document.querySelector(".front");

const width = canvasPart.clientWidth;
const height = canvasPart.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 0, -20);

const light = new THREE.AmbientLight(0x404040);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(0, 20, -10);
scene.add(pointLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

canvasPart.appendChild(renderer.domElement);
window.addEventListener("resize", () => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
const controls = new OrbitControls(camera, renderer.domElement);

let geometry = new THREE.BoxGeometry(2, 8, 2);
const map = new THREE.TextureLoader().load("./textures/wood-texture.jpg");
const dmap = new THREE.TextureLoader().load("./textures/displacement.jpg");
const bmap = new THREE.TextureLoader().load("./textures/bump.jpg");

let geometryWidth = geometry.parameters.width;
let repeatVal;
if (geometryWidth <= 10) {
  repeatVal = geometryWidth;
} else {
  repeatVal = geometryWidth / 10;
}

repeatWrapping(map, geometryWidth);
repeatWrapping(bmap, geometryWidth);
repeatWrapping(dmap, geometryWidth);

const material = new THREE.MeshPhongMaterial({
  bumpMap: bmap,
  bumpScale: 1.3,
  displacementMap: dmap,
  displacementScale: 0.002,
  map: map,
});

let cuboid = new THREE.Mesh(geometry, material);

buttonSet.addEventListener("click", () => {
  let { repeatValue, width, height, depth } = getValuesForCuboId(
    cuboid,
    repeatVal
  );

  map.repeat.set(repeatValue, 1);
  bmap.repeat.set(repeatValue, 1);
  dmap.repeat.set(repeatValue, 1);
  fitSizeOfViewPort(cuboid,camera,controls);
});

scene.add(cuboid);

btnCameraLeft.addEventListener("click", () => {
  cameraPosition(camera, scene, "left");
  fitSizeOfViewPort(cuboid,camera,controls);
});

btnCameraFront.addEventListener("click", () => {
  cameraPosition(camera, scene, "front");
  fitSizeOfViewPort(cuboid,camera,controls);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
