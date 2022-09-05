import { Canvas } from "@react-three/fiber";
import { CanvasContainer } from "./styles";
import { OrbitControls, GizmoHelper, GizmoViewcube } from "@react-three/drei";
import Slide from "../Slide";
import CameraElement from "../CameraElement";
import {
  AXIS_COLORS,
  LABEL_COLOR,
  SLIDE_OPACITY,
} from "../../constants/variables";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getRegistrationData } from "../../constants/functions";
import { useRef } from "react";
import { useState } from "react";
import SlidesContainer from "../SlidesContainer";
import LeftSidebar from "../LeftSidebar";

const ThreeCanvas = () => {
  const [searchParams] = useSearchParams();
  const defaultData = useRef([]);
  const [imagesArr, setImagesArr] = useState([]);
  const [referenceSlide, setReferenceSlide] = useState();
  const [opacity, setOpacity] = useState(SLIDE_OPACITY);

  // React-dnd
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(imagesArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImagesArr(items);
  };

  // Image functions
  const toggleImageVisibility = (index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], hidden: !imagesArr[index].hidden },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const targetImageOpacityChange = (value, index) => {
    console.log("opacity change");
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], opacity: parseFloat(value) },
      ...imagesArr.slice(index + 1),
    ]);
  };

  useEffect(() => {
    const fetchImgData = async () => {
      const paramsData = searchParams.get("data");
      const parsedData = JSON.parse(atob(paramsData));
      const formattedData = await getRegistrationData(parsedData);
      defaultData.current = formattedData;
      setImagesArr(formattedData);
      setReferenceSlide(parsedData.reference_slide_info.slide_id);
    };

    fetchImgData();
  }, []);

  return (
    <CanvasContainer>
      <Canvas>
        <color attach="background" args={["black"]} />
        <SlidesContainer
          data={imagesArr}
          referenceSlide={referenceSlide}
          opacity={opacity}
        />
        <CameraElement />
        <OrbitControls />
        <GizmoHelper>
          <GizmoViewcube
            faces={["Right", "Left", "Top", "Bottom", "Front", "Back"]}
          />
        </GizmoHelper>
      </Canvas>
      <LeftSidebar
        data={imagesArr}
        toggleImageVisibility={toggleImageVisibility}
        targetImageOpacityChange={targetImageOpacityChange}
        handleDragEnd={handleDragEnd}
        apiUrl={window.location.origin}
        opacity={opacity}
      />
    </CanvasContainer>
  );
};

export default ThreeCanvas;
