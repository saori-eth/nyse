import React from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Create a custom shader material
const StarrySkyMaterial = shaderMaterial(
  // Uniforms
  {},
  // Vertex Shader
  `
    varying vec3 vWorldPosition;

    void main() {
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  // Fragment Shader
  `
    varying vec3 vWorldPosition;

    // Simple random function
    float random(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      float starDensity = 0.0001;
      float r = random(vWorldPosition.xy * 1000.0);
      if (r > 1.0 - starDensity) {
          gl_FragColor = vec4(vec3(1.0), 1.0); // White star
      } else {
          gl_FragColor = vec4(vec3(0.0), 1.0); // Space background
      }
    }
  `
);

// Extend the material so it can be used in JSX
extend({ StarrySkyMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      starrySkyMaterial: any;
    }
  }
}

export const Skybox = () => {
  return (
    <mesh>
      {/* Large sphere geometry to encompass the scene */}
      <sphereGeometry args={[100, 60, 40]} />
      {/* Use the custom shader material */}
      <starrySkyMaterial side={THREE.BackSide} />
    </mesh>
  );
};
