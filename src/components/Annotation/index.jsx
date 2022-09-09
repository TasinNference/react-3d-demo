import React from "react";
import { Line } from "@react-three/drei";

const Annotation = ({ img, width, height, composite }) => {
  return (
    width &&
    height && (
      <mesh position={[0, 0, composite ? 1000 : 1]}>
        {img.annotations.map(({ coordinates, annotationColor }) => {
          const formattedCoords = coordinates.map((coord) => [
            -width / 2 + coord.x / 128,
            height / 2 - coord.y / 128,
            0,
          ]);

          return (
            <Line
              points={[...formattedCoords, formattedCoords[0]]}
              color={annotationColor}
              lineWidth={composite ? 2 : 3}
              toneMapped={false}
            />
          );
        })}
      </mesh>
    )
  );
};

export default Annotation;
