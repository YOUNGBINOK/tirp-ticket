'use client';

import {Button} from '@/app/components/ui/button';
import {Card} from '@/app/components/ui/card';
import {Input} from '@/app/components/ui/input';
import {useState} from 'react';

type TripType = 'oneway' | 'roundtrip' | 'multicity';

// 국제 공항 데이터 (예시, 실제 데이터를 사용하세요)
const airportOptions = [
  {value: 'LAX', label: 'Los Angeles International Airport (LAX)'},
  {value: 'JFK', label: 'John F. Kennedy International Airport (JFK)'},
  {value: 'NRT', label: 'Narita International Airport (NRT)'},
  {value: 'ICN', label: 'Incheon International Airport (ICN)'},
  {value: 'HND', label: 'Haneda Airport (HND)'},
  {value: 'CDG', label: 'Charles de Gaulle Airport (CDG)'},
  // 추가 공항 데이터 ...
];

const Main = () => {
  const [tripType, setTripType] = useState<TripType>('oneway');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(''); // 출발 날짜 추가
  const [returnDate, setReturnDate] = useState('');
  const [multiCities, setMultiCities] = useState([
    {from: '', to: '', departureDate: '', returnDate: ''},
  ]);

  // 편도/왕복/다구간 선택 변경 처리
  const handleTripTypeChange = (type: TripType) => {
    setTripType(type);
    if (type !== 'roundtrip') {
      setReturnDate('');
    }
  };

  // 다구간 항공 추가
  const addMultiCity = () => {
    setMultiCities([
      ...multiCities,
      {from: '', to: '', departureDate: '', returnDate: ''},
    ]);
  };

  return (
    <Card>
      <div className="p-6 bg-white shadow-lg rounded-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">항공편 검색</h2>

        {/* 여행 타입 선택 */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">여행 타입</label>
          <div className="flex space-x-4">
            <Button
              className={`py-2 px-4 rounded-lg ${tripType === 'oneway' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleTripTypeChange('oneway')}
            >
              편도
            </Button>
            <Button
              className={`py-2 px-4 rounded-lg ${tripType === 'roundtrip' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleTripTypeChange('roundtrip')}
            >
              왕복
            </Button>
            {/* <Button
              className={`py-2 px-4 rounded-lg ${tripType === 'multicity' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleTripTypeChange('multicity')}
            >
              다구간
            </Button> */}
          </div>
        </div>

        {/* 출발지/도착지 입력 */}
        <div className="flex">
          <div className="mb-4">
            <label className="block font-semibold mb-2">출발지</label>
            <Input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="출발 공항을 입력하세요"
              value={departure}
              onChange={e => setDeparture(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">도착지</label>
            <Input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="도착 공항을 입력하세요"
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>

          {/* 출발 날짜 입력 (모든 여행 타입 공통) */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">출발 날짜</label>
            <Input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
            />
          </div>

          {/* 왕복일 경우 복귀 날짜 입력 */}
          {tripType === 'roundtrip' && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">복귀일</label>
              <Input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
              />
            </div>
          )}

          {/* 다구간일 경우 추가 입력 필드 */}
          {/* {tripType === 'multicity' && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">다구간 항공편</h3>
              {multiCities.map((city, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="출발지"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={city.from}
                      onChange={e =>
                        setMultiCities(
                          multiCities.map((c, i) =>
                            i === index ? {...c, from: e.target.value} : c,
                          ),
                        )
                      }
                    />
                    <Input
                      type="text"
                      placeholder="도착지"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={city.to}
                      onChange={e =>
                        setMultiCities(
                          multiCities.map((c, i) =>
                            i === index ? {...c, to: e.target.value} : c,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="date"
                      placeholder="출발 날짜"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={city.departureDate}
                      onChange={e =>
                        setMultiCities(
                          multiCities.map((c, i) =>
                            i === index
                              ? {...c, departureDate: e.target.value}
                              : c,
                          ),
                        )
                      }
                    />
                    <Input
                      type="date"
                      placeholder="복귀 날짜"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={city.returnDate}
                      onChange={e =>
                        setMultiCities(
                          multiCities.map((c, i) =>
                            i === index
                              ? {...c, returnDate: e.target.value}
                              : c,
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                className="py-2 px-4 bg-blue-500 text-white rounded-lg"
                onClick={addMultiCity}
              >
                + 항공편 추가
              </Button>
            </div>
          )} */}
        </div>
        <Button className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg mt-4">
          검색
        </Button>
      </div>
    </Card>
  );
};

export default Main;
