import { createContext, useContext, useRef, ReactNode } from "react";

interface MousePosition {
  movementX: number;
  movementY: number;
}

const MouseContext = createContext<{
  mousePositionRef: React.MutableRefObject<MousePosition>;
  setMousePosition: (position: MousePosition) => void;
} | null>(null);

export const MouseProvider = ({ children }: { children: ReactNode }) => {
  const mousePositionRef = useRef<MousePosition>({
    movementX: 0,
    movementY: 0,
  });

  const setMousePosition = (position: MousePosition) => {
    mousePositionRef.current = position;
  };

  return (
    <MouseContext.Provider value={{ mousePositionRef, setMousePosition }}>
      {children}
    </MouseContext.Provider>
  );
};

export const useMousePosition = () => {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error("useMousePosition must be used within a MouseProvider");
  }
  return context;
};
