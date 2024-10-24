'use client';

import * as d3 from 'd3';
import {FeatureCollection, Geometry} from 'geojson';
import {useEffect, useRef, useState} from 'react';
import {Airport} from '../../../types/airport.ts';

type GlobeProps = {
  data: FeatureCollection<Geometry>;
  onAirportClick: (airport: Airport) => void;
};

const airportData: Airport[] = [
  {name: 'Incheon International Airport', lat: 37.4602, lng: 126.4407},
  {name: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085},
  {name: 'John F. Kennedy International Airport', lat: 40.6413, lng: -73.7781},
];

const Map = ({data, onAirportClick}: GlobeProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerGroupRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [rotation, setRotation] = useState<[number, number, number]>([
    0, -30, 0,
  ]);
  const [zoomLevel, setZoomLevel] = useState<number>(250);

  useEffect(() => {
    if (!mapRef.current) return;

    const svg = d3
      .select(mapRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', 800);
    svgRef.current = svg.node();

    const projection = d3
      .geoOrthographic()
      .scale(zoomLevel)
      .center([0, 0])
      .rotate(rotation)
      .translate([svgRef.current.clientWidth / 2, 400]);

    const path = d3.geoPath().projection(projection);
    const globe = svg
      .append('circle')
      .attr('fill', '#EEE')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.2')
      .attr('cx', svgRef.current.clientWidth / 2)
      .attr('cy', 400)
      .attr('r', projection.scale());

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

    const markerGroup = svg.append('g').attr('class', 'markers');
    markerGroupRef.current = markerGroup.node();

    const drawMarkers = () => {
      const markers = markerGroup.selectAll('circle').data(airportData);

      markers
        .enter()
        .append('circle')
        .merge(markers)
        .attr('r', 4)
        .attr('cx', d => projection([d.lng, d.lat])![0])
        .attr('cy', d => projection([d.lng, d.lat])![1])
        .attr('fill', 'red')
        .on('click', (event, d) => {
          event.stopPropagation();
          onAirportClick(d);
        });

      markers.exit().remove();
    };

    const drawGraticule = () => {
      const graticule = d3.geoGraticule().step([15, 15]);
      svg
        .append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', path)
        .attr('fill-opacity', '0.1')
        .style('fill', '#fff')
        .style('stroke', '#ccc');
    };

    //drawGraticule();
    drawMarkers();

    const dragHandler = d3.drag().on('drag', event => {
      const rotate = projection.rotate();
      const k = 75 / projection.scale();
      const newRotation: [number, number, number] = [
        rotate[0] + event.dx * k,
        rotate[1] - event.dy * k,
        rotate[2],
      ];

      setRotation(newRotation);
      projection.rotate(newRotation).scale(zoomLevel);

      svg.selectAll('path').attr('d', path);
      globe.attr('r', projection.scale());
      drawMarkers();
    });

    svg.call(dragHandler);

    const handleResize = () => {
      svg.attr('width', '100%');
      svg.attr('height', '800');
      projection.translate([svgRef.current.clientWidth / 2, 400]);
      svg.selectAll('path').attr('d', path);
      drawMarkers();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      svg.remove();
    };
  }, [data, onAirportClick, rotation, zoomLevel]);

  const zoomIn = () => {
    const newZoomLevel = Math.min(zoomLevel + 50, 500);
    setZoomLevel(newZoomLevel);
  };

  const zoomOut = () => {
    const newZoomLevel = Math.max(zoomLevel - 50, 100);
    setZoomLevel(newZoomLevel);
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          onClick={zoomIn}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Zoom In
        </button>
        <button
          onClick={zoomOut}
          className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
        >
          Zoom Out
        </button>
      </div>
      <div id="map" ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default Map;
