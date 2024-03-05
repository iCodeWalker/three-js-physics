# three-js Physics

1. We can create our own physics using Raycaster.

2. But if we want realistic physics like tension, friction, bouncing, constraints, pivots etc its better to use
   a library.

3. We create a physics world, just like threejs scene, but it is not visible, there are lot of things happening in this physics world.

4. We are going to replicate the things that are available in three.js scene into physics world.
   Ex : a threejs scene has floor, a cube and sphere, the same we will create for physics world

5. When we add an object in three.js world, we also add one in the physics world.

6. On each frame, we will update the physics world using the library. We take the new coordinates of the object (let say sphere) in the physics world, and apply or use this coordinate in the three.js world (scene).

7. 3D libraries

   1. Ammo.js
   2. Cannon.js
   3. Oimo.js

8. 2D physics libraries

   1. Matter.js
   2. P2.js
   3. Planck.js
   4. Box2D.js

9. Nothing happens till we update our Cannon.js world and update our Three.js sphere accordingly.

10. To update the physics world we have to use step(...)
    world.step(1,2,3)
    1 -> a fixed time step. We want our experience to run at 60fps, so value can be 1/60
    2 - > how much time passed since the last step.
    3 -> how much iterations the world can apply.
