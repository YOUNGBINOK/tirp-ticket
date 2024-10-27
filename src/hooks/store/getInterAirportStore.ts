// getFlightStore.ts
import {create} from 'zustand';
import {Airport2} from '../../types/airport';

interface FlightStore {
  airports: Airport2[]; // 공항 데이터 리스트
  fetchAirports: () => Promise<void>; // 공항 데이터를 fetch하여 저장하는 함수
  loading: boolean; // 로딩 상태
  error: string | null; // 에러 상태
}

// 공항 데이터 fetch 함수
async function fetchAirportData(): Promise<string> {
  const response = await fetch(
    'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat',
  );
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.text();
}

// 공항 데이터 파싱 함수
function parseAirportData(data: string): Airport2[] {
  return data
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      const fields = line.split(',');
      return {
        id: parseInt(fields[0]),
        name: fields[1].replace(/"/g, ''),
        city: fields[2].replace(/"/g, ''),
        country: fields[3].replace(/"/g, ''),
        iataCode: fields[4] !== '\\N' ? fields[4].replace(/"/g, '') : null,
        icaoCode: fields[5] !== '\\N' ? fields[5].replace(/"/g, '') : null,
        lat: parseFloat(fields[6]),
        lon: parseFloat(fields[7]),
        altitude: parseInt(fields[8]),
        timezone: parseFloat(fields[9]),
        dst: fields[10].replace(/"/g, ''),
        tzDatabase: fields[11].replace(/"/g, ''),
        type: fields[12].replace(/"/g, ''),
        source: fields[13].replace(/"/g, ''),
      } as Airport2;
    });
}

// zustand를 사용한 스토어 생성
export const useInterAirportStore = create<FlightStore>(set => ({
  airports: [],
  loading: false,
  error: null,

  fetchAirports: async () => {
    set({loading: true, error: null});
    try {
      const rawData = await fetchAirportData();
      const airportData = parseAirportData(rawData);
      set({airports: airportData, loading: false});
      console.log(airportData);
    } catch (error) {
      console.error('Error:', error);
      set({error: (error as Error).message, loading: false});
    }
  },
}));
