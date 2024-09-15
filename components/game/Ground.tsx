import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
export const Ground = () => {
  const { scene: map } = useGLTF("/map.glb");
  return (
    <RigidBody type="fixed" colliders="trimesh" position={[0, -0.05, 0]}>
      <primitive object={map} />
    </RigidBody>
  );
};
