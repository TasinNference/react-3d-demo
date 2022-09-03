import React, { Suspense, useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useState } from "react";

const Slide = ({ url }) => {
  const [texture, setTexture] = useState();

  useTexture(url, (tex) => {
    setTexture(tex);
  });

  return (
    <Suspense fallback={null}>
      <mesh>
        <planeBufferGeometry
          attach="geometry"
          args={[texture?.image.width, texture?.image.height]}
        />
        <meshBasicMaterial
          attach="material"
          map={texture}
          side={THREE.DoubleSide}
          transparent={true}
          toneMapped={false}
        />
      </mesh>
    </Suspense>
  );
};

export default Slide;
