import { Canvas, useThree } from "@react-three/fiber";
import { CanvasContainer } from "./styles";
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewcube,
  View,
  MapControls,
} from "@react-three/drei";
import Slide from "../Slide";
import CameraElement from "../CameraElement";
import {
  AXIS_COLORS,
  LABEL_COLOR,
  SLIDE_OPACITY,
  SLIDE_SPACING,
} from "../../constants/variables";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getRegistrationData } from "../../constants/functions";
import { useRef } from "react";
import { useState } from "react";
import SlidesContainer from "../SlidesContainer";
import LeftSidebar from "../LeftSidebar";
import * as THREE from "three";
import { borderRadius } from "@mui/system";
import { Typography } from "@mui/material";
import CollapsedSidebar from "../CollapsedSidebar";
import { CameraControls } from "../CameraControls";
import SettingsWidget from "../SettingsWidget";

const ThreeCanvas = () => {
  const [searchParams] = useSearchParams();
  const defaultData = useRef([]);
  const [imagesArr, setImagesArr] = useState([]);
  const [referenceSlide, setReferenceSlide] = useState();
  const [opacity, setOpacity] = useState(SLIDE_OPACITY);
  const [open, setOpen] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [spacing, setSpacing] = useState(SLIDE_SPACING);
  const cameraControls = useRef(null);
  const [syncOpacity, setSyncOpacity] = useState(true);
  const projectIndex = imagesArr.map((object) => object.project).indexOf(true);

  console.log(projectIndex, "project index");

  console.log(imagesArr);

  // React-dnd
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(imagesArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImagesArr(items);
  };

  useEffect(() => {
    setSyncOpacity(true);
  }, [opacity]);

  // Image functions
  const resetOpacity = () => {
    setImagesArr((prevArray) =>
      prevArray.map(({ opacity, ...rest }) => ({ ...rest }))
    );
    setSyncOpacity(true);
  };

  const resetImages = () => {
    setImagesArr(defaultData.current);
    setRotation(0);
    setSpacing(SLIDE_SPACING);
    setOpacity(SLIDE_OPACITY);
  };

  const toggleImageProjection = (i, bool) => {
    setImagesArr((prevArray) =>
      prevArray.map(({ project, ...rest }, index) => {
        if (i === index) {
          return { ...rest, project: bool };
        } else {
          return { ...rest };
        }
      })
    );
  };

  const toggleImageVisibility = (index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], hidden: !imagesArr[index].hidden },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const targetImageOpacityChange = (value, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], opacity: parseFloat(value) },
      ...imagesArr.slice(index + 1),
    ]);
    setSyncOpacity(false);
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
      {open ? (
        <LeftSidebar
          data={imagesArr}
          toggleImageVisibility={toggleImageVisibility}
          targetImageOpacityChange={targetImageOpacityChange}
          handleDragEnd={handleDragEnd}
          opacity={opacity}
          open={open}
          setOpen={setOpen}
          syncOpacity={syncOpacity}
          toggleImageProjection={toggleImageProjection}
        />
      ) : (
        <CollapsedSidebar
          data={imagesArr}
          handleDragEnd={handleDragEnd}
          open={open}
          setOpen={setOpen}
        />
      )}
      <SettingsWidget
        opacity={opacity}
        setOpacity={setOpacity}
        roation={rotation}
        setRotation={setRotation}
        spacing={spacing}
        setSpacing={setSpacing}
        resetImages={resetImages}
        resetOpacity={resetOpacity}
      />
      <div style={{ height: "100vh" }}>
        <Canvas>
          <GizmoHelper alignment="top-right">
            <GizmoViewcube />
          </GizmoHelper>
          <SlidesContainer
            data={imagesArr}
            referenceSlide={referenceSlide}
            opacity={opacity}
            rotation={rotation}
            spacing={spacing}
            projectIndex={projectIndex}
          />
          <CameraElement />
          {/* <CameraControls ref={cameraControls} /> */}
          <OrbitControls minZoom={0.2} maxZoom={5} />
        </Canvas>
      </div>
    </CanvasContainer>
  );
};

export default ThreeCanvas;
