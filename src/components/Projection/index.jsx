import React from "react";
import { rectData } from "../../constants/bounded_boxes";
import { calcRectPosition } from "../../constants/functions";
import { Edges, Plane, Extrude, Line } from "@react-three/drei";
import { SLIDE_SPACING } from "../../constants/variables";
import * as THREE from "three";

const extrudeSettings = {
  steps: 2,
  bevelEnabled: false,
};

const Projections = ({ length, index }) => {
  return (
    <group>
      {rectData.map((r) => {
        const shape = new THREE.Shape();
        const position = calcRectPosition(r, index, length - 1);
        const points = [
          [position[0], position[1], position[2]],
          [position[0], position[1] + (r.max_y - r.min_y), position[2]],
          [
            position[0] + (r.max_x - r.min_x),
            position[1] + (r.max_y - r.min_y),
            position[2],
          ],
          [position[0] + (r.max_x - r.min_x), position[1], position[2]],
          [position[0], position[1], position[2]],
        ];

        shape.moveTo(points[0][0], points[0][1]);
        shape.lineTo(points[1][0], points[1][1]);
        shape.lineTo(points[2][0], points[2][1]);
        shape.lineTo(points[3][0], points[3][1]);

        return (
          <mesh renderOrder={1000}>
            <Line points={points} color="blue" lineWidth={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

export default Projections;
