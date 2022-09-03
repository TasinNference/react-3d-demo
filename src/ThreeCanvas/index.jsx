import React, { Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { CanvasContainer } from "./styles";
import {
  OrthographicCamera,
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Image,
} from "@react-three/drei";
import Slide from "../Slide";
import CamerElement from "../CameraElement";

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
        <Slide url="https://www.educationcorner.com/images/featured-improve-test-taking.jpg" />
        <CamerElement />
        {/* <OrthographicCamera makeDefault={true} position={[0, 0, 80]} /> */}
        <OrbitControls />
      </Canvas>
    </CanvasContainer>
  );
};

export default ThreeCanvas;
