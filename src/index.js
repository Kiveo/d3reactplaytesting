import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import App2 from "./App2";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    {/* <App2 /> */}
    <App />
  </StrictMode>,
  rootElement
);
