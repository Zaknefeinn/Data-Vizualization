import React, { Component } from 'react';
import * as d3 from 'd3';

export default class GlobalSurfaceTemp extends Component {
  componentDidMount() {
    this.getChart();
  }
  componentDidUpdate() {
    this.getChart();
  }
  getChart = () => {
    const svg = d3.select('.GlobalSurfaceTempContainer'),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom,
      g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      ' December'
    ];
    let base;
    var div = d3
      .select('body')
      .append('div')
      .attr('class', 'GlobalSurfaceTempTooltip')
      .style('opacity', 0);
    d3.json(
      'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
    ).then(d => {
      base = d.baseTemperature;
      const minDate = d.monthlyVariance[0].year;
      const maxDate = d.monthlyVariance[d.monthlyVariance.length - 1].year;
      const length = maxDate - minDate;
      const xTicks = Math.ceil((maxDate - minDate) / 10);

      const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, 12]);

      const x = d3
        .scaleLinear()
        .range([2, width])
        .domain([minDate, maxDate]);

      g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(
          d3
            .axisBottom(x)
            .ticks(xTicks)
            .tickFormat(d => d)
        );

      g.append('g').call(d3.axisLeft(y).tickFormat(d => months[d - 1]));
      // console.log(new Date(data[0].year))
      g.selectAll('GlobalSurfaceTempRects')
        .data(d.monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'GlobalSurfaceTempRects')
        .attr('x', d => x(d.year))
        .attr('y', d => y(d.month))
        .attr('fill', pickColor)
        .attr('width', d => width / length)
        .attr('height', d => height / 13)
        .on('mouseover', function(d) {
          div
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          div
            .html(
              `${d.year} - ${months[d.month - 1]} </br> ${parseFloat(
                d.variance + base
              ).toFixed(3)}</br> ${d.variance}`
            )
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        });
    });

    function pickColor(d) {
      let color;
      let temp = d.variance + base;
      if (temp < 2.7) {
        color = '#9013FF';
      } else if (temp < 3.9) {
        color = '#30B98B';
      } else if (temp < 5) {
        color = '#42E3AD';
      } else if (temp < 6.1) {
        color = '#E6E645';
      } else if (temp < 7.2) {
        color = '#FFFFCF';
      } else if (temp < 8.3) {
        color = '#F3C259';
      } else if (temp < 9.4) {
        color = '#F7B425';
      } else if (temp < 10.5) {
        color = '#F78E25';
      } else if (temp < 11.6) {
        color = '#F45713';
      } else {
        color = '#F41313';
      }

      return color;
    }
  };
  render() {
    return (
      <div>
        <h1>Monthly Global Land-Surface Temperature</h1>
        <svg
          className="GlobalSurfaceTempContainer"
          width="1500"
          height="1000"
        />
      </div>
    );
  }
}
