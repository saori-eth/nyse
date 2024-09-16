import { useRef, type ReactNode, useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { processMovement, processRotation } from "./controls";
import { useFrame } from "@react-three/fiber";
import type { Controls } from "@/types";
import { useMouse } from "@/context/MouseProvider";
import { Euler, type Group, Quaternion, Vector3 } from "three";
import {
  CapsuleCollider,
  type RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { type PlayerState } from "playroomkit";
import { vec3 } from "@react-three/rapier";
import { isGrounded } from "./controls/isGrounded";
import { useStore } from "@/hooks/useStore";
import { Gun } from "./Gun";

interface PlayerControllerProps {
  children: ReactNode;
  player: PlayerState;
}
const CAMERA_DISTANCE = 10;
const MIN_POLAR_ANGLE = -Math.PI / 2; // Minimum vertical angle (downwards)
const MAX_POLAR_ANGLE = Math.PI / 2; // Maximum vertical angle (upwards)
const CAM_SENSITIVITY = 200;
const innerRot = new Quaternion();
const v1 = new Vector3();
const v2 = new Vector3();
const euler = new Euler(0, 0, 0, "YXZ");
export const PlayerController = (props: PlayerControllerProps) => {
  const playerState = props.player;
  const [, get] = useKeyboardControls<Controls>();
  const { mousePositionRef, setMousePosition } = useMouse();
  const physicsRef = useRef<RapierRigidBody>(null);
  const playerRef = useRef<Group>(null);
  const rapierData = useRapier();
  const innerRef = useRef<any>();
  const camRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const { selectors, actions } = useStore();
  const localEntity = selectors.getLocalEntity();
  const lastUpdateTime = useRef(0);
  const UPDATE_INTERVAL = 1000 / 8; // 8 times per second

  useEffect(() => {
    if (
      !localEntity ||
      !physicsRef.current ||
      !headRef.current ||
      !camRef.current
    )
      return;
    actions.addRigidBodyToEntity(localEntity.id, physicsRef.current);
    actions.addHeadToEntity(localEntity.id, headRef.current);
    actions.addHeadCamToEntity(localEntity.id, camRef.current);
  }, [localEntity?.mesh, localEntity?.head, localEntity?.headCam]);

  useEffect(() => {
    // sleep initially so that the player doesn't fall through the floor
    const { current: physics } = physicsRef;
    if (!physics) return;
    physics.sleep();
    physics.userData = { type: "self" };
  }, []);

  useFrame(({ clock }) => {
    const currentTime = clock.getElapsedTime() * 1000; // Convert to milliseconds
    const physics = physicsRef.current;
    const player = playerRef.current;
    const head = headRef.current;
    const inner = innerRef.current;
    if (!player || !physics || !inner || !head) return;

    const isPointerLocked = document.pointerLockElement;

    // movement controls
    const controlState = get();

    const direction = processMovement(controlState, player.rotation.y);
    const currLinvel = physics.linvel();

    v1.setFromMatrixPosition(head.matrixWorld).y -= 0.2;

    if (!isPointerLocked) {
      physics.sleep();
      return;
    }
    // inner is isolated from context which involves the camera. basically rotates the mesh. while allowing extra context of direction.
    const playerRotation = processRotation(controlState);
    if (playerRotation) {
      inner.quaternion.slerp(playerRotation, 0.1);
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

    // jump
    let velY = currLinvel.y;
    const { jump } = get();
    if (jump) {
      const grounded = isGrounded(rapierData, physics);
      if (grounded) {
        velY = 5;
      }
    }

    // apply movement / jump
    physics.setLinvel(v2.set(direction.x, velY, direction.z), true);

    const physicsPosition = physics.translation();
    const rigidPosition = vec3(physicsPosition);

    // reset global control refs
    setMousePosition({ movementX: 0, movementY: 0 });

    // set player state
    // Update state 8 times per second
    if (currentTime - lastUpdateTime.current >= UPDATE_INTERVAL) {
      playerState.setState("position", rigidPosition.toArray());
      const innerRotation = inner.getWorldQuaternion(innerRot);
      playerState.setState("rotation", innerRotation.toArray());
      lastUpdateTime.current = currentTime;
    }
  });
  return (
    <>
      <RigidBody
        ref={physicsRef}
        type="dynamic"
        colliders={false}
        enabledRotations={[false, false, false]}
        position={[0, 0.5, 0]}
      >
        <group position={[0, 1, 0]} ref={headRef}>
          <group ref={camRef} position={[0, 0.2, -1 * CAMERA_DISTANCE]} />
        </group>
        <CapsuleCollider args={[0.2, 0.25]} mass={50} />
        <group ref={playerRef}>
          <group ref={innerRef}>{props.children}</group>
        </group>
      </RigidBody>
      <Gun />
    </>
  );
};
