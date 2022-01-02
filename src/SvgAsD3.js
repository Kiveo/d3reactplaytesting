import React from "react";
import * as d3 from "d3";
// Let's practice D3 and how we can use it with React
const SvgAsD3 = ({ dataSets, dataPoints, leaders }) => {
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
      .style("background-color", "rgba(0, 0, 0, 0.75)")
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
    svg
      .append("g")
      .attr("transform", `translate(0, ${svgHeight})`)
      .call(d3.axisBottom(x));
    // apply Y
    svg.append("g").call(d3.axisLeft(y));

    // comparing circle Zero origin/size visually to square origin/size
    svg
      .append("circle")
      .attr("cx", x(6))
      .attr("cy", y(3))
      .attr("r", 10)
      .style("fill", "rgba(100,175,175, 0.5)");

    // Data Binding
    // colors for data binding
    var colorizerX = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range(["white", "deepskyblue"]);
    svg
      .selectAll("plotPoints")
      .data(dataPoints) // bind data set
      .enter() // iterator
      .append("rect")
      .attr("x", (d) => x(d.x))
      .attr("y", (d) => y(d.y))
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", (d) => colorizerX(d.x))
      .attr("transform", "translate(-6,-6)") // square origin & size
      .on("click", (ev, d) => console.log("Data Point: ", d));
    // TESTING: path Arc
    const piScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([3.14, 3.14 * 3]);
    svg
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
    // // ~~~~~~~~ TESTING ~~~~~~~~
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
      .style("fill", "magenta")
      .style("stroke", "purple")
      .style("stroke-width", 1);
    // TODO: interactivity
    // enable clickthrough ?
    // .attr("pointer-events", "none");
    // .on("mousedown", (ev, d) => {
    //   console.log("mousedown..");
    //   // console.log(d)
    // });
    // d3.zoom();
  }, [svgHeight, svgWidth, svgMargins, dataSets, dataPoints, leaders]);

  // -- RENDER --
  return (
    <section>
      <h2>Practice Plotting</h2>
      <input placeholder="X" />
      <input placeholder="Y" />
      <svg ref={svgRef} />
    </section>
  );
};

export default SvgAsD3;
