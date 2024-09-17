import { Text, Billboard } from "@react-three/drei";
import { Shape } from "three";

export const NamePlate = ({ name }: { name: string }) => {
  return (
    <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
      <group position={[0, 0.5, 0]}>
        <mesh>
          <RoundedRect width={0.6} height={0.15} radius={0.05} />
          <meshBasicMaterial color="black" transparent opacity={0.5} />
        </mesh>
        <Text
          color="white"
          anchorX="center"
          anchorY="middle"
          fontSize={0.1}
          outlineColor="black"
          position={[0, 0, 0.01]} // Slightly in front of the background
        >
          {name}
        </Text>
      </group>
    </Billboard>
  );
};

const RoundedRect = ({
  width,
  height,
  radius,
}: {
  width: number;
  height: number;
  radius: number;
}) => {
  // Function to create a rounded rectangle shape
  const createRoundedRectShape = (width, height, radius) => {
    const shape = new Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height
    );
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
  };

  // Define the dimensions of the background
  const backgroundWidth = 0.6; // Adjust based on text length
  const backgroundHeight = 0.15;
  const borderRadius = 0.05;
  const roundedRectShape = createRoundedRectShape(
    backgroundWidth,
    backgroundHeight,
    borderRadius
  );
  const shape = createRoundedRectShape(width, height, radius);
  return <shapeGeometry args={[shape]} />;
};
