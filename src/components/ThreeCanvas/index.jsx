import { Canvas } from "@react-three/fiber";
import { CanvasContainer } from "./styles";
import { OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import Slide from "../Slide";
import CameraElement from "../CameraElement";
import { AXIS_COLORS } from "../../constants/variables";

const ThreeCanvas = () => {
  return (
    <CanvasContainer>
      <Canvas>
        <GizmoHelper>
          <GizmoViewport axisColors={AXIS_COLORS} labelColor="white" />
        </GizmoHelper>
        <Slide url="https://www.educationcorner.com/images/featured-improve-test-taking.jpg" />
        <CameraElement />
        <OrbitControls />
      </Canvas>
    </CanvasContainer>
  );
};

export default ThreeCanvas;
