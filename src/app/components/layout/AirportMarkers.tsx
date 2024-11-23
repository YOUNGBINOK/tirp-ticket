import {Airport} from '@/types/airport';

const airportData = [
  {name: 'Incheon International Airport', lat: 37.4602, lng: 126.4407},
  {name: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085},
  {name: 'John F. Kennedy International Airport', lat: 40.6413, lng: -73.7781},
];

const convertToSphereCoords = (
  lng: number,
  lat: number,
  radius: number,
): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180); // 위도 -> phi
  const theta = (lng + 180) * (Math.PI / 180); // 경도 -> theta

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
};

export const AirportMarkers: React.FC<{
  airports: typeof airportData;
  radius: number;
  onClick: (airport: (typeof airportData)[number]) => void;
}> = ({airports, radius, onClick}) => {
  return (
    <>
      {airports.map((airport, index) => {
        const position = convertToSphereCoords(
          airport.lng,
          airport.lat,
          radius,
        );

        return (
          <mesh
            key={index}
            position={position}
            onClick={() => onClick(airport)}
          >
            <sphereGeometry args={[0.05, 16, 16]} /> {/* 마커 크기 */}
            <meshBasicMaterial color="red" />
          </mesh>
        );
      })}
    </>
  );
};
