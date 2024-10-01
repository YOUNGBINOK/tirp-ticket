'use client';

import {useState} from 'react';

const Main = () => {
  const [startDate, setStartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState('oneway');

  const handleTripTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setTripType(event.target.value);
    // 왕복 선택 시 returnDate를 초기화할 수 있습니다.
    if (event.target.value === 'roundtrip' || event.target.value === 'multi') {
      setReturnDate('');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">여행 정보 입력</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          출발일:
        </label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      {tripType === 'roundtrip' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            복귀일:
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={e => setReturnDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          여행 타입:
        </label>
        <select
          value={tripType}
          onChange={handleTripTypeChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="oneway">편도</option>
          <option value="roundtrip">왕복</option>
          <option value="multi">다구간</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md px-4 py-2"
      >
        예약하기
      </button>
    </div>
  );
};

export default Main;
