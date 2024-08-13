import { Euler, Vector3 } from "three";
const SPEED = 5;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const rotation = new Euler();

export const processMovement = (
  controlState: any,
  rotationY: number
): Vector3 => {
  const { forward, back, left, right, sprint } = controlState;

  frontVector.set(0, 0, forward - back);
  sideVector.set(right - left, 0, 0);
  direction
    .subVectors(frontVector, sideVector)
    .normalize()
    .multiplyScalar(SPEED)
    .applyEuler(rotation.set(0, rotationY, 0));

  if (sprint) {
    direction.multiplyScalar(1.5);
  }
  return direction;
};
