import React from "react";
import * as d3 from "d3";

const Zoom = ({ dataSets, dataPoints, leaders }) => {
  // -- STATE --
  const svgRef = React.useRef(null);
  const svgMargins = React.useMemo(() => {
    return { pole: 25, side: 30 };
  }, []);
  const svgWidth = 450 - svgMargins.side * 2;
  const svgHeight = 325 - svgMargins.pole * 2;

  // -- LIFECYCLE --
  React.useEffect(() => {
    // Initial Selection
    const svg = d3
      .select(svgRef.current)
      .attr("width", svgWidth + svgMargins.side * 2)
      .attr("height", svgHeight + svgMargins.pole * 2)
      .style("background-color", "rgba(255, 255, 200, 0.1)")
      .style("border-radius", "20px")
      .style("color", "rgba(200, 200, 200, 0.75)")
      // adjust for margin translation
      .append("g")
      .attr("transform", `translate(${svgMargins.side}, ${svgMargins.pole})`);

    // Scales & Axis
    const maxX = d3.max(dataSets[0]);
    const minX = d3.min(dataSets[0]);
    const maxY = d3.max(dataSets[1]);
    const minY = d3.min(dataSets[1]);
    const x = d3
      .scaleLinear()
      .domain([minX, maxX]) // data domain, alliteration
      .range([0, svgWidth]); // px range 'pixie ranger'
    const y = d3
      .scaleLinear()
      .domain([minY, maxY]) // data domain
      .range([svgHeight, 0]); // y-down
    // apply X
    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0, ${svgHeight})`)
      .call(d3.axisBottom(x));
    // apply Y
    const yAxis = svg.append("g").call(d3.axisLeft(y));

    // Data Binding
    // colors for data binding
    var colorizerX = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range(["white", "deepskyblue"]);
    const plotPoints = svg
      .selectAll("plotPoints")
      .data(dataPoints) // bind data set
      .enter() // iterator
      .append("rect")
      .attr("x", (d) => x(d.x))
      .attr("y", (d) => y(d.y))
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", (d) => colorizerX(d.x))
      .attr("transform", "translate(-6,-6)"); // square origin & size
    // TESTING: path Arc
    const piScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([3.14, 3.14 * 3]);
    const pathRadii = svg
      .selectAll("pathCircles")
      .data(dataPoints)
      .enter()
      .append("path")
      .style("fill", "lime")
      .style("stroke", "teal")
      .attr("transform", (d) => `translate(${x(d.x)},${y(d.y)})`)
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(5)
          .outerRadius(10)
          .startAngle(3.14) // radian; Pi = 3.14 = bottom.
          .endAngle((d) => piScale(d.y)) // 2*Pi = 6.28 = top. 3x ~fullcircle
      );
    svg
      .selectAll("leaders")
      .data(leaders)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.y))
      .attr("width", (d) => x(d.x))
      .attr("height", (d) => svgHeight - y(d.y))
      .style("fill-opacity", "0.2")
      .style("fill", "deeppink")
      .style("stroke", "hotpink")
      .style("stroke-width", 1);
    // ~~~~~~~~ BEGIN TESTING ~~~~~~~~
    // ZOOM
    d3.select("#svg-container") // container allows smoother zoom/pan
      .call(
        d3
          .zoom()
          .scaleExtent([0.5, 10]) // settings for unzoom/zoom
          .extent([
            [0, 0],
            [svgWidth, svgHeight]
          ])
          .on("zoom", function (ev) {
            svg.attr("transform", ev.transform);
          })
      );
  }, [svgHeight, svgWidth, svgMargins, dataSets, dataPoints, leaders]);

  // -- RENDER --
  return (
    <section id="svg-container">
      <h2>Zoom Example</h2>
      <svg ref={svgRef} />
      <hr />
    </section>
  );
};

export default Zoom;
