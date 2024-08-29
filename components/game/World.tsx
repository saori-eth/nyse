import { Physics } from "@react-three/rapier";
import { Players } from "./Players";
import { Ground } from "./Ground";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface WorldProps {
  mobile: boolean;
}

export const World = (props: WorldProps) => {
  const [name] = useLocalStorage("name", "");
  const [color] = useLocalStorage("color", "");
  const { mobile } = props;
  return (
    <Physics>
      <ambientLight intensity={0.5} />
      <Ground />
      <Players user={{ name: name || "Anon", color: color || "red" }} />
    </Physics>
  );
};
