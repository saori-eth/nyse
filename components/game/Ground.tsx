import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
export const Ground = () => {
  return (
    <RigidBody type="fixed">
      <Box args={[50, 0.1, 50]} position={[0, -0.05, 0]}>
        <gridHelper args={[50, 25]} />
        <meshPhongMaterial
          attach="material"
          color="#474747"
          opacity={0.5}
          transparent
        />
      </Box>
    </RigidBody>
  );
};
