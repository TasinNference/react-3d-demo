import React, { memo, useRef, useLayoutEffect } from "react";
import { rectData } from "../../constants/bounded_boxes";
import { classData } from "../../constants/classifications";
import {
  calcRectPosition,
  getPositionFromSpacing,
} from "../../constants/functions";
import { Edges, Plane, Extrude, Line } from "@react-three/drei";
import * as THREE from "three";
import { colorMap } from "../../constants/variables";

const InstancedSquare = ({ instances, refCenter, width, height }) => {
  // const visibleLength = instances.reduce((n, item) => n + (item[2] !== 0), 0);
  console.log(refCenter);
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

    console.log(ref.current.position);
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.instanceColor.needsUpdate = true;
  }, [instances]);

  return (
    <instancedMesh
      position={[0, 0, 0]}
      ref={ref}
      args={[null, null, instances.length]}
    >
      <boxBufferGeometry args={[width, height, 0]} />
      <meshBasicMaterial transparent opacity={1} side={THREE.DoubleSide} />
      {/* <meshBasicMaterial transparent opacity={0.3} side={THREE.DoubleSide} /> */}
    </instancedMesh>
  );
};

const Projections = memo(({ length, index, composite, refCenter }) => {
  const width = 256 / 128;
  const height = 256 / 128;
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
        instances={classData.data.filter((item) => item[2] !== 0)}
        width={width}
        height={height}
      />
    </>
  );
});

export default Projections;
