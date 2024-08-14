"use client";
import { KeyboardControls } from "@/hooks/useKeyboardControls";
import type { KeyboardControlsEntry } from "@react-three/drei";
import { useMemo, ReactNode } from "react";
import { Controls } from "@/types/index";
import { MouseProvider } from "@/context/MouseProvider";
import { ZoomProvider } from "@/context/ZoomProvider";

export const Middleware = ({ children }: { children: ReactNode }) => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.sprint, keys: ["ShiftLeft"] },
    ],
    []
  );
  return (
    <>
      <KeyboardControls map={map}>
        <ZoomProvider>
          <MouseProvider>{children}</MouseProvider>
        </ZoomProvider>
      </KeyboardControls>
    </>
  );
};
