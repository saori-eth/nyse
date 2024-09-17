import { Physics } from "@react-three/rapier";
import { Players } from "./Players";
import { Map } from "./Map";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bullets } from "./Bullets";
import { Camera } from "./Camera";
import { Perf } from "r3f-perf";

interface WorldProps {
  mobile: boolean;
}

export const World = (props: WorldProps) => {
  const [name] = useLocalStorage("name", "");
  const [color] = useLocalStorage("color", "");

  return (
    <Physics debug>
      <Perf />
      <ambientLight intensity={1} />
      <Map />
      <Players user={{ name: name || "Anon", color: color || "red" }} />
      <Camera />
      <Bullets />
    </Physics>
  );
};
