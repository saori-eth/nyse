import { Text, Billboard } from "@react-three/drei";
import type { PlayerState } from "playroomkit";
import { PlayerController } from "./PlayerController";
import { useEffect, useRef } from "react";
import { type Mesh } from "three";
import { useStore } from "@/hooks/useStore";

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
    console.log("mesh", mesh);
    if (!mesh) return;
    console.log("mesh", mesh);
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
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={0.1}
            outlineColor="black"
            position={[0, 0.35, 0]}
          >
            {name}
          </Text>
        </Billboard>
        <mesh ref={meshRef} userData={{ name: "localPlayer" }}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </PlayerController>
    </>
  );
};
