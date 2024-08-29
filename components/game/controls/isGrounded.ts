import { type RapierContext } from "@react-three/rapier";

export const isGrounded = (
  rapierData: RapierContext,
  translation: { x: number; y: number; z: number }
): boolean => {
  const { world, rapier } = rapierData;
  const ray = world.castRay(
    new rapier.Ray(translation, { x: 0, y: -1, z: 0 }),
    Infinity,
    false
  );
  return ray != null && Math.abs(ray.timeOfImpact) <= 0.459002;
};
