import React, { Suspense, useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useState } from "react";
import { useEffect } from "react";
import { MathUtils, Matrix4 } from "three";
import { degToRad } from "../../constants/functions";

const Slide = ({ imgData, positionZ, refCenter, setRefCenter }) => {
  const [texture, setTexture] = useState();
  const [mat1, setMat1] = useState();
  const [mat2, setMat2] = useState();
  const mesh = useRef();

  useTexture(`${window.location.origin}${imgData.url}`, (tex) => {
    setTexture(tex);
  });

  useEffect(() => {
    if (!texture) return;

    if (imgData.reference && !refCenter) {
      const center = {
        x: texture.image.width / 2,
        y: texture.image.height / 2,
      };
      setRefCenter(center);
    }

    if (!imgData.reference) {
      mesh.current.position.set(
        texture.image.width / 2,
        -texture.image.height / 2,
        positionZ
      );
      const matrix = new Matrix4();
      const matrix2 = new Matrix4();

      console.log(imgData.tilt);

      matrix.multiply(
        new Matrix4().makeTranslation(-refCenter?.x, refCenter?.y, 0)
      );

      matrix.multiply(new Matrix4().makeRotationZ(degToRad(-imgData.tilt)));

      matrix.multiply(
        new Matrix4().makeShear(imgData.x_skew, 0, imgData.y_skew, 0, 0, 0)
      );

      matrix.multiply(
        new Matrix4().makeScale(imgData.x_scale, imgData.y_scale, 1)
      );

      matrix2.multiply(
        new Matrix4().makeTranslation(imgData.x_disp, -imgData.y_disp, 0)
      );

      setMat1(matrix);
      setMat2(matrix2);
    }
  }, [texture, refCenter]);

  return (
    <Suspense fallback={null}>
      <group matrixAutoUpdate={false} matrix={mat2}>
        <group matrixAutoUpdate={false} matrix={mat1}>
          <mesh ref={mesh} position={[0, 0, positionZ]}>
            <planeBufferGeometry
              attach="geometry"
              args={[texture?.image.width, texture?.image.height]}
            />
            <meshBasicMaterial
              attach="material"
              map={texture}
              side={THREE.DoubleSide}
              transparent={true}
              toneMapped={false}
              opacity={0.5}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </Suspense>
  );
};

export default Slide;
