import React, { Suspense, useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useState } from "react";
import { useEffect } from "react";
import { MathUtils, Matrix4 } from "three";
import { degToRad } from "../../constants/functions";
import Annotation from "../Annotation";

const Slide = ({
  imgData,
  positionZ,
  refCenter,
  setRefCenter,
  opacity,
  composite,
  projectIndex,
  length,
  spacing,
  index,
}) => {
  const [texture, setTexture] = useState();
  const [mat1, setMat1] = useState();
  const [mat2, setMat2] = useState();
  const [position, setPosition] = useState([0, 0]);
  const mesh = useRef();
  const width = useRef();
  const height = useRef();

  const calcMatrix = () => {
    const matrix = new Matrix4();
    const matrix2 = new Matrix4();

    matrix.multiply(
      new Matrix4().makeTranslation(-refCenter?.x, refCenter?.y, 0)
    );

    matrix.multiply(new Matrix4().makeRotationZ(degToRad(-imgData.comp_tilt)));

    matrix.multiply(
      new Matrix4().makeShear(imgData.x_skew, 0, imgData.y_skew, 0, 0, 0)
    );

    matrix.multiply(
      new Matrix4().makeScale(imgData.x_scale, imgData.y_scale, 1)
    );

    matrix2.multiply(
      new Matrix4().makeTranslation(
        imgData.comp_x_disp,
        -imgData.comp_y_disp,
        0
      )
    );

    setMat1(matrix);
    setMat2(matrix2);
  };

  useTexture(`${window.location.origin}${imgData.url}`, (tex) => {
    if (!texture) {
      console.log("texture test");
      setTexture(tex);
      width.current = tex.image.width;
      height.current = tex.image.height;
    }
  });

  useEffect(() => {
    if (!texture) return;

    if (imgData.reference && !refCenter) {
      const center = {
        x: width.current / 2,
        y: height.current / 2,
      };
      setRefCenter(center);
    }

    if (!imgData.reference) {
      setPosition([width.current / 2, -height.current / 2]);
      calcMatrix();
    }
  }, [texture, refCenter]);

  useEffect(() => {
    if (!imgData.reference) {
      calcMatrix();
    }
  }, [imgData.comp_tilt, imgData.comp_x_disp, imgData.comp_y_disp]);

  return (
    <group matrixAutoUpdate={false} matrix={mat2}>
      <group matrixAutoUpdate={false} matrix={mat1}>
        <mesh ref={mesh} position={[...position, positionZ]}>
          <planeBufferGeometry
            attach="geometry"
            args={[width.current, height.current]}
          />
          <meshBasicMaterial
            attach="material"
            map={texture}
            side={THREE.DoubleSide}
            transparent={true}
            toneMapped={false}
            opacity={opacity / 100}
          />

          <Annotation
            annotations={imgData.annotations}
            width={width.current}
            height={height.current}
            composite={composite}
            length={length}
            projectIndex={projectIndex}
          />

          {projectIndex === index &&
            Array(length)
              .fill()
              .map((_, i) => {
                return (
                  i !== index && (
                    <group position={[0, 0, (index - i) * spacing]}>
                      <Annotation
                        annotations={imgData.annotations}
                        width={width.current}
                        height={height.current}
                        composite={composite}
                        length={length}
                        projectIndex={projectIndex}
                      />
                    </group>
                  )
                );
              })}
        </mesh>
      </group>
    </group>
  );
};

export default Slide;
