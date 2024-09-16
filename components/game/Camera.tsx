import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "@/hooks/useStore";
import { useRef } from "react";
import { Vector3 } from "three";
import { useZoom } from "@/context/ZoomProvider";
import { PerspectiveCamera } from "@react-three/drei";

const v1 = new Vector3();
const v2 = new Vector3();
const CAMERA_DISTANCE = 10;
const MIN_DISTANCE = 1; // Minimum camera distance
const MAX_DISTANCE = 20; // Maximum camera distance
export const Camera = () => {
  const { selectors } = useStore();
  const localEntity = selectors.getLocalEntity();
  const { camera } = useThree();
  const { deltaYRef, setDeltaY } = useZoom();
  const distanceRef = useRef(CAMERA_DISTANCE);

  useFrame((_, delta) => {
    if (!localEntity) return;
    const { head, headCam } = localEntity;
    if (!head || !headCam) return;

    // zoom
    const { current: deltaY } = deltaYRef;
    const { current: distance } = distanceRef;
    if (deltaY) {
      distanceRef.current = Math.max(
        MIN_DISTANCE,
        Math.min(MAX_DISTANCE, distance + deltaY * 0.01)
      );
    }

    // snap to playercontroller head
    v1.setFromMatrixPosition(head.matrixWorld).y -= 0.5;
    headCam.position.set(0, -0.5, -distance);
    camera.position.lerp(v2.setFromMatrixPosition(headCam.matrixWorld), 0.5);
    camera.lookAt(v1);

    setDeltaY(0);
  });

  return <PerspectiveCamera makeDefault />;
};
