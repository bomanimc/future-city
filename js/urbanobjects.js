// Define globally useful maps
const urbanObjects = new Map();
const preloadedObjects = new Map();
const codeToObjectMap = {
  '563': 'tree',
  '361': 'bike',
  '421': 'tricycle',
  '271': 'pug',
  '313': 'seasaw',
  '203': 'bench',
  '155': 'coffee_shop',
  '563': 'food_stand',
}

// Key DOM Elements
const videoCanvas = document.getElementById('video-canvas');
const container = document.getElementById('three-container');

// Preload objects
preloadObjects();

// Create your main scene
var scene = new THREE.Scene();

// Create your main camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create lights
var light = new THREE.PointLight(0xEEEEEE);
var lightAmb = new THREE.AmbientLight(0x777777);
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.50);
var dirLight = new THREE.DirectionalLight(0xffffff, 0.50);

light.position.set(20, 0, 20);
lightAmb.position.set(20, 0, 20);
hemiLight.position.set(20, 0, 20);
dirLight.position.set(20, 0, 20);

scene.add(light);
scene.add(lightAmb);
scene.add(hemiLight);
scene.add(dirLight);

// Create your renderer
var renderer = new THREE.WebGLRenderer();
const threeContainerWidth = container.offsetWidth;
const threeContainerHeight = container.offsetHeight;
renderer.setSize(threeContainerWidth, threeContainerHeight);
container.appendChild(renderer.domElement);

// Set up the main camera
camera.position.z = 5;

// Load the background texture
const textureLoader = new THREE.TextureLoader();
const backgroundImageTexture = textureLoader.load('img/pier.jpg');
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

// Rendering function
var render = function () {
  requestAnimationFrame(render);

  const topcodes = getTopCodesList().getTopCodes();
  if (topcodes.length > 0) {
    for (let i = 0; i < topcodes.length; i++) {
      const topcode = topcodes[i];
      const code = topcode.code;
      const objectType = codeToObjectMap[code.toString()];

      let topcodePosX = topcode.x;
      let topcodePosY = topcode.y;

      let relativeX = (topcodePosX * threeContainerWidth) / videoCanvas.width;
      let relativeY = (topcodePosY * threeContainerHeight) / videoCanvas.height;

      const preloadedObject = preloadedObjects.get(objectType);
      let scalingFactor = 0;
      if (preloadedObject) {
        scalingFactor = preloadedObject.scalingFactor;
      }

      let scaledX = scaleToRange(relativeX, 0, videoCanvas.width, 2, -5);
      let scaledSize = scaleToRange(relativeY, videoCanvas.height, 0, 3, 1) * scalingFactor;

      // console.log("Scaled X", scaledX);
      // console.log("Scaled Size", scaledSize);

      let object = urbanObjects.get(code);
      if (!object) {
        object = addNewObject(scene, objectType);
        urbanObjects.set(code, object);
      }

      object.position.setX(scaledX);
      if ('rotationY' in preloadedObject) {
        object.rotation.y = preloadedObject.rotationY;
      }
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

function addNewObject(scene, objectType) {
  const objectMesh = preloadedObjects.get(objectType).objectMesh;

  scene.add(objectMesh);
  return objectMesh;
}

function preloadObjects() {
  // Bike
  const bikeMTLLoader = new THREE.MTLLoader();
  const bikeOBJLoader = new THREE.OBJLoader();
  bikeMTLLoader.load("models/bike/bike.mtl", function(materials) {
    materials.preload();
    bikeOBJLoader.setMaterials(materials);
    bikeOBJLoader.load('models/bike/bike.obj', function(objectMesh) {
      preloadedObjects.set('bike', {objectMesh: objectMesh, scalingFactor: 0.002});
    });
  });

  // Tree
  const treeMTLLoader = new THREE.MTLLoader();
  const treeOBJLoader = new THREE.OBJLoader();
  treeMTLLoader.load("models/tree/tree.mtl", function(materials) {
    materials.preload();
    treeOBJLoader.setMaterials(materials);
    treeOBJLoader.load('models/tree/tree.obj', function(objectMesh) {
      preloadedObjects.set('tree', {objectMesh: objectMesh, scalingFactor: 0.002});
    });
  });

  // Tricycle
  const tricycleMTLLoader = new THREE.MTLLoader();
  const tricycleOBJLoader = new THREE.OBJLoader();
  tricycleMTLLoader.load("models/tricycle/tricycle.mtl", function(materials) {
    materials.preload();
    tricycleOBJLoader.setMaterials(materials);
    tricycleOBJLoader.load('models/tricycle/tricycle.obj', function(objectMesh) {
      preloadedObjects.set('tricycle', {
        objectMesh: objectMesh,
        scalingFactor: 1,
        rotationY: Math.PI,
      });
    });
  });

  // Pug
  const pugMTLLoader = new THREE.MTLLoader();
  const pugOBJLoader = new THREE.OBJLoader();
  pugMTLLoader.load("models/pug/pug.mtl", function(materials) {
    materials.preload();
    pugOBJLoader.setMaterials(materials);
    pugOBJLoader.load('models/pug/pug.obj', function(objectMesh) {
      preloadedObjects.set('pug', {objectMesh: objectMesh, scalingFactor: 1});
    });
  });

  // Seesaw
  const seesawMTLLoader = new THREE.MTLLoader();
  const seesawOBJLoader = new THREE.OBJLoader();
  seesawMTLLoader.load("models/seasaw/seasaw.mtl", function(materials) {
    materials.preload();
    seesawOBJLoader.setMaterials(materials);
    seesawOBJLoader.load('models/seasaw/seasaw.obj', function(objectMesh) {
      preloadedObjects.set('seasaw', {objectMesh: objectMesh, scalingFactor: 0.1});
    });
  });

  // Bench
  const benchMTLLoader = new THREE.MTLLoader();
  const benchOBJLoader = new THREE.OBJLoader();
  benchMTLLoader.load("models/bench/bench.mtl", function(materials) {
    materials.preload();
    benchOBJLoader.setMaterials(materials);
    benchOBJLoader.load('models/bench/bench.obj', function(objectMesh) {
      preloadedObjects.set('bench', {
        objectMesh: objectMesh,
        scalingFactor: 1,
        rotationY: Math.PI,
      });
    });
  });

  // Coffee Shop
  const coffeeShopMTLLoader = new THREE.MTLLoader();
  const coffeeShopOBJLoader = new THREE.OBJLoader();
  coffeeShopMTLLoader.load("models/coffee_shop/coffee_shop.mtl", function(materials) {
    materials.preload();
    coffeeShopOBJLoader.setMaterials(materials);
    coffeeShopOBJLoader.load('models/coffee_shop/coffee_shop.obj', function(objectMesh) {
      preloadedObjects.set('coffee_shop', {objectMesh: objectMesh, scalingFactor: 1, rotationY: Math.PI});
    });
  });

  // Food Stand
  const foodStandMTLLoader = new THREE.MTLLoader();
  const foodStandOBJLoader = new THREE.OBJLoader();
  foodStandMTLLoader.load("models/food_stand/food_stand.mtl", function(materials) {
    materials.preload();
    foodStandOBJLoader.setMaterials(materials);
    foodStandOBJLoader.load('models/food_stand/food_stand.obj', function(objectMesh) {
      preloadedObjects.set('food_stand', {objectMesh: objectMesh, scalingFactor: 1});
    });
  });
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
