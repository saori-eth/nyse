import { type RapierRigidBody, type RapierContext } from "@react-three/rapier";

const COOLDOWN = 500;
let lastGroundedTime = 0;
export const isGrounded = (
  rapierData: RapierContext,
  physics: RapierRigidBody
): boolean => {
  if (Date.now() - lastGroundedTime < COOLDOWN) {
    return false;
  }
  const { world, rapier } = rapierData;
  const translation = physics.translation();
  const ray = world.castRay(
    new rapier.Ray(translation, { x: 0, y: -1, z: 0 }),
    0.5,
    false,
    undefined,
    undefined,
    undefined,
    physics
  );
  const grounded = ray != null && Math.abs(ray.timeOfImpact) <= 0.459002;
  if (grounded) {
    lastGroundedTime = Date.now();
  }
  return grounded;
};
