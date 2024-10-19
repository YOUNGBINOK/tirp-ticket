'use client';

import * as d3 from 'd3';
import {FeatureCollection, Geometry} from 'geojson';
import {useEffect, useRef} from 'react';

type GlobeProps = {
  data: FeatureCollection<Geometry>;
};

type Airport = {
  name: string;
  lat: number;
  lng: number;
};

const airportData: Airport[] = [
  {name: 'Incheon International Airport', lat: 37.4602, lng: 126.4407},
  {name: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085},
  {name: 'John F. Kennedy International Airport', lat: 40.6413, lng: -73.7781},
  // 추가 공항 데이터...
];

const Map = ({data}: GlobeProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const sensitivity = 75;
    let width = mapRef.current.getBoundingClientRect().width;
    const height = 500;

    const projection = d3
      .geoOrthographic()
      .scale(250)
      .center([0, 0])
      .rotate([0, -30])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    const path = d3.geoPath().projection(projection);

    const svg = d3
      .select(mapRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height);

    const globe = svg
      .append('circle')
      .attr('fill', '#EEE')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.2')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', initialScale);

    const mapGroup = svg.append('g');

    // 국가 경계 그리기
    mapGroup
      .append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.3)
      .style('opacity', 0.8);

    // 마커 생성
    const markers = svg
      .append('g')
      .selectAll('circle')
      .data(airportData)
      .enter()
      .append('circle')
      .attr('r', 4)
      .attr('fill', 'red')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .attr('cx', d => projection([d.lng, d.lat])![0])
      .attr('cy', d => projection([d.lng, d.lat])![1])
      .append('title')
      .text(d => d.name);

    // 마커 좌표 업데이트 함수
    const updateMarkers = () => {
      markers
        .attr('cx', d => {
          const coords = projection([d.lng, d.lat]);
          return coords ? coords[0] : 0;
        })
        .attr('cy', d => {
          const coords = projection([d.lng, d.lat]);
          return coords ? coords[1] : 0;
        });
    };

    // 드래그로 지구본 회전 및 마커 업데이트
    svg.call(
      d3.drag().on('drag', event => {
        const rotate = projection.rotate();
        const k = sensitivity / projection.scale();
        projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
        svg.selectAll('path').attr('d', path);
        updateMarkers();
      }),
    );

    // 줌 이벤트 처리
    svg.call(
      d3.zoom().on('zoom', event => {
        const zoomLevel = event.transform.k > 0.3 ? event.transform.k : 0.3;
        projection.scale(initialScale * zoomLevel);
        svg.selectAll('path').attr('d', path);
        globe.attr('r', projection.scale());
        updateMarkers();
      }),
    );

    // 리사이즈 핸들러
    const handleResize = () => {
      width = mapRef.current!.getBoundingClientRect().width;
      projection.translate([width / 2, height / 2]);
      svg.attr('width', '100%');
      globe.attr('cx', width / 2).attr('cy', height / 2);
      svg.selectAll('path').attr('d', path);
      updateMarkers();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      svg.remove();
    };
  }, [data]);

  return <div id="map" ref={mapRef} className="w-full h-full"></div>;
};

export default Map;
