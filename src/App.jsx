import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import "./App.css";
import * as THREE from "three";
import {
  OrbitControls,
  OrthographicCamera,
  useTexture,
} from "@react-three/drei";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { GoSettings } from "react-icons/go";
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"

const X_INCREMENT = 0.1;
const Y_INCREMENT = 0.1;

function Image({ position, rotation, opacity, url }) {
  const texture = useTexture(`${url}`);
  return (
    <group
      rotation={
        rotation ? [0, THREE.MathUtils.degToRad(-rotation), 0] : [0, 0, 0]
      }
      position={position}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[3, 3]} />
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
    <OrthographicCamera makeDefault zoom={100} position={[-100, 100, 100]} />
  );
};

const App = () => {
  const [cameraView, setCameraView] = useState("iso");
  const [opacity, setOpacity] = useState(50);
  const [spacing, setSpacing] = useState(0.5);
  const [imagesArr, setImagesArr] = useState([
    {
      id: 1,
      url: "https://media.istockphoto.com/photos/stratified-squamous-epithelium-picture-id865398980?k=20&m=865398980&s=612x612&w=0&h=4App3rfAYGX6AR618AQHpd_wiktr3sYFD1KBAjOiMdA=",
      name: "Image 1",
    },
    {
      id: 2,
      url: "/images/skin-tissue-1.jpg",
      name: "Image 2",
    },
    {
      id: 3,
      url: "https://cdn.proactiveinvestors.com/eyJidWNrZXQiOiJwYS1jZG4iLCJrZXkiOiJ1cGxvYWRcL0FydGljbGVcL0ltYWdlXC8yMDE3XzA0XC9za2luLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0Ijo3NDAsImZpdCI6ImNvdmVyIn19fQ==",
      name: "Image 3",
    },
  ]);

  const filteredImages = imagesArr.filter((img) => !img.hidden)

  const handleSpacingIncrease = () => {
    setSpacing(spacing + 0.5);
  };

  const handleSpacingDecrease = () => {
    if (spacing > 0.5) setSpacing(spacing - 0.5);
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
    setImagesArr((prevArray) =>
      prevArray.map(({ hidden, transformX, transformY, opacity, rotation, ...rest }) => ({ ...rest }))
    );
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
  }

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
      { ...imagesArr[index], transformY:
        (imagesArr[index].transformY ? imagesArr[index].transformY : 0) +
        (opposite ? -1 : 1) * Y_INCREMENT, },
      ...imagesArr.slice(index + 1),
    ]);
  };

  return (
    <div id="canvas-container">
      <Canvas>
        <CameraElement cameraView={cameraView} />
        <OrbitControls
          onStart={() => {
            setCameraView("free");
          }}
        />
        <group rotation={[Math.PI / 2, 0, 0]}>
          {filteredImages.map((img, index) => {
            return (
              <Suspense key={index} fallback={null}>
                <Image
                  position={[img.transformX ? img.transformX : 0, calcPosition(index), img.transformY ? img.transformY : 0]}
                  rotation={img.rotation}
                  url={img.url}
                  opacity={img.opacity ? img.opacity : opacity}
                />
              </Suspense>
            );
          })}
        </group>
      </Canvas>
      <div id="canvas-layers">
        <button onClick={resetImages}>Reset</button>
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
                        <div style={{display: 'flex', columnGap: '10px'}}>
                          <div style={{cursor: "pointer"}} onClick={() => toggleImageVisibility(index)}>
                          {img.hidden ? <AiFillEyeInvisible /> : <AiFillEye />}
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
                              <button onClick={() => moveY(index)}>-</button> Y <button onClick={() => moveY(index, true)}>+</button>
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
