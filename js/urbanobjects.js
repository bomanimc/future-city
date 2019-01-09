const urbanObjects = new Map();
const preloadedObjects = new Map();
const codeToObjectMap = {
  '563': 'tree',
  '1189': 'bike',
  '421': 'cube',
}

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({
   color: 0xff00ff,
   ambient: 0x121212,
   emissive: 0x121212
});
preloadedObjects.set('cube', {
  objectMesh: new THREE.Mesh(geometry, material),
  scalingFactor: 1,
});

// Bat Mobile
const stlLoader = new THREE.STLLoader();
stlLoader.load('models/bat11.stl', function (geometry) {
  var material = new THREE.MeshPhongMaterial({
    color: 0xff5533,
    specular: 0x111111,
    shininess: 200,
  });
  mesh = new THREE.Mesh( geometry, material );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  preloadedObjects.set('bike', {objectMesh: mesh, scalingFactor: 0.01});
  preloadedObjects.set('tree', {objectMesh: mesh, scalingFactor: 0.01});
});

var color = 0x000000;

// Create your main scene
var scene = new THREE.Scene();

// Create your main camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create lights
var light = new THREE.PointLight(0xEEEEEE);
light.position.set(20, 0, 20);
scene.add(light);

var lightAmb = new THREE.AmbientLight(0x777777);
scene.add(lightAmb);

// Create your renderer
var renderer = new THREE.WebGLRenderer();
const container = document.getElementById('three-container');
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Set up the main camera
camera.position.z = 5;

// Load the background texture
const loader = new THREE.TextureLoader();
const backgroundImageTexture = loader.load('img/parkinglot.jpg');
var backgroundMesh = new THREE.Mesh(
 new THREE.PlaneGeometry(2, 2, 0),
 new THREE.MeshBasicMaterial({
   map: backgroundImageTexture,
}));

backgroundMesh.material.depthTest = false;
backgroundMesh.material.depthWrite = false;

// Create your background scene
var backgroundScene = new THREE.Scene();
var backgroundCamera = new THREE.Camera();
backgroundScene.add(backgroundCamera);
backgroundScene.add(backgroundMesh);

const videoCanvas = document.getElementById('video-canvas');

// Rendering function
var render = function () {
  requestAnimationFrame(render);

  const topcodes = getTopCodesList().getTopCodes();
  if (topcodes.length > 0) {
    for (let i = 0; i < topcodes.length; i++) {
      const topcode = topcodes[i];
      const code = topcode.code;

      let topcodePosX = topcode.x;
      let topcodePosY = topcode.y;

      let relativeX = (topcodePosX * window.innerWidth) / videoCanvas.width;
      let relativeY = (topcodePosY * window.innerHeight) / videoCanvas.height;

      const scalingFactor = preloadedObjects.get(
        codeToObjectMap[code.toString()]
      ).scalingFactor;
      console.log("Scaling", scalingFactor);

      let scaledX = scaleToRange(relativeX, 0, videoCanvas.width, 2, -5);
      let scaledSize = scaleToRange(relativeY, videoCanvas.height, 0, 3, 1) * scalingFactor;

      console.log("Scaled X", scaledX);
      console.log("Scaled Size", scaledSize);

      let object = urbanObjects.get(code);
      if (!object) {
        object = addNewObject(scene, code);
        urbanObjects.set(code, object);
      }

      object.position.setX(scaledX);
      object.scale.set(scaledSize, scaledSize, scaledSize);
    }
  }

  renderer.autoClear = false;
  renderer.clear();
  renderer.render(backgroundScene , backgroundCamera );
  renderer.render(scene, camera);
};

render();

// Clean up the urbanObjects map to remove any objects that were placed by
// incorrect topcode readings. Rather than doing this in the draw loop, we can
// do it here to reduce flickering when the code tracking is temporarily lost.
setInterval(function() {
  const topcodes = getTopCodesList().getTopCodes();
  const currentCodes = topcodes.map(topcode => topcode.code);
  Array.from(urbanObjects.keys()).map(code => {
    if (!currentCodes.includes(code)) {
      scene.remove(urbanObjects.get(code));
      urbanObjects.delete(code);
    }
  });
}, 500);

function addNewObject(scene, code) {
  let mesh = null;
  const objectType = codeToObjectMap[code.toString()];
  const objectMesh = preloadedObjects.get(objectType).objectMesh;

  scene.add(objectMesh);
  return objectMesh;
}

function scaleToRange(num, inMin, inMax, outMin, outMax) {
  const scaledValue = (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

  const highestOut = outMax > outMin ? outMax : outMin;
  const lowestOut = outMin < outMax ? outMin : outMax;

  if (scaledValue > highestOut) {
    return highestOut;
  } else if (scaledValue < lowestOut) {
    return lowestOut;
  }

  return scaledValue;
}
