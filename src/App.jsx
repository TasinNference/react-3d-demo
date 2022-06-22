import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import * as THREE from "three";
import { OrbitControls, useTexture } from "@react-three/drei";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function Image({ position, opacity, url }) {
  const texture = useTexture(`${url}`);
  return (
    <mesh position={position}>
      <planeBufferGeometry attach="geometry" args={[3, 3]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={opacity / 100}
      />
    </mesh>
  );
}

const App = () => {
  const [opacity, setOpacity] = useState(50);
  const [spacing, setSpacing] = useState(0.5);
  const [imagesArr, setImagesArr] = useState([
    {
      id: 1,
      url: "https://media.istockphoto.com/photos/stratified-squamous-epithelium-picture-id865398980?k=20&m=865398980&s=612x612&w=0&h=4App3rfAYGX6AR618AQHpd_wiktr3sYFD1KBAjOiMdA=",
      name: "Image 1",
    },
    { id: 2, url: "/images/skin-tissue-1.jpg", name: "Image 2" },
    {
      id: 3,
      url: "https://cdn.proactiveinvestors.com/eyJidWNrZXQiOiJwYS1jZG4iLCJrZXkiOiJ1cGxvYWRcL0FydGljbGVcL0ltYWdlXC8yMDE3XzA0XC9za2luLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0Ijo3NDAsImZpdCI6ImNvdmVyIn19fQ==",
      name: "Image 3",
    },
  ]);

  const handleSpacingIncrease = () => {
    setSpacing(spacing + 0.5);
  };

  const handleSpacingDecrease = () => {
    if (spacing > 0.5) setSpacing(spacing - 0.5);
  };

  const calcPosition = (index) => {
    return (index - (imagesArr.length - 1) / 2) * spacing;
  };

  const handleDragEnd = (result) => {
    if(!result.destination) return;

    const items = Array.from(imagesArr);
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setImagesArr(items)
  }

  return (
    <div id="canvas-container">
      <Canvas orthographic camera={{ zoom: 100, position: [-100, 100, 100] }}>
        <OrbitControls />
        {imagesArr.map((img, index) => {
          console.log(calcPosition(index));
          return (
            <Suspense key={index} fallback={null}>
              <Image
                position={[0, 0, calcPosition(index)]}
                url={img.url}
                opacity={opacity}
              />
            </Suspense>
          );
        })}
      </Canvas>
      <div id="canvas-layers">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="layers-container">
                {imagesArr.map((img, index) => (
                  <Draggable key={index} draggableId={`${index}`} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="layers-item"
                      >
                        {img.name}
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
            onChange={(e) => setOpacity(e.target.value)}
            min={1}
            max={100}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
