import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
export default class MeteoriteStrike extends Component {
  componentDidMount() {
    this.getChart();
  }
  componentDidUpdate() {
    this.getChart();
  }
  getChart = () => {
    const svg = d3.select('.MeteoriteStrikeContainer'),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom;

    const files = [
      'https://s3-us-west-2.amazonaws.com/vida-public/geo/world-topo-min.json',
      'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json'
    ];
    const div = d3
      .select('body')
      .append('div')
      .attr('class', 'MeteoriteStrikeTooltip')
      .style('opacity', 0);

    const projection = d3
      .geoMercator()
      .translate([width / 2, height / 2])
      .scale(200);
    const path = d3.geoPath().projection(projection);

    Promise.all(files.map(url => d3.json(url))).then(data => {
      const countries = topojson.feature(data[0], data[0].objects.countries)
        .features;
      const meteors = data[1].features;
      svg
        .selectAll('.MeteoriteStrikeCountry')
        .data(countries)
        .enter()
        .append('path')
        .attr('class', 'MeteoriteStrikeCountry')
        .attr('d', path);

      svg
        .selectAll('.MeteoriteStrikeMeteors')
        .data(meteors)
        .enter()
        .append('circle')
        .attr('class', 'MeteoriteStrikeMeteors')
        .attr('r', d => Math.sqrt(d.properties.mass) / 100)
        .attr('fill', d => {
          const mass = d.properties.mass;
          if (mass < 10000) {
            return 'rgba(0, 153, 0, .5)';
          } else if (mass < 100000) {
            return 'rgba(153, 153, 0, .5)';
          } else {
            return 'rgba(153, 0, 0, .5)';
          }
        })
        .attr('cx', d => {
          if (d.geometry !== null) {
            const coords = projection([
              d.geometry.coordinates[0],
              d.geometry.coordinates[1]
            ]);
            return coords[0];
          }
        })
        .attr('cy', d => {
          if (d.geometry !== null) {
            const coords = projection([
              d.geometry.coordinates[0],
              d.geometry.coordinates[1]
            ]);
            return coords[1];
          }
        })
        .on('mouseover', function(d) {
          let year = d.properties.year;
          year = year.substring(0, 10);
          d3.select(this);
          div
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          div
            .html(
              `
    <div><strong>Fall:</strong> ${d.properties.fall}</div>
    <div><strong>Mass:</strong> ${d.properties.mass}</div>
    <div><strong>Name:</strong> ${d.properties.name}</div>
    <div><strong>recclass:</strong> ${d.properties.recclass}</div>
    <div><strong>reclat:</strong> ${d.properties.reclat}</div>
    <div><strong>year:</strong> ${year}</div>`
            )
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', mouseOut);
    });

    function mouseOut() {
      div.style('opacity', 0);
    }
  };
  render() {
    return (
      <div>
        <h1>World Map</h1>
        <svg className="MeteoriteStrikeContainer" width="1500" height="1000" />
      </div>
    );
  }
}
