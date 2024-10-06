'use client';

import {OrbitControls, Sphere} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {useState} from 'react';
import * as THREE from 'three';

// 공항 데이터
type Airport = {
  name: string;
  lat: number;
  lng: number;
};

const airportData: Airport[] = [
  {name: 'Incheon International Airport', lat: 37.4602, lng: 126.4407},
  {name: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085},
  {name: 'John F. Kennedy International Airport', lat: 40.6413, lng: -73.7781},
  // 추가 공항 데이터...
];

// 클릭 효과 추가
// 호버 효과 추가
const Globe = ({
  onAirportClick,
}: {
  onAirportClick: (airport: Airport) => void;
}) => {
  const globeTexture = new THREE.TextureLoader().load(
    '../../../../images/earth.jpg',
  );

  return (
    <Sphere args={[1, 64, 64]}>
      <meshPhongMaterial map={globeTexture} />
      {airportData.map(airport => {
        // 위도와 경도를 사용하여 구의 표면에서의 위치 계산
        const phi = (90 - airport.lat) * (Math.PI / 180);
        const theta = (airport.lng + 180) * (Math.PI / 180);
        const x = -(1 * Math.sin(phi) * Math.cos(theta));
        const y = 1 * Math.cos(phi);
        const z = 1 * Math.sin(phi) * Math.sin(theta);

        return (
          <mesh
            key={airport.name}
            position={[x, y, z]}
            onClick={() => onAirportClick(airport)}
          >
            <sphereGeometry args={[0.01, 16, 16]} />
            <meshPhongMaterial color="red" />
          </mesh>
        );
      })}
    </Sphere>
  );
};

const Map = () => {
  const [startAirport, setStartAirport] = useState<Airport | null>(null);
  const [endAirport, setEndAirport] = useState<Airport | null>(null);

  const handleAirportClick = (airport: Airport) => {
    if (!startAirport) {
      setStartAirport(airport);
    } else if (!endAirport) {
      setEndAirport(airport);
    } else {
      // 초기화하고 다시 선택
      setStartAirport(airport);
      setEndAirport(null);
    }
  };

  return (
    <div style={{height: '100vh'}}>
      <h1 className="text-xl font-bold mb-4">공항 선택하기</h1>
      <div className="mb-4">
        <p>출발지: {startAirport ? startAirport.name : '선택되지 않음'}</p>
        <p>도착지: {endAirport ? endAirport.name : '선택되지 않음'}</p>
      </div>

      <Canvas style={{height: '100vh'}}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Globe onAirportClick={handleAirportClick} />
      </Canvas>
    </div>
  );
};

export default Map;
