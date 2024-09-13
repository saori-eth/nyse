import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Group, Mesh, Quaternion } from "three";
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
  useBeforePhysicsStep,
} from "@react-three/rapier";
import { Billboard, Text } from "@react-three/drei";

interface RemotePlayerProps {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number, number];
  name: string;
  color: string;
}

const q1 = new Quaternion();
export const RemotePlayer = (props: RemotePlayerProps) => {
  const physicsRef = useRef<RapierRigidBody>(null);
  const playerRef = useRef<Group>(null);
  const { name, color } = props;

  // Refs to hold the current and target positions
  const currentPosition = useRef(new Vector3(0, 0, 0));
  const targetPosition = useRef(new Vector3(0, 0, 0));

  const lerpFactor = 0.1; // Adjust this factor to control interpolation speed

  useBeforePhysicsStep(() => {
    const thisPlayer = playerRef.current;
    const physics = physicsRef.current;
    if (!thisPlayer || !physics) return;

    const newPosition = props.position;
    if (!newPosition) return;

    // Update the target position
    targetPosition.current.set(...newPosition);

    // Interpolate current position towards the target position
    currentPosition.current.lerp(targetPosition.current, lerpFactor);

    // Apply the interpolated position to the physics body
    physics.setTranslation(currentPosition.current, true);
  });

  useEffect(() => {
    if (!physicsRef.current || !props.id) return;
    physicsRef.current.userData = {
      playerId: props.id,
      type: "remotePlayer",
    };
  }, [physicsRef, props.id]);

  useFrame((_, delta) => {
    const thisPlayer = playerRef.current;
    if (!thisPlayer) return;
    const newRotation = props.rotation;
    if (!newRotation) return;
    q1.set(...newRotation);
    thisPlayer.quaternion.slerp(q1, delta * 10);
  });

  return (
    <RigidBody
      type="kinematicPosition"
      ref={physicsRef}
      colliders={false}
      enabledRotations={[false, false, false]}
      position={[0, 0.75, 0]}
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
