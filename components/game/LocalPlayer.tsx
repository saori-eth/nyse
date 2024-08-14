import { useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { Text, Billboard } from "@react-three/drei";
import type { PlayerState } from "playroomkit";
import { PlayerController } from "./PlayerController";
import { Group, Mesh, Vector3 } from "three";

interface LocalPlayerProps {
  player: PlayerState;
  user: {
    name: string;
    avatar: string;
  };
}

const headPos = new Vector3();
export const LocalPlayer = (props: LocalPlayerProps) => {
  const player = props.player;
  const { name } = props.user;
  const textRef = useRef<Group>(null);
  const boxRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (boxRef.current && textRef.current) {
      boxRef.current.getWorldPosition(headPos);
      textRef.current.position.set(headPos.x, headPos.y + 0.35, headPos.z);
    }
  });

  return (
    <>
      <Billboard
        ref={textRef}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <Text
          color="white"
          anchorX="center"
          anchorY="middle"
          fontSize={0.1}
          outlineColor="black"
        >
          {name}
        </Text>
      </Billboard>
      <PlayerController player={player}>
        <mesh ref={boxRef}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </PlayerController>
    </>
  );
};
