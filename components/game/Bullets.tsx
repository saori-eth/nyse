import { useStore } from "@/hooks/useStore";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { type Vector3 } from "three";

export const Bullets = () => {
  const { actions, selectors } = useStore();
  const bullets = selectors.getBullets();

  useFrame(() => {
    const now = Date.now();
    bullets.forEach((bullet) => {
      const bulletTimestamp = bullet.id.split("-")[1];
      const timeSinceShot = now - Number(bulletTimestamp);
      if (timeSinceShot > 10000) {
        actions.removeBullet(bullet.id);
      }
    });
  });

  return (
    <group>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} {...bullet} />
      ))}
    </group>
  );
};

const BULLET_SPEED = 10;
const Bullet = ({
  id,
  position,
  direction,
}: {
  id: string;
  position: Vector3;
  direction: Vector3;
}) => {
  const { actions } = useStore();
  const physicsRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    if (!physicsRef.current) return;
    physicsRef.current.setLinvel(direction.multiplyScalar(BULLET_SPEED), true);
  }, []);
  return (
    <group position={position}>
      <RigidBody
        ref={physicsRef}
        gravityScale={0}
        sensor
        onIntersectionEnter={(e) => {
          if (
            //@ts-expect-error
            e.other.rigidBody?.userData.type === "self" ||
            //@ts-expect-error
            e.other.rigidBody?.userData.type === "bullet"
          )
            return;
          console.log("hit", e);
          actions.removeBullet(id);
        }}
        userData={{
          type: "bullet",
          playerId: id.split("-")[0],
          damage: 10,
        }}
      >
        <mesh>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    </group>
  );
};
