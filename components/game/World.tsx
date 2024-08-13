import { MeshReflectorMaterial } from "@react-three/drei";

interface WorldProps {
  mobile: boolean;
}

export const World = (props: WorldProps) => {
  const { mobile } = props;
  return (
    <>
      <ambientLight intensity={0.5} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, -0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          metalness={0.5}
          roughness={0.5}
          mirror={0.5}
          color={"#a0a0a0"}
        />
      </mesh>
    </>
  );
};
