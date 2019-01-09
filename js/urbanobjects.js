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
 renderer.setSize(window.innerWidth, window.innerHeight);
 const container = document.getElementById('three-container');
 container.appendChild(renderer.domElement);

 // Create a cube
 var geometry = new THREE.BoxGeometry(1, 1, 1);
 var material = new THREE.MeshLambertMaterial({
     color: 0xff00ff,
     ambient: 0x121212,
     emissive: 0x121212
  });

 var cube = new THREE.Mesh(geometry, material);
 scene.add(cube);

 // Set up the main camera
 camera.position.z = 5;

 // Load the background texture
 var texture = THREE.ImageUtils.loadTexture('img/parkinglot.jpg');
 var backgroundMesh = new THREE.Mesh(
     new THREE.PlaneGeometry(2, 2, 0),
     new THREE.MeshBasicMaterial({
         map: texture
     }));

 backgroundMesh.material.depthTest = false;
 backgroundMesh.material.depthWrite = false;

 // Create your background scene
 var backgroundScene = new THREE.Scene();
 var backgroundCamera = new THREE.Camera();
 backgroundScene.add(backgroundCamera );
 backgroundScene.add(backgroundMesh );

 // Rendering function
 var render = function () {
     requestAnimationFrame(render);

     // Update the color to set
     if (color < 0xdddddd) color += 0x0000ff;

     // Update the cube color
     cube.material.color.setHex(color);

     // Update the cube rotations
     cube.rotation.x += 0.05;
     cube.rotation.y += 0.02;

     renderer.autoClear = false;
     renderer.clear();
     renderer.render(backgroundScene , backgroundCamera );
     renderer.render(scene, camera);
};

render();
