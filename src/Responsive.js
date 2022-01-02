import React from "react";
import * as d3 from "d3";
import "./Responsive.css";

const Responsive = ({ dataSets, dataPoints, leaders }) => {
  const [num, setNum] = React.useState(0);
  const svgRef = React.useRef();
  const svg2 = React.useRef();
  const originRef = React.useRef();
  const svgMargins = React.useMemo(() => {
    return { pole: 25, side: 30 };
  }, []);
  const svgWidth = 450 - svgMargins.side * 2;
  const svgHeight = 325 - svgMargins.pole * 2;

  // -- LIFECYCLE --
  React.useEffect(() => {
    const data2 = [
      { x: 15, y: 25 },
      { x: 35, y: 35 },
      { x: 49, y: 45 },
      { x: 65, y: 35 },
      { x: 105, y: 155 },
      { x: 155, y: 80 },
      { x: 285, y: 35 },
      { x: 310, y: 250 }
    ];
    console.log("REDRAW!!!!");
    // ~~~~~~~~ BEGIN TESTING ~~~~~~~~
    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("border", "1px solid cyan")
      .style("background", "rgba(250,0,250, 0.25)");
    const x2 = d3.scaleLinear().domain([15, 310]).range([0, 400]);
    const y2 = d3.scaleLinear().domain([25, 250]).range([300, 0]);

    originRef.current = svg;

    svg2.current = svg
      .append("path")
      .datum(data2)
      .style("fill", (d) => {
        return num % 2 ? "blue" : "white";
      })
      .style("stroke", "aqua")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .area()
          .x(function (d) {
            return x2(d.x);
          })
          .y0(y2(0))
          .y1(function (d) {
            return y2(d.y);
          })
      );
  }, [svgHeight, svgWidth, svgMargins, dataSets, dataPoints, leaders]);

  const handleClick = () => {
    // let updateColor = () => (num % 2) ? "white" : "blue";
    const x2 = d3.scaleLinear().domain([15, 310]).range([0, 400]);
    const y2 = d3.scaleLinear().domain([25, 250]).range([300, 0]);
    console.log("click...");
    const test = svg2.current
      // .append("path")
      .merge(svg2.current)
      .transition()
      .duration(1000)
      .style("stroke", "aqua")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .area()
          .x(function (d) {
            return x2(d.x);
          })
          .y0(y2(0))
          .y1(function (d) {
            return num % 2 ? y2(d.y) : y2(d.y / 2);
          })
      );

    setNum(num + 1);
  };

  // -- RENDER --
  return (
    <section
      style={{
        width: "70%",
        maxWidth: "400px"
      }}
    >
      <h2>Responsiveness</h2>
      <button onClick={handleClick}>Update Stuff</button>
      <svg
        ref={svgRef}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
      />
      <hr />
    </section>
  );
};

export default Responsive;
