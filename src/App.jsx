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
import {
  Box,
  Button,
  ButtonBase,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Radio,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsIcon from "@mui/icons-material/Settings";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import { useSearchParams } from "react-router-dom";
import { FaLock, FaUnlock } from "react-icons/fa";

const X_INCREMENT = 1;
const Y_INCREMENT = 1;
const X_SCALE_INCREMENT = 0.1;
const Y_SCALE_INCREMENT = 0.1;
const SPACING = 50;

const API_URL = `${window.location.origin}`;

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

function CloneProps(props) {
  const { children, ...other } = props;
  return children(other);
}

const registerData = {
  status: true,
  reference_slide_info: {
    slide_id: "H01BBB24P-6636",
    grid_id: "grid_merged",
    img: "/wsi_data/registration_outcome/H01BBB24P-6636/H01BBB24P-6636_panorama.jpeg",
  },
  register_slide_info: [
    {
      slide_id: "H01BBB24P-6635",
      grid_id: "grid_merged",
      tilt: 0.6755608193436402,
      x_disp: -7.002938601508233,
      y_disp: 21.5733004113515,
      x_scale: 0.9985830846238507,
      y_scale: 1.002959527647854,
      x_skew: 0.0010078995117070938,
      y_skew: 0,
      img: "/wsi_data/registration_outcome/H01BBB24P-6635/H01BBB24P-6635_panorama.jpeg",
    },
    {
      slide_id: "H01BBB24P-6637",
      grid_id: "grid_merged",
      tilt: 171.52841795158662,
      x_disp: 756.4809090508966,
      y_disp: 1013.6539416437139,
      x_scale: 1.0134707342588396,
      y_scale: 1.1562656607862223,
      x_skew: -0.020939868868742294,
      y_skew: 0,
      img: "/wsi_data/registration_outcome/H01BBB24P-6637/H01BBB24P-6637_panorama.jpeg",
    },
  ],
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

function roundNum(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function getImgData(data) {
  const reference = data.reference_slide_info;
  const registerResponse = data.register_slide_info;
  const registerArr = registerResponse.map((itm) => {
    return {
      ...itm,
      rotation: itm.tilt,
      id: itm.slide_id,
      url: `/images/${itm.slide_id}.jpeg`,
      borderColor: randomColor(),
      name: itm.slide_id,
      scaleX: itm.x_scale,
      scaleY: itm.y_scale,
      img: `/wsi_data/registration_outcome/${itm.slide_id}/${itm.slide_id}_panorama.jpeg`,
    };
  });
  let arr = [];
  arr.push({
    id: reference.slide_id,
    name: reference.slide_id,
    url: `/images/${reference.slide_id}.jpeg`,
    borderColor: randomColor(),
    img: `/wsi_data/registration_outcome/${reference.slide_id}/${reference.slide_id}_panorama.jpeg`,
  });
  arr = [...arr, ...registerArr];
  return arr;
}

const imgData = getImgData(registerData);

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

function ImageElement({
  position,
  globalRotation,
  rotation,
  opacity,
  img,
  showBorder,
}) {
  const [imgLoaded, setImgLoaded] = useState(0);
  const canvas = document.createElement("canvas");
  const width = useRef();
  const height = useRef();
  const ctx = canvas.getContext("2d");
  const imgObj = new Image();
  const texture = useRef();

  function loadImg() {
    imgObj.onload = function () {
      width.current = this.width;
      height.current = this.height;
      canvas.width = width.current;
      canvas.height = height.current;
      ctx.save();
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(this, 0, 0);
      ctx.restore();
      console.log(showBorder);
      if (showBorder) {
        ctx.strokeStyle = img.borderColor;
        ctx.lineWidth = 15;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.lineWidth = 0;
      }

      texture.current = new THREE.CanvasTexture(canvas);
      texture.current.needsUpdate = true;
      setImgLoaded(imgLoaded + 1);
    };
    imgObj.crossOrigin = "anonymus";
    imgObj.src = `${API_URL}${img.img}`;
  }

  useEffect(() => {
    loadImg();
  }, []);

  useEffect(() => {
    loadImg();
  }, [showBorder, opacity, img.img]);

  useFrame(() => {
    if (texture.current) {
      texture.current.needsUpdate = true;
    }
  });

  return (
    imgLoaded && (
      <group
        scale={
          new THREE.Vector3(
            img.scaleX ? img.scaleX : 1,
            1,
            img.scaleY ? img.scaleY : 1
          )
        }
        rotation={
          rotation
            ? [0, THREE.MathUtils.degToRad(-rotation - globalRotation), 0]
            : [0, THREE.MathUtils.degToRad(-globalRotation), 0]
        }
        position={position}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeBufferGeometry
            attach="geometry"
            args={[width.current, height.current]}
          />
          <meshBasicMaterial
            attach="material"
            map={texture.current}
            side={THREE.DoubleSide}
            transparent={true}
          />
        </mesh>
      </group>
    )
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
      zoom={0.3}
      position={[-100, 100, 100]}
      near={-10000}
      far={10000}
    />
  );
};

const App = () => {
  const [globalRotation, setGlobalRotation] = useState(0);
  const mesh = useRef();
  const mounted = useRef(true);
  const [cameraView, setCameraView] = useState("iso");
  const [opacity, setOpacity] = useState(50);
  const [spacing, setSpacing] = useState(200);
  const [imagesArr, setImagesArr] = useState([]);
  const [showBorder, setShowBorder] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [groupImages, setGroupImages] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useRef();
  const defaultData = useRef();

  const filteredImages = imagesArr.filter((img) => !img.hidden);

  useEffect(() => {
    data.current = searchParams.get("data");
    var actual = JSON.parse(atob(data.current));
    const formattedData = getImgData(actual);
    setImagesArr(formattedData);
    defaultData.current = formattedData;
  }, []);

  function closeAll() {
    setImagesArr((prevArray) =>
      prevArray.map(({ open, ...rest }) => ({ ...rest, open: false }))
    );
  }

  useEffect(() => {
    closeAll();
  }, [groupImages]);

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
    setImagesArr(defaultData.current);
    switchToView("front");
    setGlobalRotation(0);
    setSpacing(200);
    setOpacity(50);
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

  const moveX = (index, value) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      {
        ...imagesArr[index],
        transformX: value,
      },
      ...imagesArr.slice(index + 1),
    ]);
  };

  const moveY = (index, value) => {
    setImagesArr([
      ...imagesArr.slice(0, index),
      {
        ...imagesArr[index],
        transformY: value,
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

  const handleTabChange = (event, index) => {
    setCurrentTab(index);
  };

  return (
    <div fontFamily="sans-serif" id="canvas-container">
      <Canvas>
        <CameraElement />
        <CameraControls ref={setCameraControls} />
        {/* <Viewcube /> */}
        <group ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
          {filteredImages.map((img, index) => {
            return (
              <Suspense key={index} fallback={null}>
                <ImageElement
                  globalRotation={globalRotation}
                  position={[
                    img.transformX ? img.transformX : 0,
                    calcPosition(index),
                    img.transformY ? -img.transformY : 0,
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
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          style={{ borderBottom: "1px solid #e5e5e5" }}
        >
          <CloneProps>
            {(tabProps) => (
              <Tooltip title="Layers">
                <div>
                  <Tab {...tabProps} icon={<LayersIcon />} />
                </div>
              </Tooltip>
            )}
          </CloneProps>
          <CloneProps>
            {(tabProps) => (
              <Tooltip title="Camera Controls">
                <div>
                  <Tab {...tabProps} icon={<ControlCameraIcon />} />
                </div>
              </Tooltip>
            )}
          </CloneProps>
          <CloneProps>
            {(tabProps) => (
              <Tooltip title="Global Settings">
                <div>
                  <Tab {...tabProps} icon={<SettingsIcon />} />
                </div>
              </Tooltip>
            )}
          </CloneProps>
        </Tabs>
        <div
          style={{
            height: "100%",
            backgroundColor: "#f5f5f5",
          }}
        >
          <div
            style={{
              display: currentTab === 0 ? "block" : "none",
            }}
          >
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
                          return (
                            <Card
                              variant="outlined"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="layers-item-data"
                            >
                              <img
                                style={{
                                  border: `3px solid ${img.borderColor}`,
                                }}
                                className="layers-item-img"
                                src={`${API_URL}${img.img}`}
                                alt=""
                              />
                              <div className="layers-item">
                                <div className="layers-info">
                                  <Typography variant="subtitle2">
                                    {img.name}
                                  </Typography>
                                  <div style={{ display: "flex" }}>
                                    <IconButton
                                      size="small"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        toggleImageVisibility(index)
                                      }
                                    >
                                      {img.hidden ? (
                                        <AiFillEyeInvisible />
                                      ) : (
                                        <AiFillEye />
                                      )}
                                    </IconButton>
                                    {!groupImages && (
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleConfigureImage(img.id, index)
                                        }
                                      >
                                        <GoSettings
                                          style={{ cursor: "pointer" }}
                                        />
                                      </IconButton>
                                    )}
                                  </div>
                                </div>
                                {img.open && (
                                  <div
                                    style={{
                                      padding: "10px",
                                      display: "grid",
                                      rowGap: "15px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <TextField
                                      defaultValue={
                                        img.transformX
                                          ? roundNum(img.transformX)
                                          : 0
                                      }
                                      fullWidth
                                      size="small"
                                      label="X Displacement"
                                      type="number"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      inputProps={{
                                        step: "5",
                                      }}
                                      onChange={(e) =>
                                        moveX(index, e.target.value)
                                      }
                                    />
                                    <TextField
                                      defaultValue={
                                        roundNum(img.transformY)
                                          ? img.transformY
                                          : 0
                                      }
                                      fullWidth
                                      size="small"
                                      label="Y Displacement"
                                      type="number"
                                      inputProps={{
                                        step: "5",
                                      }}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      onChange={(e) =>
                                        moveY(index, e.target.value)
                                      }
                                    />
                                    <TextField
                                      defaultValue={
                                        img.scaleX ? roundNum(img.scaleX) : 1
                                      }
                                      fullWidth
                                      size="small"
                                      label="Scale X"
                                      type="number"
                                      inputProps={{
                                        step: "0.1",
                                      }}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      onChange={(e) => scaleX(e, index)}
                                    />
                                    <TextField
                                      defaultValue={
                                        img.scaleY ? roundNum(img.scaleY) : 1
                                      }
                                      fullWidth
                                      size="small"
                                      label="Scale Y"
                                      type="number"
                                      inputProps={{
                                        step: "0.1",
                                      }}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      onChange={(e) => scaleY(e, index)}
                                    />
                                    <TextField
                                      defaultValue={
                                        img.opacity
                                          ? roundNum(img.opacity)
                                          : roundNum(opacity)
                                      }
                                      fullWidth
                                      size="small"
                                      label="Opacity (Percent)"
                                      type="number"
                                      inputProps={{
                                        step: "1",
                                        max: 100,
                                        min: 1,
                                      }}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      onChange={(e) =>
                                        targetImageOpacityChange(e, index)
                                      }
                                    />
                                    <TextField
                                      defaultValue={
                                        img.rotation
                                          ? roundNum(img.rotation)
                                          : roundNum(0)
                                      }
                                      fullWidth
                                      size="small"
                                      label="Rotation (Degrees)"
                                      type="number"
                                      inputProps={{
                                        step: "1",
                                      }}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      onChange={(e) =>
                                        rotationHandler(e, index)
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            </Card>
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
          <div style={{ display: currentTab === 1 ? "block" : "none" }}>
            Camera controls
          </div>
          <div
            style={{
              display: currentTab === 2 ? "grid" : "none",
              rowGap: "10px",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showBorder}
                    onChange={(e) => setShowBorder(e.target.checked)}
                  />
                }
                label="Show Borders"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<FaUnlock size="1.2em" />}
                    checkedIcon={<FaLock size="1.2em" />}
                    checked={groupImages}
                    onChange={(e) => setGroupImages(e.target.checked)}
                  />
                }
                label={`${groupImages ? "Ungroup" : "Group"} Images`}
              />
            </FormGroup>
            <TextField
              value={spacing}
              fullWidth
              size="small"
              label="Image Spacing"
              type="number"
              inputProps={{
                step: "50",
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setSpacing(e.target.value)}
            />
            <TextField
              value={opacity}
              fullWidth
              size="small"
              label="Global Opacity (Percent)"
              type="number"
              inputProps={{
                step: "1",
                max: 100,
                min: 1,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => mainOpacityChange(e)}
              disabled={!groupImages}
            />
            <TextField
              value={globalRotation}
              fullWidth
              size="small"
              label="Global Rotation"
              type="number"
              inputProps={{
                step: "1",
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setGlobalRotation(e.target.value)}
              disabled={!groupImages}
            />
            <Button
              onClick={resetImages}
              fullWidth
              size="small"
              variant="contained"
              color="warning"
            >
              Reset All
            </Button>
          </div>
        </div>
      </div>
      <div id="canvas-view-changer">
        {/* <button onClick={() => switchToView("front")}>Front</button> */}
        {/* <button onClick={() => switchToView("iso")}>Isometric</button> */}
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
