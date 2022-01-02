import React from "react";
import * as d3 from "d3";
import "./styles.css";

const Annotation = ({ dataSets, dataPoints, leaders }) => {
  // -- STATE --
  const svgRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
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
      .style("background-color", "rgba(150, 150, 150, 0.25)")
      .style("border-radius", "15px")
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
    // ------------------ BEGIN BRUSH PRIOR TO DATA ITERATION -----------
    function isBrushed(brush_coords, cx, cy) {
      var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
    }
    function handleBrush(ev) {
      const selected = ev.selection;
      if (!selected) {
        return;
      }
      plotPoints.classed("selected", function (d) {
        return isBrushed(selected, x(d.x), y(d.y));
      });
      pathRadii.classed("selected", function (d) {
        return isBrushed(selected, x(d.x), y(d.y));
      });
    }
    svg.call(
      d3
        .brush()
        .extent([
          [-svgMargins.side, -svgMargins.pole],
          [svgWidth + svgMargins.side, svgHeight + svgMargins.pole]
        ])
        .on("start end", handleBrush)
    );
    // ------------------ END BRUSH PRIOR TO DATA ITERATION -----------

    // Data Binding
    // colors for data binding
    var colorizerX = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range(["white", "deepskyblue"]);

    const plotLeads = svg
      .selectAll("leaders")
      .data(leaders)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.y))
      .attr("width", (d) => x(d.x))
      .attr("height", (d) => svgHeight - y(d.y))
      .style("fill-opacity", "0.2")
      .style("fill", "aqua")
      .style("stroke", "aqua")
      .style("stroke-width", 1);

    // TOOLTIP ----
    const tooltip = d3
      .select(wrapperRef.current)
      .append("div")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("border", "white")
      .style("padding", "0.5rem")
      .style("background", "orange")
      .style("color", "white")
      .style("border-radius", "10px");
    // hover move exit
    function mouseOver(ev) {
      // console.log("Triggered!", d3.pointer(ev));
      // console.log("Triggered!", ev.pageX, ev.pageY);
      // not sure why XY aren't closer
      const pointerX = ev.pageX + 50;
      const pointerY = ev.pageY + 20;
      // const pointerX = d3.pointer(ev)[0] + 150;
      // const pointerY = d3.pointer(ev)[1];
      // console.log("ev over", ev);
      // console.log("d over", d);
      tooltip
        // .style("opacity", 1)
        .html("Hello There")
        .style("left", `${pointerX}px`)
        .style("top", `${pointerY}px`);
    }
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
      .attr("transform", "translate(-6,-6)") // square origin & size
      // svg
      // plotPoints
      .on("mouseover", () => tooltip.style("opacity", 1))
      .on("mousemove", mouseOver)
      .on("mouseout", () => tooltip.style("opacity", 0));

    // Path Arcs
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
      )
      .attr("pointer-events", "none");
    // ---------------------------------------------------------

    // define brush helpers
    // function isBrushed(brush_coords, cx, cy) {
    //   var x0 = brush_coords[0][0],
    //     x1 = brush_coords[1][0],
    //     y0 = brush_coords[0][1],
    //     y1 = brush_coords[1][1];
    //   return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
    // }
    // function handleBrush(ev) {
    //   const selected = ev.selection;
    //   if (!selected) {
    //     return;
    //   }
    //   plotPoints.classed("selected", function (d) {
    //     return isBrushed(selected, x(d.x), y(d.y));
    //   });
    //   pathRadii.classed("selected", function (d) {
    //     return isBrushed(selected, x(d.x), y(d.y));
    //   });
    // }
    // svg.call(
    //   d3
    //     .brush()
    //     .extent([
    //       [-svgMargins.side, -svgMargins.pole],
    //       [svgWidth + svgMargins.side, svgHeight + svgMargins.pole]
    //     ])
    //     .on("start end", handleBrush)
    // );
    // ~~~~~~~~ BEGIN TESTING ~~~~~~~~
    const label1 = { cx: 320, cy: 30, r: 6, fill: "#50a3a2" };
    const label2 = { cx: label1.cx, cy: label1.cy + 25, r: 6, fill: "#F08088" };
    const labelIcon1 = d3
      .select(svgRef.current)
      .append("circle")
      .attr("cx", label1.cx)
      .attr("cy", label1.cy)
      .attr("r", label1.r)
      .style("fill", label1.fill);
    const labelIcon2 = d3
      .select(svgRef.current)
      .append("circle")
      .attr("cx", label2.cx)
      .attr("cy", label2.cy)
      .attr("r", label2.r)
      .style("fill", label2.fill);
    d3.select(svgRef.current)
      .append("text")
      .attr("x", label1.cx + 20)
      .attr("y", label1.cy)
      .text("Select All")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");
    d3.select(svgRef.current)
      .append("text")
      .attr("x", label2.cx + 20)
      .attr("y", label2.cy)
      .text("Select Zones")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");
    // maybe we can add interaction to the label icon
    let label1Active = false;
    labelIcon1.style("cursor", "pointer").on("click", (ev) => {
      if (!label1Active) {
        plotPoints.classed("selected", true);
      } else {
        plotPoints.classed("selected", false);
      }
      label1Active = !label1Active;
    });
    let label2Active = false;
    labelIcon2.style("cursor", "pointer").on("click", (ev) => {
      if (!label2Active) {
        plotLeads.classed("selected", true);
      } else {
        plotLeads.classed("selected", false);
      }
      label2Active = !label2Active;
    });
  }, [svgHeight, svgWidth, svgMargins, dataSets, dataPoints, leaders]);

  // -- RENDER --
  return (
    <section>
      <h2>Annotation Example</h2>
      <div ref={wrapperRef}>
        <svg ref={svgRef} />
      </div>
      <hr />
    </section>
  );
};

export default Annotation;
