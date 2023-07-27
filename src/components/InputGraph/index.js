import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const InputGraph = ({ steering, throttle, brake }) => {
  const ref = useRef();
  const y = throttle - brake;

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // Define the scales
    const xScale = d3.scaleLinear().domain([-1, 1]).range([0, width / 2]);
    const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);
    const barScale = d3.scaleLinear().domain([0, 1]).range([0, height / 2]);

    // Remove the old dot and bars
    svg.selectAll('circle').remove();
    svg.selectAll('.bar').remove();
    svg.selectAll('.text').remove();

    // Draw the dot
    svg
      .append('circle')
      .attr('cx', xScale(steering))
      .attr('cy', yScale(y))
      .attr('r', 5)
      .attr('fill', 'red');

    // Draw the bars
    ['throttle', 'brake'].forEach((input, i) => {
      const value = input === 'throttle' ? throttle : brake;
      const barHeight = barScale(value);

      svg
        .append('rect')
        .attr('x', (width / 2) + (i * 60))
        .attr('y', (height / 2) - barHeight)
        .attr('width', 50)
        .attr('height', barHeight)
        .attr('class', 'bar')
        .attr('fill', input === 'throttle' ? 'green' : 'blue');

      svg
        .append('text')
        .attr('x', (width / 2) + (i * 60))
        .attr('y', (height / 2) + 20)
        .attr('class', 'text')
        .text(`${Math.round(value * 100)}%`);
    });
  }, [steering, y, throttle, brake]);

  return <svg ref={ref} width="800" height="500"></svg>;
};

export default InputGraph;
