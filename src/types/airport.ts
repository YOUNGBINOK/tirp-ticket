export type Airport = {
  name: string;
  lat: number;
  lng: number;
};

export interface Airport2 {
  id: number;
  name: string;
  city: string;
  country: string;
  iataCode: string | null;
  icaoCode: string | null;
  lat: number;
  lon: number;
  altitude: number;
  timezone: number;
  dst: string;
  tzDatabase: string;
  type: string;
  source: string;
}
