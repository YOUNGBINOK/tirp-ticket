'use client';

import * as d3 from 'd3';
import {FeatureCollection, Geometry} from 'geojson';
import {useEffect, useRef, useState} from 'react';
import {Airport} from '../../../types/airport.ts';
import {useInterAirportStore} from '@/hooks/store/getInterAirportStore.ts';

type GlobeProps = {
  data: FeatureCollection<Geometry>;
  onAirportClick: (airport: Airport) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
};

const airportData: Airport[] = [
  {name: 'Incheon International Airport', lat: 37.4602, lng: 126.4407},
  {name: 'Los Angeles International Airport', lat: 33.9416, lng: -118.4085},
  {name: 'John F. Kennedy International Airport', lat: 40.6413, lng: -73.7781},
];

const Map = ({data, onAirportClick, zoomLevel, setZoomLevel}: GlobeProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerGroupRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const {airports, fetchAirports, loading, error} = useInterAirportStore();
  const [rotation, setRotation] = useState<[number, number, number]>([
    0, -30, 0,
  ]);

  // useEffect(() => {
  //   fetchAirports();
  // }, [fetchAirports]);

  useEffect(() => {
    if (!mapRef.current) return;

    const svg = d3
      .select(mapRef.current)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 960 500');

    svgRef.current = svg.node();

    const projection = d3
      .geoOrthographic()
      .scale(zoomLevel)
      .center([0, 0])
      .rotate(rotation)
      .translate([
        svgRef.current.clientWidth / 2,
        svgRef.current.clientHeight / 2,
      ]);

    const path = d3.geoPath().projection(projection);
    const globe = svg
      .append('circle')
      .attr('fill', '#EEE')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.2')
      .attr('cx', svgRef.current.clientWidth / 2)
      .attr('cy', svgRef.current.clientHeight / 2)
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
      const markers = markerGroup.selectAll('circle').data(airports);

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
        })
        .on('mouseover', function (event, d) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr('fill', 'blue') // Change color on hover
            .attr('r', 6); // Increase size on hover

          svg
            .append('text')
            .attr('id', 'tooltip')
            .attr('x', projection([d.lng, d.lat])![0] + 10) // Offset to avoid overlapping with the marker
            .attr('y', projection([d.lng, d.lat])![1] - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .text(d.name); // Display airport name or other info
        })
        .on('mouseout', function () {
          d3.select(this)
            .transition()
            .duration(100)
            .attr('fill', 'red') // Reset color on mouseout
            .attr('r', 4); // Reset size on mouseout

          // Remove tooltip
          svg.select('#tooltip').remove();
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
      svg.attr('preserveAspectRatio', 'xMinYMin meet');
      svg.attr('viewBox', '0 0 960 500');
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

  return (
    <div>
      <div id="map" ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default Map;
