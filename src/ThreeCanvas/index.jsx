import React from "react";
import { Canvas } from "@react-three/fiber";
import { CanvasContainer } from "./styles";
import {
  OrthographicCamera,
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";

const ThreeCanvas = () => {
  return (
    <CanvasContainer>
      <Canvas>
        <GizmoHelper>
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="white"
          />
        </GizmoHelper>
        <OrthographicCamera makeDefault zoom={40} position={[0, 0, 40]} />
        <OrbitControls />
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </CanvasContainer>
  );
};

export default ThreeCanvas;
