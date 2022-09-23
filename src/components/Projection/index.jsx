import React, { memo, useRef, useLayoutEffect, useMemo } from "react";
import { rectData } from "../../constants/bounded_boxes";
import { classData } from "../../constants/classifications";
import {
  calcRectPosition,
  getPositionFromSpacing,
} from "../../constants/functions";
import { Edges, Plane, Extrude, Line } from "@react-three/drei";
import * as THREE from "three";
import { colorMap } from "../../constants/variables";

const InstancedSquare = ({ instances, refCenter, width, height, opacity }) => {
  const ref = useRef();
  useLayoutEffect(() => {
    instances.forEach((item, index) => {
      ref.current.setMatrixAt(
        index,
        new THREE.Matrix4().makeTranslation(
          item[0] / 128 - refCenter.x + width / 2,
          refCenter.y - item[1] / 128 - height / 2,
          0
        )
      );
      ref.current.setColorAt(
        index,
        new THREE.Color().setHex(colorMap[item[2]])
      );
    });

    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.instanceColor.needsUpdate = true;
  }, [instances]);

  return (
    <instancedMesh ref={ref} args={[null, null, instances.length]}>
      <boxBufferGeometry args={[width, height, 0]} />
      <meshBasicMaterial
        transparent
        opacity={opacity / 100}
        side={THREE.DoubleSide}
      />
      {/* <meshBasicMaterial transparent opacity={0.3} side={THREE.DoubleSide} /> */}
    </instancedMesh>
  );
};

const Projections = memo(
  ({ length, composite, refCenter, opacity, options }) => {
    const width = 256 / 128;
    const height = 256 / 128;
    const enabledLayers = options
      .filter((item) => item.checked)
      .map((item) => item.label_val);
    const data = useMemo(
      () =>
        classData.data.filter(
          (item) => enabledLayers.includes(item[2]) && item[2] !== 0
        ),
      [options]
    );
    // const positionZ = getPositionFromSpacing(index, length, spacing) + 1;
    // return (
    //   <group>
    //     {rectData.map((r) => {
    //       const position = calcRectPosition(r, index, length - 1);
    //       const points = [
    //         [position[0], position[1], positionZ],
    //         [position[0], position[1] + (r.max_y - r.min_y), positionZ],
    //         [
    //           position[0] + (r.max_x - r.min_x),
    //           position[1] + (r.max_y - r.min_y),
    //           positionZ,
    //         ],
    //         [position[0] + (r.max_x - r.min_x), position[1], positionZ],
    //         [position[0], position[1], positionZ],
    //       ];

    //       return (
    //         <mesh renderOrder={1000}>
    //           <Line points={points} color="blue" lineWidth={1} />
    //         </mesh>
    //       );
    //     })}
    //   </group>
    // );

    return (
      <>
        <InstancedSquare
          refCenter={refCenter}
          instances={data}
          width={width}
          height={height}
          opacity={opacity}
        />
      </>
    );
  }
);

export default Projections;
