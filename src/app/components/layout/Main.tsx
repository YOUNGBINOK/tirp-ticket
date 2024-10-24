'use client';

import {useState} from 'react';
import Map from '@/app/components/layout/Map';
import {FeatureCollection, Geometry} from 'geojson';
import {data as rawData} from '../../../../public/data/data.ts';
import {Airport} from '../../../types/airport.ts';

const data = rawData as FeatureCollection<Geometry>;

const Main = () => {
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
    <div>
      <Map data={data} onAirportClick={handleAirportClick} />
      <div className="mb-4">
        <p>출발지: {startAirport ? startAirport.name : '선택되지 않음'}</p>
        <p>도착지: {endAirport ? endAirport.name : '선택되지 않음'}</p>
      </div>
    </div>
  );
};

export default Main;
