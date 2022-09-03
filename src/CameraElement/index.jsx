import React, { useRef } from "react";
import * as THREE from "three";
import { OrthographicCamera, useHelper } from "@react-three/drei";

const CamerElement = () => {
  const camera = useRef();
  // useHelper(camera, THREE.CameraHelper, 1, "hotpink");

  return (
    <>
      <OrthographicCamera
        ref={camera}
        makeDefault
        position={[0, 0, 2000]}
        near={1}
        far={4000}
        zoom={0.3}
      />
    </>
  );
};

export default CamerElement;
