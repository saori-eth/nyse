"use client";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Background } from "./Background";
import { Physics } from "@react-three/rapier";

export const Experience = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setMobile(window.innerWidth < 768);
    window.addEventListener("resize", () => {
      setMobile(window.innerWidth < 768);
    });
  }, []);
  return (
    <Canvas className="absolute inset-0 w-full h-full bg-black">
      <Suspense fallback={null}>
        <Physics debug>
          <PerspectiveCamera
            makeDefault
            rotation={[0, -Math.PI / 2, 0]}
            fov={75}
          />
          <Background />
        </Physics>
      </Suspense>
    </Canvas>
  );
};
