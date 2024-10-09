'use client';

import {useEffect, useState} from 'react';

type Airport = {
  name: string;
  lat: number;
  lng: number;
};

const MapMini = () => {
  const [startAirport, setStartAirport] = useState<Airport | null>(null);
  const [endAirport, setEndAirport] = useState<Airport | null>(null);

  useEffect(() => {
    const loadEarthScript = async () => {
      return new Promise<void>(resolve => {
        const script = document.createElement('script');
        script.src = `../../../miniature.earth.js`;
        script.async = true;
        script.onload = () => {
          console.log('Earth script loaded');
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    const initializeEarth = async () => {
      await loadEarthScript();

      const myearth = new (window as any).Earth('myearth', {
        location: {lat: 10, lng: -80},
        light: 'none',
        mapLandColor: '#fff',
        mapSeaColor: '#66d8ff',
        mapBorderColor: '#66d8ff',
        mapBorderWidth: 0.4,
      });

      myearth.addEventListener('ready', function () {
        this.addMarker({
          mesh: ['Pin2', 'Needle'],
          location: {lat: 40.6918636, lng: -74.0965785},
        });
      });
    };

    initializeEarth();

    // Cleanup script on component unmount
    return () => {
      const script = document.querySelector(
        `script[src="../../../miniature.earth.js"]`,
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleAirportClick = (airport: Airport) => {
    if (!startAirport) {
      setStartAirport(airport);
    } else if (!endAirport) {
      setEndAirport(airport);
    } else {
      setStartAirport(airport);
      setEndAirport(null);
    }
  };

  return (
    <div style={{height: '100vh'}}>
      <h1 className="text-xl font-bold mb-4">공항 선택하기</h1>
      <div className="mb-4">
        <p>출발지: {startAirport ? startAirport.name : '선택되지 않음'}</p>
        <p>도착지: {endAirport ? endAirport.name : '선택되지 않음'}</p>
      </div>
      <div id="myearth" className="earth-container earth-ready">
        <canvas width="1296" height="1296"></canvas>
      </div>
    </div>
  );
};

export default MapMini;
