import React from "react";
import "./styles.css";
import SvgAsD3 from "./SvgAsD3";
import BrushingExample from "./BrushingExample";
import Zoom from "./Zoom";
import Responsive from "./Responsive";
import Annotation from "./Annotation";
import DragZone from "./DragZone";

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
  // { x: 11, y: 8 },
  { x: 8, y: 8 }
];

const leaders = [
  { x: 10, y: 6.5 },
  { x: 14, y: 5 },
  { x: 8, y: 12 }
];

export default function App() {
  //
  return (
    <div className="App">
      <hr />
      {/* <DragZone dataSets={dataSets} dataPoints={dataPoints} leaders={leaders} /> */}
      <Annotation
        dataSets={dataSets}
        dataPoints={dataPoints}
        leaders={leaders}
      />
      {/* <Responsive
        dataSets={dataSets}
        dataPoints={dataPoints}
        leaders={leaders}
      />
      <Zoom dataSets={dataSets} dataPoints={dataPoints} leaders={leaders} />
      <BrushingExample
        dataSets={dataSets}
        dataPoints={dataPoints}
        leaders={leaders}
      />
      <SvgAsD3 dataSets={dataSets} dataPoints={dataPoints} leaders={leaders} /> */}
    </div>
  );
}
