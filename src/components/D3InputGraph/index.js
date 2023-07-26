import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3InputGraph = ({ datasets }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const margin = { top: 10, right: 20, bottom: 20, left: 30 };

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Calculate dimensions once
    if (dimensions.width === 0 || dimensions.height === 0) {
      const containerWidth = svgRef.current.parentElement.clientWidth;
      const containerHeight = svgRef.current.parentElement.clientHeight;
      setDimensions({ width: containerWidth, height: containerHeight });
    }

    // Extract dimensions from state
    const { width: containerWidth, height: containerHeight } = dimensions;

    const x = d3.scaleTime()
      .domain(d3.extent(datasets[0], d => new Date(d.x)))
      .range([margin.left, containerWidth - margin.right]);

    const y = d3.scaleLinear()
      .domain([100, 0]) // Reverse the y-scale to display values in positive direction
      .range([containerHeight - margin.bottom, margin.top]);

    svg.selectAll("*").remove();

    const lineGenerator = d3.line()
      .x(d => x(new Date(d.x)))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    datasets.forEach((data, index) => {
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", index === 0 ? 'red' : 'blue')
        .attr("stroke-width", 1.5)
        .attr("d", lineGenerator(data))
        .style("display", "block")
        .on('mouseover', () => svg.select(`path:nth-child(${index + 1})`).style('display', 'block'))
        .on('mouseout', () => svg.select(`path:nth-child(${index + 1})`).style('display', 'none'));
    });

    svg.append("g")
      .attr("transform", `translate(0, ${containerHeight - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));
  }, [datasets, dimensions]);

  return (
    <div>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default D3InputGraph;
