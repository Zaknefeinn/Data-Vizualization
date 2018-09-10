import React, { Component } from 'react';
import * as d3 from 'd3';
import 'flag-icon-css/css/flag-icon.css';
export default class ForceDirectedGraph extends Component {
  componentDidMount() {
    this.getChart();
  }
  componentDidUpdate() {
    this.getChart();
  }
  getChart = () => {
    const svg = d3.select('.ForceDirectedGraphContainer'),
      width = +svg.attr('width'),
      height = +svg.attr('height');

    var simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id(function(d, i) {
          return i;
        })
      )
      .force('charge', d3.forceManyBody().strength(-5))
      .force('center', d3.forceCenter(width / 2, height / 2));
    var div = d3.select('.ForceDirectedGraphContainer2').append('div');

    d3.json(
      'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'
    ).then(graph => {
      var link = svg
        .append('g')
        .attr('class', 'ForceDirectedGraphLinks')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append('line');

      var node = div
        .attr('class', 'ForceDirectedGraphNodes')
        .selectAll('img')
        .data(graph.nodes)
        .enter()
        .append('img')
        .attr('class', d => `flag-icon flag-icon-${d.code}`)
        .attr('width', '25px')
        .attr('height', '15px')
        .call(
          d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        );

      node.append('title').text(d => d.country);
      simulation.nodes(graph.nodes).on('tick', ticked);

      simulation.force('link').links(graph.links);

      function ticked() {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node.style('left', d => `${d.x}px`).style('top', d => `${d.y}px`);
      }
    });

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };
  render() {
    return (
      <div className="ForceDirectedGraph">
        <h1>Directed Path</h1>
        <div
          className="ForceDirectedGraphContainer2"
          width="1500"
          height="1000"
        >
          <svg
            className="ForceDirectedGraphContainer"
            width="1500"
            height="1000"
          />
        </div>
      </div>
    );
  }
}
