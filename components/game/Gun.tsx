import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useStore } from "@/hooks/useStore";
import { useRef } from "react";
import { useMouse } from "@/context/MouseProvider";
import { RPC } from "playroomkit";

const v1 = new Vector3();
const ROUNDS_PER_SECOND = 30;
export const Gun = () => {
  const { selectors, actions } = useStore();
  const localEntity = selectors.getLocalEntity();
  const lastShot = useRef(0);
  const { mouseClicksRef } = useMouse();

  useFrame(({ camera }) => {
    if (!localEntity) return;
    const { id, rigidBody } = localEntity;
    if (!id || !rigidBody) return;
    const translation = rigidBody.translation();
    if (mouseClicksRef.current.leftClick) {
      const now = Date.now();
      if (now - lastShot.current > 1000 / ROUNDS_PER_SECOND) {
        camera.getWorldDirection(v1);
        const bullet = {
          id: `${id}~${Date.now()}`,
          position: [translation.x, translation.y, translation.z] as [
            number,
            number,
            number
          ],
          direction: [v1.x, 0, v1.z] as [number, number, number],
        };
        actions.addBullet(bullet);
        RPC.call("addBullet", bullet, RPC.Mode.OTHERS);
        lastShot.current = now;
      }
    }
  });

  return <></>;
};
