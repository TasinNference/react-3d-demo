import React, { Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import * as THREE from "three";
import {
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { GoSettings } from "react-icons/go";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import randomColor from "randomcolor";

const X_INCREMENT = 1;
const Y_INCREMENT = 1;
const SPACING = 50;

// const imgData = {
//   request: {
//     reference_slide_info: {
//       slide_id: "H01BBB24P-6639",
//       grid_id: "grid_merged",
//       grids: [
//         {
//           id: "62a1a0ce0ca2c83b4d1efd60",
//           boundingBox: {
//             end_x: 590.0729166666666,
//             end_y: 711.659477124183,
//             start_x: 66.92708333333334,
//             start_y: 204.340522875817,
//           },
//         },
//         {
//           id: "62a1a0ce0ca2c83b4d1efd61",
//           boundingBox: {
//             end_x: 549.0729166666666,
//             end_y: 1224,
//             start_x: 24.927083333333343,
//             start_y: 736.340522875817,
//           },
//         },
//       ],
//       stainColor: "red-pink",
//     },
//     register_slide_info: [
//       {
//         slide_id: "H01BBB24P-6638",
//         grid_id: "grid_merged",
//         grids: [
//           {
//             id: "62a1a0ac0ca2c83b4d1efd5d",
//             boundingBox: {
//               end_x: 597.0729166666666,
//               end_y: 1021.659477124183,
//               start_x: 72.92708333333334,
//               start_y: 500.340522875817,
//             },
//           },
//         ],
//         stainColor: "red-pink",
//       },
//     ],
//   },
//   response: {
//     status: true,
//     reference_slide_info: {
//       slide_id: "H01BBB24P-6639",
//       grid_id: "grid_merged",
//     },
//     register_slide_info: [
//       {
//         slide_id: "H01BBB24P-6638",
//         grid_id: "grid_merged",
//         tilt: 98.56557776856678,
//         x_disp: 1017.9208399401064,
//         y_disp: 117.50423590224302,
//         x_scale: 0.9801446591539287,
//         y_scale: 0.9850595270811353,
//         x_skew: 0.020011303049138344,
//         y_skew: 0,
//       },
//     ],
//   },
// };

const imgData = [
  {
    id: 1,
    url: "/images/H01BBB24P-6638.jpeg",
    name: "Image 1",
    start_x: 72.92708333333334,
    start_y: 500.340522875817,
    end_x: 597.0729166666666,
    end_y: 1021.659477124183,
    rotation: 98.56557776856678,
    borderColor: randomColor()
  },
  {
    id: 2,
    url: "/images/H01BBB24P-6639.jpeg",
    name: "Image 2",
    end_x: 590.0729166666666,
    end_y: 711.659477124183,
    start_x: 66.92708333333334,
    start_y: 204.340522875817,
    borderColor: randomColor()
  },
];

function ImageElement({ position, rotation, opacity, url, img, showBorder }) {
  const width = img.end_x - img.start_x;
  const height = img.end_y - img.start_y;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imgObj = new Image();
  imgObj.onload = function() {
    ctx.drawImage(
      imgObj,
      img.start_x,
      img.start_y,
      width,
      height,
      0,
      0,
      width,
      height
    );
    if(showBorder) {
      ctx.strokeStyle = img.borderColor
      ctx.lineWidth = 15;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
  }
  imgObj.src = url;
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true;

  useFrame(() => {
    texture.needsUpdate = true;
  })

  return (
    <group
      rotation={
        rotation ? [0, THREE.MathUtils.degToRad(-rotation), 0] : [0, 0, 0]
      }
      position={position}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[width, height]} />
        <meshBasicMaterial
          attach="material"
          map={texture}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={opacity / 100}
        />
      </mesh>
    </group>
  );
}

const CameraElement = ({ cameraView }) => {
  const { camera } = useThree();

  console.log(cameraView);

  switch (cameraView) {
    case "front":
      camera.position.set(0, 0, 100);
      break;

    case "back":
      camera.position.set(0, 0, -100);
      break;

    case "iso":
      camera.position.set(-100, 100, 100);
      break;

    default:
      break;
  }

  return (
    <OrthographicCamera
      makeDefault
      zoom={1}
      position={[-100, 100, 100]}
      near={-1000}
      far={1000}
    />
  );
};

const App = () => {
  const [cameraView, setCameraView] = useState("iso");
  const [opacity, setOpacity] = useState(50);
  const [spacing, setSpacing] = useState(50);
  const [imagesArr, setImagesArr] = useState(imgData);
  const [showBorder, setShowBorder] = useState(true);

  const filteredImages = imagesArr.filter((img) => !img.hidden);

  const handleSpacingIncrease = () => {
    setSpacing(spacing + SPACING);
  };

  const handleSpacingDecrease = () => {
    if (spacing > SPACING) setSpacing(spacing - SPACING);
  };

  const calcPosition = (index) => {
    return -1 * (index - (filteredImages.length - 1) / 2) * spacing;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(imagesArr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImagesArr(items);
  };

  const handleConfigureImage = (id, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index).map(({ open, ...rest }) => ({ ...rest })),
      { ...imagesArr[index], open: !imagesArr[index].open },
      ...imagesArr.slice(index + 1).map(({ open, ...rest }) => ({ ...rest })),
    ]);
  };

  const targetImageOpacityChange = (e, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], opacity: e.target.value },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const resetOpacity = () => {
    setImagesArr((prevArray) =>
      prevArray.map(({ opacity, ...rest }) => ({ ...rest }))
    );
  };

  const resetImages = () => {
    setImagesArr(imgData);
  };

  const mainOpacityChange = (e) => {
    resetOpacity();
    setOpacity(e.target.value);
  };

  const rotationHandler = (e, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], rotation: e.target.value },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const toFrontView = () => {
    setCameraView("front");
  };

  const toIsoView = () => {
    setCameraView("iso");
  };

  const toBackView = () => {
    setCameraView("back");
  };

  const toggleImageVisibility = (index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      { ...imagesArr[index], hidden: !imagesArr[index].hidden },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const moveX = (index, opposite = false) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      {
        ...imagesArr[index],
        transformX:
          (imagesArr[index].transformX ? imagesArr[index].transformX : 0) +
          (opposite ? -1 : 1) * X_INCREMENT,
      },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const moveY = (index, opposite = false) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      {
        ...imagesArr[index],
        transformY:
          (imagesArr[index].transformY ? imagesArr[index].transformY : 0) +
          (opposite ? -1 : 1) * Y_INCREMENT,
      },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const toggleShowBorder = () => {
    setShowBorder((prevBorder) => !showBorder)
  }

  return (
    <div id="canvas-container">
      <Canvas>
        <CameraElement cameraView={cameraView} />
        <OrbitControls
          enablePan={false}
          onStart={() => {
            setCameraView("free");
          }}
        />
        <group rotation={[Math.PI / 2, 0, 0]}>
          {filteredImages.map((img, index) => {
            return (
              <Suspense key={index} fallback={null}>
                <ImageElement
                  position={[
                    img.transformX ? img.transformX : 0,
                    calcPosition(index),
                    img.transformY ? img.transformY : 0,
                  ]}
                  img={img}
                  rotation={img.rotation}
                  url={img.url}
                  opacity={img.opacity ? img.opacity : opacity}
                  showBorder={showBorder}
                />
              </Suspense>
            );
          })}
        </group>
      </Canvas>
      <div id="canvas-layers">
        <div>
        <button onClick={resetImages}>Reset</button>
        <button onClick={toggleShowBorder}>Toggle Border</button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="layers-container"
              >
                {imagesArr.map((img, index) => (
                  <Draggable
                    key={img.id}
                    draggableId={`${img.id}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="layers-item"
                      >
                        <div>{img.name}</div>
                        <div style={{ display: "flex", columnGap: "10px" }}>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleImageVisibility(index)}
                          >
                            {img.hidden ? (
                              <AiFillEyeInvisible />
                            ) : (
                              <AiFillEye />
                            )}
                          </div>
                          <GoSettings
                            onClick={() => handleConfigureImage(img.id, index)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        {img.open && (
                          <div>
                            <div>
                              <button onClick={() => moveX(index, true)}>
                                -
                              </button>{" "}
                              X <button onClick={() => moveX(index)}>+</button>
                            </div>
                            <div>
                              <button onClick={() => moveY(index)}>-</button> Y{" "}
                              <button onClick={() => moveY(index, true)}>
                                +
                              </button>
                            </div>
                            <div>
                              <div>
                                Opacity {img.opacity ? img.opacity : opacity}%
                              </div>
                              <input
                                id="target-image-opacity"
                                type="range"
                                value={img.opacity ? img.opacity : opacity}
                                onChange={(e) =>
                                  targetImageOpacityChange(e, index)
                                }
                                min={1}
                                max={100}
                              />
                            </div>
                            <div>
                              <div>
                                Rotation {img.rotation ? img.rotation : 0}
                              </div>
                              <input
                                id="target-image-opacity"
                                type="range"
                                value={img.rotation ? img.rotation : 0}
                                onChange={(e) => rotationHandler(e, index)}
                                min={-180}
                                max={180}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div id="canvas-view-changer">
        <button onClick={toFrontView}>Front</button>
        <button onClick={toBackView}>Back</button>
        <button onClick={toIsoView}>Isometric</button>
      </div>
      <div id="canvas-controls">
        <div className="input-group">
          <label>Spacing</label>
          <div>
            <button onClick={handleSpacingDecrease}>-</button>
            {spacing}
            <button onClick={handleSpacingIncrease}>+</button>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="image-opacity">Opacity</label>
          <input
            id="image-opacity"
            type="range"
            value={opacity}
            onChange={(e) => mainOpacityChange(e)}
            min={1}
            max={100}
          />
        </div>
      </div>
    </div>
  );
};

export default App;