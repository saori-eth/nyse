import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "@/hooks/useStore";
import { useRef } from "react";
import { Box3, Mesh, Sphere, Vector3 } from "three";
import { useZoom } from "@/context/ZoomProvider";
import { PerspectiveCamera } from "@react-three/drei";

const v1 = new Vector3();
const v2 = new Vector3();
const bbox = new Box3();
const sphere = new Sphere();
const CAMERA_DISTANCE = 10;
const MIN_DISTANCE = 1; // Minimum camera distance
const MAX_DISTANCE = 20; // Maximum camera distance

export const Camera = () => {
  const { selectors } = useStore();
  const localEntity = selectors.getLocalEntity();
  const { camera, scene, raycaster } = useThree();
  const { deltaYRef, setDeltaY } = useZoom();
  const distanceRef = useRef(CAMERA_DISTANCE);
  const intersectionDistance = useRef<number | null>(null);

  useFrame((_, delta) => {
    if (!localEntity) return;
    const { head, headCam, mesh } = localEntity;
    if (!head || !headCam || !mesh) return;

    bbox.setFromObject(mesh);
    bbox.getBoundingSphere(sphere);

    camera.getWorldPosition(v1);
    v2.subVectors(v1, sphere.center).normalize();

    // Calculate the nearest point on the sphere's surface in the direction of v2
    const nearestPoint = sphere.center
      .clone()
      .add(v2.clone().multiplyScalar(sphere.radius));

    raycaster.set(nearestPoint, v2);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const closestIntersection = intersects[0];
      const distance = sphere.center.distanceTo(closestIntersection.point);
      if (distance < distanceRef.current) {
        intersectionDistance.current = distance;
      } else if (intersectionDistance.current !== null) {
        intersectionDistance.current = null;
      }
    } else if (
      intersects.length === 0 &&
      intersectionDistance.current !== null
    ) {
      intersectionDistance.current = null;
    }

    const { current: deltaY } = deltaYRef;
    const { current: distance } = distanceRef;

    if (deltaY) {
      distanceRef.current = Math.max(
        MIN_DISTANCE,
        Math.min(MAX_DISTANCE, distance + deltaY * 0.01)
      );
    }

    // snap to playercontroller head
    const newDistance =
      intersectionDistance.current !== null
        ? -intersectionDistance.current + 0.75
        : -distance;
    headCam.position.lerp(v1.set(0, -0.5, newDistance), delta * 25);
    camera.position.lerp(v1.setFromMatrixPosition(headCam.matrixWorld), 0.5);
    v1.setFromMatrixPosition(head.matrixWorld).y -= 0.5;
    camera.lookAt(v1);

    setDeltaY(0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault />
    </>
  );
};
