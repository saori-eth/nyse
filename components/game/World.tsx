import { Physics } from "@react-three/rapier";
import { Players } from "./Players";
import { Map } from "./Map";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bullets } from "./Bullets";
import { Camera } from "./Camera";
import { ToggleablePerf } from "./ui/ToggleablePerf";
import { Environment } from "@react-three/drei";
import { Skybox } from "./Skybox";

interface WorldProps {
  mobile: boolean;
}

export const World = (props: WorldProps) => {
  const [name] = useLocalStorage("name", "");
  const [color] = useLocalStorage("color", "");

  return (
    <Physics>
      <ToggleablePerf />
      <Environment preset="night" />
      <Skybox />
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        shadow-mapSize={1024}
      />
      <Map mode="basic" />
      <Players user={{ name: name || "Anon", color: color || "red" }} />
      <Camera />
      <Bullets />
    </Physics>
  );
};
