import {Airport} from '@/types/airport';

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
  airports: Airport[]; // 타입 수정
  radius: number;
  onClick: (airport: Airport) => void; // 타입 수정
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
