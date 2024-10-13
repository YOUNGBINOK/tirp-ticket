import Map from '@/app/components/layout/Map';
// import MapMini from '@/app/components/layout/Map_mini';
import {FeatureCollection, Geometry} from 'geojson';
import {data as rawData} from '../../../../public/data/data.ts';

const data = rawData as FeatureCollection<Geometry>;

export default function Main() {
  return (
    <div>
      <Map data={data} />
      {/* <MapMini /> */}
    </div>
  );
}
