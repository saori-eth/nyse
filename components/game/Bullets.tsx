import { useStore } from "@/hooks/useStore";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { RPC } from "playroomkit";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

export const Bullets = () => {
  const { actions, selectors } = useStore();
  const bullets = selectors.getBullets();
  const entityId = selectors.getLocalEntity()?.id;

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
        <Bullet
          key={bullet.id}
          entityId={entityId ? entityId : ""}
          {...bullet}
        />
      ))}
    </group>
  );
};

const BULLET_SPEED = 10;
const Bullet = ({
  entityId,
  id,
  position,
  direction,
}: {
  entityId: string;
  id: string;
  position: [number, number, number];
  direction: [number, number, number];
}) => {
  const { actions } = useStore();
  const physicsRef = useRef<RapierRigidBody>(null);
  const bulletEntityId = id.split("-")[0];

  useEffect(() => {
    if (!physicsRef.current) return;
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
          if (entityId === bulletEntityId) {
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "self") return;
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "bullet") return;
          }
          // if bullet came from remote player, and the type of collider it hit is "remotePlayer", don't remove bullet
          if (entityId !== bulletEntityId) {
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "remotePlayer") return;
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "bullet") return;
          }
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