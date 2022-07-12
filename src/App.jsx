import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import * as THREE from "three";
import {
  OrbitControls,
  OrthographicCamera,
  useCamera,
} from "@react-three/drei";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { GoSettings } from "react-icons/go";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import randomColor from "randomcolor";
import { Matrix4, Scene } from "three";
import { CameraControls } from "./CameraControls";
import * as holdEvent from "hold-event";
import { ButtonBase, IconButton } from "@mui/material";

const X_INCREMENT = 1;
const Y_INCREMENT = 1;
const X_SCALE_INCREMENT = 0.1;
const Y_SCALE_INCREMENT = 0.1;
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

const registerData = {
  request: {
    reference_slide_info: {
      slide_id: "H01BBB24P-6636",
      grid_id: "grid_merged",
      grids: [
        {
          id: "62a1a0760ca2c83b4d1efd56",
          boundingBox: {
            end_x: 588.0729166666666,
            end_y: 1049.659477124183,
            start_x: 32.92708333333334,
            start_y: 206.340522875817,
          },
        },
      ],
      stainColor: "red-pink",
    },
    register_slide_info: [
      {
        slide_id: "H01BBB24P-6635",
        grid_id: "grid_merged",
        grids: [
          {
            id: "62a1a05c0ca2c83b4d1efd53",
            boundingBox: {
              end_x: 607.0729166666666,
              end_y: 1103.659477124183,
              start_x: 6.927083333333343,
              start_y: 288.340522875817,
            },
          },
        ],
        stainColor: "red-pink",
      },
      {
        slide_id: "H01BBB24P-6637",
        grid_id: "grid_merged",
        grids: [
          {
            id: "62a1a0920ca2c83b4d1efd59",
            boundingBox: {
              end_x: 596.0729166666666,
              end_y: 1224,
              start_x: 16.92708333333333,
              start_y: 372.340522875817,
            },
          },
          {
            id: "62a1a0920ca2c83b4d1efd5a",
            boundingBox: {
              end_x: 546.0729166666666,
              end_y: 318.659477124183,
              start_x: 260.9270833333333,
              start_y: 104.34052287581699,
            },
          },
        ],
        stainColor: "cyan",
      },
    ],
  },
  response: {
    status: true,
    reference_slide_info: {
      slide_id: "H01BBB24P-6636",
      grid_id: "grid_merged",
    },
    register_slide_info: [
      {
        slide_id: "H01BBB24P-6635",
        grid_id: "grid_merged",
        tilt: 0.930132519249635,
        x_disp: 7.7257975320275385,
        y_disp: -60.64126411821617,
        x_scale: 0.9932316080455453,
        y_scale: 0.9961912835987787,
        x_skew: 0.006646505876389043,
        y_skew: 0,
      },
      {
        slide_id: "H01BBB24P-6637",
        grid_id: "grid_merged",
        tilt: 171.52440438387183,
        x_disp: 693.2506683300645,
        y_disp: 1230.1780663414054,
        x_scale: 0.9955137468889019,
        y_scale: 1.117638255636144,
        x_skew: -0.05524755652754538,
        y_skew: 0,
      },
    ],
  },
};

function Viewcube() {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();
  const [hover, set] = useState(null);
  const matrix = new Matrix4();

  useFrame(() => {
    matrix.copy(camera.matrix).invert();
    ref.current.quaternion.setFromRotationMatrix(matrix);
    gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current);
  }, 1);

  return createPortal(
    <>
      <OrthographicCamera
        ref={virtualCam}
        makeDefault={false}
        position={[0, 0, 100]}
      />
      <mesh
        ref={ref}
        raycast={useCamera(virtualCam)}
        position={[size.width / 2 - 80, size.height / 2 - 80, 0]}
        onPointerOut={(e) => set(null)}
        onPointerMove={(e) => set(Math.floor(e.faceIndex / 2))}
      >
        {[...Array(6)].map((_, index) => {
          return (
            <meshLambertMaterial
              attachArray="material"
              key={index}
              color={index === hover ? "hotpink" : "white"}
            />
          );
        })}
        <boxGeometry args={[60, 60, 60]} />
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
    </>,
    virtualScene
  );
}

function getImgData() {
  const reference = registerData.request.reference_slide_info;
  const registerRequest = registerData.request.register_slide_info;
  const registerResponse = registerData.response.register_slide_info;
  const registerArr = registerRequest.map((itm) => {
    const foundItem = registerResponse.find(
      (item) => itm.slide_id === item.slide_id && item
    );
    return {
      ...foundItem,
      rotation: foundItem.tilt,
      id: itm.slide_id,
      ...itm.grids[0].boundingBox,
      url: `/images/${itm.slide_id}.jpeg`,
      borderColor: randomColor(),
      name: itm.slide_id,
      scaleX: foundItem.x_scale,
      scaleY: foundItem.y_scale,
    };
  });
  let arr = [];
  arr.push({
    id: reference.slide_id,
    name: reference.slide_id,
    url: `/images/${reference.slide_id}.jpeg`,
    borderColor: randomColor(),
    ...reference.grids[0].boundingBox,
  });
  arr = [...arr, ...registerArr];
  console.log(arr);
  return arr;
}

const imgData = getImgData();

// const imgData = [
//   {
//     id: 1,
//     url: "/images/H01BBB24P-6638.jpeg",
//     name: "Image 1",
//     start_x: 72.92708333333334,
//     start_y: 500.340522875817,
//     end_x: 597.0729166666666,
//     end_y: 1021.659477124183,
//     rotation: 98.56557776856678,
//     borderColor: randomColor(),
//   },
//   {
//     id: 2,
//     url: "/images/H01BBB24P-6639.jpeg",
//     name: "Image 2",
//     end_x: 590.0729166666666,
//     end_y: 711.659477124183,
//     start_x: 66.92708333333334,
//     start_y: 204.340522875817,
//     borderColor: randomColor(),
//   },
// ];

function ImageElement({ position, rotation, opacity, url, img, showBorder }) {
  const width = img.end_x - img.start_x;
  const height = img.end_y - img.start_y;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imgObj = new Image();
  imgObj.onload = function () {
    ctx.save();
    ctx.globalAlpha = opacity / 100;
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
    ctx.restore();
    if (showBorder) {
      ctx.strokeStyle = img.borderColor;
      ctx.lineWidth = 15;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
  };
  imgObj.src = url;
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  useFrame(() => {
    texture.needsUpdate = true;
  });

  return (
    <group
      scale={
        new THREE.Vector3(
          img.scaleX ? img.scaleX : 1,
          1,
          img.scaleY ? img.scaleY : 1
        )
      }
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
        />
      </mesh>
    </group>
  );
}

const CameraElement = ({ cameraView }) => {
  const ref = useRef();
  const set = useThree((state) => state.set);

  useEffect(() => {
    void set(ref.current);
  }, []);

  return (
    <OrthographicCamera
      ref={ref}
      makeDefault
      zoom={0.5}
      position={[-100, 100, 100]}
      near={-10000}
      far={10000}
    />
  );
};

const App = () => {
  const mesh = useRef();
  const mounted = useRef(true);
  const [cameraView, setCameraView] = useState("iso");
  const [opacity, setOpacity] = useState(50);
  const [spacing, setSpacing] = useState(200);
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
    switchToView('front')
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

  const scaleX = (e, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      {
        ...imagesArr[index],
        scaleX: e.target.value,
      },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const scaleY = (e, index) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      {
        ...imagesArr[index],
        scaleY: e.target.value,
      },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const toggleShowBorder = () => {
    setShowBorder((prevBorder) => !showBorder);
  };

  useEffect(() => {
    mounted.current = false;
  }, []);

  const [cameraControls, setCameraControls] = useState(null);

  const DEG90 = Math.PI / 2;
  const DEG45 = Math.PI / 4;
  const DEG180 = Math.PI;

  const switchToView = (view) => {
    if (!cameraControls) return;

    switch (view) {
      case "front":
        cameraControls.rotateTo(0, THREE.MathUtils.DEG2RAD * 90, true);
        break;

      case "iso":
        cameraControls.rotateTo(0, THREE.MathUtils.DEG2RAD * 45, true);
        break;

      default:
        break;
    }
    fitToMesh();
  };

  useEffect(() => {
    if (cameraControls) {
      cameraControls.addEventListener("rest", () => {
        console.log("done");
        cameraControls.setOrbitPoint(0, 0, 0);
      });

      const KEYCODE = {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
      };

      const wKey = new holdEvent.KeyboardKeyHold(KEYCODE.W, 16.666);
      const aKey = new holdEvent.KeyboardKeyHold(KEYCODE.A, 16.666);
      const sKey = new holdEvent.KeyboardKeyHold(KEYCODE.S, 16.666);
      const dKey = new holdEvent.KeyboardKeyHold(KEYCODE.D, 16.666);
      aKey.addEventListener("holding", function (event) {
        cameraControls.truck(0.1 * event.deltaTime, 0, false);
      });
      dKey.addEventListener("holding", function (event) {
        cameraControls.truck(-0.1 * event.deltaTime, 0, false);
      });
      wKey.addEventListener("holding", function (event) {
        cameraControls.truck(0, 0.1 * event.deltaTime, false);
      });
      sKey.addEventListener("holding", function (event) {
        cameraControls.truck(0, -0.1 * event.deltaTime, false);
      });

      const leftKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_LEFT, 100);
      const rightKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_RIGHT, 100);
      const upKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_UP, 100);
      const downKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_DOWN, 100);
      leftKey.addEventListener("holding", function (event) {
        cameraControls.rotate(
          0.05 * THREE.MathUtils.DEG2RAD * event.deltaTime,
          0,
          true
        );
      });
      rightKey.addEventListener("holding", function (event) {
        cameraControls.rotate(
          -0.05 * THREE.MathUtils.DEG2RAD * event.deltaTime,
          0,
          true
        );
      });
      upKey.addEventListener("holding", function (event) {
        cameraControls.rotate(
          0,
          0.05 * THREE.MathUtils.DEG2RAD * event.deltaTime,
          true
        );
      });
      downKey.addEventListener("holding", function (event) {
        cameraControls.rotate(
          0,
          -0.05 * THREE.MathUtils.DEG2RAD * event.deltaTime,
          true
        );
      });
    }
  }, [cameraControls]);

  function fitToMesh() {
    cameraControls.fitToBox(mesh.current, true, {
      paddingTop: 50,
      paddingBottom: 50,
      paddingRight: 50,
      paddingLeft: 50,
    });
  }

  return (
    <div fontFamily="sans-serif" id="canvas-container">
      <Canvas>
        <CameraElement />
        <CameraControls ref={setCameraControls} />
        <Viewcube />
        <group ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
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
                    {(provided) => {
                      if (mounted.current) {
                        const width = img.end_x - img.start_x;
                        const height = img.end_y - img.start_y;
                        const canvas = document.createElement("canvas");
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        const imgObj = new Image();
                        imgObj.onload = function () {
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
                          const layersItem = document.getElementById(
                            `layers-item-canvas-${img.id}`
                          );
                          const imgSrc = canvas.toDataURL();
                          const newImg = new Image();
                          newImg.src = imgSrc;
                          newImg.style.width = "100%";
                          newImg.style.border = `3px solid ${img.borderColor}`;
                          newImg.classList.add("layers-item-canvas");
                          layersItem.appendChild(newImg);
                        };
                        imgObj.src = img.url;
                      }

                      return (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="layers-item-data"
                        >
                          <div className="layers-item-img">
                            <div id={`layers-item-canvas-${img.id}`}></div>
                          </div>
                          <div className="layers-item">
                            <div className="layers-info">
                              <div>{img.name}</div>
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  size="small"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => toggleImageVisibility(index)}
                                >
                                  {img.hidden ? (
                                    <AiFillEyeInvisible />
                                  ) : (
                                    <AiFillEye />
                                  )}
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleConfigureImage(img.id, index)
                                  }
                                >
                                  <GoSettings style={{ cursor: "pointer" }} />
                                </IconButton>
                              </div>
                            </div>
                            {img.open && (
                              <div>
                                <div>
                                  <button onClick={() => moveX(index, true)}>
                                    -
                                  </button>{" "}
                                  X{" "}
                                  <button onClick={() => moveX(index)}>
                                    +
                                  </button>
                                </div>
                                <div>
                                  <button onClick={() => moveY(index)}>
                                    -
                                  </button>{" "}
                                  Y{" "}
                                  <button onClick={() => moveY(index, true)}>
                                    +
                                  </button>
                                </div>
                                <div>
                                  <div>
                                    Opacity{" "}
                                    {img.opacity ? img.opacity : opacity}%
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
                                <div>
                                  <div>
                                    Scale X: {img.scaleX ? img.scaleX : 1}
                                  </div>
                                  <input
                                    id="target-image-scaleX"
                                    type="range"
                                    value={img.scaleX ? img.scaleX : 1}
                                    onChange={(e) => scaleX(e, index)}
                                    step={X_SCALE_INCREMENT}
                                    min={0.5}
                                    max={2}
                                  />
                                </div>
                                <div>
                                  <div>
                                    Scale Y: {img.scaleY ? img.scaleY : 1}
                                  </div>
                                  <input
                                    id="target-image-scaleY"
                                    type="range"
                                    value={img.scaleY ? img.scaleY : 1}
                                    onChange={(e) => scaleY(e, index)}
                                    step={Y_SCALE_INCREMENT}
                                    min={0.5}
                                    max={2}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div id="canvas-view-changer">
        <button onClick={() => switchToView("front")}>Front</button>
        <button onClick={() => switchToView("iso")}>Isometric</button>
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
