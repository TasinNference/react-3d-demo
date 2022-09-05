import React, { useState } from "react";
import { getPositionFromSpacing } from "../../constants/functions";
import Projection from "../Projection";
import Slide from "../Slide";

const SlidesContainer = ({ data, referenceSlide }) => {
  const [refCenter, setRefCenter] = useState();
  const filteredImages = data.filter((img) => !img.hidden);

  return (
    <group>
      {filteredImages.map((imgData, index) => (
        <>
          <Slide
            imgData={imgData}
            positionZ={getPositionFromSpacing(index, filteredImages.length)}
            refCenter={refCenter}
            setRefCenter={setRefCenter}
            key={imgData.slide_id}
          />
          {referenceSlide === "JR-20-4929-A21-1_H01BBB30P-12293" && (
            <Projection length={filteredImages.length} index={index} />
          )}
        </>
      ))}
    </group>
  );
};

export default SlidesContainer;
