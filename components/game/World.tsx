import { Physics } from "@react-three/rapier";
import { Players } from "./Players";
import { Ground } from "./Ground";

interface WorldProps {
  mobile: boolean;
}

export const World = (props: WorldProps) => {
  const { mobile } = props;
  return (
    <Physics debug>
      <ambientLight intensity={0.5} />
      <Ground />
      <Players user={{ name: "placeholder", avatar: "red" }} />
    </Physics>
  );
};
