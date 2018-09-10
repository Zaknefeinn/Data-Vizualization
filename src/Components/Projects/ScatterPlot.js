import React, { Component } from 'react';
import * as d3 from 'd3';

export default class ScatterPlot extends Component {
  componentDidMount() {
    this.getChart();
  }
  componentDidUpdate() {
    this.getChart();
  }
  getChart = () => {
    let color = '';
    const svg = d3.select('.ScatterPlotContainer'),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom,
      g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    d3.json(
      'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
    ).then(d => {
      const first = d[0].Seconds;

      d.forEach(x => {
        x.Doping.length > 0 ? (x.color = 'red') : (x.color = '#1F618D');
        const time = Math.abs(first - x.Seconds);
        x.behind = time;
      });
      const last = d[d.length - 1].behind + 20;
      const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([d.length + 5, 1]);

      const x = d3
        .scaleLinear()
        .range([0, width - 100])
        .domain([last, 0]);

      g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

      g.append('g').call(d3.axisLeft(y));
      const text = g
        .selectAll('.text')
        .data(d)
        .enter()
        .append('text');

      g.selectAll('.ScatterPlotScatter')
        .data(d)
        .enter()
        .append('circle')
        .attr('class', 'ScatterPlotScatter')
        .attr('r', 10.5)
        .attr('cx', d => x(d.behind))
        .attr('cy', d => y(d.Place))
        .attr('fill', d => d.color)
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut);
      text
        .attr('x', d => x(d.behind) + 15)
        .attr('y', d => y(d.Place) + 5)
        .text(function(d) {
          return d.Name;
        });
    });

    function mouseOver(d) {
      d.color === 'red' ? (color = '#F08080') : (color = '#5DADE2');
      d3.select(this).attr('fill', color);
      d3.select('.ScatterPlotTooltip').html(`<h3> ${d.Name} : ${
        d.Nationality
      }</h3>
         <p><b>Year: ${d.Year}, Time: ${d.Time}
         <p> ${d.Doping}</b>`);
    }
    function mouseOut(d) {
      color = d.color;
      d3.select(this).attr('fill', color);
      d3.select('.tooltip').html('');
    }
  };
  render() {
    return (
      <div>
        <h1>Doping in Professional Bicycle Racing</h1>
        <svg className="ScatterPlotContainer" width="1500" height="1000" />
        <div className="ScatterPlotTooltip" />
      </div>
    );
  }
}
