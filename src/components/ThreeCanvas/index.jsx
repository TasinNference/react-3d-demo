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
  MAX_OPACITY,
  MAX_SPACING,
  MIN_OPACITY,
  MIN_SPACING,
} from "../../constants/variables";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getRegistrationData } from "../../constants/functions";
import { useRef } from "react";
import { useState, Suspense } from "react";
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
  const [opacity, setOpacity] = useState((MIN_OPACITY + MAX_OPACITY) / 2);
  const [open, setOpen] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [spacing, setSpacing] = useState((MIN_SPACING + MAX_SPACING) / 2);
  const [syncOpacity, setSyncOpacity] = useState(true);
  const projectId = imagesArr.find((object) => object.project)?.slide_id;
  const projectIndex = imagesArr.map((object) => object.project).indexOf(true);
  const [composite, setComposite] = useState(false);
  const [options, setOptions] = useState([
    { name: "Normal Epithelial", label_val: 2, checked: true },
    { name: "Tumor", label_val: 3, checked: true },
    { name: "Stroma", label_val: 4, checked: true },
    { name: "Adipose", label_val: 1, checked: true },
    { name: "Necrosis", label_val: 5, checked: true },
  ]);
  const enabledLayers = options
    .filter((item) => item.checked)
    .map((item) => item.label_val);
  const defaultOptions = useRef(options);

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
    setSpacing((MIN_SPACING + MAX_SPACING) / 2);
    setOpacity((MAX_OPACITY + MIN_OPACITY) / 2);
    setOptions(defaultOptions.current);
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

  const toggleOptions = (index) => {
    if (options[index].checked && enabledLayers.length === 1) return;

    setOptions([
      ...options.slice(0, index),
      { ...options[index], checked: !options[index].checked },
      ...options.slice(index + 1),
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

  const targetImageTiltChange = (value, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], comp_tilt: parseFloat(value) },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const targetImageXChange = (value, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], comp_x_disp: parseFloat(value) },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const targetImageYChange = (value, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], comp_y_disp: parseFloat(value) },
      ...imagesArr.slice(index + 1),
    ]);
  };

  useEffect(() => {
    const fetchImgData = async () => {
      const paramsData = searchParams.get("data");
      const parsedData = JSON.parse(atob(paramsData));
      let formattedData = await getRegistrationData(parsedData);
      console.log(referenceSlide);
      formattedData =
        formattedData[0]?.slide_id === "H-1582-21-H-E_H01FBB59P-7110"
          ? [{ isTumor: true }, ...formattedData]
          : formattedData;
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
          composite={composite}
          targetImageTiltChange={targetImageTiltChange}
          targetImageXChange={targetImageXChange}
          targetImageYChange={targetImageYChange}
          options={options}
          toggleOptions={toggleOptions}
        />
      ) : (
        <CollapsedSidebar
          data={imagesArr}
          handleDragEnd={handleDragEnd}
          open={open}
          setOpen={setOpen}
          targetImageOpacityChange={targetImageOpacityChange}
          syncOpacity={syncOpacity}
          opacity={opacity}
          toggleImageVisibility={toggleImageVisibility}
          toggleImageProjection={toggleImageProjection}
        />
      )}
      <SettingsWidget
        opacity={opacity}
        setOpacity={setOpacity}
        rotation={rotation}
        setRotation={setRotation}
        spacing={spacing}
        setSpacing={setSpacing}
        resetImages={resetImages}
        resetOpacity={resetOpacity}
        composite={composite}
        setComposite={setComposite}
      />
      <div style={{ height: "100vh" }}>
        <Canvas linear flat>
          <GizmoHelper alignment="top-right">
            <GizmoViewcube />
          </GizmoHelper>
          <Suspense fallback={null}>
            <SlidesContainer
              data={imagesArr}
              referenceSlide={referenceSlide}
              opacity={opacity}
              rotation={rotation}
              spacing={spacing}
              projectId={projectId}
              options={options}
            />
          </Suspense>
          <CameraElement />
          {/* <CameraControls ref={cameraControls} /> */}
          <OrbitControls minZoom={0.2} maxZoom={5} />
        </Canvas>
      </div>
    </CanvasContainer>
  );
};

export default ThreeCanvas;
