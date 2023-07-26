import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { select, line, scaleLinear, max, curveBasis } from 'd3';


const RealTimeGraph = ({ data, scenarioData }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data && data.length > 0 && d3Container.current) {
      const svg = select(d3Container.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = scaleLinear().range([0, width]);
      const y = scaleLinear().range([height, 0]);

      const throttleLine = line()
        .x((d) => x(d.second))
        .y((d) => y(d.throttle))
        .curve(curveBasis);

      const brakeLine = line()
        .x((d) => x(d.second))
        .y((d) => y(d.brake))
        .curve(curveBasis);

      const scenarioThrottleLine = line()
        .x((d) => x(d.second))
        .y((d) => y(d.throttle))
        .curve(curveBasis);

      const scenarioBrakeLine = line()
        .x((d) => x(d.second))
        .y((d) => y(d.brake))
        .curve(curveBasis);

      x.domain([0, max(data, d => d.second)]);
      y.domain([0, 100]);

      g.append("path")
        .datum(data)
        .attr("d", throttleLine)
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      g.append("path")
        .datum(data)
        .attr("d", brakeLine)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      g.append("path")
        .datum(scenarioData)
        .attr("d", scenarioThrottleLine)
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      g.append("path")
        .datum(scenarioData)
        .attr("d", scenarioBrakeLine)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g").call(d3.axisLeft(y));
    }
  }, [data, scenarioData, d3Container.current]);

  return (
    <svg
        className="d3-component"
        width={1000}
        height={600}
        ref={d3Container}
    />
  );
};

export default RealTimeGraph;
