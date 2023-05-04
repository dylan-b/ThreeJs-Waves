import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Waves from "./components/Waves";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const moonLightTarget = new THREE.Object3D();
  moonLightTarget.position.set(0, 0, 0);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.style.width = window.innerWidth + "px";
        canvasRef.current.style.height = window.innerHeight + "px";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="App"
      ref={canvasRef}
      style={{ width: "100%", height: "100%" }}
    >
      <Canvas shadows style={{ background: "black" }}>
        <PerspectiveCamera makeDefault position={[2.5, 20, 10]} />
        <OrbitControls target={[0, 0, 0]} />
        <ambientLight intensity={1} />
        <Waves />
      </Canvas>
    </div>
  );
};

export default App;
