"use client";
import { Canvas } from "@react-three/fiber";
import {
  // OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { PlayerState, RPC, insertCoin, me, onPlayerJoin } from "playroomkit";
import { useMouse } from "@/context/MouseProvider";
import { useZoom } from "@/context/ZoomProvider";
import { World } from "./World";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bullet, useStore } from "@/hooks/useStore";
const env = process.env.NEXT_PUBLIC_ENV;
console.log("env", env);

export const Experience = () => {
  const { setMousePosition } = useMouse();
  const { setDeltaY } = useZoom();
  const [name] = useLocalStorage("name", "");
  const [color] = useLocalStorage("color", "");
  const { actions } = useStore();
  const start = async () => {
    try {
      await insertCoin({
        maxPlayersPerRoom: 16,
        roomCode: env === "dev" ? "dev" : "test",
        skipLobby: true,
      });
    } catch (error) {
      console.error("Error joining room", error);
    }
    onPlayerJoin((player: PlayerState) => {
      const isMe = player.id === me().id;
      console.log("Player joined", player);
      if (isMe) {
        player.setState("name", name || "Anon");
        player.setState("color", color || "red");
        actions.addLocalEntity({
          id: player.id,
          name: name || "Anon",
          color: color || "red",
          type: "localPlayer",
        });
      }
      player.onQuit(() => {
        console.log("Player quit", player);
      });
    });
    // @ts-expect-error
    RPC.register("addBullet", (data: Bullet) => {
      actions.addBullet(data);
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
        (e.target as HTMLCanvasElement).requestPointerLock();
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
        <World mobile={mobile} />
      </Suspense>
    </Canvas>
  );
};
