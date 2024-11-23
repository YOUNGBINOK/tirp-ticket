'use client';

import * as d3 from 'd3';
import {FeatureCollection, Geometry} from 'geojson';
import {useEffect, useRef, useState} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {Sphere} from '@react-three/drei';
import {Airport} from '../../../types/airport';
import {useInterAirportStore} from '@/hooks/store/getInterAirportStore';
import {CanvasTexture} from 'three';
import {AirportMarkers} from '@/app/components/layout/AirportMarkers';

type GlobeProps = {
  data: FeatureCollection<Geometry>;
  onAirportClick: (airport: Airport) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
};

const airportData: Airport[] = [
  {name: 'Incheon International Airport', lat: 37.4602, lng: 126.4407},
  {name: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085},
  {name: 'John F. Kennedy International Airport', lat: 40.6413, lng: -73.7781},
];

const Globe = ({
  texture,
  rotation,
}: {
  texture: CanvasTexture | null;
  rotation: [number, number, number];
}) => {
  useFrame(() => {
    if (texture) {
      // This will rotate the globe continuously
      rotation[1] += 0.1; // Adjust rotation speed as needed
    }
  });

  return (
    <>
      {texture && (
        <Sphere args={[4, 32, 32]} rotation={rotation}>
          <meshBasicMaterial attach="material" map={texture} />
        </Sphere>
      )}
    </>
  );
};

const Map = ({data, onAirportClick, zoomLevel, setZoomLevel}: GlobeProps) => {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([
    0, -30, 0,
  ]);

  const radius = 4; // Globe 반지름 설정

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 960;

    const context = canvas.getContext('2d');
    if (!context) return;

    const projection = d3
      .geoOrthographic()
      .scale(zoomLevel)
      .center([0, 0])
      .rotate(rotation)
      .translate([canvas.width / 2, canvas.height / 2]);

    const path = d3.geoPath().projection(projection).context(context);

    const drawD3Map = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#EEE';
      context.strokeStyle = '#000';
      context.lineWidth = 0.2;
      context.beginPath();
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        projection.scale(),
        0,
        2 * Math.PI,
      );
      context.fill();
      context.stroke();

      context.fillStyle = 'white';
      context.strokeStyle = 'black';
      context.lineWidth = 0.3;
      data.features.forEach(feature => {
        context.beginPath();
        path(feature);
        context.fill();
        context.stroke();
      });
    };

    drawD3Map();
    setTexture(new CanvasTexture(canvas));
  }, [data, zoomLevel, rotation]);

  return (
    <Canvas>
      {/* Globe 렌더링 */}
      <Globe texture={texture} rotation={rotation} />

      {/* 공항 마커 렌더링 */}
      <AirportMarkers
        airports={airportData}
        radius={radius}
        onClick={onAirportClick}
      />
    </Canvas>
  );
};

export default Map;
