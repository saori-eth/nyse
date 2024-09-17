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
        <group position={[0, -10, 0]}>
          <BasicMap />
        </group>
      )}
    </>
  );
};

const BasicMap = () => {
  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed" userData={{ name: "ground" }}>
        <mesh receiveShadow>
          <boxGeometry args={[100, 0.1, 100]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      {/* Walls */}
      {/* Back Wall */}
      <RigidBody
        type="fixed"
        position={[0, 5, -50]}
        userData={{ name: "back-wall" }}
      >
        <mesh receiveShadow>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>
      </RigidBody>

      {/* Front Wall */}
      <RigidBody
        type="fixed"
        position={[0, 5, 50]}
        userData={{ name: "front-wall" }}
      >
        <mesh receiveShadow>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>
      </RigidBody>

      {/* Left Wall */}
      <RigidBody
        type="fixed"
        position={[-50, 5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        userData={{ name: "left-wall" }}
      >
        <mesh receiveShadow>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>
      </RigidBody>

      {/* Right Wall */}
      <RigidBody
        type="fixed"
        position={[50, 5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        userData={{ name: "right-wall" }}
      >
        <mesh receiveShadow>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>
      </RigidBody>

      {/* Central Platform */}
      <RigidBody
        type="fixed"
        position={[0, 1, 0]}
        userData={{ name: "central-platform" }}
      >
        <mesh receiveShadow>
          <boxGeometry args={[20, 2, 20]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </RigidBody>

      {/* Obstacles */}
      {[-15, 15].map((x) =>
        [-15, 15].map((z) => (
          <RigidBody
            key={`obstacle-${x}-${z}`}
            type="fixed"
            position={[x, 2.5, z]}
            userData={{ name: `obstacle-${x}-${z}` }}
          >
            <mesh receiveShadow>
              <boxGeometry args={[5, 5, 5]} />
              <meshStandardMaterial color="blue" />
            </mesh>
          </RigidBody>
        ))
      )}

      {/* Elevated Platforms */}
      {[
        [-30, -30],
        [30, -30],
        [-30, 30],
        [30, 30],
      ].map(([x, z], index) => (
        <RigidBody
          key={`elevated-platform-${index}`}
          type="fixed"
          position={[x, 5, z]}
          userData={{ name: `elevated-platform-${index}` }}
        >
          <mesh receiveShadow>
            <boxGeometry args={[10, 1, 10]} />
            <meshStandardMaterial color="lightgray" />
          </mesh>
        </RigidBody>
      ))}

      {/* Ramps to Elevated Platforms */}
      {[
        [-30, -20],
        [30, -20],
        [-30, 20],
        [30, 20],
      ].map(([x, z], index) => (
        <RigidBody
          key={`ramp-${index}`}
          type="fixed"
          position={[x, 2.5, z]}
          rotation={[-Math.PI / 6, 0, 0]}
          userData={{ name: `ramp-${index}` }}
        >
          <mesh receiveShadow>
            <boxGeometry args={[10, 1, 10]} />
            <meshStandardMaterial color="lightgray" />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
};
