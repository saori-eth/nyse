import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

export const Map = ({ mode = "glb" }: { mode?: "basic" | "glb" }) => {
  const { scene: map } = useGLTF("/map.glb");
  const colliderRef = useRef<RapierRigidBody>(null);
  useEffect(() => {
    if (!colliderRef.current) return;
    colliderRef.current.userData = { type: "environment" };
  }, [map]);
  return (
    <>
      {mode === "glb" ? (
        <RigidBody
          type="fixed"
          colliders="trimesh"
          position={[0, -0.05, 0]}
          ref={colliderRef}
        >
          <primitive object={map} />
        </RigidBody>
      ) : (
        <>
          <RigidBody type="fixed" position={[-5, 0, 0]}>
            <mesh userData={{ name: "middlebox" }}>
              <boxGeometry args={[5, 5, 5]} />
              <meshStandardMaterial color="white" />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed">
            <mesh userData={{ name: "ground" }}>
              <boxGeometry args={[100, 0.1, 100]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          </RigidBody>
        </>
      )}
    </>
  );
};
