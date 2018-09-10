import React, { Component } from 'react';
import * as d3 from 'd3';

export default class GrossProduct extends Component {
  componentDidMount() {
    this.getChart();
  }
  componentDidUpdate() {
    this.getChart();
  }
  getChart = () => {
    let data = [];
    const svg = d3.select('.GrossProductContainer'),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      svgWidth = +svg.attr('width') - margin.left - margin.right,
      svgHeight = +svg.attr('height') - margin.top - margin.bottom,
      g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    let yScale = d3.scaleLinear().range([svgHeight, 0]);
    let xScale = d3.scaleTime().range([0, svgWidth]);

    var div = d3
      .select('body')
      .append('div')
      .attr('class', 'GrossProductTooltip')
      .style('opacity', 0);

    d3.json(
      'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
    ).then(d => {
      const parseTime = d3.timeParse('%Y-%d-%m');
      const minDate = parseTime(d.from_date);
      const maxDate = parseTime(d.to_date);
      d.data.forEach(x => {
        data.push({ date: x[0], usd: x[1] });
      });
      // console.log(maxDate)
      xScale.domain([minDate, maxDate]);
      yScale.domain([0, d3.max(data, d => d.usd)]);

      // console.log(xScale)
      g.append('g')
        .attr('transform', 'translate(0,' + svgHeight + ')')
        .call(d3.axisBottom(xScale));
      g.append('g').call(d3.axisLeft(yScale));
      g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(new Date(d.date)))
        .attr('y', d => yScale(d.usd))
        .attr('width', d => svgWidth / data.length)
        .attr('height', d => svgHeight - yScale(d.usd))
        .attr('fill', 'steelblue')
        .on('mouseover', function(d) {
          d3.select(this).attr('fill', 'lightBlue');
          div
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          div
            .html(`${d.date}<br/>$${d.usd}`)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', mouseOut);
    });

    function mouseOut() {
      d3.select(this).attr('fill', 'steelblue');
    }
  };
  render() {
    return (
      <div>
        <h1>US Gross Domestic Product</h1>
        <svg width="1500" height="700" className="GrossProductContainer" />
        <h4>
          Units: Billions of Dollars <br />
          Seasonal Adjustment: Seasonally Adjusted Annual Rate <br />
          Notes: A Guide to the National Income and Product Accounts of the
          United States (NIPA) - (http://www.bea.gov/national/pdf/nipaguid.pdf)
        </h4>
      </div>
    );
  }
}
