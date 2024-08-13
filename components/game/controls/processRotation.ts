import { Quaternion, Euler } from "three";

const quat = new Quaternion();
const euler = new Euler();

const playerDirection = {
  forward: 0,
  back: Math.PI,
  left: Math.PI / 2,
  right: -Math.PI / 2,
  forwardLeft: Math.PI / 4,
  forwardRight: -Math.PI / 4,
  backLeft: Math.PI * 0.75,
  backRight: -Math.PI * 0.75,
};

export const processRotation = (controlState: any) => {
  const { forward, back, left, right } = controlState;
  let angle: number | undefined;

  if (forward && left && !right && !back) {
    angle = playerDirection.forwardLeft;
  } else if (forward && right && !left && !back) {
    angle = playerDirection.forwardRight;
  } else if (back && left && !right && !forward) {
    angle = playerDirection.backLeft;
  } else if (back && right && !left && !forward) {
    angle = playerDirection.backRight;
  } else if (forward && !left && !right && !back) {
    angle = playerDirection.forward;
  } else if (back && !left && !right && !forward) {
    angle = playerDirection.back;
  } else if (left && !right && !forward && !back) {
    angle = playerDirection.left;
  } else if (right && !left && !forward && !back) {
    angle = playerDirection.right;
  }

  if (angle !== undefined) {
    return quat.setFromEuler(euler.set(0, angle, 0));
  }
};
