import React, { Suspense, useState } from 'react'
import {Canvas, useLoader} from "@react-three/fiber"
import "./App.css"
import * as THREE from 'three'
import img from "./images/skin-tissue.jpg"
import {OrbitControls} from "@react-three/drei"

function Image({position, opacity}) {
  const texture = useLoader(THREE.TextureLoader, img)
  return (
    <mesh position={position}>
      <planeBufferGeometry attach="geometry" args={[3, 3]} />
      <meshBasicMaterial attach="material" map={texture} side={THREE.DoubleSide} transparent={true} opacity={opacity/100} />
    </mesh>
  )
}

const App = () => {
  const [opacity, setOpacity] = useState(50);

  return (
    <div id="canvas-container">
      <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 100] }} >
        <OrbitControls/>
        <Suspense fallback={null}>
          <Image position={[0,0,-0.5]} opacity={opacity} />
        </Suspense>
        <Suspense fallback={null}>
          <Image position={[0,0,0]} opacity={opacity} />
        </Suspense>
        <Suspense fallback={null}>
          <Image position={[0,0,0.5]} opacity={opacity} />
        </Suspense>
      </Canvas>
      <div id='canvas-controls'>
        <div className='input-group'>
          <label htmlFor='image-opacity'>Opacity</label>
          <input id="image-opacity" type="range" value={opacity} onChange={(e) => setOpacity(e.target.value)} min={1} max={100} />
        </div>
      </div>
    </div>
  )
}

export default App