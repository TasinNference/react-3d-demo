import React from "react";
import { rectData } from "../../constants/bounded_boxes";
import {
  calcRectPosition,
  getPositionFromSpacing,
} from "../../constants/functions";
import { Edges, Plane, Extrude, Line } from "@react-three/drei";
import { SLIDE_SPACING } from "../../constants/variables";
import * as THREE from "three";

const extrudeSettings = {
  steps: 2,
  bevelEnabled: false,
};

const Projections = ({ length, index, composite }) => {
  const positionZ = getPositionFromSpacing(index, length) + 1;
  return (
    <group>
      {rectData.map((r) => {
        const shape = new THREE.Shape();
        const position = calcRectPosition(r, index, length - 1);
        console.log(position);
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

        shape.moveTo(points[0][0], points[0][1]);
        shape.lineTo(points[1][0], points[1][1]);
        shape.lineTo(points[2][0], points[2][1]);
        shape.lineTo(points[3][0], points[3][1]);

        return (
          <mesh renderOrder={1000}>
            <Line points={points} color="blue" lineWidth={composite ? 1 : 1} />
          </mesh>
        );
      })}
    </group>
  );
};

export default Projections;
