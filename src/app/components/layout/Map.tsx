'use client';

import {Line, OrbitControls, Sphere} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {useEffect, useState} from 'react';
import * as THREE from 'three';

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

const Globe = ({
  onAirportClick,
}: {
  onAirportClick: (airport: Airport) => void;
}) => {
  const [boundaries, setBoundaries] = useState<any[]>([]);
  const globeTexture = new THREE.TextureLoader().load(
    '../../../../images/earth-blue-marble.jpg',
  );

  // GeoJSON 경계 데이터를 가져오기
  useEffect(() => {
    const fetchBoundaries = async () => {
      const response = await fetch('../../../../data/world.geojson');
      const data = await response.json();
      const lines: any[] = [];

      data.features.forEach((feature: any) => {
        const {geometry} = feature;

        if (geometry.type === 'Polygon') {
          geometry.coordinates.forEach((polygon: any) => {
            if (Array.isArray(polygon)) {
              const linePoints = polygon.map(([lng, lat]: [number, number]) => {
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                return [
                  -(1 * Math.sin(phi) * Math.cos(theta)),
                  1 * Math.cos(phi),
                  1 * Math.sin(phi) * Math.sin(theta),
                ];
              });
              lines.push(linePoints);
            }
          });
        } else if (geometry.type === 'MultiPolygon') {
          geometry.coordinates.forEach((multiPolygon: any) => {
            multiPolygon.forEach((polygon: any) => {
              if (Array.isArray(polygon)) {
                const linePoints = polygon.map(
                  ([lng, lat]: [number, number]) => {
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lng + 180) * (Math.PI / 180);
                    return [
                      -(1 * Math.sin(phi) * Math.cos(theta)),
                      1 * Math.cos(phi),
                      1 * Math.sin(phi) * Math.sin(theta),
                    ];
                  },
                );
                lines.push(linePoints);
              }
            });
          });
        }
      });

      setBoundaries(lines);
    };

    fetchBoundaries();
  }, []);

  return (
    <Sphere args={[1, 64, 64]}>
      <meshPhongMaterial map={globeTexture} />
      {airportData.map(airport => {
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

      {boundaries.map((line, index) => (
        <Line
          key={index}
          points={line}
          color="white"
          lineWidth={1}
          dashed={false}
        />
      ))}
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
