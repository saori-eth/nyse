import { createContext, useContext, useRef, ReactNode } from "react";

type DeltaY = number;

const ZoomContext = createContext<{
  deltaYRef: React.MutableRefObject<DeltaY>;
  setDeltaY: (deltaY: DeltaY) => void;
} | null>(null);

export const ZoomProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const deltaYRef = useRef<DeltaY>(0);
  const setDeltaY = (newDeltaY: DeltaY) => {
    deltaYRef.current = newDeltaY;
  };

  return (
    <ZoomContext.Provider value={{ deltaYRef, setDeltaY }}>
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error("useZoom must be used within a ZoomProvider");
  }
  return context;
};
