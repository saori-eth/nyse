import { useRef, type ReactNode, useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { processMovement, processRotation } from "./controls";
import { useFrame } from "@react-three/fiber";
import type { Controls } from "@/types";
import { useMousePosition } from "@/context/MouseProvider";
import { useZoom } from "@/context/ZoomProvider";
import { Euler, type Group, Quaternion, Vector3 } from "three";
import {
  CapsuleCollider,
  type RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import type { PlayerState } from "playroomkit";
import { vec3 } from "@react-three/rapier";

const CAMERA_DISTANCE = 10;
const MIN_DISTANCE = 1; // Minimum camera distance
const MAX_DISTANCE = 20; // Maximum camera distance

interface PlayerControllerProps {
  children: ReactNode;
  player: PlayerState;
}
const MIN_POLAR_ANGLE = 0; // Minimum vertical angle (downwards)
const MAX_POLAR_ANGLE = Math.PI / 2; // Maximum vertical angle (upwards)
const CAM_SENSITIVITY = 200;
const innerRot = new Quaternion();
const v1 = new Vector3();
const v2 = new Vector3();
const euler = new Euler(0, 0, 0, "YXZ");
export const PlayerController = (props: PlayerControllerProps) => {
  const playerState = props.player;
  const [, get] = useKeyboardControls<Controls>();
  const { mousePositionRef, setMousePosition } = useMousePosition();
  const { deltaYRef, setDeltaY } = useZoom();
  const physicsRef = useRef<RapierRigidBody>(null);
  const playerRef = useRef<Group>(null);
  const innerRef = useRef<any>();
  const distanceRef = useRef(CAMERA_DISTANCE);
  const camRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);

  useEffect(() => {
    // sleep initially so that the player doesn't fall through the floor
    physicsRef.current?.sleep();
  }, []);

  useFrame(({ camera }) => {
    const physics = physicsRef.current;
    const player = playerRef.current;
    const cam = camRef.current;
    const head = headRef.current;
    const inner = innerRef.current;
    if (!player || !physics || !inner || !cam || !head) return;

    // movement controls
    const controlState = get();

    // camera controls
    const { current: distance } = distanceRef;
    const { current: deltaY } = deltaYRef;

    if (!distance) return;

    const direction = processMovement(controlState, player.rotation.y);
    const currLinvel = physics.linvel();
    physics.setLinvel(
      new Vector3(direction.x, currLinvel.y, direction.z),
      true
    );

    // inner is isolated from context which involves the camera. basically rotates the mesh. while allowing extra context of direction.
    const playerRotation = processRotation(controlState);
    if (playerRotation) {
      inner.quaternion.slerp(playerRotation, 0.1);
    }

    const physicsPosition = physics.translation();
    const rigidPosition = vec3(physicsPosition);

    // process camera controls
    if (deltaY) {
      distanceRef.current = Math.max(
        MIN_DISTANCE,
        Math.min(MAX_DISTANCE, distanceRef.current + deltaY * 0.05)
      );
    }

    const { movementX, movementY } = mousePositionRef.current;
    if (movementX || movementY) {
      euler.setFromQuaternion(head.quaternion);
      euler.y -= movementX / CAM_SENSITIVITY;
      euler.x = Math.max(
        MIN_POLAR_ANGLE,
        Math.min(MAX_POLAR_ANGLE, euler.x + movementY / CAM_SENSITIVITY)
      );
      player.rotation.y = euler.y;
      head.quaternion.setFromEuler(euler);
    }

    v1.setFromMatrixPosition(head.matrixWorld).y -= 0.2;
    cam.position.set(0, -0.2, -distanceRef.current);
    camera.position.lerp(v2.setFromMatrixPosition(cam.matrixWorld), 0.5);
    camera.lookAt(v1);

    // set player state
    const innerRotation = inner.getWorldQuaternion(innerRot);
    playerState.setState("rotation", innerRotation.toArray());
    playerState.setState("position", rigidPosition.toArray());

    // reset global control refs
    setMousePosition({ movementX: 0, movementY: 0 });
    setDeltaY(0);
  });
  return (
    <>
      <RigidBody
        type="dynamic"
        ref={physicsRef}
        colliders={false}
        enabledRotations={[false, false, false]}
        position={[0, 0.75, 0]}
      >
        <group position={[0, 1, 0]} ref={headRef}>
          <group ref={camRef} position={[0, 0.2, -1 * CAMERA_DISTANCE]} />
        </group>
        <CapsuleCollider args={[0.2, 0.25]} mass={50} />
        <group ref={playerRef}>
          <group ref={innerRef}>{props.children}</group>
        </group>
      </RigidBody>
    </>
  );
};
