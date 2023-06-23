import * as THREE from "three";
export function getValuesForCuboId(cuboid, repeatVal) {
  let width = +document.querySelector("#width").value;
  let depth = +document.querySelector("#depth").value;

  if (width === 0 || depth === 0) {
    document.querySelector(".err-msg").innerText = "please type a number";
    document.querySelector("#width").value = "";
    document.querySelector("#depth").value = "";
  } else {
    document.querySelector(".err-msg").innerText = "";
    if (width > 10) {
      repeatVal = width / 10;
    }

    const newBoxGeometry = new THREE.BoxGeometry(width, 8, depth);
    cuboid.geometry = newBoxGeometry;
    document.querySelector("#width").value = "";
    document.querySelector("#depth").value = "";
  }

  return {
    repeatValue: repeatVal,
    width: cuboid.geometry.parameters.width,
    height: cuboid.geometry.parameters.height,
    depth: cuboid.geometry.parameters.depth,
  };
}

export function cameraPosition(camera, scene, dir) {
  dir === "left"
    ? camera.position.set(-20, 0, 8)
    : camera.position.set(0, 0, -20);
  camera.lookAt(scene.position);
}

export function repeatWrapping(texture, geometryWidth) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(geometryWidth, 1);
}

export function fitSizeOfViewPort(cube, camera, controls) {
  let box = new THREE.Box3().setFromObject(cube);
  let size = box.getSize(new THREE.Vector3());
  let distance = Math.max(size.x, size.y, size.z);
  camera.position.z = distance;
  controls.target.set(0, 0, 0);
  controls.maxDistance = distance * 10;
  controls.update();
}
