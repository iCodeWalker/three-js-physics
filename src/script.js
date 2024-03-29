import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};
debugObject.createSphere = () => {
  //   console.log("create sphere");
  //createSphere(0.5, { x: 0, y: 3, z: 0 });

  // create random sphere
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createSphere");

// #### ADDING TO DAT GUI ###

debugObject.createBox = () => {
  //   console.log("create box");
  //createBox(0.5,0.5,0.5 { x: 0, y: 3, z: 0 });

  // create random box
  createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};

gui.add(debugObject, "createBox");

// Create a reset function and add it to our Dat.GUI
debugObject.reset = () => {
  console.log("reset");
  // Loop through the objectsToUpdate array and remove both object.body from the world and object.mesh from the
  // scene.

  for (const object of objectsToUpdate) {
    // Remove event listener
    object.body.removeEventListener("collide", playHitSound);
    // Remove Body from world
    world.removeBody(object.body);

    // Remove Mesh from scene
    scene.remove(object.mesh);

    // Empty the objectsToUpdate array
    objectsToUpdate.splice(0, objectsToUpdate.length);
  }
};
gui.add(debugObject, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sounds
 */

// Create the sound in javascript and create a function to play it.
const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = (collisionInfo) => {
  // To know the strength of the impact
  // The impact strength can be found with getImpactVelocityAlongNormal() method on contact property
  const impactStrength = collisionInfo.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    // Add randomness to the sound volume
    hitSound.volume = Math.random();
    // reset the sound to 0 with currentTime property, if the sound is already been played
    hitSound.currentTime = 0;
    hitSound.play();
  }
};
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */
// #### Create a physics world
const world = new CANNON.World();

// To switch to SAPBroadPhase, simply instantiate it in the 'world.broadphase' property and use the same world
// paramter
world.broadphase = new CANNON.SAPBroadphase(world);

// To activate sleep
world.allowSleep = true;

// We have to add gravity in the physics world to have objects fall, otherwise it will stay at it's position.
// To add gravity
world.gravity.set(0, -9.82, 0);

// Create a sphere inside the physics world.
// To create objects in physics world we need to create a "Body"
// Body are objects that will fall and collide with other bodies.

// ### Materials ###
// const concreteMaterial = new CANNON.Material("concrete");
// const plasticMaterial = new CANNON.Material("plastic");

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   }
// );

// world.addContactMaterial(concretePlasticContactMaterial);

// ### Simplified Material
// simplify everything and replace the two "Materials" by the default one

const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

// world.addContactMaterial(defaultContactMaterial);

//  set our material as the deafult one with the deafultContactMaterial property on the World
world.defaultContactMaterial = defaultContactMaterial;

// To create a "Body" first we need to create a "Shape", it's like Geometry in case of three.js
// Sphere
const sphereShape = new CANNON.Sphere(0.5);

// ##### To create Body we need mass and position
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
  // ### need to associate the material with the body
  //material: plasticMaterial,
  //   material: defaultMaterial,
});

// ##### Add Force to the body #####
// use applyLocalForce() to apply small push on our sphereBody at the start

// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );

// We need to add this Body to the physics world, just like we add mesh to scene.
world.addBody(sphereBody);

// ###### ----> Nothing happens till we update our Cannon.js world and update our Three.js sphere accordingly

// ##### Add a floor to physics world
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();

// ### need to associate the material with the body
// floorBody.material = concreteMaterial;
// floorBody.material = defaultMaterial;

floorBody.mass = 0; // To set the body static we use mass value  = 0;
floorBody.addShape(floorShape);

// --> We need to rotate the floor as by default the plane faces the camera. That's why we have a strange effect.
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

world.addBody(floorBody);
/**
 * Test Sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  })
);

sphere.castShadow = true;
sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */

const objectsToUpdate = [];

// ##### Handling Multiple Objects ######
// Create a createSphere function with "radius" and "position" parameters

// ##################### SPHERE ###################
const sphereGemometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createSphere = (radius, position) => {
  // ##### Three.js scene
  // ##### Create a Mesh
  const mesh = new THREE.Mesh(sphereGemometry, sphereMaterial);
  // we can increase the radius of sphere here
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // ##### Physics world
  // ##### Create a Body

  const shape = new CANNON.Sphere(radius);

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial,
  });

  body.position.copy(position);

  // Listen to the 'collide' event and use the playHitSound function as the callback
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  // push the mesh and body in the array
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

// ##################### BOXES ###################
const boxGemometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createBox = (width, height, depth, position) => {
  // ##### Three.js scene
  // ##### Create a Mesh
  const mesh = new THREE.Mesh(boxGemometry, boxMaterial);
  // we can increase the width of sphere here
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // ##### Physics world
  // ##### Create a Body

  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial,
  });

  body.position.copy(position);

  // Listen to the 'collide' event and use the playHitSound function as the callback
  body.addEventListener("collide", playHitSound);

  world.addBody(body);

  // push the mesh and body in the array
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Mimic the wind by using applyForce(...) on each frame before updating the World
  // use sphere.position to apply the force at the right position

  //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
  // ### Update physics world
  world.step(1 / 60, deltaTime, 3);
  //   console.log(sphereBody.position.y, "sphereBody.position");

  // ### Now we update the three.js world accordingly to the physics world.
  //   sphere.position.x = sphereBody.position.x;
  //   sphere.position.y = sphereBody.position.y;
  //   sphere.position.z = sphereBody.position.z;

  // we can also use the copy() method to copy all positions
  //   sphere.position.copy(sphereBody.position);

  // ### After updating the physical world, loop throught the array and update the mesh.position with the
  // body.position

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    // To rotate objects when they fall on each other
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
