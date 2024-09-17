import { useStore } from "@/hooks/useStore";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3, Mesh } from "three";

export const Bullets = () => {
  const { actions, selectors } = useStore();
  const bullets = selectors.getBullets();
  const myId = selectors.getLocalEntity()?.id;

  useFrame(() => {
    const now = Date.now();
    bullets.forEach((bullet) => {
      const bulletTimestamp = bullet.id.split("~")[1];
      const timeSinceShot = now - Number(bulletTimestamp);
      if (timeSinceShot > 10000) {
        actions.removeBullet(bullet.id);
      }
    });
  });

  return (
    <group>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} myId={myId ? myId : ""} {...bullet} />
      ))}
    </group>
  );
};

const BULLET_SPEED = 30;
const Bullet = ({
  myId,
  id,
  position,
  direction,
}: {
  myId: string;
  id: string;
  position: [number, number, number];
  direction: [number, number, number];
}) => {
  const { actions } = useStore();
  const physicsRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<Mesh>(null);
  const bulletEntityId = id.split("~")[0];

  useEffect(() => {
    if (!physicsRef.current) return;
    physicsRef.current.userData = {
      type: "bullet",
      playerId: id.split("-")[0],
      damage: 10,
    };
    const dir = new Vector3(...direction);
    physicsRef.current.setLinvel(dir.multiplyScalar(BULLET_SPEED), true);
  }, []);

  return (
    <group position={position}>
      <RigidBody
        ref={physicsRef}
        gravityScale={0}
        sensor
        onIntersectionEnter={(e) => {
          // if bullet came from entity, and the type of collider it hit is "self", don't remove bullet
          if (myId === bulletEntityId) {
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "self") return;
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "bullet") return;
          }

          // if bullet came from remote player, and the type of collider it hit is "remotePlayer", don't remove bullet
          if (myId !== bulletEntityId) {
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "remotePlayer") return;
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "bullet") return;
          }
          // @ts-expect-error
          meshRef.current?.material.color.set("white");
          actions.removeBullet(id);
        }}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    </group>
  );
};
