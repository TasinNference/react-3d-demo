import React, { useState } from "react";
import { getPositionFromSpacing } from "../../constants/functions";
import Slide from "../Slide";

const SlidesContainer = ({ data }) => {
  const [refCenter, setRefCenter] = useState();

  return (
    <group>
      {data.map((imgData, index) => (
        <Slide
          imgData={imgData}
          positionZ={getPositionFromSpacing(index, data.length)}
          refCenter={refCenter}
          setRefCenter={setRefCenter}
          key={imgData.slide_id}
        />
      ))}
    </group>
  );
};

export default SlidesContainer;
