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
  const markerGroupRef = useRef<SVGGElement | null>(null); // 마커 그룹을 위한 Ref 추가

  useEffect(() => {
    if (!mapRef.current) return;

    const sensitivity = 75;
    let width = mapRef.current.getBoundingClientRect().width;
    const height = 500;

    const projection = d3
      .geoOrthographic()
      .scale(250)
      .center([0, 0])
      .rotate([0, -30]) // 초기 회전값 설정
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    let path = d3.geoPath().projection(projection);

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

    const map = svg.append('g');

    map
      .append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('class', d => `country_${d.properties.name.replace(' ', '_')}`)
      .attr('d', path)
      .attr('fill', 'white')
      .style('stroke', 'black')
      .style('stroke-width', 0.3)
      .style('opacity', 0.8);

    // 마커 그룹 초기화
    const markerGroup = svg.append('g').attr('class', 'markers');
    markerGroupRef.current = markerGroup.node(); // Ref 저장

    // 마커 그리기 및 업데이트 함수
    const drawMarkers = () => {
      const markers = markerGroup.selectAll('circle').data(airportData);

      markers
        .enter()
        .append('circle')
        .merge(markers)
        .attr('r', 4)
        .attr('cx', d => projection([d.lng, d.lat])![0]) // 초기 좌표 설정
        .attr('cy', d => projection([d.lng, d.lat])![1]) // 초기 좌표 설정
        .attr('fill', d => {
          const coordinate = [d.lng, d.lat];
          const gdistance = d3.geoDistance(
            coordinate,
            projection.invert([width / 2, height / 2]),
          );
          return gdistance > 1.5 ? 'none' : 'red';
        })
        .attr('stroke', d => {
          const coordinate = [d.lng, d.lat];
          const gdistance = d3.geoDistance(
            coordinate,
            projection.invert([width / 2, height / 2]),
          );
          return gdistance > 1.5 ? 'none' : 'white';
        });

      markers.exit().remove(); // 데이터가 변경되었을 때 제거

      markerGroup.each(function () {
        this.parentNode.appendChild(this); // DOM 순서 보존
      });
    };

    // 격자무늬 추가
    const drawGraticule = () => {
      const graticule = d3.geoGraticule().step([10, 10]);
      svg
        .append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', path)
        .style('fill', '#fff')
        .style('stroke', '#ccc');
    };

    drawMarkers(); // 초기 마커 그리기 호출

    // 지구본 드래그 및 회전 이벤트
    svg
      .call(
        d3.drag().on('drag', event => {
          const rotate = projection.rotate();
          const k = sensitivity / projection.scale();
          projection.rotate([
            rotate[0] + event.dx * k,
            rotate[1] - event.dy * k,
          ]);
          path = d3.geoPath().projection(projection);
          svg.selectAll('path').attr('d', path);
          drawMarkers(); // 회전 시 마커 좌표 업데이트
        }),
      )
      .call(
        d3.zoom().on('zoom', event => {
          if (event.transform.k > 0.3) {
            projection.scale(initialScale * event.transform.k);
            path = d3.geoPath().projection(projection);
            svg.selectAll('path').attr('d', path);
            globe.attr('r', projection.scale());
            drawMarkers(); // 확대/축소 시 마커 좌표 업데이트
          } else {
            event.transform.k = 0.3;
          }
        }),
      );

    const handleResize = () => {
      width = mapRef.current.getBoundingClientRect().width;
      projection.translate([width / 2, height / 2]);
      svg.attr('width', '100%');
      globe.attr('cx', width / 2).attr('cy', height / 2);
      svg.selectAll('path').attr('d', path);
      drawMarkers(); // 리사이즈 시 마커 좌표 업데이트
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      svg.remove();
    };
  }, [data]);

  return <div id="map" ref={mapRef} className="w-full h-full"></div>;
};

export default Map;
