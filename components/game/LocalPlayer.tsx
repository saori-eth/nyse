import { useRef, useEffect } from "react";
import { Mesh } from "three";
import { useStore } from "@/hooks/useStore";
import { PlayerController } from "./PlayerController";
import type { PlayerState } from "playroomkit";
import { NamePlate } from "./NamePlate";

interface LocalPlayerProps {
  player: PlayerState;
  user: {
    name: string;
    color: string;
  };
}

export const LocalPlayer = (props: LocalPlayerProps) => {
  const player = props.player;
  const { name, color } = props.user;
  const meshRef = useRef<Mesh>(null);
  const { actions } = useStore();

  useEffect(() => {
    const { current: mesh } = meshRef;
    if (!mesh) return;
    mesh.traverse((child) => {
      if (child.type === "Mesh") {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    actions.addLocalEntity({
      id: player.id,
      name,
      color,
      type: "localPlayer",
      mesh,
    });
  }, [meshRef]);

  return (
    <>
      <PlayerController player={player}>
        <NamePlate name={name} />
        <mesh
          ref={meshRef}
          userData={{ name: "localPlayer" }}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </PlayerController>
    </>
  );
};
