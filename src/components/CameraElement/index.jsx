import React, { useRef } from "react";
import * as THREE from "three";
import { OrthographicCamera, useHelper } from "@react-three/drei";
import {
  CAMERA_POSITION,
  FAR_VALUE,
  NEAR_VALUE,
  ZOOM_LEVEL,
} from "../../constants/variables";

const CamerElement = () => {
  const camera = useRef();
  // useHelper(camera, THREE.CameraHelper, 1, "hotpink");

  return (
    <>
      <OrthographicCamera
        ref={camera}
        makeDefault
        position={CAMERA_POSITION}
        near={NEAR_VALUE}
        far={FAR_VALUE}
        zoom={ZOOM_LEVEL}
      />
    </>
  );
};

export default CamerElement;
