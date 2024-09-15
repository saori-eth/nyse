import { Physics, RigidBody } from "@react-three/rapier";
import { Players } from "./Players";
import { Ground } from "./Ground";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bullets } from "./Bullets";

interface WorldProps {
  mobile: boolean;
}

export const World = (props: WorldProps) => {
  const [name] = useLocalStorage("name", "");
  const [color] = useLocalStorage("color", "");

  return (
    <Physics>
      <ambientLight intensity={1} />
      <Ground />
      <Players user={{ name: name || "Anon", color: color || "red" }} />
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
