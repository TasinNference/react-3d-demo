import React, { useState } from "react";
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
  const [refCenter, setRefCenter] = useState();
  const filteredImages = data.filter((img) => !img.hidden);

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(rotation)]}>
      {filteredImages.map((imgData, index) => (
        <>
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
          {referenceSlide === "JR-20-4929-A21-1_H01BBB30P-12293" && (
            <Projection
              length={filteredImages.length}
              index={index}
              composite={composite}
              spacing={spacing}
            />
          )}
        </>
      ))}
    </group>
  );
};

export default SlidesContainer;
