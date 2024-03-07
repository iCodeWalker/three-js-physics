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

11. Contact Material
    We can change the friction and bouncing behaviour by settiing a "Material".
    A Material is just a reference and we should create one for each type of material in the scene.
    Types : plastic, concrete, jelly etc.

    We have to create a "ContactMaterial" which is the combination of two Materials and how they should collide.
    The first two parameters are the Materials.
    The Third parameter is an object containing collision properties like friction (how much does it rub)
    and restitution (how much does it bounce). Default value for both is 0.3

    We create the "ContactMaterial" and add it to the world with addContactMaterial(...)

    After this we need to associate the materials with the bodies

12. Simplified ContactMaterial
    simplify everything and replace the two "Materials" by the default one

13. We can also set our material as the deafult one with the deafultContactMaterial property on the World.
    world.defaultContactMaterial = defaultMaterial

14. Apply Forces:
    Four methods to apply force on the body:
    1. applyForce : apply force from a specified point in space (not necessarily on the Body's surface) like wind,
       a small push or a strong push.
    2. applyImpulse : like applyForce but instead of adding to the force, will add to the velocity.
    3. applyLocalForce : same as applyForce but the coordinates are local to the Body(0,0,0 would be center of body)
    4. applyLocalImpulse : same as applyImpulse but the coordinates are local to the Body
