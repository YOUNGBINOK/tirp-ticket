import {create} from 'zustand';

interface ApiData {
  // API에서 받아올 데이터의 타입을 정의합니다.
  id: number;
  name: string;
  // 필요한 다른 필드들...
}

interface StoreState {
  data: ApiData | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useFlightStore = create<StoreState>(set => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async () => {
    set({loading: true, error: null});
    const apiKey = 'YOUR_API_KEY';
    const url = `https://YOUR_API_ENDPOINT?key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      set({data, loading: false});
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
}));

export default useFlightStore;
