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
        }),
      )
      .call(
        d3.zoom().on('zoom', event => {
          if (event.transform.k > 0.3) {
            projection.scale(initialScale * event.transform.k);
            path = d3.geoPath().projection(projection);
            svg.selectAll('path').attr('d', path);
            globe.attr('r', projection.scale());
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
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      svg.remove();
    };
  }, [data]);

  return <div id="map" ref={mapRef} className="w-full h-full" />;
};

export default Map;
