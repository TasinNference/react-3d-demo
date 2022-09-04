import { Canvas } from "@react-three/fiber";
import { CanvasContainer } from "./styles";
import { OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import Slide from "../Slide";
import CameraElement from "../CameraElement";
import { AXIS_COLORS, LABEL_COLOR } from "../../constants/variables";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getRegistrationData } from "../../constants/functions";
import { useRef } from "react";
import { useState } from "react";
import SlidesContainer from "../SlidesContainer";

const ThreeCanvas = () => {
  const [searchParams] = useSearchParams();
  const defaultData = useRef([]);
  const [imagesArr, setImagesArr] = useState([]);

  useEffect(() => {
    const paramsData = searchParams.get("data");
    const parsedData = JSON.parse(atob(paramsData));
    const formattedData = getRegistrationData(parsedData);
    defaultData.current = formattedData;
    setImagesArr(formattedData);
    console.log(formattedData);
  }, []);

  return (
    <CanvasContainer>
      <Canvas>
        <color attach="background" args={["black"]} />
        <GizmoHelper>
          <GizmoViewport axisColors={AXIS_COLORS} labelColor={LABEL_COLOR} />
        </GizmoHelper>
        <SlidesContainer data={imagesArr} />
        <CameraElement />
        <OrbitControls />
      </Canvas>
    </CanvasContainer>
  );
};

export default ThreeCanvas;
