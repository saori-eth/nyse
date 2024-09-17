import { useState, useEffect } from "react";
import { Perf } from "r3f-perf";

export const ToggleablePerf = () => {
  const [showPerf, setShowPerf] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "+") {
        setShowPerf((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return showPerf ? <Perf /> : null;
};
