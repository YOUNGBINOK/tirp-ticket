'use client';

import {useState} from 'react';
import {CgArrowsExchange} from 'react-icons/cg';

const Main = () => {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [isMultiCity, setIsMultiCity] = useState(false);
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = () => {
    console.log('검색:', {departure, arrival, departureDate, returnDate});
  };

  const handleSwap = () => {
    setDeparture(arrival);
    setArrival(departure);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-xl font-bold mb-4">항공권 검색하기</h1>

      <div className="flex mb-4">
        <button
          className={`flex-1 text-lg font-bold ${!isRoundTrip && !isMultiCity ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} py-2 rounded-l-lg`}
          onClick={() => {
            setIsRoundTrip(false);
            setIsMultiCity(false);
          }}
        >
          편도
        </button>
        <button
          className={`flex-1 text-lg font-bold ${isRoundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} py-2`}
          onClick={() => {
            setIsRoundTrip(true);
            setIsMultiCity(false);
          }}
        >
          왕복
        </button>
        <button
          className={`flex-1 text-lg font-bold ${isMultiCity ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} py-2 rounded-r-lg`}
          onClick={() => {
            setIsMultiCity(true);
            setIsRoundTrip(false);
          }}
        >
          다구간
        </button>
      </div>

      <div className="flex items-center mb-4 border border-gray-300 rounded-lg p-2">
        <input
          className="bg-transparent text-gray-700 border-none flex-1 outline-none placeholder-gray-400"
          value={departure}
          onChange={e => setDeparture(e.target.value)}
          placeholder="출발지"
        />

        {isRoundTrip && (
          <>
            <CgArrowsExchange
              className="text-gray-800 text-xl mx-2 cursor-pointer border-2 rounded-full border-blue-600"
              onClick={handleSwap}
            />
            <input
              className="bg-transparent text-gray-700 border-none flex-1 outline-none placeholder-gray-400"
              value={arrival}
              onChange={e => setArrival(e.target.value)}
              placeholder="도착지"
            />
          </>
        )}

        <input
          type="date"
          className="bg-transparent text-gray-700 border-none flex-1 outline-none placeholder-gray-400"
          value={departureDate}
          onChange={e => setDepartureDate(e.target.value)}
        />

        {isRoundTrip && (
          <input
            type="date"
            className="bg-transparent text-gray-700 border-none flex-1 outline-none placeholder-gray-400"
            value={returnDate}
            onChange={e => setReturnDate(e.target.value)}
          />
        )}
      </div>

      {isMultiCity && (
        <div className="flex items-center mb-4">
          <input
            className="bg-gray-100 text-gray-700 border border-gray-300 rounded-lg p-2 mr-2 flex-1"
            placeholder="중간 도시"
          />
          <input
            type="date"
            className="bg-gray-100 text-gray-700 border border-gray-300 rounded-lg p-2 flex-1"
          />
        </div>
      )}

      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        검색하기
      </button>
    </div>
  );
};

export default Main;
