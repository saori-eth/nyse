"use client";
import { Canvas } from "@react-three/fiber";
import {
  // OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { PlayerState, insertCoin, me, onPlayerJoin } from "playroomkit";
import { useMousePosition } from "@/context/MouseProvider";
import { useZoom } from "@/context/ZoomProvider";
import { World } from "./World";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const Experience = () => {
  const { setMousePosition } = useMousePosition();
  const { setDeltaY } = useZoom();
  const [name] = useLocalStorage("name", "");
  const [color] = useLocalStorage("color", "");
  const start = async () => {
    await insertCoin({
      maxPlayersPerRoom: 16,
      roomCode: "test",
      skipLobby: true,
    });
    onPlayerJoin((player: PlayerState) => {
      const isMe = player.id === me().id;
      console.log("Player joined", player);
      if (isMe) {
        player.setState("name", name || "Anon");
        player.setState("color", color || "red");
      }
      player.onQuit(() => {
        console.log("Player quit", player);
      });
    });
  };
  useEffect(() => {
    if (!name || !color) return;
    console.log("Starting game", name, color);
    start();
  }, [name, color]);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setMobile(window.innerWidth < 768);
    window.addEventListener("resize", () => {
      setMobile(window.innerWidth < 768);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setMobile(window.innerWidth < 768);
      });
    };
  }, []);
  return (
    <Canvas
      className="absolute inset-0 w-full h-full bg-gray-900"
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") {
          (e.target as HTMLCanvasElement).requestPointerLock();
        }
      }}
      onPointerMove={(e) => {
        if (!document.pointerLockElement) return;
        setMousePosition({
          movementX: e.movementX,
          movementY: e.movementY,
        });
      }}
      onWheel={(e) => {
        if (!document.pointerLockElement) return;
        setDeltaY(e.deltaY);
      }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault />

        <World mobile={mobile} />
      </Suspense>
    </Canvas>
  );
};
