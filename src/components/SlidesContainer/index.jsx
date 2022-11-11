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
  projectId,
  options,
}) => {
  const [refCenter, setRefCenter] = useState();
  const filteredImages = data.filter((img) => !img.hidden);
  const hiddenImgs = data.filter((img) => img.hidden);

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(rotation)]}>
      {filteredImages.map((imgData, index) =>
        imgData.isTumor ? (
          refCenter && (
            <mesh
              position={[
                0,
                0,
                getPositionFromSpacing(index, filteredImages.length, spacing),
              ]}
            >
              <Projection
                length={filteredImages.length}
                composite={composite}
                refCenter={refCenter}
                opacity={imgData.opacity ? imgData.opacity : opacity}
                options={options}
              />
            </mesh>
          )
        ) : (
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
                length={filteredImages.length}
                spacing={spacing}
                index={index}
                projectId={projectId}
              />
            </Suspense>
          </>
        )
      )}
      {hiddenImgs.map(
        (imgData, index) =>
          !imgData.isTumor && (
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
                length={filteredImages.length}
                spacing={spacing}
                index={index}
                projectId={projectId}
              />
            </Suspense>
          )
      )}
    </group>
  );
};

export default SlidesContainer;
