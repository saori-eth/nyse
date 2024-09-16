import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
export const Map = () => {
  const { scene: map } = useGLTF("/map.glb");
  const colliderRef = useRef<RapierRigidBody>(null);
  useEffect(() => {
    if (!colliderRef.current) return;
    colliderRef.current.userData = { type: "environment" };
  }, [map]);
  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
      position={[0, -0.05, 0]}
      ref={colliderRef}
    >
      <primitive object={map} />
    </RigidBody>
  );
};
