import React, { useState } from "react";
import { getPositionFromSpacing } from "../../constants/functions";
import { SLIDE_OPACITY } from "../../constants/variables";
import Projection from "../Projection";
import Slide from "../Slide";

const SlidesContainer = ({
  data,
  referenceSlide,
  opacity,
  composite = false,
}) => {
  const [refCenter, setRefCenter] = useState();
  const filteredImages = data.filter((img) => !img.hidden);
  const [hover, setHover] = useState(false);

  return (
    <group
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {filteredImages.map((imgData, index) => (
        <>
          <Slide
            imgData={imgData}
            positionZ={getPositionFromSpacing(index, filteredImages.length)}
            refCenter={refCenter}
            setRefCenter={setRefCenter}
            key={imgData.slide_id}
            opacity={imgData.opacity ? imgData.opacity : opacity}
            composite={composite}
          />
          {referenceSlide === "JR-20-4929-A21-1_H01BBB30P-12293" && (
            <Projection
              length={filteredImages.length}
              index={index}
              composite={composite}
            />
          )}
        </>
      ))}
    </group>
  );
};

export default SlidesContainer;
