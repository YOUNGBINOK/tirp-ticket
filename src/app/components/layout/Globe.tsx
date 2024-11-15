'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import * as d3 from 'd3';
import * as THREE from 'three';
import {FeatureCollection, Geometry} from 'geojson';

type GlobeProps = {
  data: FeatureCollection<Geometry>;
};

// 기본 설정
const CANVAS_WIDTH = 8192;
const CANVAS_HEIGHT = 4096;
const PROJECTION_AR = 0.8; // 원하는 비율
const SEGMENTS = 256;
const DATA = {
  /* ISO 코드별 데이터 매핑 예시 */
};
const COLOR_SCALE = d3.scaleSequential(d3.interpolateBlues);

// 텍스처 생성 함수
const getTexture = (data: FeatureCollection<Geometry>) => {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const context = canvas.getContext('2d');

  const projection = d3
    .geoEquirectangular()
    .translate([CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2])
    .scale(
      Math.min(CANVAS_WIDTH / PROJECTION_AR / Math.PI, CANVAS_HEIGHT / Math.PI),
    );
  const path = d3.geoPath().projection(projection).context(context!);

  context!.fillStyle = '#777';
  context!.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context!.strokeStyle = '#000';
  context!.lineWidth = 1.0;

  data.features.forEach(d => {
    context!.fillStyle = DATA[d.properties.iso_a3]
      ? COLOR_SCALE(DATA[d.properties.iso_a3].measure)
      : '#fff';
    context!.beginPath();
    path(d);
    context!.fill();
    context!.stroke();
  });

  const graticule = d3.geoGraticule().step([10, 10]);
  const graticuleLines = graticule();

  // 격자선 추가
  context!.strokeStyle = '#333';
  context!.lineWidth = 0.5;

  graticuleLines.coordinates.forEach(line => {
    context!.beginPath();
    line.forEach(([longitude, latitude], index) => {
      const [x, y] = projection([longitude, latitude]);
      if (index === 0) {
        context!.moveTo(x, y);
      } else {
        context!.lineTo(x, y);
      }
    });
    context!.stroke();
  });

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter; // 고품질 필터링
  texture.anisotropy = 16; // 이방성 필터링으로 세부 표현 개선

  return texture;
};

// 장면 컴포넌트
const Globe: React.FC<GlobeProps> = ({data}) => {
  const textureRef = useRef<THREE.Texture | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // 텍스처를 useEffect로 생성하도록 보장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const generatedTexture = getTexture(data);
      textureRef.current = generatedTexture;
      setTexture(generatedTexture);
    }
  }, [data]);

  return (
    <Canvas
      camera={{position: [0, 0, 8], fov: 45, near: 0.01, far: 1000}}
      style={{width: '100vw', height: '100vh'}}
    >
      <OrbitControls enableZoom={true} />

      {/* 조명 추가 */}
      <ambientLight intensity={1} />

      {/* Sphere에 텍스처 적용 */}
      {texture && (
        <mesh>
          <sphereGeometry args={[3, SEGMENTS, SEGMENTS]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      )}
    </Canvas>
  );
};

export default Globe;
