import { createContext, useContext, useRef, ReactNode, useEffect } from "react";

interface MousePosition {
  movementX: number;
  movementY: number;
}

interface MouseClicks {
  leftClick: boolean;
  rightClick: boolean;
}

const MouseContext = createContext<{
  mousePositionRef: React.MutableRefObject<MousePosition>;
  setMousePosition: (position: MousePosition) => void;
  mouseClicksRef: React.MutableRefObject<MouseClicks>;
} | null>(null);

export const MouseProvider = ({ children }: { children: ReactNode }) => {
  const mousePositionRef = useRef<MousePosition>({
    movementX: 0,
    movementY: 0,
  });

  const setMousePosition = (position: MousePosition) => {
    mousePositionRef.current = position;
  };

  const mouseClicksRef = useRef<MouseClicks>({
    leftClick: false,
    rightClick: false,
  });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!document.pointerLockElement) return;
      if (e.button === 0) mouseClicksRef.current.leftClick = true;
      if (e.button === 2) mouseClicksRef.current.rightClick = true;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!document.pointerLockElement) return;
      if (e.button === 0) mouseClicksRef.current.leftClick = false;
      if (e.button === 2) mouseClicksRef.current.rightClick = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <MouseContext.Provider
      value={{
        mousePositionRef,
        setMousePosition,
        mouseClicksRef,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
};

export const useMouse = () => {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error("useMousePosition must be used within a MouseProvider");
  }
  return context;
};
