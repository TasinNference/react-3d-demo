import { Canvas } from "@react-three/fiber";
import { CanvasContainer } from "./styles";
import { OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import Slide from "../Slide";
import CameraElement from "../CameraElement";

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
        <CameraElement />
        <OrbitControls />
      </Canvas>
    </CanvasContainer>
  );
};

export default ThreeCanvas;
