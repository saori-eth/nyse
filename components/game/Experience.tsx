"use client";
import { Canvas } from "@react-three/fiber";
import {
  // OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { World } from "./World";

const Experience = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setMobile(window.innerWidth < 768);
    });
  }, []);
  return (
    <Canvas>
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          position={[0.5, 1.25, 2]}
          fov={mobile ? 60 : 50}
        />
        <World mobile={mobile} />
      </Suspense>
    </Canvas>
  );
};

export default Experience;
