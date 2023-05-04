import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { PlaneGeometry, Mesh, Vector3 } from "three";
import { createNoise3D, createNoise2D } from "simplex-noise";

const Waves = () => {
  const mesh: any = useRef<Mesh>();
  const primaryNoise3D = createNoise3D();
  const secondaryNoise3D = createNoise3D();
  const primaryNoise2D = createNoise2D();
  const secondaryNoise2D = createNoise2D();

  const geometry = useMemo(() => {
    return new PlaneGeometry(50, 50, 100, 100);
  }, []);

  const initialPositions = useMemo(() => {
    const positionAttribute = geometry.getAttribute("position") as any;
    const initialPositions: Vector3[] = [];
    for (let i = 0; i < positionAttribute.count; i++) {
      initialPositions.push(
        new Vector3(
          positionAttribute.getX(i),
          positionAttribute.getY(i),
          positionAttribute.getZ(i)
        )
      );
    }
    return initialPositions;
  }, [geometry]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    const positionAttribute = geometry.getAttribute("position") as any;

    for (let i = 0; i < positionAttribute.count; i++) {
      const initialPosition = initialPositions[i];

      const newPosition = new Vector3(
        initialPosition.x,
        initialPosition.y,
        initialPosition.z
      );

      const time = state.clock.elapsedTime * 0.2;
      const primaryNoise = 16;
      const secondaryNoise = 16;
      const primaryWaveAmp = 0.5;
      const secondaryWaveAmp = 0.7;

      const primaryNoise3DValue = primaryNoise3D(
        newPosition.x / primaryNoise,
        newPosition.y / primaryNoise,
        newPosition.z / primaryNoise + time
      );

      const secondaryNoise3DValue = secondaryNoise3D(
        newPosition.x / secondaryNoise,
        newPosition.y / secondaryNoise,
        newPosition.z / secondaryNoise + time * 0.8
      );

      const primaryNoise2DValue = primaryNoise2D(
        newPosition.x / 10 + time * 0.5,
        newPosition.y / 10 + time * 0.5
      );

      const secondaryNoise2DValue = secondaryNoise2D(
        newPosition.x / 5 + time * 0.5,
        newPosition.y / 5 + time * 0.5
      );

      newPosition.z =
        initialPosition.z +
        (primaryNoise3DValue * primaryWaveAmp +
          secondaryNoise3DValue * secondaryWaveAmp +
          primaryNoise2DValue * primaryWaveAmp +
          secondaryNoise2DValue * secondaryWaveAmp);

      positionAttribute.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} geometry={geometry} rotation-x={-Math.PI / 2}>
      <meshStandardMaterial color={"white"} wireframe />
    </mesh>
  );
};

export default Waves;
