import { Physics, RigidBody } from "@react-three/rapier";
import { Players } from "./Players";
import { Map } from "./Map";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bullets } from "./Bullets";
import { Camera } from "./Camera";

interface WorldProps {
  mobile: boolean;
}

export const World = (props: WorldProps) => {
  const [name] = useLocalStorage("name", "");
  const [color] = useLocalStorage("color", "");

  return (
    <Physics debug>
      <ambientLight intensity={1} />
      <Map />
      <Players user={{ name: name || "Anon", color: color || "red" }} />
      <Camera />
      <Bullets />
      <RigidBody type="fixed" userData={{ type: "environment" }}>
        <mesh position={[4, 1, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>
    </Physics>
  );
};
