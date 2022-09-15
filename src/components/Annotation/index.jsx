import React from "react";
import { Line } from "@react-three/drei";
import { ANN_WIDTH } from "../../constants/variables";

const Annotation = ({ annotations, width, height, composite }) => {
  return (
    width &&
    height && (
      <mesh position={[0, 0, 1]}>
        {annotations.map(({ coordinates, annotationColor }) => {
          const formattedCoords = coordinates.map((coord) => [
            -width / 2 + coord.x / 128,
            height / 2 - coord.y / 128,
            0,
          ]);

          return (
            <Line
              points={[...formattedCoords, formattedCoords[0]]}
              color={annotationColor}
              lineWidth={ANN_WIDTH}
              toneMapped={false}
            />
          );
        })}
      </mesh>
    )
  );
};

export default Annotation;
