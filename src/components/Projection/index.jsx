import React from "react";
import { rectData } from "../../constants/bounded_boxes";
import {
  calcRectPosition,
  getPositionFromSpacing,
} from "../../constants/functions";
import { Edges, Plane, Extrude, Line } from "@react-three/drei";
import * as THREE from "three";

const Projections = ({ length, index, composite, spacing }) => {
  const positionZ = getPositionFromSpacing(index, length, spacing) + 1;
  return (
    <group>
      {rectData.map((r) => {
        const position = calcRectPosition(r, index, length - 1);
        const points = [
          [position[0], position[1], positionZ],
          [position[0], position[1] + (r.max_y - r.min_y), positionZ],
          [
            position[0] + (r.max_x - r.min_x),
            position[1] + (r.max_y - r.min_y),
            positionZ,
          ],
          [position[0] + (r.max_x - r.min_x), position[1], positionZ],
          [position[0], position[1], positionZ],
        ];

        return (
          <mesh renderOrder={1000}>
            <Line points={points} color="blue" lineWidth={1} />
          </mesh>
        );
      })}
    </group>
  );
};

export default Projections;
