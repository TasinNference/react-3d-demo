import React, { useState, useEffect, Suspense } from "react";
import { getPositionFromSpacing } from "../../constants/functions";
import Projection from "../Projection";
import Slide from "../Slide";
import * as THREE from "three";

const SlidesContainer = ({
  data,
  referenceSlide,
  opacity,
  composite = false,
  rotation,
  spacing,
  projectIndex,
}) => {
  console.log("slides container");

  const [refCenter, setRefCenter] = useState();
  const filteredImages = data.filter((img) => !img.hidden);

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(rotation)]}>
      {filteredImages.map((imgData, index) => (
        <>
          <Suspense fallback={null}>
            <Slide
              imgData={imgData}
              positionZ={getPositionFromSpacing(
                index,
                filteredImages.length,
                spacing
              )}
              refCenter={refCenter}
              setRefCenter={setRefCenter}
              key={imgData.slide_id}
              opacity={imgData.opacity ? imgData.opacity : opacity}
              composite={composite}
              projectIndex={projectIndex}
              length={filteredImages.length}
              spacing={spacing}
              index={index}
            />
          </Suspense>
          {index === 0 && refCenter && (
            <Projection
              length={filteredImages.length}
              index={index}
              composite={composite}
              spacing={spacing}
              refCenter={refCenter}
            />
          )}
        </>
      ))}
    </group>
  );
};

export default SlidesContainer;
