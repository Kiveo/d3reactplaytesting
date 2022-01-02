import React from "react";
import "./styles.css";
import * as d3 from "d3";
import { axisBottom } from "d3";

const dataSets = [
  [8, 6, 14, 10, 12, 7],
  [4, 3, 12, 5, 6, 8]
];

const dataPoints = [
  { x: 6, y: 3 },
  { x: 10, y: 6.5 },
  { x: 14, y: 5 },
  { x: 12, y: 4 },
  { x: 14, y: 4 },
  { x: 8, y: 12 },
  { x: 8, y: 8 } // ADDED FOR TESTING. Remove if needed.
];

const leaders = [
  { x: 14, y: 5 },
  { x: 8, y: 12 },
  { x: 10, y: 6.5 }
];

export default function App2() {
  const svgRef = React.useRef(null);
  const margins = React.useMemo(() => {
    return { side: 50, top: 20, bottom: 40 };
  }, []);
  const width = 450 - margins.side * 2;
  const height = 400 - margins.top - margins.bottom;

  React.useEffect(() => {
    // Initial Selection
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margins.side * 2)
      .attr("height", height + margins.top + margins.bottom)
      .style("background-color", "rgba(100, 150, 200, 0.5)")
      // adjust for margins
      .append("g")
      .attr("transform", `translate(${margins.side}, ${margins.top})`);

    // Scale & Axis
    const maxX = d3.max(dataSets[1]);
    const minX = d3.min(dataSets[0]);
    const maxY = d3.max(dataSets[1]);
    const minY = d3.min(dataSets[1]);
    // define axis
    const x = d3.scaleLinear().domain([minX, maxX]).range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([minY, maxY]) // data based
      .range([height, 0]); // y-down, px based
    // apply axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));
    // Add X axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 5)
      .attr("y", height + margins.top + 15)
      .text("X-Axis title");
    // Add Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(90)")
      .attr("y", margins.side - 10)
      .attr("x", 80)
      .attr("text-anchor", "end")
      .text("Y-Axis Title");
    // Data Binding
  }, [height, width, margins]);

  return (
    <div className="App">
      <p>Hello World</p>
      {/* <svg ref={svgRef} /> */}
    </div>
  );
}
