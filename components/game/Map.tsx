import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

export const Map = ({ mode = "glb" }: { mode?: "basic" | "glb" }) => {
  const { scene: map } = useGLTF("/midship.glb");
  const colliderRef = useRef<RapierRigidBody>(null);
  useEffect(() => {
    if (!colliderRef.current) return;
    colliderRef.current.userData = { type: "environment" };
    map.traverse((child) => {
      if (child.type === "Mesh") {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
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
        <BasicMap />
      )}
    </>
  );
};

const BasicMap = () => {
  return (
    <>
      <RigidBody
        type="fixed"
        position={[-5, 0, 0]}
        userData={{ name: "middlebox" }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 5, 5]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" userData={{ name: "ground" }}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[100, 0.1, 100]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        position={[0, 0.5, -10]}
        userData={{ name: "environment" }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[20, 2, 0.25]} />
          <meshStandardMaterial color="lightblue" />
        </mesh>
      </RigidBody>
    </>
  );
};
