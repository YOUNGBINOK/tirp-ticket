'use client';

import {useState} from 'react';
import Map from '@/app/components/layout/Map';
import Globe from '@/app/components/layout/Globe.tsx';
import {FeatureCollection, Geometry} from 'geojson';
import {data as rawData} from '../../../../public/data/world_data.ts';
import {Airport, Airport2} from '../../../types/airport.ts';
import {ZoomIn, ZoomOut} from 'lucide-react';

const data = rawData as FeatureCollection<Geometry>;

const Main = () => {
  return (
    <div className="flex">
      <Globe data={data} />
    </div>
  );
};

export default Main;
