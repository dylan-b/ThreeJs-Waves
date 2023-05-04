import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { PlaneGeometry, Mesh, Vector3 } from "three";
import { createNoise3D, createNoise2D } from "simplex-noise";

const Waves = () => {
  const mesh: any = useRef<Mesh>();
  const noise3D_1 = createNoise3D();
  const noise3D_2 = createNoise3D();
  const noise2D_1 = createNoise2D();
  const noise2D_2 = createNoise2D();

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
      const noiseFactor_1 = 16;
      const noiseFactor_2 = 16;
      const waveAmplitude_1 = 0.5;
      const waveAmplitude_2 = 0.7;

      const noiseValue_1 = noise3D_1(
        newPosition.x / noiseFactor_1,
        newPosition.y / noiseFactor_1,
        newPosition.z / noiseFactor_1 + time
      );

      const noiseValue_2 = noise3D_2(
        newPosition.x / noiseFactor_2,
        newPosition.y / noiseFactor_2,
        newPosition.z / noiseFactor_2 + time * 0.8
      );

      const noiseValue_3 = noise2D_1(
        newPosition.x / 6 + time * 0.5,
        newPosition.y / 6 + time * 0.5
      );

      const noiseValue_4 = noise2D_2(
        newPosition.x / 10 + time * 0.5,
        newPosition.y / 10 + time * 0.5
      );

      newPosition.z =
        initialPosition.z +
        (noiseValue_1 * waveAmplitude_1 +
          noiseValue_2 * waveAmplitude_2 +
          noiseValue_3 * waveAmplitude_1 +
          noiseValue_4 * waveAmplitude_2);

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
