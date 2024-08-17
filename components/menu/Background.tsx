import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { Color, ShaderMaterial } from "three";
import { useRef } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      colorShiftMaterial: any;
    }
  }
}

export const Background = () => {
  const shaderRef = useRef<ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime() / 64;
    }
  });
  return (
    <mesh rotation={[Math.PI / 4, 0, 0]}>
      {/* <sphereGeometry args={[250, 64, 64]} /> */}
      <boxGeometry args={[250, 250, 250]} />
      <colorShiftMaterial
        ref={shaderRef}
        side={1}
        uMultiplier={5}
        uColorA="#309cad"
        uColorB="#221471"
      />
    </mesh>
  );
};

const ColorShiftMaterial = shaderMaterial(
  {
    uAlpha: 0.5,
    uMultiplier: 20,
    uTime: 0,
    //@ts-expect-error
    uColorA: new Color("#000000"),
    //@ts-expect-error
    uColorB: new Color("#000000"),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uMultiplier;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec2 mulvUv = mod(vUv * uMultiplier, 1.0);
      float strength = step(0.5, mod(mulvUv.y + uTime, 1.0));
      vec3 mixColor = mix(uColorA, uColorB, step(0.5, mod(vUv.y * uMultiplier / 2.0, 1.0)));
      gl_FragColor.rgba = vec4(mixColor, strength);
    }
  `
);

extend({ ColorShiftMaterial });
