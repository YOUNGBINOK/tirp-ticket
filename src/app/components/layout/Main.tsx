'use client';

import {useState} from 'react';
import Map from '@/app/components/layout/Map';
import {FeatureCollection, Geometry} from 'geojson';
import {data as rawData} from '../../../../public/data/world_data.ts';
import {Airport, Airport2} from '../../../types/airport.ts';
import {ZoomIn, ZoomOut} from 'lucide-react';

const data = rawData as FeatureCollection<Geometry>;

const Main = () => {
  const [startAirport, setStartAirport] = useState<Airport | null>(null);
  const [endAirport, setEndAirport] = useState<Airport | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(250);

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

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 50, 500));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 50, 100));
  };

  return (
    <div>
      <div className="mb-4">
        <p>출발지: {startAirport ? startAirport.name : '선택되지 않음'}</p>
        <p>도착지: {endAirport ? endAirport.name : '선택되지 않음'}</p>
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={zoomIn}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          <ZoomIn />
        </button>
        <button
          onClick={zoomOut}
          className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
        >
          <ZoomOut />
        </button>
      </div>
      <Map
        data={data}
        onAirportClick={handleAirportClick}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />
    </div>
  );
};

export default Main;
