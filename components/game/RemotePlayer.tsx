import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Group, Mesh } from "three";
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { Billboard, Text } from "@react-three/drei";

interface RemotePlayerProps {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number, number];
  name: string;
  color: string;
}

export const RemotePlayer = (props: RemotePlayerProps) => {
  const physicsRef = useRef<RapierRigidBody>(null);
  const playerRef = useRef<Group>(null);
  const { name, color } = props;
  const translation = useRef<Vector3>(new Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const thisPlayer = playerRef.current;
    const physics = physicsRef.current;
    if (!thisPlayer || !physics) return;
    const newPosition = props.position;
    const newRotation = props.rotation;
    if (!newPosition || !newRotation) return;
    translation.current.set(...newPosition);
    const vec = {
      x: translation.current.x,
      y: translation.current.y,
      z: translation.current.z,
    };
    physics.setTranslation(vec, true);
    // thisPlayer.position.lerp(translation.current, delta * 10);
    thisPlayer.quaternion.set(...newRotation);
  });

  return (
    <RigidBody
      type="kinematicPosition"
      ref={physicsRef}
      colliders={false}
      enabledRotations={[false, false, false]}
      position={[0, 0.75, 0]}
      userData={{
        playerId: props.id,
        type: "remotePlayer",
      }}
    >
      <CapsuleCollider args={[0.2, 0.25]} mass={50} />
      <group ref={playerRef}>
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
          position={[0, 0.35, 0]}
        >
          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={0.1}
            outlineColor="black"
          >
            {name}
          </Text>
        </Billboard>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </RigidBody>
  );
};
